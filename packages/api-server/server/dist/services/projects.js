"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
exports.getProjects = getProjects;
exports.getProjectById = getProjectById;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const projectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    description: zod_1.z.string().optional(),
});
async function createProject(data, userId) {
    const validated = projectSchema.parse(data);
    const projectData = {
        name: validated.name,
        description: validated.description || '',
        createdById: userId,
    };
    return prisma.project.create({
        data: projectData,
    });
}
async function getProjects(userId) {
    return prisma.project.findMany({
        where: { createdById: userId },
    });
}
async function getProjectById(id) {
    return prisma.project.findUnique({
        where: { id },
    });
}
async function updateProject(id, data) {
    const validated = projectSchema.partial().parse(data);
    return prisma.project.update({
        where: { id },
        data: validated,
    });
}
async function deleteProject(id) {
    await prisma.project.delete({ where: { id } });
}
