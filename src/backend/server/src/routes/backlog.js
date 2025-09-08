"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Placeholder for backlog service functions
const getBacklog = async (projectId) => {
    /* CODemod: console.log('Fetching backlog for project:', projectId); */
    return { projectId, issues: [] };
};
// Get backlog for a project
router.get('/:projectId', auth_1.authMiddleware, async (req, res) => {
    try {
        const backlog = await getBacklog(req.params.projectId);
        res.json(backlog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch backlog' });
    }
});
exports.default = router;
