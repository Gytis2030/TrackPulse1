import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { saveAnalysis } from "@/lib/analysis-store";
import { getArtistMatches, computeTrendScore, inferTrendCluster } from "@/lib/scoring";
import { AnalyzeApiResponse, AudioFeatures, TrendAnalysisResult } from "@/lib/types";

const AUDIO_SERVICE_URL = process.env.AUDIO_SERVICE_URL ?? "http://localhost:8000";

export async function POST(request: Request): Promise<NextResponse> {
  const incoming = await request.formData();
  const file = incoming.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
  }

  const servicePayload = new FormData();
  servicePayload.append("file", file, file.name);

  const upstream = await fetch(`${AUDIO_SERVICE_URL}/analyze`, {
    method: "POST",
    body: servicePayload,
    cache: "no-store"
  });

  if (!upstream.ok) {
    const message = await upstream.text();
    return NextResponse.json({ error: `Audio service error: ${message}` }, { status: 502 });
  }

  const analysis = (await upstream.json()) as AnalyzeApiResponse;

  const features: AudioFeatures = {
    bpm: analysis.bpm,
    estimatedKey: analysis.estimated_key,
    energy: analysis.energy,
    spectralCentroid: analysis.spectral_centroid,
    bassIntensity: analysis.bass_intensity_proxy,
    duration: analysis.duration,
    moodTags: analysis.mood_tags
  };

  const result: TrendAnalysisResult = {
    id: randomUUID(),
    trackName: file.name,
    uploadedAt: new Date().toISOString(),
    features,
    trendScore: computeTrendScore(features),
    trendCluster: inferTrendCluster(features),
    artistMatches: getArtistMatches(features)
  };

  saveAnalysis(result);

  return NextResponse.json({ id: result.id });
}
