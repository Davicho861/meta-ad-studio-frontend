import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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

export const deploymentAgent = async (action: 'deploy' | 'rollback', reasoning_effort: string = 'high') => {
  let command = '';
  let prompt = '';

  if (action === 'deploy') {
    command = 'gcloud run deploy --source . --allow-unauthenticated --region us-central1'; // Example Cloud Run deploy command
    prompt = `As a senior DevOps AI engineer, your task is to manage CI/CD with GitHub Actions for deployment to GCP Cloud Run. Analyze the deployment logs and confirm successful deployment or identify issues.

Deployment Action: Deploy
Deployment Logs:
[DEPLOYMENT_LOGS]

[Nivel de razonamiento: ${reasoning_effort}]`;
  } else if (action === 'rollback') {
    command = 'gcloud run services replace service-name --region us-central1 --config-file previous-config.yaml'; // Example rollback command
    prompt = `As a senior DevOps AI engineer, your task is to manage CI/CD with GitHub Actions for deployment to GCP Cloud Run. Analyze the rollback logs and confirm successful rollback or identify issues.

Deployment Action: Rollback
Rollback Logs:
[ROLLBACK_LOGS]

[Nivel de razonamiento: ${reasoning_effort}]`;
  } else {
    return "Invalid deployment action specified. Please use 'deploy' or 'rollback'.";
  }

  try {
    console.log(`Executing deployment action: ${action}...`);
    const { stdout, stderr } = await execAsync(command);
    const logs = stdout + stderr;
    console.log(`Deployment action complete. Analyzing results with Gemini...`);

    const finalPrompt = prompt
      .replace('[DEPLOYMENT_LOGS]', logs)
      .replace('[ROLLBACK_LOGS]', logs);

    return await callAIAgent(finalPrompt, reasoning_effort);
  } catch (error: unknown) {
    console.error(`Error during deployment action ${action} or analysis:`, error);
    const errorPrompt = `Analyze the following error output from a failed deployment action (${action}). Identify the root cause and suggest steps to resolve it.

Error Output:
${(error as { stdout?: string, message: string }).stdout || (error as Error).message}

[Nivel de razonamiento: ${reasoning_effort}]`;

    try {
      const analysis = await callAIAgent(errorPrompt, reasoning_effort);
      return `Deployment action failed. Gemini's analysis and proposed steps:\n${analysis}`;
    } catch (geminiError) {
      console.error("Error during Gemini analysis of failed deployment:", geminiError);
      return `Deployment action failed and an error occurred during AI analysis: ${geminiError}`;
    }
  }
};
