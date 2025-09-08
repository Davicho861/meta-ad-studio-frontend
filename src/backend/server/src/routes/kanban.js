"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const issues_1 = require("../services/issues");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
// Placeholder for kanban service functions
const getKanbanBoard = async (projectId) => {
    /* CODemod: console.log('Fetching kanban board for project:', projectId); */
    return { projectId, columns: [] };
};
// Get kanban board for a project
router.get('/:projectId', auth_1.authMiddleware, async (req, res) => {
    try {
        const board = await getKanbanBoard(req.params.projectId);
        res.json(board);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch kanban board' });
    }
});
// Update issue status
router.put('/issues/:issueId', auth_1.authMiddleware, [(0, express_validator_1.body)('status').notEmpty()], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { issueId } = req.params;
        const { status } = req.body;
        await (0, issues_1.updateIssueStatus)(issueId, status);
        res.json({ message: 'Issue status updated successfully' });
    }
    catch (error) {
        /* CODemod: console.error(error); */
        res.status(500).json({ error: 'Failed to update issue status' });
    }
});
exports.default = router;
