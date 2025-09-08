"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorPredictionAgent = void 0;
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3000/api/ai/generate';
const callAIAgent = async (prompt) => {
    try {
        const response = await axios_1.default.post(API_URL, { prompt });
        return response.data.response;
    }
    catch (error) {
        /* CODemod: console.error('Error calling AI agent:', error); */
        throw new Error('Failed to get response from AI agent.');
    }
};
const errorPredictionAgent = async (logs) => {
    const prompt = `Based on the following logs, predict potential failures in the upcoming deployment:\n\n${logs}`;
    return await callAIAgent(prompt);
};
exports.errorPredictionAgent = errorPredictionAgent;
