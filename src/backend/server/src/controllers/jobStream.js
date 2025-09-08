"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobStream = void 0;
const queue_1 = require("../lib/queue");
// SSE stream for job updates. Clients connect to /jobs/:id/stream
const jobStream = async (req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).end();
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    });
    res.flushHeaders?.();
    const send = (event, data) => {
        res.write(`event: ${event}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
    // Send initial status if any
    const initial = await queue_1.redisClient.get(`job:${id}`);
    if (initial)
        send('status', JSON.parse(initial));
    const IORedis = require('ioredis');
    const sub = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', { maxRetriesPerRequest: null });
    sub.subscribe(`job:${id}`, (err) => {
        if (err) {
            send('error', { message: 'failed to subscribe' });
        }
    });
    sub.on('message', (_channel, message) => {
        try {
            const payload = JSON.parse(message);
            send('status', payload);
        }
        catch (e) {
            send('status', { raw: message });
        }
    });
    // heartbeat
    const keepAlive = setInterval(() => res.write(': keep-alive\n\n'), 25000);
    req.on('close', () => {
        clearInterval(keepAlive);
        sub.disconnect();
        res.end();
    });
};
exports.jobStream = jobStream;
