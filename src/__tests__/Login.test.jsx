import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '../store/AuthContext';
import Login from '../pages/Login';

describe('Login Page', () => {
  it('toggles password visibility', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    const passInput = screen.getByPlaceholderText(/••••••••••/i);
    const toggleBtn = screen.getByRole('button', { name: /👁️/i });

    expect(passInput.getAttribute('type')).toBe('password');
    fireEvent.click(toggleBtn);
    expect(passInput.getAttribute('type')).toBe('text');
  });

  it('handles form submission', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email:/i);
    const passInput = screen.getByLabelText(/Password:/i);
    const submitBtn = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: 'pilot@skytraq.com' } });
    fireEvent.change(passInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    expect(emailInput.value).toBe('pilot@skytraq.com');
    expect(passInput.value).toBe('password123');
  });

it('handles close button click', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );
    
    // Fix: Look for the text '✕' instead of a title!
    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);
  });
});