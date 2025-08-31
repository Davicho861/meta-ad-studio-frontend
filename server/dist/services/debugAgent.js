"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugAgent = void 0;
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3000/api/ai/generate';
const callAIAgent = async (prompt) => {
    try {
        const response = await axios_1.default.post(API_URL, { prompt });
        return response.data.response;
    }
    catch (error) {
        console.error('Error calling AI agent:', error);
        throw new Error('Failed to get response from AI agent.');
    }
};
const debugAgent = async (errorLogs) => {
    const prompt = `Analyze the following error logs and generate a fix in JSON format with the following structure: { "code": "string", "apply": "boolean" }:\n\n${errorLogs}`;
    return await callAIAgent(prompt);
};
exports.debugAgent = debugAgent;
