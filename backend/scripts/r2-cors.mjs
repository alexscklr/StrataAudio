#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const API_BASE = 'https://api.cloudflare.com/client/v4';

const TOKEN =
  process.env.CLOUDFLARE_API_TOKEN
  || process.env.CF_API_TOKEN
  || '';

const ACCOUNT_ID =
  process.env.CLOUDFLARE_ACCOUNT_ID
  || process.env.CF_ACCOUNT_ID
  || process.env.R2_ACCOUNT_ID
  || '';

const JURISDICTION = (process.env.R2_JURISDICTION || process.env.R2_BUCKET_JURISDICTION || '').trim().toLowerCase();

const usage = () => {
  console.error('Usage:');
  console.error('  node scripts/r2-cors.mjs set <bucket> <cors-json-file>');
  console.error('  node scripts/r2-cors.mjs list <bucket>');
  console.error('  node scripts/r2-cors.mjs ensure <bucket> [locationHint]');
  process.exit(1);
};

const assertEnv = () => {
  if (!TOKEN) {
    throw new Error('Missing CLOUDFLARE_API_TOKEN (or CF_API_TOKEN).');
  }

  if (!ACCOUNT_ID) {
    throw new Error('Missing CLOUDFLARE_ACCOUNT_ID (or CF_ACCOUNT_ID/R2_ACCOUNT_ID).');
  }
};

const parseResponse = async (response, method, url) => {
  const rawText = await response.text();
  let parsed;
  try {
    parsed = rawText ? JSON.parse(rawText) : null;
  } catch {
    parsed = { raw: rawText };
  }

  if (!response.ok || (parsed && parsed.success === false)) {
    const errors = parsed?.errors ?? parsed;
    throw new Error(`Cloudflare API ${method} failed (${response.status}) for ${url}: ${JSON.stringify(errors)}`);
  }

  return parsed?.result ?? parsed;
};

const withJurisdiction = (url) => {
  if (!JURISDICTION) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}jurisdiction=${encodeURIComponent(JURISDICTION)}`;
};

const requestPath = async (method, apiPath, body) => {
  const url = withJurisdiction(`${API_BASE}${apiPath}`);
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseResponse(response, method, url);
};

const requestBucketCors = async (method, bucket, body) => {
  return requestPath(method, `/accounts/${ACCOUNT_ID}/r2/buckets/${bucket}/cors`, body);
};

const listBuckets = async () => {
  const result = await requestPath('GET', `/accounts/${ACCOUNT_ID}/r2/buckets`);
  const buckets = Array.isArray(result?.buckets) ? result.buckets : [];
  return buckets;
};

const ensureBucketExists = async (bucket, locationHint) => {
  const buckets = await listBuckets();
  const exists = buckets.some((entry) => entry?.name === bucket);
  if (exists) {
    console.log(`Bucket '${bucket}' already exists.`);
    return;
  }

  const payload = {
    name: bucket,
    ...(locationHint ? { locationHint } : {}),
  };

  await requestPath('POST', `/accounts/${ACCOUNT_ID}/r2/buckets`, payload);
  console.log(`Bucket '${bucket}' created${locationHint ? ` (location: ${locationHint})` : ''}.`);
};

const toCloudflareCorsPayload = (rules) => {
  return {
    rules: rules.map((rule) => {
      const allowed = rule?.allowed ?? {};
      const origins = Array.isArray(rule.AllowedOrigins)
        ? rule.AllowedOrigins
        : Array.isArray(allowed.origins)
          ? allowed.origins
          : [];
      const methods = Array.isArray(rule.AllowedMethods)
        ? rule.AllowedMethods
        : Array.isArray(allowed.methods)
          ? allowed.methods
          : [];
      const headers = Array.isArray(rule.AllowedHeaders)
        ? rule.AllowedHeaders
        : Array.isArray(allowed.headers)
          ? allowed.headers
          : [];
      const exposeHeaders = Array.isArray(rule.ExposeHeaders)
        ? rule.ExposeHeaders
        : Array.isArray(rule.exposeHeaders)
          ? rule.exposeHeaders
          : [];
      const maxAgeSeconds = Number.isFinite(rule.MaxAgeSeconds)
        ? Number(rule.MaxAgeSeconds)
        : Number.isFinite(rule.maxAgeSeconds)
          ? Number(rule.maxAgeSeconds)
          : undefined;
      const id = typeof rule.ID === 'string' && rule.ID.trim().length > 0
        ? rule.ID.trim()
        : typeof rule.id === 'string' && rule.id.trim().length > 0
          ? rule.id.trim()
          : undefined;

      return {
        allowed: {
          origins,
          methods,
          ...(headers.length > 0 ? { headers } : {}),
        },
        ...(id ? { id } : {}),
        ...(exposeHeaders.length > 0 ? { exposeHeaders } : {}),
        ...(typeof maxAgeSeconds === 'number' ? { maxAgeSeconds } : {}),
      };
    }),
  };
};

const main = async () => {
  const [, , command, bucket, arg3] = process.argv;
  if (!command || !bucket) {
    usage();
  }

  assertEnv();

  if (command === 'ensure') {
    const locationHint = arg3 ?? process.env.R2_BUCKET_LOCATION_HINT ?? 'enam';
    await ensureBucketExists(bucket, locationHint);
    return;
  }

  if (command === 'set') {
    const filePath = arg3;
    if (!filePath) {
      usage();
    }

    const locationHint = process.env.R2_BUCKET_LOCATION_HINT ?? 'enam';
    await ensureBucketExists(bucket, locationHint);

    const raw = await fs.readFile(path.resolve(process.cwd(), filePath), 'utf8');
    const parsed = JSON.parse(raw);
    const rules = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.rules)
        ? parsed.rules
        : null;

    if (!rules) {
      throw new Error('CORS JSON must be an array of rules or an object with a rules array.');
    }

    const payload = toCloudflareCorsPayload(rules);
    await requestBucketCors('PUT', bucket, payload);
    console.log(`CORS policy updated for bucket '${bucket}'.`);
    return;
  }

  if (command === 'list') {
    const result = await requestBucketCors('GET', bucket);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  usage();
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
