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
SUPABASE_SERVICE_ROLE_KEY=...SERVICE_ROLE_KEY...
DEEPL_API_KEY=...API_KEY...
DEEPL_API_URL=...API_URL...
```

These values are required by `storage-seed.js`.

### 3) Frontend environment variables

Create `frontend/.env.local`:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=...ANON_KEY...
```

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

## Privacy and Research Context

This project is designed for anonymous data collection in a research context (consent, demographics, interaction data, survey data).

Privacy policy and legal notice pages are integrated into the frontend.

