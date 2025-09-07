import { Router } from 'express';
import axios from 'axios';
import prisma from '../prisma.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.post('/', requireAuth, async (req, res) => {
    const { prompt, settings } = req.body;
    if (!prompt)
        return res.status(400).json({ error: 'prompt required' });
    try {
        // Llamada a la API de Gemini (placeholder - adaptar según el endpoint real)
        const apiKey = process.env.GEMINI_API_KEY;
        const fullPrompt = `Actúa como un director creativo experto en publicidad para el metaverso. Basado en: "${prompt}". Genera 4 conceptos en formato JSON array [{title, description}]`;
        const geminiResp = await axios.post('https://api.example.gemini/generate', { prompt: fullPrompt, settings }, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        const concepts = geminiResp.data?.concepts || geminiResp.data || [];
        // Normalizar: esperar un array de objetos {title, description}
        const parsed = Array.isArray(concepts) ? concepts : [];
        // Guardar en BD
        const generation = await prisma.generation.create({
            data: {
                prompt,
                settings,
                userId: req.userId,
                results: {
                    create: parsed.map((p) => ({ title: String(p.title || ''), description: String(p.description || ''), imageUrl: p.imageUrl || null }))
                }
            },
            include: { results: true }
        });
        res.json({ generation });
    }
    catch (err) {
        console.error('generate error', err);
        res.status(500).json({ error: 'generation failed' });
    }
});
export default router;
