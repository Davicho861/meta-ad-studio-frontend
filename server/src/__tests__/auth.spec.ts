import request from 'supertest';
import { TextEncoder, TextDecoder } from 'util';
import 'whatwg-encoding';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Clear the database before running tests
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    // First, register a user
    const hashedPassword = await bcrypt.hash('password', 10);
    await prisma.user.create({
      data: {
        email: 'test2@example.com',
        password: hashedPassword,
        name: 'Test User 2',
      },
    });

    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'test2@example.com',
        password: 'password',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'test2@example.com',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});
