# StrataAudio

StrataAudio is a web application for evaluating a user-centered audio mixer for videos in the browser as part of a bachelor's thesis.

The focus is on:
- Interaction data from the mixer
- Subjective video/audio ratings per video
- A final questionnaire after mandatory content is completed

## Tech Stack

- Frontend: React 19, TypeScript, Vite
- Data access: Supabase JS + TanStack Query
- Routing: React Router
- Internationalization: i18next + react-i18next
- Metadata/SEO: react-helmet-async
- Video playback: HLS.js
- Backend: local Supabase (Postgres, Storage, RLS, SQL migrations)

## Repository Structure

```text
backend/
    package.json
    storage-seed.js
    supabase/
        config.toml
        functions/
        migrations/
        seeds/
        storage-seed/

frontend/
    package.json
    vite.config.ts
    public/
    src/
        api/
        assets/
        constants/
        features/
        layout/
        locales/
        pages/
        shared/
```

## User Flow

1. Consent
2. Demographics
3. Video catalog (mandatory + optional)
4. Watch flow with two modes (randomized order): `standard` and `mixer`
5. Video survey per watched video
6. End survey (after all mandatory videos)

Route guards enforce consent/demographics order.

## Prerequisites

- Node.js (recommended: current LTS)
- npm
- Docker Desktop (Windows) or Docker Engine (Linux)
- Supabase CLI (already included as backend dev dependency)

## Installation

### 1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Backend environment variables

Create `backend/.env`:

```env
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

STORAGE_PROVIDER=r2
UPLOAD_ADMIN_EMAILS=admin@example.com,test@strataaudio.local

R2_ACCOUNT_ID=YOUR_CLOUDFLARE_ACCOUNT_ID
R2_ACCESS_KEY_ID=YOUR_R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY=YOUR_R2_SECRET_ACCESS_KEY
R2_S3_ENDPOINT=https://YOUR_CLOUDFLARE_ACCOUNT_ID.r2.cloudflarestorage.com
R2_JURISDICTION=
R2_UPLOAD_URL_EXPIRES_SECONDS=900

HCAPTCHA_SECRET_KEY=YOUR_HCAPTCHA_SECRET
CAPTCHA_REQUIRED_FOR_PUBLIC_UPLOADS=false

DEEPL_API_KEY=YOUR_DEEPL_API_KEY
DEEPL_API_URL=https://api-free.deepl.com/v2/translate
TRANSLATION_WEBHOOK_SECRET=YOUR_TRANSLATION_WEBHOOK_SECRET

# Optional: only needed for local R2 bucket/CORS helper scripts
CLOUDFLARE_API_TOKEN=YOUR_CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID=YOUR_CLOUDFLARE_ACCOUNT_ID
```

Required for the currently verified local R2 upload flow:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STORAGE_PROVIDER`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_S3_ENDPOINT`

Additional notes:

- `UPLOAD_ADMIN_EMAILS` restricts the admin-only storage functions (`manage-r2-storage`, `create-upload-invite`).
- `HCAPTCHA_SECRET_KEY` and `CAPTCHA_REQUIRED_FOR_PUBLIC_UPLOADS` are only relevant when invite-based public uploads require CAPTCHA.
- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are not required by the upload runtime itself. They are only used by local helper scripts such as `scripts/r2-cors.mjs`.
- `R2_S3_ENDPOINT` should use the direct R2 S3 endpoint, for example `https://<account-id>.r2.cloudflarestorage.com`.

For local Supabase Edge Functions, the same environment is also needed in `backend/supabase/functions/.env`.
The backend scripts sync `backend/.env` to that location automatically before start/reset.

The Edge Functions folder is configured for Deno via:

- `backend/supabase/functions/deno.json`
- `.vscode/settings.json`

This keeps Deno-specific diagnostics scoped to the Supabase Functions directory in VS Code.

### 3) Frontend environment variables

Create `frontend/.env.local`:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_STORAGE_PROVIDER=r2
VITE_PUBLIC_UPLOAD_SIGNED_PROVIDER=r2

# Optional for CAPTCHA-enabled invite uploads
VITE_HCAPTCHA_SITE_KEY=YOUR_HCAPTCHA_SITE_KEY

# Optional player-control flags
VITE_VIDEO_CONTROLS_CAN_SEEK=true
VITE_VIDEO_CONTROLS_CAN_REWIND=true
VITE_VIDEO_CONTROLS_CAN_PAUSE=true
VITE_VIDEO_CONTROLS_CAN_FULLSCREEN=true

# Optional for STORAGE_PROVIDER=r2
# Generic fallback base (resolved as <base>/<bucket>/<path>)
VITE_R2_PUBLIC_BASE_URL=https://example-public-r2-base
# Optional bucket-specific overrides
VITE_R2_PUBLIC_URL_VIDEOS=https://videos.example.com
VITE_R2_PUBLIC_URL_SYSTEM=https://system.example.com
VITE_R2_PUBLIC_URL_USER_UPLOADS=https://user-uploads.example.com

