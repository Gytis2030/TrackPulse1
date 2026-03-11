import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { buildArtistMatches, buildTrendScore } from '@/lib/score';
import { saveAnalysis } from '@/lib/storage';
import type { AnalysisResult } from '@/types/analysis';

const AUDIO_SERVICE_URL = process.env.AUDIO_SERVICE_URL ?? 'http://localhost:8000/analyze';

type ServiceResponse = {
  bpm: number;
  estimated_key: string;
  energy: number;
  spectral_centroid: number;
  bass_intensity_proxy: number;
  duration: number;
  mood_tags: string[];
};

export async function POST(request: Request) {
  const data = await request.formData();
  const file = data.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No audio file uploaded.' }, { status: 400 });
  }

  const serviceForm = new FormData();
  serviceForm.append('file', file);

  const response = await fetch(AUDIO_SERVICE_URL, {
    method: 'POST',
    body: serviceForm
  }).catch(() => null);

  if (!response || !response.ok) {
    return NextResponse.json({ error: 'Audio service unavailable.' }, { status: 503 });
  }

  const result = (await response.json()) as ServiceResponse;

  const normalized: AnalysisResult = {
    id: randomUUID(),
    filename: file.name,
    createdAt: new Date().toISOString(),
    features: {
      bpm: result.bpm,
      estimatedKey: result.estimated_key,
      energy: result.energy,
      spectralCentroid: result.spectral_centroid,
      bassIntensity: result.bass_intensity_proxy,
      duration: result.duration,
      moodTags: result.mood_tags
    },
    trendScore: buildTrendScore({
      bpm: result.bpm,
      estimatedKey: result.estimated_key,
      energy: result.energy,
      spectralCentroid: result.spectral_centroid,
      bassIntensity: result.bass_intensity_proxy,
      duration: result.duration,
      moodTags: result.mood_tags
    }),
    artistMatches: buildArtistMatches({
      bpm: result.bpm,
      estimatedKey: result.estimated_key,
      energy: result.energy,
      spectralCentroid: result.spectral_centroid,
      bassIntensity: result.bass_intensity_proxy,
      duration: result.duration,
      moodTags: result.mood_tags
    })
  };

  await saveAnalysis(normalized);

  return NextResponse.json({ id: normalized.id });
}
