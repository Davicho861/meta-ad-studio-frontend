"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoWorker = void 0;
const bullmq_1 = require("bullmq");
const queue_1 = require("../lib/queue");
const prisma_1 = require("../lib/prisma");
// Worker processor consolidated: Prisma state updates + Redis pub/sub + simulated provider call
const processor = async (job) => {
    const jobId = String(job.id);
    const payload = job.data;
    // 1) Mark as processing in DB (upsert style)
    try {
        await prisma_1.prisma.videoGenerationJob.upsert({
            where: { id: jobId },
            update: { status: 'processing' },
            create: {
                id: jobId,
                status: 'processing',
                prompt: payload.prompt || '',
                imageUrl: payload.imageUrl || null,
                provider: payload.provider || null,
            },
        });
    }
    catch (err) {
        // If DB fails, rethrow to trigger retry/backoff
        throw new Error(`prisma_upsert_failed: ${err.message}`);
    }
    // 2) Publish processing state to Redis pub/sub
    try {
        await queue_1.redisClient.set(`job:${jobId}`, JSON.stringify({ status: 'processing', progress: 0 }));
        await queue_1.redisClient.publish(`job:${jobId}`, JSON.stringify({ status: 'processing', progress: 0 }));
    }
    catch (err) {
        // Non-fatal for processing but log (BullMQ will handle retries if thrown)
    }
    // 3) Simulate provider processing with incremental progress
    try {
        for (let p = 10; p <= 90; p += 20) {
            await new Promise((r) => setTimeout(r, 500));
            await queue_1.redisClient.set(`job:${jobId}`, JSON.stringify({ status: 'processing', progress: p }));
            await queue_1.redisClient.publish(`job:${jobId}`, JSON.stringify({ status: 'processing', progress: p }));
        }
        // Simulated final result
        const videoUrl = `https://cdn.meta-ad-studio.local/videos/${jobId}.mp4`;
        // 4) Persist final state in DB
        await prisma_1.prisma.videoGenerationJob.update({
            where: { id: jobId },
            data: { status: 'completed', videoUrl, completedAt: new Date() },
        });
        // 5) Publish completed state
        const completed = { status: 'completed', progress: 100, videoUrl };
        await queue_1.redisClient.set(`job:${jobId}`, JSON.stringify(completed));
        await queue_1.redisClient.publish(`job:${jobId}`, JSON.stringify(completed));
        return completed;
    }
    catch (err) {
        // On failure, persist failed state and rethrow to allow BullMQ retry/DLQ handling
        try {
            await prisma_1.prisma.videoGenerationJob.update({
                where: { id: jobId },
                data: { status: 'failed', error: err.message },
            });
            const failed = { status: 'failed', error: err.message };
            await queue_1.redisClient.set(`job:${jobId}`, JSON.stringify(failed));
            await queue_1.redisClient.publish(`job:${jobId}`, JSON.stringify(failed));
        }
        catch (innerErr) {
            // swallow
        }
        throw err;
    }
};
// Instantiate worker with connection coming from redisClient
exports.videoWorker = new bullmq_1.Worker(queue_1.videoQueueName, processor, { connection: queue_1.redisClient });
exports.videoWorker.on('completed', (job) => {
    console.log(`videoWorker: job ${job.id} completed`);
});
exports.videoWorker.on('failed', async (job, err) => {
    console.error(`videoWorker: job ${job?.id} failed:`, err?.message);
    // If job exhausted all attempts, move to DLQ queue for manual inspection
    if (job && job.attemptsMade >= (job.opts.attempts || 0)) {
        try {
            // push minimal payload to DLQ (id + data + error)
            const dlq = await Promise.resolve().then(() => __importStar(require('../lib/queue')));
            await dlq.videoDLQ.add('dlq', { id: job.id, data: job.data, error: err?.message || 'unknown' });
        }
        catch (e) {
            console.error('videoWorker: failed to enqueue to DLQ', e.message);
        }
    }
});
exports.default = exports.videoWorker;
