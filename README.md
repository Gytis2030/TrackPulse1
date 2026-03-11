# TrackPulse MVP

TrackPulse is a production-style MVP for music producers and indie music teams. It provides a deterministic upload-to-insight flow for founder demos.

## What is included
- Next.js 14 frontend with premium-styled pages:
  - landing (`/`)
  - dashboard (`/dashboard`)
  - upload (`/upload`)
  - analysis results (`/results/[id]`)
- FastAPI audio-service endpoint (`POST /analyze`) with deterministic feature extraction
- Trend score + artist-style matching logic in typed frontend modules
- Simple file-based analysis storage (`frontend/data/analyses.json`) designed to map cleanly to Prisma later
- Prisma schema scaffold and Docker Compose local stack

## Local setup
```bash
npm install
pip install -r audio-service/requirements.txt
cp frontend/.env.example frontend/.env.local
```

Run frontend:
```bash
npm run dev --workspace frontend
```

Run audio-service:
```bash
uvicorn audio-service.app.main:app --host 0.0.0.0 --port 8000
```

## Validation commands
```bash
npm run lint --workspace frontend
npm run build --workspace frontend
python -m compileall audio-service/app
```
