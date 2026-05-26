import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/prismaClient.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe.skip('Database Integration Tests (Real DB)', () => {
  let testFlightId;
  let testUserId;
  let testAirlineId;

  // --- SETUP ---
  beforeAll(async () => {
    const user = await prisma.user.findFirst();
    const airline = await prisma.airline.findFirst();
    
    if (!user || !airline) {
      throw new Error("⚠️ Please ensure at least one User and Airline exist in the database.");
    }
    
    testUserId = user.id;
    testAirlineId = airline.id;
  });

  // --- CLEANUP ---
  afterAll(async () => {
    // Delete the test flight so we don't pollute your production database!
    if (testFlightId) {
      await prisma.flight.deleteMany({ where: { id: testFlightId } });
    }
    await prisma.$disconnect();
  });

  it('should successfully write to and read from the PostgreSQL database', async () => {
    // 1. Fire a real request to the API
    const res = await request(app)
      .post('/api/flights')
      .send({
        flightNumber: "DB-TEST-777",
        date: "2026-12-31",
        origin: "LROP",
        destination: "EGLL",
        departureTime: "08:00",
        arrivalTime: "10:00",
        role: "PIC",
        status: "scheduled",
        userId: testUserId,
        airlineId: testAirlineId
      });

    expect(res.statusCode).toEqual(201);
    testFlightId = res.body.id;

    // 2. VERIFY: Ask Prisma to check the actual PostgreSQL database
    const dbCheck = await prisma.flight.findUnique({
      where: { id: testFlightId }
    });

    // 3. Assert the data actually made it to the hard drive!
    expect(dbCheck).not.toBeNull();
    expect(dbCheck.flightNumber).toBe("DB-TEST-777");
  });
});