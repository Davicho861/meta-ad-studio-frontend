// Browser-compatible database service using localStorage
const STORAGE_KEY = 'meta-ad-studio-history';

function getStoredData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { generations: [] };
  } catch (error) {
    /* CODemod: console.warn('Failed to read from localStorage:', error); */
    return { generations: [] };
  }
}

function setStoredData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    /* CODemod: console.warn('Failed to write to localStorage:', error); */
  }
}

async function ensureDb() {
  // For browser compatibility, we simulate the db interface
  const data = getStoredData();
  return {
    data,
    read: async () => { /* data is already loaded */ },
    write: async () => setStoredData(data)
  };
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
