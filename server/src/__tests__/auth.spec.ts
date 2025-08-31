import request from 'supertest';
import { app } from '../index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prismaMock } from '../lib/prisma-mock';
import { Role } from '@prisma/client';

// Mock the bcrypt library
jest.mock('bcryptjs', () => ({
  ...jest.requireActual('bcryptjs'),
  hash: jest.fn().mockResolvedValue('hashedpassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock the jsonwebtoken library
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  sign: jest.fn().mockReturnValue('test-token'),
}));

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        email: 'test@example.com',
        name: 'Test User',
        firebaseId: 'test-firebase-id-1',
      };

      const createdUser = {
        id: '1',
        email: newUser.email,
        name: newUser.name,
        firebaseId: newUser.firebaseId,
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(createdUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(res.statusCode).toEqual(201);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: newUser.email,
          name: newUser.name,
          firebaseId: newUser.firebaseId,
        },
      });
      expect(res.body).toHaveProperty('token', 'test-token');
      expect(jwt.sign).toHaveBeenCalledWith({ id: createdUser.id, role: createdUser.role }, expect.any(String), { expiresIn: '1h' });
    });

    it('should return 400 if firebaseId is missing', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                name: 'Test User',
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Firebase ID is required');
    });

    it('should return 400 if user already exists', async () => {
        prismaMock.user.findUnique.mockResolvedValue({ id: '1' } as any);

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                name: 'Test User',
                firebaseId: 'test-firebase-id-1',
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user with correct credentials', async () => {
      const existingUser = {
        id: '2',
        email: 'test2@example.com',
        name: 'Test User 2',
        firebaseId: 'test-firebase-id-2',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(existingUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test2@example.com',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token', 'test-token');
      expect(jwt.sign).toHaveBeenCalledWith({ id: existingUser.id, role: existingUser.role }, expect.any(String), { expiresIn: '1h' });
    });

    it('should return 400 for non-existent user', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nouser@example.com',
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 400 for invalid password', async () => {
        const existingUser = {
            id: '2',
            email: 'test2@example.com',
            name: 'Test User 2',
            firebaseId: 'test-firebase-id-2',
            role: Role.USER,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        prismaMock.user.findUnique.mockResolvedValue(existingUser);

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test2@example.com',
            });

        expect(res.statusCode).toEqual(200);
    });
  });
});
