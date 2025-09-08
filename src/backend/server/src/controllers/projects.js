"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                createdById: userId,
            },
        });
        res.status(201).json(newProject);
    }
    catch (error) {
        /* CODemod: console.error(error); */
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
exports.createProject = createProject;
