"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const gcp_1 = require("../services/gcp");
const router = express_1.default.Router();
router.get('/cloudbuild/history', auth_1.authMiddleware, async (req, res) => {
    try {
        const client = await (0, gcp_1.getCloudBuildClient)();
        const [builds] = await client.listBuilds({ projectId: process.env.GCP_PROJECT_ID });
        res.json(builds);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Failed to fetch Cloud Build history: ${error.message}` });
        }
        else {
            res.status(500).json({ error: 'Failed to fetch Cloud Build history: An unknown error occurred' });
        }
    }
});
router.get('/project-management', auth_1.authMiddleware, async (req, res) => {
    // Fetch from Firestore (assumed)
    res.json({ issues: [], sprints: [], milestones: [] }); // Placeholder
});
exports.default = router;
