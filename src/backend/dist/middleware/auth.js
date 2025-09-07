import jwt from 'jsonwebtoken';
export function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer '))
        return res.status(401).json({ error: 'Unauthorized' });
    const token = auth.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev');
        req.userId = decoded.userId;
        return next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
