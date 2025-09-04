"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobStatus = exports.animateImage = void 0;
const uuid_1 = require("uuid");
const animateImage = async (req, res) => {
    try {
        const { imageUrl, prompt, id } = req.body;
        if (!imageUrl)
            return res.status(400).json({ error: 'imageUrl is required' });
        // Simulate creating a background job and return a jobId
        const jobId = (0, uuid_1.v4)();
        // In a real implementation, enqueue a job (e.g., Redis queue, Cloud Task) that calls the third-party video API
        // For now return jobId so frontend can poll /api/v1/animate-image/status/:jobId
        return res.status(202).json({ jobId, status: 'queued' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'server_error' });
    }
};
exports.animateImage = animateImage;
const getJobStatus = async (req, res) => {
    const { jobId } = req.params;
    // Simulate progress
    return res.status(200).json({ jobId, status: 'processing', progress: 42 });
};
exports.getJobStatus = getJobStatus;
exports.default = {
    animateImage: exports.animateImage,
    getJobStatus: exports.getJobStatus,
};
