import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../store/AuthContext';

global.fetch = vi.fn();

describe('AuthContext', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear(); 
  });

  it('handles user registration, login, and logout', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    // 1. Mock a successful Registration WITH a token
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-jwt', user: { fullName: 'Maverick' } })
    });

    await act(async () => { 
      await result.current.register('pilot@skytraq.com', 'password123', 'Maverick', 'RO1234'); 
    });
    
    //  Check that a user object successfully loaded into state
    expect(result.current.user).toBeTruthy();

    act(() => { 
      result.current.logout(); 
    });
    expect(result.current.user).toBeNull();

    // 2. Mock a successful Login WITH a token
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-jwt', user: { fullName: 'iceman' } })
    });

    await act(async () => { 
      await result.current.login('iceman@skytraq.com', 'password123'); 
    });
    
    // Check that a user object successfully loaded into state
    expect(result.current.user).toBeTruthy();
  });

  it('fails gracefully with missing credentials', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    fetch.mockResolvedValue({ ok: false });

    let loginSuccess, regSuccess;
    
    await act(async () => {
      loginSuccess = await result.current.login('', '');
      regSuccess = await result.current.register('test@test.com', 'pass'); 
    });
    
    expect(loginSuccess).toBe(false);
    expect(regSuccess).toBe(false);
  });
});