import { describe, it, expect } from 'vitest';

describe('API Integration Tests', () => {
  it('should fetch data from the backend', async () => {
    try {
      const response = await fetch('http://localhost:3001/api/data'); // Assuming this endpoint exists
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toBeDefined();
    } catch (error) {
      console.error('API integration test failed:', error);
      throw error;
    }
  });
});
