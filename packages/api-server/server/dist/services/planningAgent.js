"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const API_URL = 'http://localhost:3000/api/ai/generate';
const callAIAgent = async (prompt, reasoning_effort = 'high') => {
    try {
        const response = await axios_1.default.post(API_URL, { prompt, reasoning_effort });
        return response.data.response;
    }
    catch (error) {
        console.error('Error calling AI agent:', error);
        throw new Error('Failed to get response from AI agent.');
    }
};
class PlanningAgent {
    async prioritizeTasks() {
        try {
            const backlogContent = await promises_1.default.readFile(path_1.default.join(__dirname, '../../../../BACKLOG.md'), 'utf-8');
            const transformationPlanContent = await promises_1.default.readFile(path_1.default.join(__dirname, '../../../../TRANSFORMATION_PLAN.md'), 'utf-8');
            const prompt = `
        Based on the following backlog and transformation plan, prioritize the tasks based on ROI and monetization potential.

        BACKLOG.md:
        ${backlogContent}

        TRANSFORMATION_PLAN.md:
        ${transformationPlanContent}

        Please provide a prioritized list of tasks.
      `;
            const text = await callAIAgent(prompt, 'high');
            return { success: true, data: text };
        }
        catch (error) {
            console.error('Error prioritizing tasks:', error);
            return { success: false, error: 'Failed to prioritize tasks' };
        }
    }
}
exports.default = new PlanningAgent();
