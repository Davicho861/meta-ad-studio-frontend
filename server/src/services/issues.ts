import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import { Issue } from '../models/issue';

const prisma = new PrismaClient();

const issueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['To Do', 'In Progress', 'In Review', 'Done']).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Highest']).optional(),
  dueDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  projectId: z.string().min(1, 'Project ID is required'),
  assigneeId: z.string().optional(),
  sprintId: z.string().optional(),
});

const statusSchema = z.object({
  status: z.enum(['To Do', 'In Progress', 'In Review', 'Done']),
});

export async function createIssue(data: Partial<Issue>, userId: string): Promise<Issue> {
  const validated = issueSchema.parse(data);

  const issueData: Prisma.IssueUncheckedCreateInput = {
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
  return issue as unknown as Issue;
}

export async function getIssues({ sprintId, projectId, dueThisWeek }: { sprintId?: string; projectId?: string; dueThisWeek?: boolean }): Promise<Issue[]> {
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
  }) as unknown as Issue[];
}

export async function getBacklogIssues({ projectId, dueThisWeek }: { projectId?: string; dueThisWeek?: boolean }): Promise<Issue[]> {
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
  }) as unknown as Issue[];
}

export async function getTeamIssues(teamId: string): Promise<Issue[]> {
  const teamWithMembers = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: { select: { id: true } } },
  });

  if (!teamWithMembers) {
    return [];
  }

  const userIds = teamWithMembers.members.map((member: { id: string }) => member.id);

  return prisma.issue.findMany({
    where: {
      createdById: {
        in: userIds,
      },
    },
  }) as unknown as Issue[];
}

export async function getIssueById(id: string): Promise<Issue | null> {
  const issue = await prisma.issue.findUnique({
    where: { id },
  });
  return issue as unknown as Issue | null;
}

export async function updateIssue(id: string, data: Partial<Issue>, userId: string): Promise<Issue> {
  const validated = issueSchema.partial().parse(data);
  const issue = await prisma.issue.update({
    where: { id },
    data: {
      ...validated,
      updatedAt: new Date(),
    },
  });
  return issue as unknown as Issue;
}

export async function updateIssueStatus(id: string, status: string): Promise<Issue> {
  const validated = statusSchema.parse({ status });
  const issue = await prisma.issue.update({
    where: { id },
    data: {
      status: validated.status,
      updatedAt: new Date(),
    },
  });
  return issue as unknown as Issue;
}

export async function deleteIssue(id: string): Promise<void> {
  await prisma.issue.delete({ where: { id } });
}
