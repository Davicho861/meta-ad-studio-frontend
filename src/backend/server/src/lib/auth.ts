import * as admin from 'firebase-admin';

if (process.env.NODE_ENV !== 'test') {
  admin.initializeApp();
}

export const verifyToken = async (token: string) => {
  // Test shortcut: if the token matches TEST_AUTH_TOKEN, return a synthetic decoded token
  // to simplify local E2E tests and avoid requiring firebase admin in CI/dev.
  if (process.env.TEST_AUTH_TOKEN && token === process.env.TEST_AUTH_TOKEN) {
    return { uid: 'test-user', email: 'test@example.com' } as any;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Unauthorized');
  }
};
