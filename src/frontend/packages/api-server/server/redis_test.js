
// This script simulates a simple Redis caching mechanism.

const assert = require('assert');

// Mock database
const mockDatabase = {
  users: [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Doe' },
  ],
  getUserById: async (id) => {
    /* CODemod: console.log('Fetching user from database...'); */
    return mockDatabase.users.find(user => user.id === id);
  }
};

// Mock Redis cache
const mockRedisCache = {
  cache: {},
  get: async (key) => {
    /* CODemod: console.log('Checking cache for key:', key); */
    return mockRedisCache.cache[key];
  },
  set: async (key, value, ttl) => {
    /* CODemod: console.log('Setting cache for key:', key); */
    mockRedisCache.cache[key] = value;
  }
};

// Function to get user with caching
const getUserWithCache = async (id) => {
  const cacheKey = `user:${id}`;
  let user = await mockRedisCache.get(cacheKey);

  if (user) {
    /* CODemod: console.log('User found in cache.'); */
    return user;
  }

  /* CODemod: console.log('User not in cache, fetching from database...'); */
  user = await mockDatabase.getUserById(id);
  await mockRedisCache.set(cacheKey, user, 3600); // Cache for 1 hour

  return user;
};

const runTests = async () => {
  // Test case 1: Get user for the first time (should fetch from DB)
  let user1 = await getUserWithCache('1');
  assert.deepStrictEqual(user1, { id: '1', name: 'John Doe' });
  /* CODemod: console.log('Test Case 1 Passed: Fetched user from DB'); */

  // Test case 2: Get the same user again (should fetch from cache)
  let user2 = await getUserWithCache('1');
  assert.deepStrictEqual(user2, { id: '1', name: 'John Doe' });
  /* CODemod: console.log('Test Case 2 Passed: Fetched user from cache'); */

  // Test case 3: Get another user (should fetch from DB)
  let user3 = await getUserWithCache('2');
  assert.deepStrictEqual(user3, { id: '2', name: 'Jane Doe' });
  /* CODemod: console.log('Test Case 3 Passed: Fetched another user from DB'); */
};

runTests();
