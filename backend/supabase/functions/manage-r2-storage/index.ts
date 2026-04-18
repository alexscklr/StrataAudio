import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from 'npm:@aws-sdk/client-s3@3.908.0';
import { getSignedUrl } from 'npm:@aws-sdk/s3-request-presigner@3.908.0';

type IssueUploadUrlsAction = {
  action: 'issue_upload_urls';
  bucket: string;
  files: Array<{
    path: string;
    mimeType?: string;
    sizeBytes?: number;
  }>;
};

type ListPrefixAction = {
  action: 'list_prefix';
  bucket: string;
  prefix: string;
};

type DeletePathsAction = {
  action: 'delete_paths';
  bucket: string;
  paths: string[];
};

type StorageActionRequest = IssueUploadUrlsAction | ListPrefixAction | DeletePathsAction;

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const STORAGE_PROVIDER = (Deno.env.get('STORAGE_PROVIDER') ?? 'r2').trim().toLowerCase() === 'supabase' ? 'supabase' : 'r2';
const UPLOAD_ADMIN_EMAILS = (Deno.env.get('UPLOAD_ADMIN_EMAILS') ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const R2_ACCOUNT_ID = (Deno.env.get('R2_ACCOUNT_ID') ?? '').trim();
const R2_ACCESS_KEY_ID = (Deno.env.get('R2_ACCESS_KEY_ID') ?? '').trim();
const R2_SECRET_ACCESS_KEY = (Deno.env.get('R2_SECRET_ACCESS_KEY') ?? '').trim();
const R2_REGION = Deno.env.get('R2_REGION') ?? 'auto';
const R2_JURISDICTION = (Deno.env.get('R2_JURISDICTION') ?? '').trim().toLowerCase();
const R2_S3_ENDPOINT_FROM_ENV = (Deno.env.get('R2_S3_ENDPOINT') ?? '').trim();
const R2_S3_ENDPOINT = R2_S3_ENDPOINT_FROM_ENV || (R2_ACCOUNT_ID
  ? `https://${R2_ACCOUNT_ID}${R2_JURISDICTION ? `.${R2_JURISDICTION}` : ''}.r2.cloudflarestorage.com`
  : '');
const R2_UPLOAD_URL_EXPIRES_SECONDS = Math.min(
  3600,
  Math.max(60, Number(Deno.env.get('R2_UPLOAD_URL_EXPIRES_SECONDS') ?? '900')),
);

const ALLOWED_BUCKETS = new Set(['videos', 'system', 'user_uploads', 'user-uploads']);

const resolveProviderBucket = (bucket: string): string => {
  // Keep Supabase naming, but map to kebab-case bucket in R2 when needed.
  if (STORAGE_PROVIDER === 'r2' && bucket === 'user_uploads') {
    return 'user-uploads';
  }

  // Accept legacy kebab-case input while using Supabase provider.
  if (STORAGE_PROVIDER === 'supabase' && bucket === 'user-uploads') {
    return 'user_uploads';
  }

  return bucket;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const jsonResponse = (status: number, payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });

const isPathValid = (value: string): boolean => {
  if (!value || value.length > 1024) {
    return false;
  }

  if (value.startsWith('/') || value.includes('..') || value.includes('\\')) {
    return false;
  }

  return true;
};

const parseRequest = async (request: Request): Promise<StorageActionRequest | null> => {
  try {
    return await request.json() as StorageActionRequest;
  } catch {
    return null;
  }
};

const getAuthenticatedUser = async (request: Request) => {
  const authorization = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (!authorization || !SUPABASE_ANON_KEY) {
    return null;
  }

  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
    global: {
      headers: {
        Authorization: authorization,
      },
    },
  }) as any;

  const { data, error } = await authClient.auth.getUser();
  if (error) {
    return null;
  }

  return data.user;
};

const getS3Client = (): S3Client => new S3Client({
  region: R2_REGION,
  endpoint: R2_S3_ENDPOINT,
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const getServiceClient = () => createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
}) as any;

