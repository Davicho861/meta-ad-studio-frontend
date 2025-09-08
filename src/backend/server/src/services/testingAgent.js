"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingAgent = void 0;
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
const testingAgent = async (testType, reasoning_effort = 'high') => {
    let command = '';
    let testLogs = '';
    if (testType === 'cypress') {
        command = 'npx cypress run --record false'; // --record false to avoid Cypress Cloud
    }
    else if (testType === 'jest') {
        command = 'npx jest --json --outputFile=jest-results.json';
    }
    else {
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
    }
    catch (error) {
        /* CODemod: console.error(`Error executing ${testType} tests or analyzing results:`, error); */
        const prompt = `Analyze the following error output from a failed ${testType} test run. Identify the root cause of the failure and propose code corrections to fix the bugs.

Error Output:
${error.stdout || error.message}`;
        try {
            const analysis = await callAIAgent(prompt, reasoning_effort);
            return `Test execution failed. Gemini's analysis and proposed corrections:\n${analysis}`;
        }
        catch (geminiError) {
            /* CODemod: console.error("Error during Gemini analysis of failed tests:", geminiError); */
            return `Test execution failed and an error occurred during AI analysis: ${geminiError}`;
        }
    }
};
exports.testingAgent = testingAgent;
