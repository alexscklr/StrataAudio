import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type SignedUploadRequest = {
  bucket: string;
  paths: string[];
  inviteToken?: string;
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

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

const isPathValid = (path: string): boolean => {
  if (!path || path.length > 512) {
    return false;
  }

  if (path.startsWith('/') || path.includes('..') || path.includes('\\')) {
    return false;
  }

  return true;
};

const parseRequest = async (request: Request): Promise<SignedUploadRequest | null> => {
  try {
    const payload = await request.json() as SignedUploadRequest;
    if (!payload?.bucket || !Array.isArray(payload.paths) || payload.paths.length === 0) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

const getAuthenticatedUser = async (request: Request) => {
  const authorization = request.headers.get('Authorization');
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
  });

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

const validateAndConsumeInviteToken = async (
  serviceClient: ReturnType<typeof createClient>,
  inviteToken: string | undefined
): Promise<boolean> => {
  if (!inviteToken || inviteToken.trim().length === 0) {
    return false;
  }

  const tokenHash = await sha256(inviteToken.trim());
  const { data: inviteRow, error: inviteError } = await serviceClient
    .from('upload_invites')
    .select('id, use_count, max_uses, expires_at')
    .eq('token_hash', tokenHash)
    .single();

  if (inviteError || !inviteRow) {
    return false;
  }

  const expiresAt = inviteRow.expires_at ? Date.parse(inviteRow.expires_at) : null;
  const isExpired = expiresAt !== null && Number.isFinite(expiresAt) && expiresAt < Date.now();
  if (isExpired) {
    return false;
  }

  const maxUses = inviteRow.max_uses;
  const useCount = inviteRow.use_count ?? 0;
  if (typeof maxUses === 'number' && useCount >= maxUses) {
    return false;
  }

  const { error: updateError } = await serviceClient
    .from('upload_invites')
    .update({ use_count: useCount + 1 })
    .eq('id', inviteRow.id)
    .eq('use_count', useCount);

  if (updateError) {
    return false;
  }

  return true;
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

  if (payload.bucket !== 'user_uploads') {
    return jsonResponse(403, { error: 'Bucket not allowed' });
  }

  const invalidPath = payload.paths.find((path) => !isPathValid(path));
  if (invalidPath) {
    return jsonResponse(400, { error: `Invalid path: ${invalidPath}` });
  }

  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const user = await getAuthenticatedUser(request);
  let inviteIsValid = false;
  if (!user) {
    inviteIsValid = await validateAndConsumeInviteToken(serviceClient, payload.inviteToken);
  }

  if (!user && !inviteIsValid) {
    return jsonResponse(401, { error: 'Unauthorized upload request' });
  }

  const uploads: Array<{ path: string; token: string }> = [];
  for (const path of payload.paths) {
    const { data, error } = await serviceClient.storage
      .from('user_uploads')
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
});
