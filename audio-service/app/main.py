from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="TrackPulse Audio Service", version="0.1.0")


class AnalyzeResponse(BaseModel):
    tempo_bpm: float
    energy: float
    danceability: float
    trend_score: float


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_track() -> AnalyzeResponse:
    """Deterministic placeholder response for MVP scaffolding."""

    return AnalyzeResponse(
        tempo_bpm=124.0,
        energy=0.76,
        danceability=0.68,
        trend_score=82.5,
    )
