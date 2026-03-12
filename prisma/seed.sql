-- TrackPulse realistic demo seed data
-- Run with: psql "$DATABASE_URL" -f prisma/seed.sql

-- Users
INSERT INTO "User" ("id", "email", "name", "createdAt", "updatedAt")
VALUES
  ('usr_demo_001', 'maya@trackpulse.dev', 'Maya Rhodes', NOW() - INTERVAL '90 days', NOW()),
  ('usr_demo_002', 'labelops@trackpulse.dev', 'Label Ops Team', NOW() - INTERVAL '65 days', NOW())
ON CONFLICT ("email") DO NOTHING;

-- Subscriptions
INSERT INTO "Subscription" ("id", "userId", "plan", "status", "billingCycle", "currentPeriodEnd", "createdAt", "updatedAt")
VALUES
  ('sub_demo_001', 'usr_demo_001', 'PRO', 'ACTIVE', 'MONTHLY', NOW() + INTERVAL '20 days', NOW() - INTERVAL '30 days', NOW()),
  ('sub_demo_002', 'usr_demo_002', 'TEAM', 'TRIALING', 'YEARLY', NOW() + INTERVAL '10 days', NOW() - INTERVAL '4 days', NOW())
ON CONFLICT DO NOTHING;

-- Uploaded tracks
INSERT INTO "UploadedTrack" ("id", "userId", "title", "artistName", "fileName", "fileUrl", "durationSeconds", "uploadedAt", "processingStatus", "createdAt", "updatedAt")
VALUES
  ('trk_demo_001', 'usr_demo_001', 'Neon Skyline', 'Maya Rhodes', 'neon-skyline-v3.wav', 'https://demo.trackpulse.dev/audio/neon-skyline-v3.wav', 214, NOW() - INTERVAL '14 days', 'ANALYZED', NOW() - INTERVAL '14 days', NOW()),
  ('trk_demo_002', 'usr_demo_001', 'Afterglow Run', 'Maya Rhodes', 'afterglow-run-master.wav', 'https://demo.trackpulse.dev/audio/afterglow-run-master.wav', 188, NOW() - INTERVAL '7 days', 'ANALYZED', NOW() - INTERVAL '7 days', NOW()),
  ('trk_demo_003', 'usr_demo_002', 'Warehouse Hearts', 'Midnight Circuit', 'warehouse-hearts-12.wav', 'https://demo.trackpulse.dev/audio/warehouse-hearts-12.wav', 236, NOW() - INTERVAL '2 days', 'PROCESSING', NOW() - INTERVAL '2 days', NOW())
ON CONFLICT DO NOTHING;

