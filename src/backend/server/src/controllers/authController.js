"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const register = async (req, res) => {
    try {
        const { email, password, name, firebaseId } = req.body;
        if (!firebaseId) {
            return res.status(400).json({ message: 'Firebase ID is required' });
        }
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Check if user already exists
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create the user
        const newUser = await prisma_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                firebaseId,
            },
        });
        // Generate a JWT
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.status(201).json({ token });
    }
    catch (error) {
        /* CODemod: console.error(error); */
        res.status(500).json({ message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate a JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        /* CODemod: console.error(error); */
        res.status(500).json({ message: error.message });
    }
};
exports.login = login;
