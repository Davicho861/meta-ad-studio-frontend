"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const gemini_1 = require("../services/gemini");
const prisma_1 = require("../lib/prisma");
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new ioredis_1.default(redisUrl, { maxRetriesPerRequest: null });
const processor = async (job) => {
    const { sceneDescription, userId } = job.data;
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
        const videoUrl = await (0, gemini_1.generateVideoService)(sceneDescription);
        const completed = { status: 'completed', progress: 100, videoUrl };
        // Persist a Video record in DB
        await prisma_1.prisma.video.create({ data: {
                imageUrl: '',
                status: 'completed',
                videoUrl: videoUrl || undefined,
                userId: userId || undefined,
            } });
        await connection.set(`job:${job.id}`, JSON.stringify(completed));
        await connection.publish(`job:${job.id}`, JSON.stringify(completed));
        return completed;
    }
    catch (err) {
        const failed = { status: 'failed', error: err?.message ?? 'unknown' };
        await connection.set(`job:${job.id}`, JSON.stringify(failed));
        await connection.publish(`job:${job.id}`, JSON.stringify(failed));
        throw err;
    }
};
const worker = new bullmq_1.Worker('video-generation', processor, { connection });
worker.on('failed', (job, err) => {
    console.error('Job failed', job?.id, err?.message);
});
worker.on('completed', (job) => {
    console.log('Job completed', job.id);
});
