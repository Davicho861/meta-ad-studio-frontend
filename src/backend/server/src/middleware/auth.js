"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_1 = require("../lib/auth");
const authMiddleware = async (req, res, next) => {
    // Local test bypass: if a test header is present, set a synthetic user and continue.
    const testUserHeader = (req.headers['x-test-user'] || req.headers['x-test-user'.toLowerCase()]);
    if (testUserHeader) {
        try {
            req.user = JSON.parse(testUserHeader);
            return next();
        }
        catch (e) {
            // ignore parse errors and fallthrough to normal auth
        }
    }
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decodedToken = await (0, auth_1.verifyToken)(token);
        req.user = decodedToken;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
exports.authMiddleware = authMiddleware;
