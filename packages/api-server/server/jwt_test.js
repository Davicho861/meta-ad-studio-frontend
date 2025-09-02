const express = require('express');
const http = require('http');
const assert = require('assert');

const app = express();
const port = 3000;

// Mock JWT middleware
const mockJwtMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token === 'valid_token') {
      req.user = { id: '123', name: 'Test User' };
      next();
    } else {
      res.status(401).send('Invalid token');
    }
  } else {
    res.status(401).send('Authorization header missing');
  }
};

app.get('/protected', mockJwtMiddleware, (req, res) => {
  res.json({ message: 'Welcome to the protected route!', user: req.user });
});

const server = app.listen(port, () => {
  console.log(`Test server listening at http://localhost:${port}`);
  runTests();
});

const runTests = async () => {
  // Test case 1: No token
  try {
    const response = await makeRequest('/protected');
    assert.strictEqual(response.statusCode, 401, 'Test Case 1 Failed: Status code should be 401');
    assert.strictEqual(response.body, 'Authorization header missing', 'Test Case 1 Failed: Response body should indicate missing header');
    console.log('Test Case 1 Passed: No token');
  } catch (error) {
    console.error('Test Case 1 Failed:', error.message);
  }

  // Test case 2: Invalid token
  try {
    const options = { path: '/protected', headers: { 'Authorization': 'Bearer invalid_token' } };
    const response = await makeRequest(options);
    assert.strictEqual(response.statusCode, 401, 'Test Case 2 Failed: Status code should be 401');
    assert.strictEqual(response.body, 'Invalid token', 'Test Case 2 Failed: Response body should indicate invalid token');
    console.log('Test Case 2 Passed: Invalid token');
  } catch (error) {
    console.error('Test Case 2 Failed:', error.message);
  }

  // Test case 3: Valid token
  try {
    const options = { path: '/protected', headers: { 'Authorization': 'Bearer valid_token' } };
    const response = await makeRequest(options);
    const data = JSON.parse(response.body);
    assert.strictEqual(response.statusCode, 200, 'Test Case 3 Failed: Status code should be 200');
    assert.deepStrictEqual(data.user, { id: '123', name: 'Test User' }, 'Test Case 3 Failed: User data should be present');
    console.log('Test Case 3 Passed: Valid token');
  } catch (error) {
    console.error('Test Case 3 Failed:', error.message);
  }

  server.close();
}

const makeRequest = (options) => {
  return new Promise((resolve, reject) => {
    const reqOptions = typeof options === 'string' ? { path: options } : options;
    reqOptions.hostname = 'localhost';
    reqOptions.port = port;

    http.get(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    }).on('error', (err) => reject(err));
  });
};