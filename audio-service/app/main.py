from fastapi import FastAPI, File, HTTPException, UploadFile
from hashlib import sha256

app = FastAPI(title="TrackPulse Audio Service", version="0.1.0")

KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]


def _scale(value: int, lower: float, upper: float) -> float:
    ratio = value / 65535
    return round(lower + (upper - lower) * ratio, 3)


def _mood_tags(energy: float, bpm: int, bass: float) -> list[str]:
    tags: list[str] = []
    tags.append("energetic" if energy >= 0.65 else "chill")
    tags.append("club" if bpm >= 124 else "groove")
    tags.append("bass-heavy" if bass >= 0.6 else "balanced")
    return tags


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)) -> dict:
    payload = await file.read()
    if not payload:
        raise HTTPException(status_code=400, detail="Empty file")

    digest = sha256(payload).digest()
    a = int.from_bytes(digest[0:2], "big")
    b = int.from_bytes(digest[2:4], "big")
    c = int.from_bytes(digest[4:6], "big")
    d = int.from_bytes(digest[6:8], "big")

    bpm = int(round(_scale(a, 88, 156)))
    estimated_key = f"{KEYS[b % 12]} {'minor' if (b // 12) % 2 else 'major'}"
    energy = _scale(c, 0.35, 0.95)
    spectral_centroid = round(_scale(d, 900, 5200), 1)
    bass_intensity_proxy = _scale((a ^ c) % 65536, 0.2, 0.92)

    extension_factor = 1.0 if file.filename and file.filename.lower().endswith(".wav") else 0.8
    duration = round(min(360.0, max(45.0, (len(payload) / 24000) * extension_factor)), 2)

    return {
        "bpm": bpm,
        "estimated_key": estimated_key,
        "energy": energy,
        "spectral_centroid": spectral_centroid,
        "bass_intensity_proxy": bass_intensity_proxy,
        "duration": duration,
        "mood_tags": _mood_tags(energy, bpm, bass_intensity_proxy),
    }
