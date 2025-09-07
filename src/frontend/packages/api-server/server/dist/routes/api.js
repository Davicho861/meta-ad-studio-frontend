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
router.post('/v1/animate-image', auth_1.authMiddleware, animateController_1.default.animateImage);
router.get('/v1/animate-image/status/:jobId', auth_1.authMiddleware, animateController_1.default.getJobStatus);
exports.default = router;