const buildSupabaseUploadUrl = (signedPath: string): string => {
  if (signedPath.startsWith('http://') || signedPath.startsWith('https://')) {
    return signedPath;
  }

  return `${SUPABASE_URL}/storage/v1${signedPath}`;
};

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return jsonResponse(500, { error: 'Missing Supabase runtime credentials' });
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse(500, { error: 'Missing Supabase service role credentials' });
  }

  if (STORAGE_PROVIDER === 'r2' && (!R2_S3_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY)) {
    return jsonResponse(500, { error: 'Missing R2 runtime credentials' });
  }

  const user = await getAuthenticatedUser(request);
  if (!user) {
    return jsonResponse(401, { error: 'Unauthorized' });
  }

  const userEmail = user.email?.toLowerCase() ?? '';
  if (UPLOAD_ADMIN_EMAILS.length > 0 && !UPLOAD_ADMIN_EMAILS.includes(userEmail)) {
    return jsonResponse(403, { error: 'Forbidden: user is not allowed to manage storage' });
  }

  const payload = await parseRequest(request);
  if (!payload) {
    return jsonResponse(400, { error: 'Invalid payload' });
  }

  if (!ALLOWED_BUCKETS.has(payload.bucket)) {
    return jsonResponse(403, { error: 'Bucket not allowed' });
  }

  const providerBucket = resolveProviderBucket(payload.bucket);

  const serviceClient = getServiceClient();
  const s3Client = STORAGE_PROVIDER === 'r2' ? getS3Client() : null;

  if (payload.action === 'issue_upload_urls') {
    const files = payload.files ?? [];
    if (files.length === 0 || files.length > 2000) {
      return jsonResponse(400, { error: 'Invalid files payload' });
    }

    const uploads: Array<{ path: string; url: string; method: 'PUT'; headers?: Record<string, string> }> = [];

    for (const file of files) {
      if (!isPathValid(file.path)) {
        return jsonResponse(400, { error: `Invalid file path: ${file.path}` });
      }

      let signedUrl = '';

      if (STORAGE_PROVIDER === 'supabase') {
        const { data: signedData, error: signError } = await serviceClient
          .storage
          .from(providerBucket)
          .createSignedUploadUrl(file.path);

        if (signError || !signedData?.signedUrl) {
          return jsonResponse(500, {
            error: signError?.message ?? 'Failed to create Supabase signed upload URL',
          });
        }

        signedUrl = buildSupabaseUploadUrl(signedData.signedUrl);
      } else {
        const command = new PutObjectCommand({
          Bucket: providerBucket,
          Key: file.path,
        });

        signedUrl = await getSignedUrl(s3Client as S3Client, command, {
          expiresIn: R2_UPLOAD_URL_EXPIRES_SECONDS,
        });
      }

      if (STORAGE_PROVIDER === 'supabase') {
        const contentType = (file.mimeType ?? '').trim() || 'application/octet-stream';
        uploads.push({
          path: file.path,
          url: signedUrl,
          method: 'PUT',
          headers: {
            'content-type': contentType,
          },
        });
      } else {
        uploads.push({
          path: file.path,
          url: signedUrl,
          method: 'PUT',
        });
      }
    }

    return jsonResponse(200, { uploads });
  }

  if (payload.action === 'list_prefix') {
    if (!isPathValid(payload.prefix)) {
      return jsonResponse(400, { error: 'Invalid prefix' });
    }

    const objectKeys: string[] = [];

    if (STORAGE_PROVIDER === 'supabase') {
      const normalizedPrefix = payload.prefix.endsWith('/') ? payload.prefix : `${payload.prefix}/`;
      const { data: rows, error: listError } = await serviceClient
        .schema('storage')
        .from('objects')
        .select('name')
        .eq('bucket_id', providerBucket)
        .or(`name.eq.${payload.prefix},name.like.${normalizedPrefix}%`)
        .limit(10000);

      if (listError) {
        return jsonResponse(500, { error: listError.message });
      }

      for (const row of rows ?? []) {
        const key = typeof row?.name === 'string' ? row.name : '';
        if (key) {
          objectKeys.push(key);
        }
      }
    } else {
      let continuationToken: string | undefined;

      do {
        const output = await (s3Client as S3Client).send(new ListObjectsV2Command({
          Bucket: providerBucket,
          Prefix: payload.prefix,
          ContinuationToken: continuationToken,
        }));

        for (const content of output.Contents ?? []) {
          if (content.Key) {
            objectKeys.push(content.Key);
          }
        }

        continuationToken = output.IsTruncated ? output.NextContinuationToken : undefined;
      } while (continuationToken);
    }

    return jsonResponse(200, { paths: objectKeys });
  }

  if (payload.action === 'delete_paths') {
    const paths = payload.paths ?? [];
    if (paths.length === 0) {
      return jsonResponse(200, { deleted: 0 });
    }

    if (paths.length > 5000) {
      return jsonResponse(400, { error: 'Too many paths in single request' });
    }

    const invalidPath = paths.find((path) => !isPathValid(path));
    if (invalidPath) {
      return jsonResponse(400, { error: `Invalid path: ${invalidPath}` });
    }

    let deletedCount = 0;
    for (let index = 0; index < paths.length; index += 1000) {
      const chunk = paths.slice(index, index + 1000);

      if (STORAGE_PROVIDER === 'supabase') {
        const { error: removeError } = await serviceClient.storage.from(providerBucket).remove(chunk);
        if (removeError) {
          return jsonResponse(500, { error: removeError.message });
        }
      } else {
        await (s3Client as S3Client).send(new DeleteObjectsCommand({
          Bucket: providerBucket,
          Delete: {
            Objects: chunk.map((key) => ({ Key: key })),
            Quiet: true,
          },
        }));
      }

      deletedCount += chunk.length;
    }

    return jsonResponse(200, { deleted: deletedCount });
  }

  return jsonResponse(400, { error: 'Unsupported action' });
});
