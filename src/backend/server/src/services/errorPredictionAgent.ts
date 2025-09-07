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

export const errorPredictionAgent = async (logs: string) => {
  const prompt = `Based on the following logs, predict potential failures in the upcoming deployment:\n\n${logs}`;
  return await callAIAgent(prompt);
};
