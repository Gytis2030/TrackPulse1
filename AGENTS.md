# TrackPulse agent instructions

## Product goal
Build TrackPulse, a production-quality MVP SaaS for music producers and small music companies.

TrackPulse should help users:
- upload a track
- extract audio features
- compare the track to trend clusters
- get a trend score
- get closest artist-style matches
- view insights in a polished dashboard

## Stack
- Next.js 14+
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- FastAPI Python service for audio analysis
- Docker Compose for local development

## Project rules
- Prioritize a usable MVP over complex ML
- Use deterministic scoring logic first
- Avoid illegal scraping
- Use mock adapters where live APIs are uncertain
- Keep code typed, testable, and modular
- Do not commit secrets or real .env files
- Commit only .env.example files
- Prefer simple architecture that can be demoed and deployed quickly

## Validation commands
- frontend lint: npm run lint --workspace frontend
- frontend build: npm run build --workspace frontend
- python compile: python -m compileall audio-service/app

## Deliverables
- clean monorepo structure
- frontend app
- audio-service app
- prisma schema
- env examples
- docker-compose.yml
- polished README
- demo seed data
- upload + analysis flow
- trend scoring
- artist-style matching

## Non-goals for now
- no advanced ML training pipeline
- no large-scale scraping
- no mobile app
- no enterprise integrations
