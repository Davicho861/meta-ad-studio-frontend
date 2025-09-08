import { Worker, Job } from 'bullmq'
import { redisClient, videoQueueName, videoDLQName } from '../lib/queue'
import { prisma } from '../lib/prisma'

// Worker processor consolidated: Prisma state updates + Redis pub/sub + simulated provider call
const processor = async (job: Job) => {
  const jobId = String(job.id)
  const payload = job.data as { prompt?: string; imageUrl?: string; userId?: string; provider?: string }

  // 1) Mark as processing in DB (upsert style)
  try {
    await prisma.videoGenerationJob.upsert({
      where: { id: jobId },
      update: { status: 'processing' },
      create: {
        id: jobId,
        status: 'processing',
        prompt: payload.prompt || '',
        imageUrl: payload.imageUrl || null,
        provider: payload.provider || null,
      },
    })
  } catch (err) {
    // If DB fails, rethrow to trigger retry/backoff
    throw new Error(`prisma_upsert_failed: ${(err as Error).message}`)
  }

  // 2) Publish processing state to Redis pub/sub
  try {
    await redisClient.set(`job:${jobId}`, JSON.stringify({ status: 'processing', progress: 0 }))
    await redisClient.publish(`job:${jobId}`, JSON.stringify({ status: 'processing', progress: 0 }))
  } catch (err) {
    // Non-fatal for processing but log (BullMQ will handle retries if thrown)
  }

  // 3) Simulate provider processing with incremental progress
  try {
    for (let p = 10; p <= 90; p += 20) {
      await new Promise((r) => setTimeout(r, 500))
      await redisClient.set(`job:${jobId}`, JSON.stringify({ status: 'processing', progress: p }))
      await redisClient.publish(`job:${jobId}`, JSON.stringify({ status: 'processing', progress: p }))
    }

    // Simulated final result
    const videoUrl = `https://cdn.meta-ad-studio.local/videos/${jobId}.mp4`

    // 4) Persist final state in DB
    await prisma.videoGenerationJob.update({
      where: { id: jobId },
      data: { status: 'completed', videoUrl, completedAt: new Date() },
    })

    // 5) Publish completed state
    const completed = { status: 'completed', progress: 100, videoUrl }
    await redisClient.set(`job:${jobId}`, JSON.stringify(completed))
    await redisClient.publish(`job:${jobId}`, JSON.stringify(completed))

    return completed
  } catch (err) {
    // On failure, persist failed state and rethrow to allow BullMQ retry/DLQ handling
    try {
      await prisma.videoGenerationJob.update({
        where: { id: jobId },
        data: { status: 'failed', error: (err as Error).message },
      })
      const failed = { status: 'failed', error: (err as Error).message }
      await redisClient.set(`job:${jobId}`, JSON.stringify(failed))
      await redisClient.publish(`job:${jobId}`, JSON.stringify(failed))
    } catch (innerErr) {
      // swallow
    }
    throw err
  }
}

// Instantiate worker with connection coming from redisClient
export const videoWorker = new Worker(videoQueueName, processor, { connection: redisClient })

videoWorker.on('completed', (job) => {
  console.log(`videoWorker: job ${job.id} completed`)
})

videoWorker.on('failed', async (job, err) => {
  console.error(`videoWorker: job ${job?.id} failed:`, err?.message)
  // If job exhausted all attempts, move to DLQ queue for manual inspection
  if (job && job.attemptsMade >= (job.opts.attempts || 0)) {
    try {
      // push minimal payload to DLQ (id + data + error)
      const dlq = await import('../lib/queue')
      await dlq.videoDLQ.add('dlq', { id: job.id, data: job.data, error: err?.message || 'unknown' })
    } catch (e) {
      console.error('videoWorker: failed to enqueue to DLQ', (e as Error).message)
    }
  }
})

export default videoWorker
