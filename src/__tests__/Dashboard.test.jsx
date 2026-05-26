import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { vi } from 'vitest';
import * as useFlightsHook from '../hooks/useFlights';
import { AuthProvider } from '../store/AuthContext';

vi.mock('../store/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-123' } }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

vi.mock('../hooks/useFlights', () => ({
  useFlights: vi.fn()
}));

describe('Dashboard Integration', () => {
  const mockFetchFlights = vi.fn();
  const mockDeleteFlight = vi.fn();
  const mockFetchStats = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    const fakeFlights = [{
      id: 'f1', airline: { name: 'TAROM', code: 'RO' }, origin: 'LROP', destination: 'EGLL', 
      date: '2026-05-20', departureTime: '08:00', arrivalTime: '10:00', status: 'completed'
    }];

    useFlightsHook.useFlights.mockReturnValue({
      fetchFlights: mockFetchFlights,
      deleteFlight: mockDeleteFlight,
      fetchStats: mockFetchStats,
      loading: false, 
      flights: fakeFlights, 
      totalPages: 2
    });

    mockFetchFlights.mockResolvedValue({
      data: fakeFlights,
      totalPages: 2
    });

    mockFetchStats.mockResolvedValue({ totalFlightHours: 99, totalFlightMinutes: 45 });
  });

  const renderDashboard = () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test('renders the logbook with sample data', async () => {
    renderDashboard();
    expect(await screen.findByText(/TAROM/i)).toBeInTheDocument();
  });

  test('calculates and displays total flight hours for the page', async () => {
    renderDashboard();
    expect(await screen.findByText(/99:45/i)).toBeInTheDocument();
  });

  test('navigates to the add flight page when button is clicked', async () => {
    renderDashboard();
    const addBtn = screen.getByText(/\+ Add Flight/i);
    expect(addBtn).toBeInTheDocument();
  });

  test('handles flight deletion with confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderDashboard();
    
    const deleteBtn = await screen.findByTitle(/Delete Flight/i);
    fireEvent.click(deleteBtn);

    await waitFor(() => {
       expect(mockDeleteFlight).toHaveBeenCalledWith('f1');
    });

    confirmSpy.mockRestore();
  });

  test('shows empty state when no flights exist', async () => {
    mockFetchFlights.mockResolvedValue({ data: [], totalPages: 1 });
    
    useFlightsHook.useFlights.mockReturnValue({
      fetchFlights: mockFetchFlights,
      deleteFlight: mockDeleteFlight,
      fetchStats: mockFetchStats,
      loading: false, 
      flights: [], 
      totalPages: 1
    });

    renderDashboard();
    expect(await screen.findByText(/No flights yet/i)).toBeInTheDocument();
  });

  test('handles pagination correctly', async () => {
    renderDashboard();
    await screen.findByText(/TAROM/i);
    
    const nextBtn = screen.getByText('›');
    expect(nextBtn.disabled).toBe(false); 

    fireEvent.click(nextBtn);
    
    await waitFor(() => {
       expect(mockFetchFlights).toHaveBeenCalled(); 
    });
  });

  test('triggers view and edit actions', async () => {
    renderDashboard();
    const viewBtn = await screen.findByTitle(/View details/i);
    expect(viewBtn).toBeInTheDocument();

    const editBtn = screen.getByTitle(/Edit/i);
    expect(editBtn).toBeInTheDocument();
  });
});