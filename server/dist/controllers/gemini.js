"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideo = void 0;
const gemini_1 = require("../services/gemini");
const generateVideo = async (req, res) => {
    try {
        const { sceneDescription } = req.body;
        if (!sceneDescription) {
            return res.status(400).json({ message: 'sceneDescription is required' });
        }
        const videoUrl = await (0, gemini_1.generateVideoService)(sceneDescription);
        if (!videoUrl) {
            return res.status(500).json({ message: 'Failed to generate video' });
        }
        res.status(200).json({ videoUrl });
    }
    catch (error) {
        console.error('Error generating video:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error', error: 'An unknown error occurred' });
        }
    }
};
exports.generateVideo = generateVideo;
