import axios from 'axios';

const API_URL = 'http://localhost:3000/api/ai/generate';

const callAIAgent = async (prompt: string) => {
  try {
    const response = await axios.post(API_URL, { prompt });
    return response.data.response;
  } catch (error) {
    console.error('Error calling AI agent:', error);
    throw new Error('Failed to get response from AI agent.');
  }
};

export const debugAgent = async (errorLogs: string) => {
  const prompt = `Analyze the following error logs and generate a fix in JSON format with the following structure: { "code": "string", "apply": "boolean" }:\n\n${errorLogs}`;
  return await callAIAgent(prompt);
};
