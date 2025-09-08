#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const BASE = path.resolve(__dirname);
const ajv = new Ajv({ allErrors: true });

const testSchema = {
  type: 'object',
  properties: {
    scenario: { type: 'string' },
    start: { type: 'number' },
    end: { type: 'number' },
    durationMs: { type: 'number' },
    exitCode: { type: 'number' },
    events: { type: 'array' }
  },
  required: ['scenario', 'start', 'end', 'durationMs', 'exitCode', 'events']
};

const scenariosSchema = {
  type: 'object',
  properties: {
    runAt: { type: 'number' },
    results: {
      type: 'array',
      items: { type: 'object' }
    }
  },
  required: ['runAt', 'results']
};

function loadJson(p) {
  try {
    return JSON.parse(fs.readFileSync(path.join(BASE, p), 'utf8'));
  } catch (e) {
    console.error('Failed loading', p, e.message);
    process.exit(2);
  }
}

const testFile = loadJson('test.json');
const scenariosFile = loadJson('scenarios-report.json');

const validTest = ajv.validate(testSchema, testFile);
if (!validTest) {
  console.error('test.json validation errors:', ajv.errors);
  process.exit(3);
}

const validScenarios = ajv.validate(scenariosSchema, scenariosFile);
if (!validScenarios) {
  console.error('scenarios-report.json validation errors:', ajv.errors);
  process.exit(4);
}

console.log('Validation OK');
process.exit(0);
