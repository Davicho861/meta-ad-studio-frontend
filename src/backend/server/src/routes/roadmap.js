"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Placeholder for roadmap service functions
const getRoadmap = async (projectId) => {
    /* CODemod: console.log('Fetching roadmap for project:', projectId); */
    return { projectId, epics: [] };
};
// Get roadmap for a project
router.get('/:projectId', auth_1.authMiddleware, async (req, res) => {
    try {
        const roadmap = await getRoadmap(req.params.projectId);
        res.json(roadmap);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch roadmap' });
    }
});
exports.default = router;
