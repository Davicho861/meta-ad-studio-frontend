"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIssue = createIssue;
exports.getIssues = getIssues;
exports.getBacklogIssues = getBacklogIssues;
exports.getTeamIssues = getTeamIssues;
exports.getIssueById = getIssueById;
exports.updateIssue = updateIssue;
exports.updateIssueStatus = updateIssueStatus;
exports.deleteIssue = deleteIssue;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const issueSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['To Do', 'In Progress', 'In Review', 'Done']).optional(),
    priority: zod_1.z.enum(['Low', 'Medium', 'High', 'Highest']).optional(),
    dueDate: zod_1.z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
    projectId: zod_1.z.string().min(1, 'Project ID is required'),
    assigneeId: zod_1.z.string().optional(),
    sprintId: zod_1.z.string().optional(),
});
const statusSchema = zod_1.z.object({
    status: zod_1.z.enum(['To Do', 'In Progress', 'In Review', 'Done']),
});
async function createIssue(data, userId) {
    const validated = issueSchema.parse(data);
    const issueData = {
        ...validated,
        title: validated.title || '',
        description: validated.description || '',
        status: validated.status || 'To Do',
        priority: validated.priority || 'Medium',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: userId,
        projectId: validated.projectId,
        sprintId: validated.sprintId,
    };
    const issue = await prisma.issue.create({
        data: issueData,
    });
    return issue;
}
async function getIssues({ sprintId, projectId, dueThisWeek }) {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return prisma.issue.findMany({
        where: {
            sprintId,
            projectId,
            ...(dueThisWeek && {
                dueDate: {
                    gte: startOfWeek,
                    lte: endOfWeek,
                },
            }),
        },
    });
}
async function getBacklogIssues({ projectId, dueThisWeek }) {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return prisma.issue.findMany({
        where: {
            sprintId: null,
            projectId,
            ...(dueThisWeek && {
                dueDate: {
                    gte: startOfWeek,
                    lte: endOfWeek,
                },
            }),
        },
    });
}
async function getTeamIssues(teamId) {
    const teamWithMembers = await prisma.team.findUnique({
        where: { id: teamId },
        include: { members: { select: { id: true } } },
    });
    if (!teamWithMembers) {
        return [];
    }
    const userIds = teamWithMembers.members.map((member) => member.id);
    return prisma.issue.findMany({
        where: {
            createdById: {
                in: userIds,
            },
        },
    });
}
async function getIssueById(id) {
    const issue = await prisma.issue.findUnique({
        where: { id },
    });
    return issue;
}
async function updateIssue(id, data, userId) {
    const validated = issueSchema.partial().parse(data);
    const issue = await prisma.issue.update({
        where: { id },
        data: {
            ...validated,
            updatedAt: new Date(),
        },
    });
    return issue;
}
async function updateIssueStatus(id, status) {
    const validated = statusSchema.parse({ status });
    const issue = await prisma.issue.update({
        where: { id },
        data: {
            status: validated.status,
            updatedAt: new Date(),
        },
    });
    return issue;
}
async function deleteIssue(id) {
    await prisma.issue.delete({ where: { id } });
}
