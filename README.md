# StrataAudio

StrataAudio is a web application for evaluating a user-centered audio mixer for videos in the browser as part of a bachelor's thesis.
The focus is on interaction data, subjective video/audio ratings, and a final survey.

## Project Overview

- Frontend: React + TypeScript + Vite
- Data access: Supabase JS + React Query
- Routing: React Router
- Video: HLS.js
- Backend: local Supabase instance (Postgres, Storage, RLS, SQL migrations)

## Repository Structure

```text
backend/
	package.json
	storage-seed.js
	supabase/
		config.toml
		migrations/
		seeds/
		storage-seed/
            bucket-name/
                subfolder1/

frontend/
	package.json
	vite.config.ts
	src/
        features/
        layout/
        pages/
        shared/
            components/
            hooks/
            lib/
            utils/
            types/
        constants/
        assets/
        api/
```

    ## User Flow

    1. Consent
    2. Demographics
    3. Video catalog (mandatory + optional)
    4. Watch flow with audio mixer/standard mode (randomized order)
    5. Video survey per video
    6. Final survey (only after all mandatory videos)

    Note: Route guards ensure that consent and demographics are completed in the correct order.

    ## Prerequisites

    - Node.js (recommended: current LTS version)
- npm
    - Docker Desktop (on Windows) or Docker Engine (on Linux) for local Supabase services
    - Supabase CLI (already used in this project as a backend dev dependency)

## Installation

    ### 1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Create backend environment variables

File: `backend/.env`

Required by `storage-seed.js`:

```env
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=...SERVICE_ROLE_KEY...
```

You can obtain these values after starting your local Supabase instance or from the terminal (for example via CLI status/Studio).

### 3) Create frontend environment variables

File: `frontend/.env.local`

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

The first startup may fail if environment variables are missing, but they are typically shown in the terminal before the process exits. Run the command again after adding the missing variables.

### Start frontend

```bash
cd frontend
npm run dev
```

After that, the frontend is available at the URL printed by Vite (typically `http://localhost:5173`).

## Important Scripts

### Backend (`backend/package.json`)

- `npm run backend:start` starts Supabase, resets the DB, and seeds storage
- `npm run db:reset` resets the DB and seeds storage
- `npm run backend:stop` stops local Supabase services
- `npm run backend:restart` stops and restarts the backend

### Frontend (`frontend/package.json`)

- `npm run dev` starts Vite in dev mode
- `npm run build` builds TypeScript + production bundle
- `npm run lint` runs ESLint
- `npm run preview` starts a preview of the build

## Database and Storage

- SQL migrations are located in `backend/supabase/migrations`
- SQL seeds are located in `backend/supabase/seeds`
- Storage files for buckets are located in `backend/supabase/storage-seed`
- `storage-seed.js` creates missing buckets and uploads files with `upsert: true`

## Common Pitfalls

- Wrong dev command: use `npm run dev` (not `npm rund ev`)
- Missing frontend env variables: Supabase client cannot initialize
- Missing backend service role variable: `storage-seed` fails
- Docker/Supabase not available: local backend services cannot start

## Privacy and Research Context

This project is designed for anonymous data collection in a research context (consent, demographics, interaction data, survey data). Privacy policy and legal notice pages are integrated into the frontend.

