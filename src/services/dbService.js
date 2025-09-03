import path from 'path'
import os from 'os'
import fs from 'fs'
import { Low, JSONFile } from 'lowdb'

// DB file location: ~/.meta-ad-studio/history.json
const APP_DIR = path.join(os.homedir(), '.meta-ad-studio');
const DB_FILE = path.join(APP_DIR, 'history.json');

async function ensureDb() {
  if (!fs.existsSync(APP_DIR)) {
    fs.mkdirSync(APP_DIR, { recursive: true });
  }

  const adapter = new JSONFile(DB_FILE);
  const db = new Low(adapter);
  await db.read();
  db.data = db.data || { generations: [] };
  return db;
}

async function addGeneration(jobData) {
  const db = await ensureDb();
  const record = Object.assign({ id: Date.now(), createdAt: new Date().toISOString() }, jobData);
  db.data.generations.unshift(record);
  await db.write();
  return record;
}

async function getAllGenerations() {
  const db = await ensureDb();
  return db.data.generations || [];
}

async function getGenerationById(id) {
  const gens = await getAllGenerations();
  return gens.find(g => String(g.id) === String(id));
}

export { addGeneration, getAllGenerations, getGenerationById }
