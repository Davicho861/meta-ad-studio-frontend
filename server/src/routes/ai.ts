import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Redis } from 'ioredis';
import { generateVideo } from '../controllers/gemini';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const redis = new Redis(process.env.REDIS_URL!);

router.post('/generate', async (req, res) => {
  const { prompt, reasoning_effort, multimodal_input, iac_input } = req.body;
  const cacheKey = `gemini:${prompt}:${reasoning_effort}:${iac_input ? 'iac' : ''}`;
  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    let content: (string | { inlineData: { mimeType: string; data: string; } })[] = [`[Nivel razonamiento: ${reasoning_effort}] ${prompt}`];
    if (multimodal_input) {
      multimodal_input.forEach((url: string) => {
        content.push({ inlineData: { mimeType: 'image/jpeg', data: url } });
      });
    }
    if (iac_input) {
      content.push(`; Analiza IaC: ${iac_input.map((diagram: string) => diagram).join(',')}`);
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
  } catch (error) {
    res.status(500).json({ error: 'API failure', retry: true });
  }
});

router.post('/generate-video', generateVideo);

export default router;
