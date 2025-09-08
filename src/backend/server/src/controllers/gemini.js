"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideo = void 0;
const queue_1 = require("../lib/queue");
const generateVideo = async (req, res) => {
    try {
        const { sceneDescription, userId } = req.body;
        if (!sceneDescription) {
            return res.status(400).json({ message: 'sceneDescription is required' });
        }
        // Enqueue the job and persist job id for client to subscribe
        const job = await queue_1.videoQueue.add('generate', { sceneDescription, userId }, { removeOnComplete: true, removeOnFail: false });
        return res.status(202).json({ jobId: job.id });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error', error: 'An unknown error occurred' });
        }
    }
};
exports.generateVideo = generateVideo;
