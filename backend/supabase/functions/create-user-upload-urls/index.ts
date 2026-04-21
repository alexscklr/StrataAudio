import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PutObjectCommand, S3Client } from 'npm:@aws-sdk/client-s3@3.908.0';
import { getSignedUrl } from 'npm:@aws-sdk/s3-request-presigner@3.908.0';

type SignedUploadRequest = {
  bucket: string;
  uploadId: string;
  action?: 'issue' | 'finalize';
  storageProvider?: 'supabase' | 'r2';
  files?: Array<{
    path: string;
    mimeType?: string;
    sizeBytes?: number;
  }>;
  inviteToken?: string;
  captchaToken?: string;
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const STORAGE_PROVIDER = (Deno.env.get('STORAGE_PROVIDER') ?? 'supabase').trim().toLowerCase() === 'r2' ? 'r2' : 'supabase';

const R2_ACCOUNT_ID = (Deno.env.get('R2_ACCOUNT_ID') ?? '').trim();
const R2_ACCESS_KEY_ID = (Deno.env.get('R2_ACCESS_KEY_ID') ?? '').trim();
const R2_SECRET_ACCESS_KEY = (Deno.env.get('R2_SECRET_ACCESS_KEY') ?? '').trim();
const R2_JURISDICTION = (Deno.env.get('R2_JURISDICTION') ?? '').trim().toLowerCase();
const R2_S3_ENDPOINT_FROM_ENV = (Deno.env.get('R2_S3_ENDPOINT') ?? '').trim();
const R2_S3_ENDPOINT = R2_S3_ENDPOINT_FROM_ENV || (R2_ACCOUNT_ID
  ? `https://${R2_ACCOUNT_ID}${R2_JURISDICTION ? `.${R2_JURISDICTION}` : ''}.r2.cloudflarestorage.com`
  : '');
const R2_UPLOAD_URL_EXPIRES_SECONDS = Math.min(
  3600,
  Math.max(60, Number(Deno.env.get('R2_UPLOAD_URL_EXPIRES_SECONDS') ?? '900')),
);

const HCAPTCHA_SECRET_KEY = Deno.env.get('HCAPTCHA_SECRET_KEY') ?? '';
const CAPTCHA_REQUIRED_FOR_PUBLIC_UPLOADS = (Deno.env.get('CAPTCHA_REQUIRED_FOR_PUBLIC_UPLOADS') ?? 'false') === 'true';

const MAX_FILES_PER_UPLOAD = 32;
const MAX_TOTAL_BYTES = 768 * 1024 * 1024; // 768 MiB

const MAX_VIDEO_BYTES = 300 * 1024 * 1024; // 300 MiB
const MAX_AUDIO_BYTES = 64 * 1024 * 1024; // 64 MiB
const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20 MiB
const MAX_INFO_BYTES = 64 * 1024; // 64 KiB

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

const uuidV4Pattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const uploadPathPattern =
  /^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\/(video\.[a-z0-9]+|thumbnail\.[a-z0-9]+|audios\/[0-9]{2}-[a-z0-9._-]+\.[a-z0-9]+|icons\/[0-9]{2}-[a-z0-9._-]+\.[a-z0-9]+|info\.txt)$/i;

const VIDEO_EXTENSIONS = new Set(['mp4', 'mov', 'mkv', 'webm', 'm4v']);
const AUDIO_EXTENSIONS = new Set(['aiff', 'aif', 'wav', 'mp3', 'aac', 'flac', 'm4a', 'ogg']);
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif']);
const INFO_EXTENSIONS = new Set(['txt']);

const videoMimePattern = /^(video\/|application\/octet-stream$)/i;
const audioMimePattern = /^(audio\/|application\/octet-stream$)/i;
const imageMimePattern = /^image\//i;
const infoMimePattern = /^text\/plain(\s*;.*)?$/i;

type SupabaseClientLike = any;

const resolveStorageProvider = (requestedProvider?: string): 'supabase' | 'r2' => {
  const normalized = requestedProvider?.trim().toLowerCase();
  if (normalized === 'r2') return 'r2';
  if (normalized === 'supabase') return 'supabase';

  return STORAGE_PROVIDER;
};

const resolveProviderBucket = (bucket: string, provider: 'supabase' | 'r2'): string => {
  if (provider === 'r2' && bucket === 'user_uploads') {
    return 'user-uploads';
  }

  if (provider === 'supabase' && bucket === 'user-uploads') {
    return 'user_uploads';
  }

  return bucket;
};

const resolveR2UploadEndpoint = (_bucket: string): string => {
  return R2_S3_ENDPOINT;
};

const getS3Client = (): S3Client => new S3Client({
  // Keep R2 signing deterministic while debugging NoSuchBucket/signature routing.
  region: 'auto',
  endpoint: R2_S3_ENDPOINT,
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const getMissingR2RuntimeFields = (bucket: string): string[] => {
  const missing: string[] = [];

  const resolvedEndpoint = resolveR2UploadEndpoint(bucket);

  if (!resolvedEndpoint) {
    missing.push('R2_S3_ENDPOINT or R2_ACCOUNT_ID');
  }

  if (!R2_ACCESS_KEY_ID) {
    missing.push('R2_ACCESS_KEY_ID');
  }

  if (!R2_SECRET_ACCESS_KEY) {
    missing.push('R2_SECRET_ACCESS_KEY');
  }

  return missing;
};

const isPathValid = (path: string, expectedUploadId: string): boolean => {
  if (!path || path.length > 512 || !uuidV4Pattern.test(expectedUploadId)) {
    return false;
  }

  if (path.startsWith('/') || path.includes('..') || path.includes('\\')) {
    return false;
  }

  const match = path.match(uploadPathPattern);
  if (!match) {
    return false;
  }

  return match[1].toLowerCase() === expectedUploadId.toLowerCase();
};

const parseRequest = async (request: Request): Promise<SignedUploadRequest | null> => {
  try {
    const payload = await request.json() as SignedUploadRequest;
    if (!payload?.bucket || !payload?.uploadId) {
      return null;
    }

    return payload;
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
  }) as SupabaseClientLike;

  const { data, error } = await authClient.auth.getUser();
  if (error) {
    return null;
  }

  return data.user;
};

const sha256 = async (value: string): Promise<string> => {
  const bytes = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
};


// IP wird nicht mehr gespeichert oder weitergegeben (DSGVO-Konformität)

const verifyCaptcha = async (captchaToken: string | undefined): Promise<boolean> => {
  if (!CAPTCHA_REQUIRED_FOR_PUBLIC_UPLOADS) {
    return true;
  }
  if (!HCAPTCHA_SECRET_KEY) {
    console.error('[captcha] HCAPTCHA_SECRET_KEY is not set');
    return false;
  }
  if (!captchaToken) {
    console.error('[captcha] no captcha token in request payload');
    return false;
  }
  const body = new URLSearchParams();
  body.set('secret', HCAPTCHA_SECRET_KEY);
  body.set('response', captchaToken);
  // remoteip wird nicht mehr gesetzt
  const response = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) {
    console.error('[captcha] hcaptcha siteverify HTTP error:', response.status);
    return false;
  }
  const result = await response.json() as { success?: boolean; 'error-codes'?: string[] };
  if (!result.success) {
    console.error('[captcha] siteverify failed, error-codes:', result['error-codes'] ?? []);
  }
  return result.success === true;
};

const validateInviteForIssue = async (
  serviceClient: SupabaseClientLike,
  inviteToken: string | undefined,
  uploadId: string
): Promise<boolean> => {
  if (!inviteToken || inviteToken.trim().length === 0) {
    return false;
  }
  const tokenHash = await sha256(inviteToken.trim());
  const { error } = await serviceClient.rpc('validate_upload_invite_issue', {
    p_token_hash: tokenHash,
    p_upload_id: uploadId,
  });
  if (error) {
    return false;
  }
  return true;
};

const finalizeInvite = async (
  serviceClient: SupabaseClientLike,
  inviteToken: string | undefined,
  uploadId: string
): Promise<boolean> => {
  if (!inviteToken || inviteToken.trim().length === 0) {
    return false;
  }

  const tokenHash = await sha256(inviteToken.trim());
  const { error } = await serviceClient.rpc('finalize_upload_invite', {
    p_token_hash: tokenHash,
    p_upload_id: uploadId,
  });

  if (error) {
    return false;
  }

  return true;
};

const getPathCategory = (path: string): 'video' | 'thumbnail' | 'audio' | 'icon' | 'info' | null => {
  if (/\/video\.[a-z0-9]+$/i.test(path)) {
    return 'video';
  }

  if (/\/thumbnail\.[a-z0-9]+$/i.test(path)) {
    return 'thumbnail';
  }

  if (/\/audios\//i.test(path)) {
    return 'audio';
  }

  if (/\/icons\//i.test(path)) {
    return 'icon';
  }

  if (/\/info\.txt$/i.test(path)) {
    return 'info';
  }

  return null;
};

const getFileExtension = (path: string): string => {
  const lastDot = path.lastIndexOf('.');
  if (lastDot < 0 || lastDot === path.length - 1) {
    return '';
  }

  return path.slice(lastDot + 1).toLowerCase();
};

const validateFiles = (
  files: Array<{ path: string; mimeType?: string; sizeBytes?: number }>,
  uploadId: string
): { totalBytes: number; paths: string[] } | null => {
  if (files.length === 0 || files.length > MAX_FILES_PER_UPLOAD) {
    return null;
  }

  const seenPaths = new Set<string>();
  let totalBytes = 0;

  for (const file of files) {
    const path = file.path;
    const mimeType = (file.mimeType ?? '').trim();
    const sizeBytes = typeof file.sizeBytes === 'number' ? file.sizeBytes : NaN;

    if (!isPathValid(path, uploadId) || seenPaths.has(path)) {
      return null;
    }

    if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
      return null;
    }

    const category = getPathCategory(path);
    if (!category) {
      return null;
    }

    const extension = getFileExtension(path);
    switch (category) {
      case 'video':
        if (!VIDEO_EXTENSIONS.has(extension) || !videoMimePattern.test(mimeType) || sizeBytes > MAX_VIDEO_BYTES) {
          return null;
        }
        break;
      case 'audio':
        if (!AUDIO_EXTENSIONS.has(extension) || !audioMimePattern.test(mimeType) || sizeBytes > MAX_AUDIO_BYTES) {
          return null;
        }
        break;
      case 'thumbnail':
      case 'icon':
        if (!IMAGE_EXTENSIONS.has(extension) || !imageMimePattern.test(mimeType) || sizeBytes > MAX_IMAGE_BYTES) {
          return null;
        }
        break;
      case 'info':
        if (!INFO_EXTENSIONS.has(extension) || !infoMimePattern.test(mimeType) || sizeBytes > MAX_INFO_BYTES) {
          return null;
        }
        break;
    }

    totalBytes += sizeBytes;
    if (totalBytes > MAX_TOTAL_BYTES) {
      return null;
    }

    seenPaths.add(path);
  }

  const hasVideo = files.some((file) => getPathCategory(file.path) === 'video');
  const hasInfo = files.some((file) => getPathCategory(file.path) === 'info');

  if (!hasVideo || !hasInfo) {
    return null;
  }

  return { totalBytes, paths: files.map((file) => file.path) };
};

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse(500, { error: 'Missing Supabase runtime credentials' });
  }

  const payload = await parseRequest(request);
  if (!payload) {
    return jsonResponse(400, { error: 'Invalid payload' });
  }

  const effectiveStorageProvider = resolveStorageProvider(payload.storageProvider);

  if (effectiveStorageProvider === 'r2') {
    const providerBucketForValidation = resolveProviderBucket(payload.bucket, effectiveStorageProvider);
    const missingR2Fields = getMissingR2RuntimeFields(providerBucketForValidation);
    if (missingR2Fields.length > 0) {
      return jsonResponse(500, {
        error: 'Missing R2 runtime credentials',
        missing: missingR2Fields,
      });
    }
  }

  if (payload.bucket !== 'user_uploads' && payload.bucket !== 'user-uploads') {
    return jsonResponse(403, { error: 'Bucket not allowed' });
  }

  const providerBucket = resolveProviderBucket(payload.bucket, effectiveStorageProvider);

  const action = payload.action ?? 'issue';
  if (action !== 'issue' && action !== 'finalize') {
    return jsonResponse(400, { error: 'Invalid action' });
  }

  if (!uuidV4Pattern.test(payload.uploadId)) {
    return jsonResponse(400, { error: 'Invalid upload id' });
  }

  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  }) as SupabaseClientLike;

  const user = await getAuthenticatedUser(request);
  // IP wird nicht mehr verwendet
  const inviteHash = payload.inviteToken?.trim() ? await sha256(payload.inviteToken.trim()) : null;

  if (action === 'issue') {
    if (!user) {
      const captchaValid = await verifyCaptcha(payload.captchaToken);
      if (!captchaValid) {
        return jsonResponse(401, { error: 'Captcha validation failed' });
      }
    }

    const files = payload.files ?? [];
    const validated = validateFiles(files, payload.uploadId);
    if (!validated) {
      return jsonResponse(400, { error: 'Invalid file metadata for upload request' });
    }

    const { error: rateError } = await serviceClient.rpc('log_and_enforce_upload_request', {
      p_invite_hash: inviteHash,
      p_action: action,
      p_paths_count: validated.paths.length,
      p_total_bytes: validated.totalBytes,
    });

    if (rateError) {
      return jsonResponse(429, { error: rateError.message });
    }

    let inviteIsValid = false;
    if (!user) {
      inviteIsValid = await validateInviteForIssue(
        serviceClient,
        payload.inviteToken,
        payload.uploadId
      );
    }

    if (!user && !inviteIsValid) {
      return jsonResponse(401, { error: 'Unauthorized upload request' });
    }

    const uploads: Array<{ path: string; token?: string; url?: string }> = [];

    for (const path of validated.paths) {
      if (effectiveStorageProvider === 'r2') {
        const s3Client = getS3Client();
        let signedUrl = '';

        try {
          signedUrl = await getSignedUrl(
            s3Client,
            new PutObjectCommand({
              Bucket: providerBucket,
              Key: path,
            }),
            { expiresIn: R2_UPLOAD_URL_EXPIRES_SECONDS }
          );
        } catch (error) {
          const details = error instanceof Error ? error.message : String(error);
          return jsonResponse(500, {
            error: 'Failed to create R2 signed upload URL',
            details,
            bucket: providerBucket,
            endpoint: R2_S3_ENDPOINT,
            forcePathStyle: true,
            path,
          });
        }

        uploads.push({ path, url: signedUrl });
        continue;
      }

      const { data, error } = await serviceClient.storage
        .from(providerBucket)
        .createSignedUploadUrl(path);

      if (error || !data?.token) {
        return jsonResponse(500, {
          error: 'Failed to create signed upload URL',
          details: error?.message ?? `No token returned for ${path}`,
        });
      }

      uploads.push({ path, token: data.token });
    }

    return jsonResponse(200, { uploads });
  }

  const { error: finalizeRateError } = await serviceClient.rpc('log_and_enforce_upload_request', {
    p_invite_hash: inviteHash,
    p_action: action,
    p_paths_count: 0,
    p_total_bytes: 0,
  });

  if (finalizeRateError) {
    return jsonResponse(429, { error: finalizeRateError.message });
  }

  let inviteIsValid = false;
  if (!user) {
    inviteIsValid = await finalizeInvite(serviceClient, payload.inviteToken, payload.uploadId);
  }

  if (!user && !inviteIsValid) {
    return jsonResponse(401, { error: 'Unauthorized upload request' });
  }

  return jsonResponse(200, { finalized: true });
});
