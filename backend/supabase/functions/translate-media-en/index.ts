/// <reference path="./types.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type SupportedTable = 'video_contents' | 'audio_contents' | 'video_genres';

type WebhookPayload = {
  table: SupportedTable;
  record: Record<string, unknown>;
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const DEEPL_API_KEY = Deno.env.get('DEEPL_API_KEY') ?? '';
const DEEPL_API_URL = Deno.env.get('DEEPL_API_URL') ?? 'https://api-free.deepl.com/v2/translate';
const TRANSLATION_WEBHOOK_SECRET = Deno.env.get('TRANSLATION_WEBHOOK_SECRET') ?? '';

const jsonResponse = (status: number, payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const isBlank = (value: unknown): boolean => {
  if (typeof value !== 'string') return true;
  return value.trim().length === 0;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const translateDeToEnBatch = async (texts: string[]): Promise<Array<string | null>> => {
  if (!DEEPL_API_KEY || texts.length === 0) {
    return texts.map(() => null);
  }

  const filtered = texts.map((value) => value.trim());
  const body = new URLSearchParams({
    source_lang: 'DE',
    target_lang: 'EN',
  });

  for (const text of filtered) {
    body.append('text', text);
  }

  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      },
      body,
    });

    if (response.ok) {
      const data = await response.json() as { translations?: Array<{ text?: string }> };
      const translated = data.translations ?? [];
      return filtered.map((_, index) => translated[index]?.text?.trim() ?? null);
    }

    const details = await response.text();
    const isRetriable = response.status === 429 || response.status >= 500;

    if (!isRetriable || attempt === maxAttempts) {
      throw new Error(`DeepL request failed (${response.status}): ${details}`);
    }

    await wait(250 * attempt);
  }

  return texts.map(() => null);
};

const translateDeToEn = async (text: string): Promise<string | null> => {
  if (isBlank(text)) {
    return null;
  }

  const [translated] = await translateDeToEnBatch([text]);
  return translated;
};

const parsePayload = async (req: Request): Promise<WebhookPayload | null> => {
  try {
    const payload = await req.json() as WebhookPayload;
    if (!payload?.table || !payload?.record) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (TRANSLATION_WEBHOOK_SECRET) {
    const secret = req.headers.get('x-translation-webhook-secret') ?? '';
    if (secret !== TRANSLATION_WEBHOOK_SECRET) {
      return jsonResponse(401, { error: 'Unauthorized webhook request' });
    }
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse(500, { error: 'Missing Supabase runtime credentials' });
  }

  const payload = await parsePayload(req);
  if (!payload) {
    return jsonResponse(400, { error: 'Invalid payload' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  try {
    const { table, record } = payload;

    if (table === 'video_contents') {
      const videoId = String(record.video_id ?? '');
      const titleDe = String(record.title_de ?? '');
      const titleEn = record.title_en;
      const descriptionDe = record.description_de;
      const descriptionEn = record.description_en;

      if (!videoId) {
        return jsonResponse(400, { error: 'Missing video_id' });
      }

      const updates: Record<string, string> = {};
      const tasks: Array<'title_en' | 'description_en'> = [];
      const sourceTexts: string[] = [];

      if (isBlank(titleEn) && !isBlank(titleDe)) {
        tasks.push('title_en');
        sourceTexts.push(titleDe);
      }

      if (isBlank(descriptionEn) && !isBlank(descriptionDe)) {
        tasks.push('description_en');
        sourceTexts.push(String(descriptionDe));
      }

      if (sourceTexts.length > 0) {
        const translated = await translateDeToEnBatch(sourceTexts);

        tasks.forEach((field, index) => {
          const value = translated[index];
          if (!isBlank(value)) {
            updates[field] = value as string;
          }
        });
      }

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from('video_contents')
          .update(updates)
          .eq('video_id', videoId);

        if (error) throw error;
      }

      return jsonResponse(200, { updated: Object.keys(updates) });
    }

    if (table === 'audio_contents') {
      const audioId = String(record.audio_id ?? '');
      const titleDe = String(record.title_de ?? '');
      const titleEn = record.title_en;

      if (!audioId) {
        return jsonResponse(400, { error: 'Missing audio_id' });
      }

      const updates: Record<string, string> = {};
      if (isBlank(titleEn) && !isBlank(titleDe)) {
        const translatedTitle = await translateDeToEn(titleDe);
        if (!isBlank(translatedTitle)) {
          updates.title_en = translatedTitle as string;
        }
      }

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from('audio_contents')
          .update(updates)
          .eq('audio_id', audioId);

        if (error) throw error;
      }

      return jsonResponse(200, { updated: Object.keys(updates) });
    }

    if (table === 'video_genres') {
      const genreId = String(record.id ?? '');
      const labelDe = String(record.label_de ?? '');
      const labelEn = record.label_en;

      if (!genreId) {
        return jsonResponse(400, { error: 'Missing genre id' });
      }

      const updates: Record<string, string> = {};
      if (isBlank(labelEn) && !isBlank(labelDe)) {
        const translatedLabel = await translateDeToEn(labelDe);
        if (!isBlank(translatedLabel)) {
          updates.label_en = translatedLabel as string;
        }
      }

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from('video_genres')
          .update(updates)
          .eq('id', genreId);

        if (error) throw error;
      }

      return jsonResponse(200, { updated: Object.keys(updates) });
    }

    return jsonResponse(400, { error: `Unsupported table: ${payload.table}` });
  } catch (error) {
    return jsonResponse(500, {
      error: 'Translation webhook failed',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});
