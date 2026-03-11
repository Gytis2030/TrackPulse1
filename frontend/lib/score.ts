import type { AnalysisResult } from '@/types/analysis';

type FeaturePayload = Omit<AnalysisResult['features'], 'moodTags'> & { moodTags?: string[] };

export function buildTrendScore(features: FeaturePayload): number {
  const bpmScore = Math.max(0, 100 - Math.abs(122 - features.bpm) * 2);
  const energyScore = features.energy * 100;
  const bassScore = features.bassIntensity * 100;
  const centroidScore = Math.max(0, 100 - Math.abs(2500 - features.spectralCentroid) / 40);
  return Math.round((bpmScore * 0.2 + energyScore * 0.35 + bassScore * 0.25 + centroidScore * 0.2) * 10) / 10;
}

export function buildArtistMatches(features: FeaturePayload): { name: string; score: number }[] {
  const catalog = [
    { name: 'Dua Lipa', targetEnergy: 0.72, targetBpm: 118 },
    { name: 'The Weeknd', targetEnergy: 0.64, targetBpm: 110 },
    { name: 'Fred again..', targetEnergy: 0.8, targetBpm: 130 }
  ];

  return catalog
    .map((artist) => {
      const bpmFit = Math.max(0, 100 - Math.abs(artist.targetBpm - features.bpm) * 2.4);
      const energyFit = Math.max(0, 100 - Math.abs(artist.targetEnergy - features.energy) * 200);
      return { name: artist.name, score: Math.round((bpmFit * 0.45 + energyFit * 0.55) * 10) / 10 };
    })
    .sort((a, b) => b.score - a.score);
}
