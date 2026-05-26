import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../components/common/Navbar';
import * as AuthContextModule from '../store/AuthContext';

// Intercept useAuth so we can control what it returns
vi.mock('../store/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

describe('Navbar Component', () => {
  it('handles brand and logbook link clicks', () => {
    // Pretend NO user is logged in
    AuthContextModule.useAuth.mockReturnValue({ user: null });
    
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const brandBtn = screen.getByRole('button', { name: /SkyTraq/i });
    fireEvent.click(brandBtn);

    const logbookBtn = screen.getByRole('button', { name: /Logbook/i });
    fireEvent.click(logbookBtn);
  });

  it('handles logout when user is authenticated', () => {
    const mockLogout = vi.fn();
    
    // Pretend a user IS logged in!
    AuthContextModule.useAuth.mockReturnValue({ 
      user: { name: 'Maverick' }, 
      logout: mockLogout 
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Because we mocked the user, the button will now say "Log out"
    const logoutBtn = screen.getByRole('button', { name: /Log out/i });
    fireEvent.click(logoutBtn);
    
    expect(mockLogout).toHaveBeenCalled();
  });
});