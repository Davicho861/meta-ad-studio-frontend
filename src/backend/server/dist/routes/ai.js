"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generative_ai_1 = require("@google/generative-ai");
const ioredis_1 = require("ioredis");
const gemini_1 = require("../controllers/gemini");
const router = (0, express_1.Router)();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const redis = new ioredis_1.Redis(process.env.REDIS_URL);
router.post('/generate', async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g;
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
        const confidence_score = (_e = (_d = (_c = (_b = (_a = result.response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.safetyRatings) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.probability) !== null && _e !== void 0 ? _e : 0;
        const tokens_used = (_g = (_f = result.response.usageMetadata) === null || _f === void 0 ? void 0 : _f.totalTokenCount) !== null && _g !== void 0 ? _g : 0;
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
exports.default = router;
