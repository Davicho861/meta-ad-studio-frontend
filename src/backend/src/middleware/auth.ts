import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = auth.split(' ')[1]
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'dev')
    req.userId = decoded.userId
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
