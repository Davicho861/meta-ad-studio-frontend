"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mixpanel_1 = __importDefault(require("mixpanel"));
const developmentAgent_1 = require("../services/developmentAgent");
const router = (0, express_1.Router)();
const mixpanel = mixpanel_1.default.init(process.env.MIXPANEL_TOKEN);
router.post('/track', (req, res) => {
    const { event, properties } = req.body;
    mixpanel.track(event, properties);
    res.status(200).send('Event tracked');
});
router.post('/generate-tracking', async (req, res) => {
    const { platform } = req.body; // platform can be 'google-analytics' or 'mixpanel'
    const featureDescription = `Configure user tracking in React with ${platform}. Generate the necessary code to track page views and custom events.`;
    const openapiContent = ''; // No openapi content for this task
    const reasoning_effort = 'high';
    try {
        const code = await (0, developmentAgent_1.developmentAgent)(featureDescription, openapiContent, reasoning_effort);
        res.json({ code });
    }
    catch (error) {
        res.status(500).json({ error: `Failed to generate ${platform} tracking code` });
    }
});
exports.default = router;
