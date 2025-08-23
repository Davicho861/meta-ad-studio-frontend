import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

const serviceAccount = require('../../credentials/gcloud-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
