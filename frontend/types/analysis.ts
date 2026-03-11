export type AnalysisResult = {
  id: string;
  filename: string;
  createdAt: string;
  features: {
    bpm: number;
    estimatedKey: string;
    energy: number;
    spectralCentroid: number;
    bassIntensity: number;
    duration: number;
    moodTags: string[];
  };
  trendScore: number;
  artistMatches: { name: string; score: number }[];
};
