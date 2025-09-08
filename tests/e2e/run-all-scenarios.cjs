#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');

const scenarios = ['progress', 'fail', 'slow'];
const path = require('path');
const BASE_DIR = path.resolve(__dirname);
const results = [];

for (const s of scenarios) {
  console.log(`Running scenario: ${s}`);
  // remove previous test.json
  try { fs.unlinkSync('test.json'); } catch (e) {}
  const env = Object.assign({}, process.env, { NODE_ENV: 'test' });
  const r = spawnSync('node', ['run-e2e.cjs', `--base-url=http://localhost:3101`, `--scenario=${s}`], { stdio: 'inherit', env, cwd: BASE_DIR });
  // read test.json
  let data = null;
  try { data = JSON.parse(fs.readFileSync('test.json', 'utf8')); } catch (e) { data = { error: 'no test.json', exitCode: r.status }; }
  results.push({ scenario: s, exitCode: r.status, data });
}

const out = { runAt: Date.now(), results };
fs.writeFileSync(path.join(BASE_DIR, 'scenarios-report.json'), JSON.stringify(out, null, 2));
console.log('Wrote', path.join(BASE_DIR, 'scenarios-report.json'));

let anyFail = results.some((r) => r.exitCode !== 0 && r.exitCode !== null);
process.exit(anyFail ? 1 : 0);
