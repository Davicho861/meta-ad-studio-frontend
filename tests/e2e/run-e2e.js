#!/usr/bin/env node
/* Minimal E2E smoke test for job flow: POST /generate-video -> SSE /jobs/:id/stream

Usage:
  NODE_ENV=test node tests/e2e/run-e2e.js

Requires the API server running locally. Configure base URL with BASE_URL env var (default http://localhost:3000).
*/

const fetch = require('node-fetch');
const EventSource = require('eventsource');

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const TIMEOUT = Number(process.env.E2E_TIMEOUT || 60000);

async function main() {
  console.log('E2E: starting minimal job flow test against', BASE);

  const body = { sceneDescription: 'E2E test scene - smoke' };
  const res = await fetch(`${BASE}/generate-video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.status !== 202) {
    const text = await res.text();
    console.error('Unexpected response creating job:', res.status, text);
    process.exit(2);
  }

  const json = await res.json();
  const jobId = json.jobId;
  if (!jobId) {
    console.error('No jobId in response:', json);
    process.exit(3);
  }

  console.log('Job created with id', jobId);

  const url = `${BASE}/jobs/${jobId}/stream`;
  const es = new EventSource(url);

  const timer = setTimeout(() => {
    console.error('E2E: timeout waiting for job completion');
    es.close();
    process.exit(4);
  }, TIMEOUT);

  es.addEventListener('status', (ev) => {
    try {
      const payload = JSON.parse(ev.data);
      console.log('SSE status event:', payload);
      if (payload.status === 'completed') {
        console.log('Job completed, OK');
        clearTimeout(timer);
        es.close();
        process.exit(0);
      }
      if (payload.status === 'failed') {
        console.error('Job failed:', payload.error || payload);
        clearTimeout(timer);
        es.close();
        process.exit(5);
      }
    } catch (e) {
      console.warn('Failed parsing SSE payload', e);
    }
  });

  es.onerror = (err) => {
    console.error('EventSource error', err);
    clearTimeout(timer);
    es.close();
    process.exit(6);
  };
}

main().catch((err) => {
  console.error('E2E script error', err);
  process.exit(10);
});
