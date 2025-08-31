import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import * as admin from 'firebase-admin';

// In a GCP environment (Cloud Build, GKE), the SDK will automatically
// use the environment's service account credentials.
if (process.env.NODE_ENV !== 'test') {
  admin.initializeApp();
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as AuthenticatedRequest).user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
