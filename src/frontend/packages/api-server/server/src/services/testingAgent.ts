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
    /* CODemod: console.error('Error calling AI agent:', error); */
    throw new Error('Failed to get response from AI agent.');
  }
};

export const testingAgent = async (testType: 'cypress' | 'jest', reasoning_effort: string = 'high') => {
  let command = '';
  let testLogs = '';

  if (testType === 'cypress') {
    command = 'npx cypress run --record false'; // --record false to avoid Cypress Cloud
  } else if (testType === 'jest') {
    command = 'npx jest --json --outputFile=jest-results.json';
  } else {
    return "Invalid test type specified. Please use 'cypress' or 'jest'.";
  }

  try {
    /* CODemod: console.log(`Executing ${testType} tests...`); */
    const { stdout, stderr } = await execAsync(command, { cwd: testType === 'jest' ? 'server/' : '.' });
    testLogs = stdout + stderr;
    /* CODemod: console.log(`Test execution complete. Analyzing results with Gemini...`); */

    const prompt = `Analyze the following test logs from a ${testType} test run. Identify any failures, suggest potential causes, and propose code corrections to fix the bugs. If no failures are found, confirm that.

Test Logs:
${testLogs}`;

    return await callAIAgent(prompt, reasoning_effort);
  } catch (error: unknown) {
    /* CODemod: console.error(`Error executing ${testType} tests or analyzing results:`, error); */
    const prompt = `Analyze the following error output from a failed ${testType} test run. Identify the root cause of the failure and propose code corrections to fix the bugs.

Error Output:
${(error as { stdout?: string, message: string }).stdout || (error as Error).message}`;

    try {
      const analysis = await callAIAgent(prompt, reasoning_effort);
      return `Test execution failed. Gemini's analysis and proposed corrections:\n${analysis}`;
    } catch (geminiError) {
      /* CODemod: console.error("Error during Gemini analysis of failed tests:", geminiError); */
      return `Test execution failed and an error occurred during AI analysis: ${geminiError}`;
    }
  }
};
