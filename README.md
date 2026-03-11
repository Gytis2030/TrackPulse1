# TrackPulse Monorepo Scaffold

TrackPulse is an MVP SaaS foundation for music producers and small music companies. This repository currently focuses on a clean, runnable structure (not full product features yet).

## What is included

- `frontend/`: Next.js 14 + TypeScript + Tailwind CSS app scaffold
- `audio-service/`: FastAPI service scaffold for deterministic audio-analysis responses
- `prisma/`: initial PostgreSQL schema for users, tracks, analyses, and artist matches
- `docker-compose.yml`: local development services for Postgres, frontend, and audio-service
- root workspace scripts in `package.json`
- `.env.example` files for root, frontend, and audio-service

## Prerequisites

Install locally:

- Node.js 20+
- npm 10+
- Python 3.11+
- Docker + Docker Compose (optional, for containerized run)

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

   Frontend starts at http://localhost:3000

4. Run the audio service in a separate terminal:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r audio-service/requirements.txt
   uvicorn audio-service.app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

   Audio service starts at http://localhost:8000 and exposes:
   - `GET /health`
   - `POST /analyze`

## Local setup (Docker Compose)

1. Build and start all services:

   ```bash
   docker compose up --build
   ```

2. Access services:
   - Frontend: http://localhost:3000
   - Audio service: http://localhost:8000
   - PostgreSQL: `localhost:5432` (`trackpulse`/`trackpulse`)

3. Stop services:

   ```bash
   docker compose down
   ```

## Validation commands

Run these from repository root:

```bash
npm run lint --workspace frontend
npm run build --workspace frontend
python -m compileall audio-service/app
```

## Current status

This scaffold intentionally keeps logic simple and deterministic for quick iteration:

- UI landing page placeholder
- deterministic audio analysis response payload
- initial Prisma schema + seed SQL

Future iterations will add upload flow, trend scoring pipeline, artist-style matching, and dashboard insights.
