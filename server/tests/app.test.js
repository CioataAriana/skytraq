import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Server Application Tests', () => {
  it('should return a 404 for an unknown route', async () => {
    const res = await request(app).get('/api/this-route-does-not-exist');
    
    expect(res.statusCode).toEqual(404);
  });
});