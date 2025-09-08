import { Queue } from 'bullmq'
import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
// BullMQ requires maxRetriesPerRequest to be null for blocking commands
export const redisClient = new Redis(redisUrl, { maxRetriesPerRequest: null })

export const videoQueueName = 'video-generation-queue'
export const videoDLQName = 'video-generation-dlq'

// Default job options: retries with exponential backoff
export const videoQueue = new Queue(videoQueueName, {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
})

export const videoDLQ = new Queue(videoDLQName, {
  connection: redisClient,
})

export default {
  redisClient,
  videoQueue,
  videoDLQ,
}
