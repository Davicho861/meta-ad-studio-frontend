import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Hashing the password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create a user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  console.log(`Created user with id: ${user.id}`);

  // Create a project
  const project = await prisma.project.create({
    data: {
      name: 'Meta Studio Flow',
      description: 'A project management tool',
      createdById: user.id,
    },
  });

  console.log(`Created project with id: ${project.id}`);

  // Create issues
  await prisma.issue.createMany({
    data: [
      {
        title: 'Implement user authentication',
        description: 'Users should be able to sign up and log in.',
        status: 'BACKLOG',
        priority: 'HIGH',
        projectId: project.id,
        createdById: user.id,
      },
      {
        title: 'Design the database schema',
        description: 'Define the models for projects, issues, users, etc.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        projectId: project.id,
        createdById: user.id,
      },
      {
        title: 'Set up the CI/CD pipeline',
        description: 'Automate the build, test, and deployment process.',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: project.id,
        createdById: user.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
