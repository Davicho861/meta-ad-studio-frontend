"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAgent = void 0;
const axios_1 = __importDefault(require("axios"));
const planningAgent_1 = __importDefault(require("./planningAgent"));
const developmentAgent_1 = require("./developmentAgent");
const testingAgent_1 = require("./testingAgent");
const deploymentAgent_1 = require("./deploymentAgent");
const IaCAgent_1 = require("./IaCAgent");
const OpsAgent_1 = require("./OpsAgent");
const debugAgent_1 = require("./debugAgent");
const errorPredictionAgent_1 = require("./errorPredictionAgent");
const API_URL = 'http://localhost:3000/api/ai/generate';
const callAIAgent = async (prompt, reasoning_effort) => {
    try {
        const response = await axios_1.default.post(API_URL, { prompt, reasoning_effort });
        return response.data.response;
    }
    catch (error) {
        /* CODemod: console.error('Error calling AI agent:', error); */
        throw new Error('Failed to get response from AI agent.');
    }
};
const runAgent = async (taskType, taskDetails, reasoning_effort = 'medium') => {
    try {
        let result;
        switch (taskType) {
            case 'plan':
                result = await planningAgent_1.default.prioritizeTasks();
                break;
            case 'develop':
                result = await (0, developmentAgent_1.developmentAgent)(taskDetails.featureDescription, taskDetails.openapiContent, reasoning_effort);
                break;
            case 'test':
                result = await (0, testingAgent_1.testingAgent)(taskDetails.testType, reasoning_effort);
                break;
            case 'deploy':
                result = await (0, deploymentAgent_1.deploymentAgent)(taskDetails.action, reasoning_effort);
                break;
            case 'iac':
                result = await (0, IaCAgent_1.iacAgent)(taskDetails.action, taskDetails.details);
                break;
            case 'ops':
                result = await (0, OpsAgent_1.opsAgent)(taskDetails.action, taskDetails.details);
                break;
            case 'debug':
                result = await (0, debugAgent_1.debugAgent)(taskDetails.errorLogs);
                break;
            case 'predict':
                result = await (0, errorPredictionAgent_1.errorPredictionAgent)(taskDetails.logs);
                break;
            default:
                const prompt = `Execute the following task: ${JSON.stringify(taskDetails)}`;
                result = await callAIAgent(prompt, reasoning_effort);
                break;
        }
        /* CODemod: console.log(`Agent output for ${taskType} task:`, result); */
        return result;
    }
    catch (error) {
        /* CODemod: console.error(`Error running agent for task type ${taskType}:`, error); */
        return `An error occurred while running the agent for task type ${taskType}.`;
    }
};
exports.runAgent = runAgent;
