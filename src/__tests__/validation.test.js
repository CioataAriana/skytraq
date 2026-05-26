import { describe, it, expect } from 'vitest';
import { validateFlight } from '../utils/validation';

describe('validateFlight Utility', () => {
  it('returns errors for empty required fields', () => {
    const errors = validateFlight({});
    expect(errors.date).toBe('Date is required');
    expect(errors.airlineId).toBe('Airline is required');
  });

  it('validates flight number format', () => {
    const errors = validateFlight({ flightNumber: 'invalid-num' });
    expect(errors.flightNumber).toContain('Must be 2–8 uppercase letters');
  });

  it('prevents origin and destination from being identical', () => {
    const errors = validateFlight({ origin: 'OTP', destination: 'OTP' });
    expect(errors.destination).toBe('Origin and destination must differ');
  });

  it('validates time sequence', () => {
    const errors = validateFlight({ departureTime: '10:00', arrivalTime: '08:00' });
    expect(errors.arrivalTime).toBe('Arrival must be after departure');
  });
});