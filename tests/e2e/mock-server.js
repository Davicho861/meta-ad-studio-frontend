const http = require('http');
const { v4: uuidv4 } = require('uuid');

const jobs = new Map();

const server = http.createServer((req, res) => {
  console.log('mock request:', req.method, req.url);
  if (req.method === 'POST' && req.url && req.url.startsWith('/api/test/animate-image')) {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const jobId = uuidv4();
      // parse scenario from query string
      const urlParts = req.url.split('?');
      const qs = new URLSearchParams(urlParts[1] || '');
      const scenario = qs.get('scenario') || 'progress';

      jobs.set(jobId, { status: 'queued', scenario });
      res.writeHead(202, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jobId, status: 'queued' }));

      // Simulate job progress via internal timers and publish to any connected SSE clients
      if (scenario === 'progress') {
        setTimeout(() => {
          jobs.set(jobId, { status: 'processing', step: 1 });
          publish(jobId, { status: 'processing', step: 1 });
        }, 300);
        setTimeout(() => {
          jobs.set(jobId, { status: 'processing', step: 2 });
          publish(jobId, { status: 'processing', step: 2 });
        }, 900);
        setTimeout(() => {
          jobs.set(jobId, { status: 'completed', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', thumbnailUrl: 'https://picsum.photos/seed/animated/600/1067' });
          publish(jobId, { status: 'completed', jobId, videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', thumbnailUrl: 'https://picsum.photos/seed/animated/600/1067' });
        }, 1800);
      } else if (scenario === 'fail') {
        setTimeout(() => {
          jobs.set(jobId, { status: 'processing', step: 1 });
          publish(jobId, { status: 'processing', step: 1 });
        }, 300);
        setTimeout(() => {
          jobs.set(jobId, { status: 'failed', error: 'Simulated error' });
          publish(jobId, { status: 'failed', error: 'Simulated error' });
        }, 900);
      } else if (scenario === 'slow') {
        setTimeout(() => {
          jobs.set(jobId, { status: 'processing', step: 1 });
          publish(jobId, { status: 'processing', step: 1 });
        }, 1000);
        setTimeout(() => {
          jobs.set(jobId, { status: 'processing', step: 2 });
          publish(jobId, { status: 'processing', step: 2 });
        }, 5000);
        setTimeout(() => {
          jobs.set(jobId, { status: 'completed', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' });
          publish(jobId, { status: 'completed', jobId, videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' });
        }, 12000);
      }
    });
    return;
  }

  // SSE endpoint
  if (req.method === 'GET' && req.url && req.url.startsWith('/api/jobs/') && req.url.includes('/stream')) {
    // path may include query string
    const [path] = req.url.split('?');
    const parts = path.split('/');
    const jobId = parts[3];
    if (!jobId) {
      res.writeHead(400);
      res.end();
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('\n');

    const send = (event, data) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

  // Send initial status (include scenario if set)
  const initial = jobs.get(jobId);
  if (initial) send('status', initial);

    // register subscription
    addSubscriber(jobId, res);

    req.on('close', () => {
      removeSubscriber(jobId, res);
    });

    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const PORT = process.env.PORT || 3001;

const subscribers = new Map();

function addSubscriber(jobId, res) {
  if (!subscribers.has(jobId)) subscribers.set(jobId, []);
  subscribers.get(jobId).push(res);
}

function removeSubscriber(jobId, res) {
  const arr = subscribers.get(jobId) || [];
  subscribers.set(jobId, arr.filter((r) => r !== res));
}

function publish(jobId, payload) {
  const arr = subscribers.get(jobId) || [];
  arr.forEach((res) => {
    try {
      res.write(`event: status\n`);
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    } catch (e) {
      // ignore
    }
  });
}

server.listen(PORT, () => {
  console.log(`Mock E2E server listening on ${PORT}`);
});
