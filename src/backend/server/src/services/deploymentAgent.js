"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploymentAgent = void 0;
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
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
const deploymentAgent = async (action, reasoning_effort = 'high') => {
    let command = '';
    let prompt = '';
    if (action === 'deploy') {
        command = 'gcloud run deploy --source . --allow-unauthenticated --region us-central1'; // Example Cloud Run deploy command
        prompt = `As a senior DevOps AI engineer, your task is to manage CI/CD with GitHub Actions for deployment to GCP Cloud Run. Analyze the deployment logs and confirm successful deployment or identify issues.

Deployment Action: Deploy
Deployment Logs:
[DEPLOYMENT_LOGS]

[Nivel de razonamiento: ${reasoning_effort}]`;
    }
    else if (action === 'rollback') {
        command = 'gcloud run services replace service-name --region us-central1 --config-file previous-config.yaml'; // Example rollback command
        prompt = `As a senior DevOps AI engineer, your task is to manage CI/CD with GitHub Actions for deployment to GCP Cloud Run. Analyze the rollback logs and confirm successful rollback or identify issues.

Deployment Action: Rollback
Rollback Logs:
[ROLLBACK_LOGS]

[Nivel de razonamiento: ${reasoning_effort}]`;
    }
    else {
        return "Invalid deployment action specified. Please use 'deploy' or 'rollback'.";
    }
    try {
        /* CODemod: console.log(`Executing deployment action: ${action}...`); */
        const { stdout, stderr } = await execAsync(command);
        const logs = stdout + stderr;
        /* CODemod: console.log(`Deployment action complete. Analyzing results with Gemini...`); */
        const finalPrompt = prompt
            .replace('[DEPLOYMENT_LOGS]', logs)
            .replace('[ROLLBACK_LOGS]', logs);
        return await callAIAgent(finalPrompt, reasoning_effort);
    }
    catch (error) {
        /* CODemod: console.error(`Error during deployment action ${action} or analysis:`, error); */
        const errorPrompt = `Analyze the following error output from a failed deployment action (${action}). Identify the root cause and suggest steps to resolve it.

Error Output:
${error.stdout || error.message}

[Nivel de razonamiento: ${reasoning_effort}]`;
        try {
            const analysis = await callAIAgent(errorPrompt, reasoning_effort);
            return `Deployment action failed. Gemini's analysis and proposed steps:\n${analysis}`;
        }
        catch (geminiError) {
            /* CODemod: console.error("Error during Gemini analysis of failed deployment:", geminiError); */
            return `Deployment action failed and an error occurred during AI analysis: ${geminiError}`;
        }
    }
};
exports.deploymentAgent = deploymentAgent;
