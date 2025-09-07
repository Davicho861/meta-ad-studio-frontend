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

export const runAgent = async (taskType: string, taskDetails: Record<string, unknown>, reasoning_effort: string = 'medium') => {
  try {
    let result: unknown;
    switch (taskType) {
      case 'plan':
        result = await planningAgent.prioritizeTasks();
        break;
      case 'develop':
        result = await developmentAgent(taskDetails.featureDescription as string, taskDetails.openapiContent as string, reasoning_effort);
        break;
      case 'test':
        result = await testingAgent(taskDetails.testType as 'cypress' | 'jest', reasoning_effort);
        break;
      case 'deploy':
        result = await deploymentAgent(taskDetails.action as 'deploy' | 'rollback', reasoning_effort);
        break;
      case 'iac':
        result = await iacAgent(taskDetails.action as string, taskDetails.details as Record<string, unknown>);
        break;
      case 'ops':
        result = await opsAgent(taskDetails.action as string, taskDetails.details as Record<string, unknown>);
        break;
      case 'debug':
        result = await debugAgent(taskDetails.errorLogs as string);
        break;
      case 'predict':
        result = await errorPredictionAgent(taskDetails.logs as string);
        break;
      default:
        const prompt = `Execute the following task: ${JSON.stringify(taskDetails as Record<string, unknown>)}`;
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
