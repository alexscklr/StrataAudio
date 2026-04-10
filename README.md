# StrataAudio

StrataAudio ist eine Webanwendung zur Evaluation eines nutzerzentrierten Audio-Mixers für Videos im Browser für eine Bachelorarbeit.
Im Fokus stehen Interaktionsdaten, subjektive Video-/Audio-Bewertungen und eine anschliessende Endumfrage.

## Projektüberblick

- Frontend: React + TypeScript + Vite
- Datenzugriff: Supabase JS + React Query
- Routing: React Router
- Video: HLS.js
- Backend: lokale Supabase-Instanz (Postgres, Storage, RLS, SQL-Migrations)

## Repository-Struktur

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
                unterordner1/

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

## Benutzerfluss

1. Consent (Einwilligung)
2. Demografie
3. Videokatalog (Pflicht + optional)
4. Watch-Flow mit Audio-Mixer/Standardmodus (zufällige Reihenfolge)
5. Video-Umfrage je Video
6. Endumfrage (erst nach allen Pflichtvideos)

Hinweis: Route Guards stellen sicher, dass Consent und Demografie in der richtigen Reihenfolge durchlaufen werden.

## Voraussetzungen

- Node.js (empfohlen: aktuelle LTS-Version)
- npm
- Docker Desktop (auf Windows) oder Docker Engine (auf Linux) für lokale Supabase-Services
- Supabase CLI (im Projekt bereits als Dev-Dependency im Backend genutzt)

## Installation

### 1) Abhängigkeiten installieren

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Backend-Umgebungsvariablen anlegen

Datei: `backend/.env`

`storage-seed.js` benötigt:

```env
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=...SERVICE_ROLE_KEY...
```

Die Werte können nach Start der lokalen Supabase-Instanz oder im Terminal ausgelesen werden (z. B. über CLI-Status/Studio).

### 3) Frontend-Umgebungsvariablen anlegen

Datei: `frontend/.env.local`

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=...ANON_KEY...
```

## Lokale Entwicklung

### Backend starten (Supabase + DB Reset + Storage Seed)

```bash
cd backend
npm run backend:start
```

Der erste Start kann abbrechen, wenn Umgebungsvariablen fehlen, jedoch sollten sie bis zum Abbruch bereits im Terminal angezeigt werden. Der Befehl muss nach dem Hinzufügen der Umgebungsvariablen erneut ausgeführt werden.

### Frontend starten

```bash
cd frontend
npm run dev
```

Danach ist das Frontend standardmässig unter der von Vite ausgegebenen URL erreichbar (typisch: `http://localhost:5173`).

## Wichtige Skripte

### Backend (`backend/package.json`)

- `npm run backend:start` startet Supabase, setzt DB neu auf und seeded Storage
- `npm run db:reset` setzt DB neu auf und seeded Storage
- `npm run backend:stop` stoppt lokale Supabase-Services
- `npm run backend:restart` stoppt und startet Backend neu

### Frontend (`frontend/package.json`)

- `npm run dev` startet Vite im Dev-Modus
- `npm run build` baut TypeScript + Production Bundle
- `npm run lint` führt ESLint aus
- `npm run preview` startet Preview des Builds

## Datenbank und Storage

- SQL-Migrations liegen in `backend/supabase/migrations`
- SQL-Seeds liegen in `backend/supabase/seeds`
- Storage-Dateien für Buckets liegen in `backend/supabase/storage-seed`
- `storage-seed.js` erstellt fehlende Buckets und lädt Dateien mit `upsert: true` hoch

## Typische Fehlerquellen

- Falscher Dev-Befehl: korrekt ist `npm run dev` (nicht `npm rund ev`)
- Fehlende Env-Variablen im Frontend: Supabase-Client kann nicht initialisiert werden
- Fehlende Service-Role-Variable im Backend: storage-seed bricht ab
- Docker/Supabase nicht verfügbar: lokale Backend-Services starten nicht

## Datenschutz und Forschungskontext

Das Projekt ist auf anonyme Datenerhebung im Studienkontext ausgelegt (Consent, Demografie, Interaktionsdaten, Survey-Daten). Datenschutz- und Impressumsseiten sind im Frontend integriert.

