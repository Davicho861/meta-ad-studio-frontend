"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_1 = __importDefault(require("stripe"));
const developmentAgent_1 = require("../services/developmentAgent");
const router = (0, express_1.Router)();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
});
router.post('/generate-dashboard', async (req, res) => {
    const featureDescription = 'Create a React component for a Stripe payment dashboard. It should display payment history, subscription status, and allow users to update their payment methods.';
    const openapiContent = ''; // No openapi content for this task
    const reasoning_effort = 'high';
    try {
        const code = await (0, developmentAgent_1.developmentAgent)(featureDescription, openapiContent, reasoning_effort);
        res.json({ code });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate Stripe dashboard code' });
    }
});
router.post('/generate-webhooks', async (req, res) => {
    const featureDescription = 'Create a Node.js endpoint to handle Stripe webhooks. It should handle events like `invoice.payment_succeeded`, `customer.subscription.deleted`, and `checkout.session.completed`.';
    const openapiContent = ''; // No openapi content for this task
    const reasoning_effort = 'high';
    try {
        const code = await (0, developmentAgent_1.developmentAgent)(featureDescription, openapiContent, reasoning_effort);
        res.json({ code });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate Stripe webhooks code' });
    }
});
exports.default = router;
