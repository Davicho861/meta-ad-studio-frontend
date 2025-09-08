import { Request, Response } from 'express';
import { redisClient } from '../lib/queue';

// SSE stream for job updates. Clients connect to /jobs/:id/stream
export const jobStream = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) return res.status(400).end();

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders?.();

  const send = (event: string, data: any) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send initial status if any
  const initial = await redisClient.get(`job:${id}`);
  if (initial) send('status', JSON.parse(initial));

  const IORedis = require('ioredis');
  const sub = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', { maxRetriesPerRequest: null });
  sub.subscribe(`job:${id}`, (err: any) => {
    if (err) {
      send('error', { message: 'failed to subscribe' });
    }
  });

  sub.on('message', (_channel: string, message: string) => {
    try {
      const payload = JSON.parse(message);
      send('status', payload);
    } catch (e) {
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
