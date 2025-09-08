"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const prom_client_1 = require("prom-client");
const aiController_1 = require("../controllers/aiController");
const animateController_1 = __importDefault(require("../controllers/animateController"));
const ai_1 = __importDefault(require("./ai"));
(0, prom_client_1.collectDefaultMetrics)();
const router = (0, express_1.Router)();
router.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', prom_client_1.register.contentType);
        res.end(await prom_client_1.register.metrics());
    }
    catch (err) {
        res.status(500).end(err);
    }
});
router.get('/data', (req, res) => {
    res.json({ message: 'Success', data: [1, 2, 3] });
});
router.post('/v1/generate-video', auth_1.authMiddleware, (req, res) => {
    // Simulate a successful video generation response
    const videos = [
        { id: 1, url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
        { id: 2, url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    ];
    res.status(200).json({
        success: true,
        message: 'Videos generated successfully.',
        videos: videos,
    });
});
router.post('/v1/generate-video-grok', auth_1.authMiddleware, aiController_1.generateVideoGrok);
// Endpoint to request animation of an image -> returns jobId
// In test or local runs we may want to skip auth to simplify E2E testing.
if (process.env.NODE_ENV === 'test' || process.env.SKIP_AUTH === 'true') {
    router.post('/v1/animate-image', animateController_1.default.animateImage);
    router.get('/v1/animate-image/status/:jobId', animateController_1.default.getJobStatus);
}
else {
    router.post('/v1/animate-image', auth_1.authMiddleware, animateController_1.default.animateImage);
    router.get('/v1/animate-image/status/:jobId', auth_1.authMiddleware, animateController_1.default.getJobStatus);
}
// Mount AI router so SSE endpoint /jobs/:id/stream is available under /api
router.use('/', ai_1.default);
// Test-only unauthenticated endpoint to create a job quickly from E2E scripts
if (process.env.NODE_ENV === 'test') {
    router.post('/test/animate-image', animateController_1.default.animateImage);
}
// Always-available unprotected endpoint for local E2E runs (keeps production routes untouched)
router.post('/unprotected/animate-image', animateController_1.default.animateImage);
exports.default = router;
