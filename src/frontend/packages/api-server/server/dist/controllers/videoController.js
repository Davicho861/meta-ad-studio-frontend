"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideos = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getVideos = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const videos = await prisma.video.findMany({
            where: { userId: req.user.uid },
        });
        res.status(200).json(videos);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getVideos = getVideos;
