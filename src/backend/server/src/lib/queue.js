"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoDLQ = exports.videoQueue = exports.videoDLQName = exports.videoQueueName = exports.redisClient = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
// BullMQ requires maxRetriesPerRequest to be null for blocking commands
exports.redisClient = new ioredis_1.default(redisUrl, { maxRetriesPerRequest: null });
exports.videoQueueName = 'video-generation-queue';
exports.videoDLQName = 'video-generation-dlq';
// Default job options: retries with exponential backoff
exports.videoQueue = new bullmq_1.Queue(exports.videoQueueName, {
    connection: exports.redisClient,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: false,
    },
});
exports.videoDLQ = new bullmq_1.Queue(exports.videoDLQName, {
    connection: exports.redisClient,
});
exports.default = {
    redisClient: exports.redisClient,
    videoQueue: exports.videoQueue,
    videoDLQ: exports.videoDLQ,
};
