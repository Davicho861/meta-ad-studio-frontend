"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobStatus = exports.animateImage = void 0;
const uuid_1 = require("uuid");
// Simple in-memory job store
const jobs = new Map();
const animateImage = async (req, res) => {
    try {
        console.log('animateImage controller invoked; headers=', req.headers && Object.keys(req.headers).join(','));
        const { imageUrl, prompt, id } = req.body;
        if (!imageUrl)
            return res.status(400).json({ error: 'imageUrl is required' });
        // Simulate creating a background job and return a jobId
        const jobId = (0, uuid_1.v4)();
        jobs.set(jobId, { status: 'queued', createdAt: Date.now() });
        return res.status(202).json({ jobId, status: 'queued' });
    }
    catch (err) {
        /* CODemod: console.error(err)
         */ return res.status(500).json({ error: 'server_error' });
    }
};
exports.animateImage = animateImage;
const getJobStatus = async (req, res) => {
    const { jobId } = req.params;
    const entry = jobs.get(jobId);
    if (!entry)
        return res.status(404).json({ error: 'job_not_found' });
    const elapsed = Date.now() - entry.createdAt;
    if (elapsed < 5000) {
        // still processing
        // update status to processing if queued
        if (entry.status !== 'processing')
            jobs.set(jobId, { ...entry, status: 'processing' });
        return res.status(200).json({ jobId, status: 'processing' });
    }
    // Completed
    jobs.set(jobId, { ...entry, status: 'completed' });
    return res.status(200).json({
        jobId,
        status: 'completed',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnailUrl: 'https://picsum.photos/seed/animated/600/1067',
    });
};
exports.getJobStatus = getJobStatus;
exports.default = {
    animateImage: exports.animateImage,
    getJobStatus: exports.getJobStatus,
};
