"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const developmentAgent_1 = require("../services/developmentAgent");
const router = (0, express_1.Router)();
router.post('/suggest-campaigns', async (req, res) => {
    const { productInfo } = req.body;
    const featureDescription = `Based on the following product information, suggest three email marketing campaigns to be sent with SendGrid. For each campaign, provide a subject line, a target audience, and the email body.

Product Information:
${productInfo}`;
    const openapiContent = ''; // No openapi content for this task
    const reasoning_effort = 'high';
    try {
        const suggestions = await (0, developmentAgent_1.developmentAgent)(featureDescription, openapiContent, reasoning_effort);
        res.json({ suggestions });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate marketing campaign suggestions' });
    }
});
router.post('/suggest-pricing-tiers', async (req, res) => {
    const { productInfo } = req.body;
    const featureDescription = `Based on the following product information, suggest three pricing tiers (e.g., freemium, pro, enterprise). For each tier, provide a name, a price, and a list of features.

Product Information:
${productInfo}`;
    const openapiContent = ''; // No openapi content for this task
    const reasoning_effort = 'high';
    try {
        const suggestions = await (0, developmentAgent_1.developmentAgent)(featureDescription, openapiContent, reasoning_effort);
        res.json({ suggestions });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate pricing tier suggestions' });
    }
});
exports.default = router;
