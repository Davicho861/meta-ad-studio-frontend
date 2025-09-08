import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { generateVideoService } from '../services/gemini';
import { prisma } from '../lib/prisma';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new Redis(redisUrl, { maxRetriesPerRequest: null });

const processor = async (job: Job) => {
  const { sceneDescription, userId } = job.data as { sceneDescription: string; userId?: string };

  // Update status: processing
  const inProgress = { status: 'processing', progress: 0 };
  await connection.set(`job:${job.id}`, JSON.stringify(inProgress));
  await connection.publish(`job:${job.id}`, JSON.stringify(inProgress));

  try {
    // Simulate progress
    for (let p = 10; p <= 90; p += 20) {
      await new Promise((r) => setTimeout(r, 500));
      await connection.set(`job:${job.id}`, JSON.stringify({ status: 'processing', progress: p }));
      await connection.publish(`job:${job.id}`, JSON.stringify({ status: 'processing', progress: p }));
    }

    const videoUrl = await generateVideoService(sceneDescription);

    const completed = { status: 'completed', progress: 100, videoUrl };

    // Persist a Video record in DB
    await prisma.video.create({ data: {
      imageUrl: '',
      status: 'completed',
      videoUrl: videoUrl || undefined,
      userId: userId || undefined,
    }});

    await connection.set(`job:${job.id}`, JSON.stringify(completed));
    await connection.publish(`job:${job.id}`, JSON.stringify(completed));

    return completed;
  } catch (err: unknown) {
    const failed = { status: 'failed', error: (err as Error)?.message ?? 'unknown' };
    await connection.set(`job:${job.id}`, JSON.stringify(failed));
    await connection.publish(`job:${job.id}`, JSON.stringify(failed));
    throw err;
  }
};

const worker = new Worker('video-generation', processor, { connection });

worker.on('failed', (job, err) => {
  console.error('Job failed', job?.id, err?.message);
});

worker.on('completed', (job) => {
  console.log('Job completed', job.id);
});
