-- Migration: create VideoGenerationJobs table
CREATE TABLE IF NOT EXISTS "VideoGenerationJobs" (
  "id" TEXT PRIMARY KEY,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "prompt" TEXT NOT NULL,
  "imageUrl" TEXT,
  "videoUrl" TEXT,
  "provider" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "completedAt" TIMESTAMP WITH TIME ZONE
);
