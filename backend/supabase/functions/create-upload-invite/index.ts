import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type CreateInviteRequest = {
  label?: string;
  expiresInHours?: number;
  maxUses?: number;
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const UPLOAD_ADMIN_EMAILS = (Deno.env.get('UPLOAD_ADMIN_EMAILS') ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

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

const parseRequest = async (request: Request): Promise<CreateInviteRequest> => {
  try {
    return await request.json() as CreateInviteRequest;
  } catch {
    return {};
  }
};

const randomToken = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

const sha256 = async (value: string): Promise<string> => {
  const bytes = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse(500, { error: 'Missing Supabase runtime credentials' });
  }

  const authorization = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (!authorization) {
    return jsonResponse(401, { error: 'Missing authorization header' });
  }

  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
    global: {
      headers: {
        Authorization: authorization,
      },
    },
  }) as any;

  const { data: authData, error: authError } = await authClient.auth.getUser();
  if (authError || !authData.user) {
    return jsonResponse(401, { error: 'Unauthorized' });
  }

  const userEmail = authData.user.email?.toLowerCase() ?? '';
  if (UPLOAD_ADMIN_EMAILS.length > 0 && !UPLOAD_ADMIN_EMAILS.includes(userEmail)) {
    return jsonResponse(403, { error: 'Forbidden: user is not allowed to create invite links' });
  }

  const payload = await parseRequest(request);
  const expiresInHours = typeof payload.expiresInHours === 'number' && Number.isFinite(payload.expiresInHours)
    ? Math.min(Math.max(payload.expiresInHours, 1), 24 * 90)
    : 24 * 7;

  const maxUses = typeof payload.maxUses === 'number' && Number.isFinite(payload.maxUses)
    ? Math.max(1, Math.floor(payload.maxUses))
    : 25;

  const token = randomToken();
  const tokenHash = await sha256(token);
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();

  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  }) as any;

  const { error: insertError } = await serviceClient
    .from('upload_invites')
    .insert({
      token_hash: tokenHash,
      label: payload.label?.trim() || null,
      max_uses: maxUses,
      expires_at: expiresAt,
      created_by: authData.user.id,
    });

  if (insertError) {
    return jsonResponse(500, { error: insertError.message });
  }

  return jsonResponse(200, {
    token,
    expiresAt,
    maxUses,
    label: payload.label?.trim() || null,
  });
});
