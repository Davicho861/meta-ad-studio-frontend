"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertBrandProfile = exports.getBrandProfile = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getBrandProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await prisma.user.findUnique({
            where: { firebaseId: req.user.uid },
            include: { brandProfile: true },
        });
        if (!user || !user.brandProfile) {
            return res.status(404).json({ message: 'Brand profile not found' });
        }
        res.status(200).json(user.brandProfile);
    }
    catch (error) {
        console.error('Error fetching brand profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getBrandProfile = getBrandProfile;
const upsertBrandProfile = async (req, res) => {
    const { brandName, logoUrl, brandColors, slogan } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await prisma.user.findUnique({
            where: { firebaseId: req.user.uid },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const brandProfile = await prisma.brandProfile.upsert({
            where: { userId: user.id },
            update: { brandName, logoUrl, brandColors, slogan },
            create: {
                userId: user.id,
                brandName,
                logoUrl,
                brandColors,
                slogan,
            },
        });
        res.status(201).json(brandProfile);
    }
    catch (error) {
        console.error('Error creating/updating brand profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.upsertBrandProfile = upsertBrandProfile;
