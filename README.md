# TrackPulse Monorepo MVP

TrackPulse is a production-oriented MVP SaaS foundation for music producers and small music companies.

## Included apps

- `frontend/`: Next.js 14 + TypeScript + Tailwind app with founder-demo UX
- `audio-service/`: FastAPI deterministic audio feature service
- `prisma/`: PostgreSQL schema for users, tracks, analyses, and artist matches
- `docker-compose.yml`: local orchestration for frontend, audio-service, and Postgres

## Core MVP flow implemented

- Premium landing page (`/`)
- Upload page with audio file submission (`/upload`)
- Analysis result page with trend score + artist-style matches (`/analysis/[id]`)
- Dashboard page with recent analyses and aggregate stats (`/dashboard`)
- Frontend API route that forwards upload requests to FastAPI (`/api/analyze`)
- In-memory analysis store abstraction that can later be swapped with Prisma persistence

## Audio feature payload

`POST /analyze` returns deterministic values for:

- `bpm`
- `estimated_key`
- `energy`
- `spectral_centroid`
- `bass_intensity_proxy`
- `duration`
- `mood_tags`

## Local setup (without Docker)

1. Install frontend dependencies from repository root:

   ```bash
   npm install
   ```

2. (Optional) copy env templates for local overrides:

   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env.local
   cp audio-service/.env.example audio-service/.env
   ```

3. Run the frontend:

   ```bash
   npm run dev:frontend
   ```

4. Run the audio service in a separate terminal:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r audio-service/requirements.txt
   uvicorn audio-service.app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## Local setup (Docker Compose)

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:3000
- Audio service: http://localhost:8000
- PostgreSQL: `localhost:5432` (`trackpulse`/`trackpulse`)

## Validation commands

```bash
npm run lint --workspace frontend
npm run build --workspace frontend
python -m compileall audio-service/app
```
