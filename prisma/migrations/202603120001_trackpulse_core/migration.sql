-- Create enums
CREATE TYPE "ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'ANALYZED', 'FAILED');
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'STARTER', 'PRO', 'TEAM');
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED');
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');
CREATE TYPE "UsageEventType" AS ENUM ('TRACK_UPLOAD', 'ANALYSIS_REQUESTED', 'ANALYSIS_COMPLETED', 'DASHBOARD_VIEWED', 'REPORT_EXPORTED');

-- Create tables
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "emailVerified" TIMESTAMP(3),
  "name" TEXT,
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Account" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Subscription" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "plan" "SubscriptionPlan" NOT NULL,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
  "billingCycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
  "currentPeriodEnd" TIMESTAMP(3),
  "cancelAt" TIMESTAMP(3),
  "canceledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UploadedTrack" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "artistName" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "durationSeconds" INTEGER,
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processingStatus" "ProcessingStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UploadedTrack_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AudioFeatures" (
  "id" TEXT NOT NULL,
  "uploadedTrackId" TEXT NOT NULL,
  "bpm" DOUBLE PRECISION NOT NULL,
  "musicalKey" TEXT,
  "energy" DOUBLE PRECISION NOT NULL,
  "danceability" DOUBLE PRECISION NOT NULL,
  "valence" DOUBLE PRECISION NOT NULL,
  "loudnessDb" DOUBLE PRECISION,
  "speechiness" DOUBLE PRECISION,
  "acousticness" DOUBLE PRECISION,
  "instrumentalness" DOUBLE PRECISION,
  "liveness" DOUBLE PRECISION,
  "spectralCentroid" DOUBLE PRECISION,
  "bassIntensity" DOUBLE PRECISION,
  "moodTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "featureVector" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
  "extractedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AudioFeatures_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrendSignal" (
  "id" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "genre" TEXT NOT NULL,
  "bpmRangeMin" INTEGER NOT NULL,
  "bpmRangeMax" INTEGER NOT NULL,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "growthScore" DOUBLE PRECISION NOT NULL,
  "signalDate" TIMESTAMP(3) NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TrendSignal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrendCluster" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "genre" TEXT NOT NULL,
  "description" TEXT,
  "centroidFeatures" JSONB NOT NULL,
  "centroidFeatureVector" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
  "sampleSize" INTEGER NOT NULL DEFAULT 0,
  "activeFrom" TIMESTAMP(3),
  "activeTo" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TrendCluster_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ArtistProfile" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "genre" TEXT NOT NULL,
  "eraTag" TEXT,
  "bpmRangeMin" INTEGER,
  "bpmRangeMax" INTEGER,
  "styleTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "profileFeatures" JSONB NOT NULL,
  "profileFeatureVector" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
  "popularityScore" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ArtistProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AnalysisReport" (
  "id" TEXT NOT NULL,
  "uploadedTrackId" TEXT NOT NULL,
  "trendClusterId" TEXT,
  "closestArtistId" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "trendScore" DOUBLE PRECISION NOT NULL,
  "confidenceScore" DOUBLE PRECISION,
  "summary" TEXT,
  "insights" JSONB NOT NULL,
  "scoringBreakdown" JSONB NOT NULL,
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AnalysisReport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UsageEvent" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "uploadedTrackId" TEXT,
  "analysisReportId" TEXT,
  "eventType" "UsageEventType" NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "metadata" JSONB,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");
CREATE INDEX "UploadedTrack_userId_uploadedAt_idx" ON "UploadedTrack"("userId", "uploadedAt");
CREATE INDEX "UploadedTrack_processingStatus_idx" ON "UploadedTrack"("processingStatus");
CREATE UNIQUE INDEX "AudioFeatures_uploadedTrackId_key" ON "AudioFeatures"("uploadedTrackId");
CREATE INDEX "TrendSignal_genre_signalDate_idx" ON "TrendSignal"("genre", "signalDate");
CREATE INDEX "TrendSignal_source_signalDate_idx" ON "TrendSignal"("source", "signalDate");
CREATE UNIQUE INDEX "TrendCluster_name_genre_key" ON "TrendCluster"("name", "genre");
CREATE INDEX "TrendCluster_genre_idx" ON "TrendCluster"("genre");
CREATE UNIQUE INDEX "ArtistProfile_name_key" ON "ArtistProfile"("name");
CREATE INDEX "ArtistProfile_genre_idx" ON "ArtistProfile"("genre");
CREATE INDEX "AnalysisReport_uploadedTrackId_generatedAt_idx" ON "AnalysisReport"("uploadedTrackId", "generatedAt");
CREATE INDEX "AnalysisReport_trendClusterId_idx" ON "AnalysisReport"("trendClusterId");
CREATE INDEX "AnalysisReport_closestArtistId_idx" ON "AnalysisReport"("closestArtistId");
CREATE INDEX "UsageEvent_userId_occurredAt_idx" ON "UsageEvent"("userId", "occurredAt");
CREATE INDEX "UsageEvent_eventType_occurredAt_idx" ON "UsageEvent"("eventType", "occurredAt");

-- Add foreign keys
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UploadedTrack" ADD CONSTRAINT "UploadedTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AudioFeatures" ADD CONSTRAINT "AudioFeatures_uploadedTrackId_fkey" FOREIGN KEY ("uploadedTrackId") REFERENCES "UploadedTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AnalysisReport" ADD CONSTRAINT "AnalysisReport_uploadedTrackId_fkey" FOREIGN KEY ("uploadedTrackId") REFERENCES "UploadedTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AnalysisReport" ADD CONSTRAINT "AnalysisReport_trendClusterId_fkey" FOREIGN KEY ("trendClusterId") REFERENCES "TrendCluster"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AnalysisReport" ADD CONSTRAINT "AnalysisReport_closestArtistId_fkey" FOREIGN KEY ("closestArtistId") REFERENCES "ArtistProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "UsageEvent" ADD CONSTRAINT "UsageEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UsageEvent" ADD CONSTRAINT "UsageEvent_uploadedTrackId_fkey" FOREIGN KEY ("uploadedTrackId") REFERENCES "UploadedTrack"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "UsageEvent" ADD CONSTRAINT "UsageEvent_analysisReportId_fkey" FOREIGN KEY ("analysisReportId") REFERENCES "AnalysisReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
