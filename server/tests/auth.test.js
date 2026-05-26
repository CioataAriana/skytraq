// @vitest-environment node
import request from 'supertest';
import app from '../src/app.js';
import { vi, describe, it, expect } from 'vitest';

// Provide a fake JWT secret so jsonwebtoken doesn't crash!
process.env.JWT_SECRET = 'super-secret-test-key-123';

// Mock BOTH the 'compare' and 'hash' functions for bcrypt!
vi.mock('bcrypt', () => ({
  default: { 
    compare: vi.fn().mockResolvedValue(true),
    hash: vi.fn().mockResolvedValue('fake-hashed-password')
  },
  compare: vi.fn().mockResolvedValue(true),
  hash: vi.fn().mockResolvedValue('fake-hashed-password')
}));
vi.mock('bcryptjs', () => ({
  default: { 
    compare: vi.fn().mockResolvedValue(true),
    hash: vi.fn().mockResolvedValue('fake-hashed-password')
  },
  compare: vi.fn().mockResolvedValue(true),
  hash: vi.fn().mockResolvedValue('fake-hashed-password')
}));

// Intercept Prisma to fake a database of users
vi.mock('../src/prismaClient.js', () => {
  return {
    default: {
      user: {
        create: vi.fn().mockResolvedValue({ id: 'u1', email: 'test@test.com', fullName: 'Maverick' }),
        findUnique: vi.fn().mockResolvedValue({ 
          id: 'u1', 
          email: 'test@test.com', 
          password: 'hashedpassword123', 
          fullName: 'Maverick' 
        })
      }
    }
  };
});

describe('Backend Authentication Tests', () => {
  
  it('should successfully REGISTER a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        email: 'test@test.com',
        password: 'password123',
        fullName: 'Maverick',
        pilotLicense: 'RO1234'
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(300);
    expect(res.body).toBeDefined();
  });

  it('should successfully LOGIN an existing user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'test@test.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token'); 
  });
});