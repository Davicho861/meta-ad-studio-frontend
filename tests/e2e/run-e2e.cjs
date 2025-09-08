#!/usr/bin/env node
/* Minimal E2E smoke test for job flow: POST /generate-video -> SSE /jobs/:id/stream

Usage:
  NODE_ENV=test node tests/e2e/run-e2e.cjs

Requires the API server running locally. Configure base URL with BASE_URL env var (default http://localhost:3000).
*/

const fetch = require('node-fetch');
const EventSource = require('eventsource');

// CLI arg helper (simple): --base-url=... --auth-token=...
function getArg(name) {
  const arg = process.argv.find((a) => a.startsWith(name + '='));
  return arg ? arg.split('=')[1] : undefined;
}

const BASE = getArg('--base-url') || process.env.BASE_URL || 'http://localhost:3101';
const TIMEOUT = Number(process.env.E2E_TIMEOUT || 60000);

const fs = require('fs');
const path = require('path');
const BASE_DIR = path.resolve(__dirname);

async function main() {
  console.log('E2E: starting minimal job flow test against', BASE);
  const start = Date.now();
  const events = [];

  // Use the animate-image endpoint which returns a jobId.
  const body = { imageUrl: 'https://picsum.photos/seed/e2e/600/400', prompt: 'E2E smoke test' };
  const headers = { 'Content-Type': 'application/json' };
  // Auth token precedence: CLI --auth-token > AUTH_TOKEN env > TEST_AUTH_TOKEN env
  const authToken = getArg('--auth-token') || process.env.AUTH_TOKEN || process.env.TEST_AUTH_TOKEN;
  if (authToken) headers['authorization'] = `Bearer ${authToken}`;
  if (process.env.TEST_AUTH_USER) headers['x-test-user'] = process.env.TEST_AUTH_USER;

  const scenario = getArg('--scenario') || process.env.E2E_SCENARIO;
  const endpoint = process.env.NODE_ENV === 'test' ? '/api/test/animate-image' : '/api/v1/animate-image';
  const endpointWithQs = scenario ? `${endpoint}?scenario=${encodeURIComponent(scenario)}` : endpoint;

  const res = await fetch(`${BASE}${endpointWithQs}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (![200,202].includes(res.status)) {
    const text = await res.text();
    console.error('Unexpected response creating job:', res.status, text);
    process.exit(2);
  }

  const json = await res.json();
  const jobId = json.jobId || json.jobId;
  if (!jobId) {
    console.error('No jobId in response:', json);
    process.exit(3);
  }

  console.log('Job created with id', jobId);
  events.push({ ts: Date.now(), type: 'job-created', jobId, scenario });

  // The frontend expects the SSE at /api/jobs/:id/stream
  const url = `${BASE}/api/jobs/${jobId}/stream`;
  const es = new EventSource(url);

  const timer = setTimeout(() => {
    console.error('E2E: timeout waiting for job completion');
    events.push({ ts: Date.now(), type: 'timeout' });
    es.close();
    writeResultAndExit({ start, events, scenario, exitCode: 4 });
  }, TIMEOUT);

  es.addEventListener('status', (ev) => {
    try {
      const payload = JSON.parse(ev.data);
      events.push({ ts: Date.now(), type: 'sse', payload });
      console.log('SSE status event:', payload);
      if (payload.status === 'completed') {
        console.log('Job completed, OK');
        clearTimeout(timer);
        es.close();
        writeResultAndExit({ start, events, scenario, exitCode: 0 });
      }
      if (payload.status === 'failed') {
        console.error('Job failed:', payload.error || payload);
        clearTimeout(timer);
        es.close();
        writeResultAndExit({ start, events, scenario, exitCode: 5 });
      }
    } catch (e) {
      console.warn('Failed parsing SSE payload', e);
    }
  });

  es.onerror = (err) => {
    console.error('EventSource error', err);
    events.push({ ts: Date.now(), type: 'error', err: String(err) });
    clearTimeout(timer);
    es.close();
    writeResultAndExit({ start, events, scenario, exitCode: 6 });
  };
}

function writeResultAndExit({ start, events, scenario, exitCode }) {
  const end = Date.now();
  const out = {
    scenario: scenario || 'default',
    start,
    end,
    durationMs: end - start,
    exitCode,
    events,
  };
  try {
    const file = path.join(BASE_DIR, 'test.json');
    fs.writeFileSync(file, JSON.stringify(out, null, 2), 'utf8');
    console.log('Wrote', file);
  } catch (e) {
    console.warn('Failed writing test.json', e);
  }
  process.exit(exitCode);
}

main().catch((err) => {
  console.error('E2E script error', err);
  process.exit(10);
});
