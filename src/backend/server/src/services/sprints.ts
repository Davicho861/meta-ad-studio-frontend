import { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { Sprint } from '../models/sprint';

const prisma = new PrismaClient();

const sprintSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  startDate: z.string().min(1, 'Start date is required').transform((val) => new Date(val)),
  endDate: z.string().min(1, 'End date is required').transform((val) => new Date(val)),
  projectId: z.string().min(1, 'Project ID is required'),
});

const issueAssignmentSchema = z.object({
  issueIds: z.array(z.string()).min(1, 'At least one issue ID is required'),
});

export async function createSprint(data: Partial<Sprint>, userId: string): Promise<Sprint> {
  const validated = sprintSchema.parse(data);
  const sprintData: Prisma.SprintUncheckedCreateInput = {
    name: validated.name,
    startDate: validated.startDate,
    endDate: validated.endDate,
    projectId: validated.projectId,
    createdById: userId,
  };
  const sprint = await prisma.sprint.create({
    data: sprintData,
  });
  return sprint as unknown as Sprint;
}

export async function getSprints(filters: { projectId?: string }): Promise<Sprint[]> {
  const sprints = await prisma.sprint.findMany({
    where: { projectId: filters.projectId },
    include: { createdBy: true, project: true, issues: true },
  });
  return sprints as unknown as Sprint[];
}

export async function getSprintById(id: string): Promise<Sprint | null> {
  const sprint = await prisma.sprint.findUnique({
    where: { id },
    include: { createdBy: true, project: true, issues: true },
  });
  return sprint as unknown as Sprint | null;
}

export async function updateSprint(id: string, data: Partial<Sprint>): Promise<Sprint> {
  const validated = sprintSchema.partial().omit({ projectId: true }).parse(data);
  const sprint = await prisma.sprint.update({
    where: { id },
    data: {
      ...validated,
      updatedAt: new Date(),
    },
  });
  return sprint as unknown as Sprint;
}

export async function deleteSprint(id: string): Promise<void> {
  await prisma.sprint.delete({ where: { id } });
}

export async function assignIssuesToSprint(sprintId: string, issueIds: string[]): Promise<Sprint> {
  const validated = issueAssignmentSchema.parse({ issueIds });
  const sprint = await prisma.sprint.update({
    where: { id: sprintId },
    data: {
      issues: { connect: validated.issueIds.map((id) => ({ id })) },
    },
    include: { issues: true },
  });
  return sprint as unknown as Sprint;
}

export async function removeIssuesFromSprint(sprintId: string, issueIds: string[]): Promise<Sprint> {
  const validated = issueAssignmentSchema.parse({ issueIds });
  const sprint = await prisma.sprint.update({
    where: { id: sprintId },
    data: {
      issues: { disconnect: validated.issueIds.map((id) => ({ id })) },
    },
    include: { issues: true },
  });
  return sprint as unknown as Sprint;
}
