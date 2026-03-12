from hashlib import sha256
from pathlib import Path

from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel

app = FastAPI(title="TrackPulse Audio Service", version="0.2.0")


class AnalyzeResponse(BaseModel):
    bpm: float
    estimated_key: str
    energy: float
    spectral_centroid: float
    bass_intensity_proxy: float
    duration: float
    mood_tags: list[str]


KEYS = [
    "C major",
    "G major",
    "D major",
    "A minor",
    "E minor",
    "F major",
    "B minor",
    "E major",
]

MOOD_BANK = [
    "uplifting",
    "dark",
    "club",
    "melodic",
    "aggressive",
    "dreamy",
    "cinematic",
    "groovy",
]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_track(file: UploadFile = File(...)) -> AnalyzeResponse:
    """Deterministic feature generation using file metadata and content hash."""

    content = await file.read()
    if not content:
        content = file.filename.encode("utf-8")

    digest = sha256(content + file.filename.encode("utf-8")).hexdigest()
    seed = int(digest[:12], 16)

    ext = Path(file.filename).suffix.lower()
    ext_factor = {".wav": 1.0, ".mp3": 0.92, ".aiff": 1.04, ".m4a": 0.95}.get(ext, 0.9)
    size_factor = min(max(len(content) / 8_000_000, 0.1), 1.0)

    bpm = round(96 + (seed % 700) / 10, 2)
    energy = round(min(0.98, 0.35 + ((seed // 7) % 60) / 100 * ext_factor), 3)
    spectral_centroid = round(1200 + ((seed // 13) % 3200) * ext_factor, 1)
    bass_intensity_proxy = round(min(0.95, 0.3 + ((seed // 17) % 55) / 100 + size_factor * 0.1), 3)
    duration = round(95 + ((seed // 23) % 190) + size_factor * 30, 2)

    key_index = seed % len(KEYS)
    mood_start = (seed // 29) % len(MOOD_BANK)
    mood_tags = [MOOD_BANK[(mood_start + shift) % len(MOOD_BANK)] for shift in range(3)]

    return AnalyzeResponse(
        bpm=bpm,
        estimated_key=KEYS[key_index],
        energy=energy,
        spectral_centroid=spectral_centroid,
        bass_intensity_proxy=bass_intensity_proxy,
        duration=duration,
        mood_tags=mood_tags,
    )
