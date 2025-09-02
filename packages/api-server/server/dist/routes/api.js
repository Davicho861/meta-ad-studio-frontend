"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/data', (req, res) => {
    res.json({ message: 'Success', data: [1, 2, 3] });
});
router.post('/v1/generate-video', (req, res) => {
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
exports.default = router;
