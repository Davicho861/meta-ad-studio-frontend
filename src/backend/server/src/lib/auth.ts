import * as admin from 'firebase-admin';

if (process.env.NODE_ENV !== 'test') {
  admin.initializeApp();
}

export const verifyToken = async (token: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Unauthorized');
  }
};
