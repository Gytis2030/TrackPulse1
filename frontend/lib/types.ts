export interface AudioFeatures {
  bpm: number;
  estimatedKey: string;
  energy: number;
  spectralCentroid: number;
  bassIntensity: number;
  duration: number;
  moodTags: string[];
}

export interface ArtistMatch {
  name: string;
  score: number;
  rationale: string;
}

export interface TrendAnalysisResult {
  id: string;
  trackName: string;
  uploadedAt: string;
  features: AudioFeatures;
  trendScore: number;
  trendCluster: string;
  artistMatches: ArtistMatch[];
}

export interface AnalyzeApiResponse {
  bpm: number;
  estimated_key: string;
  energy: number;
  spectral_centroid: number;
  bass_intensity_proxy: number;
  duration: number;
  mood_tags: string[];
}
