import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const API_URL = 'http://localhost:3000/api/ai/generate';

const callAIAgent = async (prompt: string, reasoning_effort: string = 'high') => {
  try {
    const response = await axios.post(API_URL, { prompt, reasoning_effort });
    return response.data.response;
  } catch (error) {
    console.error('Error calling AI agent:', error);
    throw new Error('Failed to get response from AI agent.');
  }
};

class PlanningAgent {
  async prioritizeTasks(): Promise<any> {
    try {
      const backlogContent = await fs.readFile(path.join(__dirname, '../../../../BACKLOG.md'), 'utf-8');
      const transformationPlanContent = await fs.readFile(path.join(__dirname, '../../../../TRANSFORMATION_PLAN.md'), 'utf-8');

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
    } catch (error) {
      console.error('Error prioritizing tasks:', error);
      return { success: false, error: 'Failed to prioritize tasks' };
    }
  }
}

export default new PlanningAgent();
