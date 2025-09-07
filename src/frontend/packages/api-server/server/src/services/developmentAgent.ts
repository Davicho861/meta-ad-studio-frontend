import axios from 'axios';

const API_URL = 'http://localhost:3000/api/ai/generate';

const callAIAgent = async (prompt: string, reasoning_effort: string, multimodal_input?: any, iac_input?: any) => {
  try {
    const response = await axios.post(API_URL, { prompt, reasoning_effort, multimodal_input, iac_input });
    return response.data;
  } catch (error) {
    /* CODemod: console.error('Error calling AI agent:', error); */
    throw new Error('Failed to get response from AI agent.');
  }
};

export const developmentAgent = async (featureDescription: string, openapiContent: string, reasoning_effort: string = 'high', multimodal_input?: any) => {
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
  } catch (error) {
    /* CODemod: console.error("Error in development agent:", error); */
    return "An error occurred while the development agent was running.";
  }
};
