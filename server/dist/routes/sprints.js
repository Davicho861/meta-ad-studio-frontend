"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sprints_1 = require("../services/sprints");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Get all sprints (public)
router.get('/', async (req, res) => {
    try {
        const filters = { projectId: req.query.projectId };
        const sprints = await (0, sprints_1.getSprints)(filters);
        res.json(sprints);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch sprints' });
    }
});
// Get single sprint (public)
router.get('/:id', async (req, res) => {
    try {
        const sprint = await (0, sprints_1.getSprintById)(req.params.id);
        if (!sprint) {
            return res.status(404).json({ error: 'Sprint not found' });
        }
        res.json(sprint);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch sprint' });
    }
});
// Create sprint (authenticated)
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const sprint = await (0, sprints_1.createSprint)(req.body, req.user.id);
        res.status(201).json(sprint);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.format() });
        }
        res.status(500).json({ error: 'Failed to create sprint' });
    }
});
// Update sprint (authenticated)
router.put('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const sprint = await (0, sprints_1.updateSprint)(req.params.id, req.body);
        res.json(sprint);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.format() });
        }
        res.status(500).json({ error: 'Failed to update sprint' });
    }
});
// Delete sprint (authenticated)
router.delete('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        await (0, sprints_1.deleteSprint)(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete sprint' });
    }
});
// Assign issues to sprint (authenticated)
router.post('/:id/issues', auth_1.authMiddleware, async (req, res) => {
    try {
        const sprint = await (0, sprints_1.assignIssuesToSprint)(req.params.id, req.body.issueIds);
        res.json(sprint);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.format() });
        }
        res.status(500).json({ error: 'Failed to assign issues to sprint' });
    }
});
// Remove issues from sprint (authenticated)
router.delete('/:id/issues', auth_1.authMiddleware, async (req, res) => {
    try {
        const sprint = await (0, sprints_1.removeIssuesFromSprint)(req.params.id, req.body.issueIds);
        res.json(sprint);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.format() });
        }
        res.status(500).json({ error: 'Failed to remove issues from sprint' });
    }
});
exports.default = router;
