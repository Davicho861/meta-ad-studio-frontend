import { Queue, Worker } from 'bullmq'
import IORedis from 'ioredis'
import { prisma } from '../lib/prisma'

// Redis connection (env-driven)
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379')

export const videoQueueName = 'video-generation-queue'

export const videoQueue = new Queue(videoQueueName, { connection })

// Basic worker skeleton - implement provider integration here
export const videoWorker = new Worker(
  videoQueueName,
  async (job) => {
    // job.data should contain { id, prompt, imageUrl, provider }
    console.log('Processing video job', job.id, job.data)

    // TODO: integrate with real video provider (e.g., AI provider)

    // Simulate processing
    await new Promise((r) => setTimeout(r, 1000))

    const result = { status: 'completed', videoUrl: 'https://example.com/video.mp4' }

    // Persist the simulated result to the database using typed Prisma client
    try {
      await prisma.videoGenerationJob.create({
        data: {
          id: String(job.id),
          status: result.status,
          prompt: job.data.prompt || '',
          imageUrl: job.data.imageUrl || null,
          videoUrl: result.videoUrl,
          provider: job.data.provider || null,
        },
      })
    } catch (err) {
      console.error('Failed to persist VideoGenerationJob', err)
    }

    return result
  },
  { connection }
)

videoWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`)
})

videoWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed`, err)
})
