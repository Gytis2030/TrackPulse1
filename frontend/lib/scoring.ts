import { ArtistMatch, AudioFeatures } from "./types";

const artistProfiles: Array<{ name: string; bpm: number; energy: number; bass: number; centroid: number; rationale: string }> = [
  {
    name: "Dua Lipa",
    bpm: 122,
    energy: 0.76,
    bass: 0.64,
    centroid: 2350,
    rationale: "Polished dance-pop profile with balanced top-end and controlled low-end punch."
  },
  {
    name: "Fred again..",
    bpm: 130,
    energy: 0.84,
    bass: 0.7,
    centroid: 2600,
    rationale: "Club-forward dynamics with bright synth spectrum and emotive drive."
  },
  {
    name: "Billie Eilish",
    bpm: 100,
    energy: 0.48,
    bass: 0.55,
    centroid: 1800,
    rationale: "Mood-centric minimalism with restrained highs and intimate pulse."
  },
  {
    name: "The Weeknd",
    bpm: 115,
    energy: 0.67,
    bass: 0.62,
    centroid: 2200,
    rationale: "Dark pop/R&B crossover energy with smooth rhythmic momentum."
  }
];

function normalize(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export function computeTrendScore(features: AudioFeatures): number {
  const bpmFit = 1 - Math.abs(features.bpm - 124) / 50;
  const energyFit = 1 - Math.abs(features.energy - 0.74);
  const centroidFit = 1 - Math.abs(normalize(features.spectralCentroid, 800, 5000) - 0.45);
  const bassFit = 1 - Math.abs(features.bassIntensity - 0.66);
  const moodBoost = features.moodTags.includes("uplifting") || features.moodTags.includes("club") ? 0.06 : 0;

  const weighted = bpmFit * 0.3 + energyFit * 0.35 + centroidFit * 0.2 + bassFit * 0.15 + moodBoost;
  return Math.round(Math.max(0, Math.min(1, weighted)) * 100);
}

export function inferTrendCluster(features: AudioFeatures): string {
  if (features.energy > 0.78 && features.bpm >= 124) return "Festival Electronic";
  if (features.energy < 0.55 && features.spectralCentroid < 2200) return "Alt Mood Pop";
  if (features.bassIntensity > 0.72) return "Bass-Forward Club";
  return "Mainstream Pop Crossover";
}

export function getArtistMatches(features: AudioFeatures): ArtistMatch[] {
  const scored = artistProfiles.map((artist) => {
    const proximity =
      (1 - Math.abs(features.bpm - artist.bpm) / 60) * 0.3 +
      (1 - Math.abs(features.energy - artist.energy)) * 0.35 +
      (1 - Math.abs(features.bassIntensity - artist.bass)) * 0.2 +
      (1 - Math.abs(features.spectralCentroid - artist.centroid) / 4500) * 0.15;

    return {
      name: artist.name,
      score: Math.round(Math.max(0, Math.min(1, proximity)) * 100),
      rationale: artist.rationale
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}
