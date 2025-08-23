import { PrismaClient } from '@prisma/client';
import { createIssue, getIssues, getBacklogIssues, getIssueById, updateIssue, updateIssueStatus, deleteIssue } from '../services/issues';
import { Issue } from '../models/issue';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    issue: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    team: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('Issue Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an issue', async () => {
    const issueData: Partial<Issue> = {
      title: 'Test Issue',
      projectId: '1',
      status: 'To Do',
      priority: 'Medium',
    };
    const userId = '1';
    const createdIssue = { ...issueData, id: '1', createdById: userId, createdAt: new Date(), updatedAt: new Date() };

    (prisma.issue.create as jest.Mock).mockResolvedValue(createdIssue);

    const result = await createIssue(issueData, userId);
    expect(result).toEqual(createdIssue);
    expect(prisma.issue.create).toHaveBeenCalledWith({
      data: {
        ...issueData,
        description: '',
        status: 'To Do',
        priority: 'Medium',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        createdById: userId,
        sprintId: undefined,
      },
    });
  });

  it('should get issues', async () => {
    const issues = [{ id: '1', title: 'Test Issue' }];
    (prisma.issue.findMany as jest.Mock).mockResolvedValue(issues);

    const result = await getIssues({ projectId: '1' });
    expect(result).toEqual(issues);
    expect(prisma.issue.findMany).toHaveBeenCalledWith({
      where: {
        projectId: '1',
      },
    });
  });

  it('should get backlog issues', async () => {
    const issues = [{ id: '1', title: 'Test Issue' }];
    (prisma.issue.findMany as jest.Mock).mockResolvedValue(issues);

    const result = await getBacklogIssues({ projectId: '1' });
    expect(result).toEqual(issues);
    expect(prisma.issue.findMany).toHaveBeenCalledWith({
      where: {
        sprintId: null,
        projectId: '1',
      },
    });
  });

  // it('should get team issues', async () => {
  //   const team = { id: '1', members: [{ id: '1' }, { id: '2' }] };
  //   const issues = [{ id: '1', title: 'Test Issue' }];
  //   (prisma.team.findUnique as jest.Mock).mockResolvedValue(team);
  //   (prisma.issue.findMany as jest.Mock).mockResolvedValue(issues);

  //   const result = await getTeamIssues('1');
  //   expect(result).toEqual(issues);
  //   expect(prisma.team.findUnique).toHaveBeenCalledWith({
  //     where: { id: '1' },
  //     include: { members: { select: { id: true } } },
  //   });
  //   expect(prisma.issue.findMany).toHaveBeenCalledWith({
  //     where: {
  //       assigneeId: {
  //         in: ['1', '2'],
  //       },
  //     },
  //   });
  // });

  it('should get an issue by id', async () => {
    const issue = { id: '1', title: 'Test Issue' };
    (prisma.issue.findUnique as jest.Mock).mockResolvedValue(issue);

    const result = await getIssueById('1');
    expect(result).toEqual(issue);
    expect(prisma.issue.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should update an issue', async () => {
    const issueData: Partial<Issue> = { title: 'Updated Issue' };
    const updatedIssue = { id: '1', ...issueData };
    (prisma.issue.update as jest.Mock).mockResolvedValue(updatedIssue);

    const result = await updateIssue('1', issueData, '1');
    expect(result).toEqual(updatedIssue);
    expect(prisma.issue.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: {
        ...issueData,
        updatedAt: expect.any(Date),
      },
    });
  });

  it('should update an issue status', async () => {
    const updatedIssue = { id: '1', status: 'In Progress' };
    (prisma.issue.update as jest.Mock).mockResolvedValue(updatedIssue);

    const result = await updateIssueStatus('1', 'In Progress');
    expect(result).toEqual(updatedIssue);
    expect(prisma.issue.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: {
        status: 'In Progress',
        updatedAt: expect.any(Date),
      },
    });
  });

  it('should delete an issue', async () => {
    (prisma.issue.delete as jest.Mock).mockResolvedValue({});

    await deleteIssue('1');
    expect(prisma.issue.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });
});