-- Audio features (1:1 with uploaded tracks where available)
INSERT INTO "AudioFeatures" ("id", "uploadedTrackId", "bpm", "musicalKey", "energy", "danceability", "valence", "loudnessDb", "speechiness", "acousticness", "instrumentalness", "liveness", "spectralCentroid", "bassIntensity", "moodTags", "featureVector", "extractedAt", "createdAt", "updatedAt")
VALUES
  ('af_demo_001', 'trk_demo_001', 123.4, 'F# minor', 0.86, 0.74, 0.62, -6.8, 0.08, 0.11, 0.19, 0.16, 3120.5, 0.81, ARRAY['uplifting', 'night-drive', 'anthemic'], ARRAY[123.4, 0.86, 0.74, 0.62, 3120.5, 0.81], NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days', NOW()),
  ('af_demo_002', 'trk_demo_002', 127.8, 'A minor', 0.79, 0.77, 0.48, -7.4, 0.05, 0.07, 0.36, 0.12, 2895.1, 0.76, ARRAY['moody', 'club', 'late-night'], ARRAY[127.8, 0.79, 0.77, 0.48, 2895.1, 0.76], NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NOW())
ON CONFLICT ("uploadedTrackId") DO NOTHING;

-- Trend signals
INSERT INTO "TrendSignal" ("id", "source", "genre", "bpmRangeMin", "bpmRangeMax", "tags", "growthScore", "signalDate", "metadata", "createdAt", "updatedAt")
VALUES
  ('sig_demo_001', 'Spotify Viral 50', 'Melodic House', 120, 126, ARRAY['female-vocal', 'nostalgic-synth', 'festival-ready'], 82.6, NOW() - INTERVAL '3 days', '{"market":"global","sampleSize":500}'::jsonb, NOW() - INTERVAL '3 days', NOW()),
  ('sig_demo_002', 'TikTok Trending', 'Tech House', 126, 130, ARRAY['minimal-hook', 'bass-driven', 'short-form-friendly'], 88.9, NOW() - INTERVAL '2 days', '{"market":"US","sampleSize":920}'::jsonb, NOW() - INTERVAL '2 days', NOW()),
  ('sig_demo_003', 'Beatport Top 100', 'Afro House', 118, 124, ARRAY['organic-percussion', 'deep-groove'], 74.3, NOW() - INTERVAL '1 day', '{"market":"EU","sampleSize":210}'::jsonb, NOW() - INTERVAL '1 day', NOW())
ON CONFLICT DO NOTHING;

-- Trend clusters with centroid-style feature storage
INSERT INTO "TrendCluster" ("id", "name", "genre", "description", "centroidFeatures", "centroidFeatureVector", "sampleSize", "activeFrom", "createdAt", "updatedAt")
VALUES
  ('clu_demo_001', 'Melodic Lift-Off', 'Melodic House', 'High-energy melodic house with bright synth leads and emotional toplines.', '{"bpm":124.2,"energy":0.84,"danceability":0.73,"valence":0.59,"spectralCentroid":3050}'::jsonb, ARRAY[124.2, 0.84, 0.73, 0.59, 3050], 146, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days', NOW()),
  ('clu_demo_002', 'Dark Groove Pocket', 'Tech House', 'Lower-valence, groove-heavy tech house with punchy low-end.', '{"bpm":128.1,"energy":0.8,"danceability":0.79,"valence":0.42,"spectralCentroid":2800}'::jsonb, ARRAY[128.1, 0.8, 0.79, 0.42, 2800], 193, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days', NOW())
ON CONFLICT ("name", "genre") DO NOTHING;

-- Artist profiles used for style matching
INSERT INTO "ArtistProfile" ("id", "name", "genre", "eraTag", "bpmRangeMin", "bpmRangeMax", "styleTags", "profileFeatures", "profileFeatureVector", "popularityScore", "createdAt", "updatedAt")
VALUES
  ('art_demo_001', 'Aurora Lane', 'Melodic House', '2020s', 121, 126, ARRAY['cinematic-builds', 'female-vocal', 'wide-stereo-synths'], '{"energy":0.83,"danceability":0.72,"valence":0.61}'::jsonb, ARRAY[123.9, 0.83, 0.72, 0.61], 71.2, NOW() - INTERVAL '80 days', NOW()),
  ('art_demo_002', 'Kilo Static', 'Tech House', '2020s', 126, 130, ARRAY['bass-forward', 'dry-percussion', 'club-tool'], '{"energy":0.81,"danceability":0.8,"valence":0.39}'::jsonb, ARRAY[128.4, 0.81, 0.8, 0.39], 77.5, NOW() - INTERVAL '77 days', NOW())
ON CONFLICT ("name") DO NOTHING;

-- Analysis reports (one track can have multiple over time)
INSERT INTO "AnalysisReport" ("id", "uploadedTrackId", "trendClusterId", "closestArtistId", "version", "trendScore", "confidenceScore", "summary", "insights", "scoringBreakdown", "generatedAt", "createdAt", "updatedAt")
VALUES
  ('rep_demo_001', 'trk_demo_001', 'clu_demo_001', 'art_demo_001', 1, 84.7, 0.89, 'Strong melodic-house alignment with above-average growth potential.', '{"recommendations":["shorten intro by 8 bars","boost hook vocal 1.5dB"],"riskFlags":["slightly long breakdown"]}'::jsonb, '{"clusterDistance":0.12,"growthSignalWeight":0.41,"genreFit":0.91,"novelty":0.64}'::jsonb, NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days', NOW()),
  ('rep_demo_002', 'trk_demo_001', 'clu_demo_001', 'art_demo_001', 2, 87.9, 0.92, 'Mix revision improved trend fit and confidence.', '{"recommendations":["retain current drop arrangement"],"riskFlags":[]}'::jsonb, '{"clusterDistance":0.09,"growthSignalWeight":0.44,"genreFit":0.93,"novelty":0.66}'::jsonb, NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days', NOW()),
  ('rep_demo_003', 'trk_demo_002', 'clu_demo_002', 'art_demo_002', 1, 79.4, 0.81, 'Good club fit; could improve uniqueness in topline phrasing.', '{"recommendations":["introduce signature mid-bass motif"],"riskFlags":["trend saturation risk"]}'::jsonb, '{"clusterDistance":0.17,"growthSignalWeight":0.36,"genreFit":0.88,"novelty":0.51}'::jsonb, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', NOW())
ON CONFLICT DO NOTHING;

-- Usage events for analytics + quota tracking
INSERT INTO "UsageEvent" ("id", "userId", "uploadedTrackId", "analysisReportId", "eventType", "quantity", "metadata", "occurredAt", "createdAt")
VALUES
  ('evt_demo_001', 'usr_demo_001', 'trk_demo_001', NULL, 'TRACK_UPLOAD', 1, '{"channel":"web"}'::jsonb, NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
  ('evt_demo_002', 'usr_demo_001', 'trk_demo_001', 'rep_demo_001', 'ANALYSIS_REQUESTED', 1, '{"model":"deterministic-v1"}'::jsonb, NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'),
  ('evt_demo_003', 'usr_demo_001', 'trk_demo_001', 'rep_demo_002', 'ANALYSIS_COMPLETED', 1, '{"latencyMs":1820}'::jsonb, NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'),
  ('evt_demo_004', 'usr_demo_001', NULL, NULL, 'DASHBOARD_VIEWED', 1, '{"surface":"overview"}'::jsonb, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('evt_demo_005', 'usr_demo_002', 'trk_demo_003', NULL, 'TRACK_UPLOAD', 1, '{"channel":"api"}'::jsonb, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;
