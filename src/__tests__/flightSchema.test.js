import { describe, it, expect } from 'vitest'
import { createFlight } from '../utils/flightSchema'

describe('createFlight', () => {
  it('generates a unique id', () => {
    const a = createFlight({})
    const b = createFlight({})
    expect(a.id).toBeTruthy()
    expect(b.id).toBeTruthy()
    expect(a.id).not.toBe(b.id)
  })

  it('sets provided fields correctly', () => {
    const f = createFlight({
      flightNumber:  'RO401',
      origin:        'CLJ',
      destination:   'OTP',
      date:          '2026-05-10',
      departureTime: '07:00',
      arrivalTime:   '08:05',
      airline:       'TAROM',
      status:        'completed',
      notes:         'Window seat',
    })
    expect(f.flightNumber).toBe('RO401')
    expect(f.origin).toBe('CLJ')
    expect(f.destination).toBe('OTP')
    expect(f.date).toBe('2026-05-10')
    expect(f.departureTime).toBe('07:00')
    expect(f.arrivalTime).toBe('08:05')
    expect(f.airline).toBe('TAROM')
    expect(f.status).toBe('completed')
    expect(f.notes).toBe('Window seat')
  })

  it('defaults status to scheduled when not provided', () => {
    expect(createFlight({}).status).toBe('scheduled')
  })

  it('defaults string fields to empty string', () => {
    const f = createFlight({})
    expect(f.flightNumber).toBe('')
    expect(f.origin).toBe('')
    expect(f.destination).toBe('')
    expect(f.date).toBe('')
    expect(f.departureTime).toBe('')
    expect(f.arrivalTime).toBe('')
    expect(f.airline).toBe('')
    expect(f.notes).toBe('')
  })

  it('sets createdAt as a valid ISO date string', () => {
    const f = createFlight({})
    expect(() => new Date(f.createdAt)).not.toThrow()
    expect(new Date(f.createdAt).toISOString()).toBe(f.createdAt)
  })
})