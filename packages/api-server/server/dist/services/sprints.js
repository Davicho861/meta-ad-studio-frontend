"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSprint = createSprint;
exports.getSprints = getSprints;
exports.getSprintById = getSprintById;
exports.updateSprint = updateSprint;
exports.deleteSprint = deleteSprint;
exports.assignIssuesToSprint = assignIssuesToSprint;
exports.removeIssuesFromSprint = removeIssuesFromSprint;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const sprintSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    startDate: zod_1.z.string().min(1, 'Start date is required').transform((val) => new Date(val)),
    endDate: zod_1.z.string().min(1, 'End date is required').transform((val) => new Date(val)),
    projectId: zod_1.z.string().min(1, 'Project ID is required'),
});
const issueAssignmentSchema = zod_1.z.object({
    issueIds: zod_1.z.array(zod_1.z.string()).min(1, 'At least one issue ID is required'),
});
async function createSprint(data, userId) {
    const validated = sprintSchema.parse(data);
    const sprintData = {
        name: validated.name,
        startDate: validated.startDate,
        endDate: validated.endDate,
        projectId: validated.projectId,
        createdById: userId,
    };
    const sprint = await prisma.sprint.create({
        data: sprintData,
    });
    return sprint;
}
async function getSprints(filters) {
    const sprints = await prisma.sprint.findMany({
        where: { projectId: filters.projectId },
        include: { createdBy: true, project: true, issues: true },
    });
    return sprints;
}
async function getSprintById(id) {
    const sprint = await prisma.sprint.findUnique({
        where: { id },
        include: { createdBy: true, project: true, issues: true },
    });
    return sprint;
}
async function updateSprint(id, data) {
    const validated = sprintSchema.partial().omit({ projectId: true }).parse(data);
    const sprint = await prisma.sprint.update({
        where: { id },
        data: {
            ...validated,
            updatedAt: new Date(),
        },
    });
    return sprint;
}
async function deleteSprint(id) {
    await prisma.sprint.delete({ where: { id } });
}
async function assignIssuesToSprint(sprintId, issueIds) {
    const validated = issueAssignmentSchema.parse({ issueIds });
    const sprint = await prisma.sprint.update({
        where: { id: sprintId },
        data: {
            issues: { connect: validated.issueIds.map((id) => ({ id })) },
        },
        include: { issues: true },
    });
    return sprint;
}
async function removeIssuesFromSprint(sprintId, issueIds) {
    const validated = issueAssignmentSchema.parse({ issueIds });
    const sprint = await prisma.sprint.update({
        where: { id: sprintId },
        data: {
            issues: { disconnect: validated.issueIds.map((id) => ({ id })) },
        },
        include: { issues: true },
    });
    return sprint;
}
