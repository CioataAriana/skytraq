import { describe, it, expect } from 'vitest';
import { calcDuration, formatTimeInput, isValidTime } from '../utils/formatters';

describe('Formatter Utilities', () => {
  it('calculates standard duration correctly', () => {
    expect(calcDuration('08:00', '10:30')).toBe('02:30');
  });

  it('calculates overnight flight duration correctly', () => {
    expect(calcDuration('22:00', '02:00')).toBe('04:00');
  });

  it('formats time input strings', () => {
    expect(formatTimeInput('1234')).toBe('12:34');
  });

  it('validates time strings correctly', () => {
    expect(isValidTime('12:30')).toBe(true);
    expect(isValidTime('25:00')).toBe(false); 
    expect(isValidTime('12:60')).toBe(false); 
    expect(isValidTime('abc')).toBe(false);   
  });
});