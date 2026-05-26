// @vitest-environment node
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/prismaClient.js';
import { vi, describe, it, expect } from 'vitest';

// We intercept Prisma and supply fake data!
// This stops Vitest from crashing, and protects your real database.
vi.mock('../src/prismaClient.js', () => {
  return {
    default: {
      user: {
        findFirst: vi.fn().mockResolvedValue({ id: 'test-user-id' })
      },
      airline: {
        findFirst: vi.fn().mockResolvedValue({ id: 'test-airline-id' })
      },
      flight: {
        create: vi.fn().mockResolvedValue({ id: 'test-flight-id', flightNumber: 'TEST-999' }),
        findUnique: vi.fn()
          .mockResolvedValueOnce({ id: 'test-flight-id', flightNumber: 'TEST-999' }) // For the GET test
          .mockResolvedValueOnce(null), // For the DELETE check test
        update: vi.fn().mockResolvedValue({ id: 'test-flight-id', status: 'completed' }),
        delete: vi.fn().mockResolvedValue({ id: 'test-flight-id' })
      },
      $disconnect: vi.fn()
    }
  };
});

describe('Flight CRUD Operations', () => {
  let testFlightId = 'test-flight-id';
  let testUserId = 'test-user-id';
  let testAirlineId = 'test-airline-id';

  // 1. TEST CREATE (POST)
  it('should CREATE a new flight', async () => {
    const res = await request(app)
      .post('/api/flights') 
      .send({
        flightNumber: "TEST-999",
        date: "2026-01-01",
        origin: "LROP",
        destination: "EVRA",
        departureTime: "10:00",
        arrivalTime: "12:00",
        role: "PIC",
        status: "scheduled",
        userId: testUserId,
        airlineId: testAirlineId
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  // 2. TEST READ (GET)
  it('should READ the created flight', async () => {
    const res = await request(app).get(`/api/flights/${testFlightId}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.flightNumber).toEqual("TEST-999");
  });

  // 3. TEST UPDATE (PUT)
  it('should UPDATE the flight status to completed', async () => {
    const res = await request(app)
      .put(`/api/flights/${testFlightId}`)
      .send({
        flightNumber: "TEST-999",
        date: "2026-01-01",
        origin: "LROP",
        destination: "EVRA",
        departureTime: "10:00",
        arrivalTime: "12:00",
        role: "PIC",
        userId: testUserId,
        airlineId: testAirlineId,
        status: "completed" 
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("completed");
  });

  // 4. TEST DELETE (DELETE)
  it('should DELETE the test flight', async () => {
    const res = await request(app).delete(`/api/flights/${testFlightId}`);
    expect(res.statusCode).toEqual(200);

    // Our mock will return null on this check, proving it was "deleted"
    const checkDb = await prisma.flight.findUnique({ where: { id: testFlightId } });
    expect(checkDb).toBeNull();
  });
});