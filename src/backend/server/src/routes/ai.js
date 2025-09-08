"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generative_ai_1 = require("@google/generative-ai");
const ioredis_1 = require("ioredis");
const gemini_1 = require("../controllers/gemini");
const jobStream_1 = require("../controllers/jobStream");
const router = (0, express_1.Router)();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const redis = new ioredis_1.Redis(process.env.REDIS_URL);
router.post('/generate', async (req, res) => {
    const { prompt, reasoning_effort, multimodal_input, iac_input } = req.body;
    const cacheKey = `gemini:${prompt}:${reasoning_effort}:${iac_input ? 'iac' : ''}`;
    const cached = await redis.get(cacheKey);
    if (cached)
        return res.json(JSON.parse(cached));
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
        let content = [`[Nivel razonamiento: ${reasoning_effort}] ${prompt}`];
        if (multimodal_input) {
            multimodal_input.forEach((url) => {
                content.push({ inlineData: { mimeType: 'image/jpeg', data: url } });
            });
        }
        if (iac_input) {
            content.push(`; Analiza IaC: ${iac_input.map((diagram) => diagram).join(',')}`);
        }
        const result = await model.generateContent(content);
        const responseText = result.response.text();
        const iacPlanMatch = responseText.match(/\{.*\}/s);
        const iac_plan = iacPlanMatch ? JSON.parse(iacPlanMatch[0]) : {};
        const confidence_score = result.response.candidates?.[0]?.safetyRatings?.[0]?.probability ?? 0;
        const tokens_used = result.response.usageMetadata?.totalTokenCount ?? 0;
        const response = {
            response: responseText,
            confidence_score,
            tokens_used,
            iac_plan,
        };
        await redis.set(cacheKey, JSON.stringify(response), 'EX', 3600);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'API failure', retry: true });
    }
});
router.post('/generate-video', gemini_1.generateVideo);
router.get('/jobs/:id/stream', jobStream_1.jobStream);
exports.default = router;