# Also supported for backward compatibility:
# VITE_R2_PUBLIC_BASE_URL_VIDEOS
# VITE_R2_PUBLIC_BASE_URL_SYSTEM
# VITE_R2_PUBLIC_BASE_URL_USER_UPLOADS
```

`VITE_STORAGE_PROVIDER` supports `supabase` and `r2`.

- Development recommendation: `VITE_STORAGE_PROVIDER=supabase`
- Production recommendation (with edge function `manage-r2-storage` configured): `VITE_STORAGE_PROVIDER=r2`

`VITE_PUBLIC_UPLOAD_SIGNED_PROVIDER` is optional.

- If omitted, the public signed upload flow uses `VITE_STORAGE_PROVIDER`.
- If set, it only overrides the signed upload path used by `create-user-upload-urls`.

Bucket naming note:
- Supabase bucket name: `user_uploads`
- R2 bucket name: `user-uploads`
- The frontend/storage layer and `manage-r2-storage` now map both names automatically.

R2 browser upload note:
- Direct browser uploads to R2 signed URLs require a CORS rule on the target bucket, especially `user-uploads`.
- Without it, the browser blocks the preflight request before the PUT upload is sent.
- For local development, allow at least `http://localhost:5173`.
- Public upload flow uses the selected storage provider (`VITE_STORAGE_PROVIDER`) by default.
- Optional override: set `VITE_PUBLIC_UPLOAD_SIGNED_PROVIDER=supabase|r2` for targeted testing.
- The currently verified working setup signs against the direct R2 S3 endpoint and uploads without forcing a `Content-Type` header on the browser PUT request.
- This avoids `SignatureDoesNotMatch` errors caused by header/signature mismatches.

Example R2 CORS rule:

```json
[
    {
        "AllowedOrigins": [
            "http://localhost:5173"
        ],
        "AllowedMethods": [
            "PUT",
            "GET",
            "HEAD"
        ],
        "AllowedHeaders": [
            "*"
        ],
        "ExposeHeaders": [
            "ETag"
        ],
        "MaxAgeSeconds": 3600
    }
]
```

For production, add your real frontend origin to `AllowedOrigins` as well.

## Local Test Login

The seed now creates a local auth test user for development:

- Email: `test@strataaudio.local`
- Password: `test`

After `npm run db:reset`, this user can sign in through Supabase Auth locally.

## Local Development

### Start backend (Supabase + DB reset + storage seed)

```bash
cd backend
npm run backend:start
```

### Start frontend

```bash
cd frontend
npm run dev
```

Frontend runs on the URL printed by Vite (usually `http://localhost:5173`).

## Scripts

### Backend (`backend/package.json`)

- `npm run backend:start`: start Supabase, reset DB, seed storage
- `npm run db:reset`: reset DB and seed storage
- `npm run backend:stop`: stop local Supabase
- `npm run backend:restart`: stop and start backend again

### Frontend (`frontend/package.json`)

- `npm run dev`: start Vite dev server
- `npm run build`: run TypeScript build and production bundle
- `npm run lint`: run ESLint
- `npm run preview`: preview production build

## Database and Storage

- Migrations: `backend/supabase/migrations`
- Seeds: `backend/supabase/seeds`
- Storage seed files: `backend/supabase/storage-seed`
- `storage-seed.js` creates missing buckets and uploads files with `upsert: true`

## Current Implementation Notes

### Survey and watch-state consistency

- Watch mode sequence and progress are persisted per video in local storage.
- Audio configuration snapshots are also persisted per video/mode.
- On reload, inconsistent state is repaired automatically (for example, mode marked as completed but required audio configuration missing).
- Survey submission requires a valid audio configuration snapshot.

### Video survey payload constraints

- `survey_responses.responses` is validated by DB JSON schema constraints.
- Option values sent by the frontend must match the schema exactly.

### Frontend metadata and accessibility

- Per-page `<title>` and meta description via `PageMeta` + `react-helmet-async`
- Helmet provider is configured in app root
- Progress bars include accessible labels/value text

### Performance-related UI behavior

- Catalog thumbnails use aspect-ratio reservation and loading placeholders
- Catalog loading placeholders reduce layout shifts while data loads
- Video player reserves space via aspect ratio and shows a loading placeholder until ready

### robots.txt

- `frontend/public/robots.txt` is currently configured with:
    - `User-agent: *`
    - `Disallow: /`

This blocks crawler indexing and is typically intended for closed/research deployments.

## Common Pitfalls

- Starting frontend from repo root: run `npm run dev` inside `frontend/`
- Missing frontend env vars: Supabase client cannot initialize
- Missing backend service role key: storage seeding fails
- Docker or Supabase not running: backend start/reset fails
- R2 browser uploads without bucket CORS: browser preflight fails before the PUT request is sent
- Password-login test users in `auth.users` with `NULL` token string columns can trigger GoTrue `500 unexpected_failure` in local development; keep the seeded auth fields aligned with the current seed file

## Privacy and Research Context

This project is designed for anonymous data collection in a research context (consent, demographics, interaction data, survey data).

Privacy policy and legal notice pages are integrated into the frontend.

