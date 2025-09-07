import { PrismaClient, Project, Prisma } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export async function createProject(data: { name: string; description?: string }, userId: string): Promise<Project> {
  const validated = projectSchema.parse(data);
  const projectData: Prisma.ProjectUncheckedCreateInput = {
    name: validated.name,
    description: validated.description || '',
    createdById: userId,
  };
  return prisma.project.create({
    data: projectData,
  });
}

export async function getProjects(userId: string): Promise<Project[]> {
  return prisma.project.findMany({
    where: { createdById: userId },
  });
}

export async function getProjectById(id: string): Promise<Project | null> {
  return prisma.project.findUnique({
    where: { id },
  });
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const validated = projectSchema.partial().parse(data);
  return prisma.project.update({
    where: { id },
    data: validated,
  });
}

export async function deleteProject(id: string): Promise<void> {
  await prisma.project.delete({ where: { id } });
}
