import axios from 'axios';
import planningAgent from './planningAgent';
import { developmentAgent } from './developmentAgent';
import { testingAgent } from './testingAgent';
import { deploymentAgent } from './deploymentAgent';
import { iacAgent } from './IaCAgent';
import { opsAgent } from './OpsAgent';
import { debugAgent } from './debugAgent';
import { errorPredictionAgent } from './errorPredictionAgent';

const API_URL = 'http://localhost:3000/api/ai/generate';

const callAIAgent = async (prompt: string, reasoning_effort: string) => {
  try {
    const response = await axios.post(API_URL, { prompt, reasoning_effort });
    return response.data.response;
  } catch (error) {
    console.error('Error calling AI agent:', error);
    throw new Error('Failed to get response from AI agent.');
  }
};

export const runAgent = async (taskType: string, taskDetails: any, reasoning_effort: string = 'medium') => {
  try {
    let result: any;
    switch (taskType) {
      case 'plan':
        result = await planningAgent.prioritizeTasks();
        break;
      case 'develop':
        result = await developmentAgent(taskDetails.featureDescription, taskDetails.openapiContent, reasoning_effort);
        break;
      case 'test':
        result = await testingAgent(taskDetails.testType, reasoning_effort);
        break;
      case 'deploy':
        result = await deploymentAgent(taskDetails.action, reasoning_effort);
        break;
      case 'iac':
        result = await iacAgent(taskDetails.action, taskDetails.details);
        break;
      case 'ops':
        result = await opsAgent(taskDetails.action, taskDetails.details);
        break;
      case 'debug':
        result = await debugAgent(taskDetails.errorLogs);
        break;
      case 'predict':
        result = await errorPredictionAgent(taskDetails.logs);
        break;
      default:
        const prompt = `Execute the following task: ${JSON.stringify(taskDetails)}`;
        result = await callAIAgent(prompt, reasoning_effort);
        break;
    }
    console.log(`Agent output for ${taskType} task:`, result);
    return result;
  } catch (error) {
    console.error(`Error running agent for task type ${taskType}:`, error);
    return `An error occurred while running the agent for task type ${taskType}.`;
  }
};
