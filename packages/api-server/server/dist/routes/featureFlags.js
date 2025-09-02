"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// TODO: Initialize Firebase Admin SDK with service account credentials
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
router.get('/:key', async (req, res) => {
    const { key } = req.params;
    // TODO: Implement logic to get feature flag from Firebase Remote Config
    res.json({ key, value: 'not implemented' });
});
router.post('/:key', async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;
    // TODO: Implement logic to set feature flag in Firebase Remote Config
    res.json({ key, value, status: 'not implemented' });
});
exports.default = router;
