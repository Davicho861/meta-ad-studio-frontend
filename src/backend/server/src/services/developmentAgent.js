"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentAgent = void 0;
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3000/api/ai/generate';
const callAIAgent = async (prompt, reasoning_effort, multimodal_input, iac_input) => {
    try {
        const response = await axios_1.default.post(API_URL, { prompt, reasoning_effort, multimodal_input, iac_input });
        return response.data;
    }
    catch (error) {
        /* CODemod: console.error('Error calling AI agent:', error); */
        throw new Error('Failed to get response from AI agent.');
    }
};
const developmentAgent = async (featureDescription, openapiContent, reasoning_effort = 'high', multimodal_input) => {
    const prompt = `As a senior full-stack developer AI, your task is to generate code for the specified feature.
First, provide a chain-of-thought plan outlining the steps you will take.
Then, generate the code based on that plan, considering the existing API definitions in openapi.yaml.
Focus on generating React/TypeScript for the frontend, Node.js for the backend, and Prisma for database interactions.

Feature to implement: ${featureDescription}

Existing OpenAPI Specification:
${openapiContent}

Generate the necessary code files (e.g., React components, Node.js routes/controllers/services, Prisma schema modifications, etc.) to implement this feature. Provide the code in a structured format, indicating file paths and content. For the "drag-and-drop Kanban" feature, specifically consider using the @dnd-kit library for the frontend.`;
    try {
        return await callAIAgent(prompt, reasoning_effort, multimodal_input);
    }
    catch (error) {
        /* CODemod: console.error("Error in development agent:", error); */
        return "An error occurred while the development agent was running.";
    }
};
exports.developmentAgent = developmentAgent;
