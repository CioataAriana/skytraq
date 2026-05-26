import { renderHook, act } from '@testing-library/react';
import { useFlights } from '../hooks/useFlights';
import { vi } from 'vitest';

// Mock the Auth Context
vi.mock('../store/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-123' } })
}));

// Mock global fetch before tests run
global.fetch = vi.fn();

describe('useFlights Hook', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('fetchFlights calls the correct API endpoint', async () => {
    // Setup the fake fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [{ id: '1', origin: 'LROP' }], totalPages: 1 })
    });

    const { result } = renderHook(() => useFlights());

    let data;
    await act(async () => {
      data = await result.current.fetchFlights(1, 8);
    });

    // ✨ FIXED: Dynamic URL checking instead of hardcoding localhost
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/flights?page=1&limit=8'),
      expect.anything() 
    );
    expect(data.data[0].origin).toBe('LROP');
  });

  it('addFlight sends a POST request', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Success" })
    });

    const { result } = renderHook(() => useFlights());

    await act(async () => {
      await result.current.addFlight({ origin: "LROP", destination: "EGLL" });
    });

    // Dynamic URL checking instead of hardcoding localhost
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/flights'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});