"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoEvolutionAgent = void 0;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const autoEvolutionAgent = async (performanceMetrics, previousPrompt, reasoning_effort = 'high') => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    const prompt = `As a senior AI engineer, your task is to analyze the provided performance metrics and suggest adjustments to the previous prompt to improve future AI model performance. This simulates a Reinforcement Learning from Human Feedback (RLHF) loop.

Performance Metrics:
${JSON.stringify(performanceMetrics, null, 2)}

Previous Prompt:
${previousPrompt}

Based on these metrics, suggest a refined prompt that aims to improve the AI's output. Focus on clarity, specificity, and guiding the model towards better results based on the observed performance.

[Nivel de razonamiento: ${reasoning_effort}]`;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
    catch (error) {
        console.error("Error in auto-evolution agent:", error);
        return "An error occurred while the auto-evolution agent was running.";
    }
};
exports.autoEvolutionAgent = autoEvolutionAgent;
