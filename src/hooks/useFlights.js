import { useAuth } from '../store/AuthContext'; 

const API_URL = import.meta.env.VITE_API_URL || 'https://skytraq.onrender.com/api'; 

export function useFlights() {
  const { user } = useAuth(); 

  // Extragem token-ul din user
  const token = user?.token;

  // Funcție care atașează mereu token-ul la cereri
  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; 
    }
    return headers;
  };

  async function fetchFlights(page = 1, limit = 8) {
    const response = await fetch(`${API_URL}/flights?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getHeaders(),
      cache: 'no-store' 
    });
    
    if (!response.ok) throw new Error("Failed to fetch flights");
    return response.json(); 
  }

  async function addFlight(data) {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== null)
    );

    const response = await fetch(`${API_URL}/flights`, {
      method: 'POST',
      headers: getHeaders(), 
      body: JSON.stringify(cleanData)
    });

    if (!response.ok) throw new Error("Failed to add flight");
    return response.json();
  }

  async function updateFlight(id, data) {
    const response = await fetch(`${API_URL}/flights/${id}`, {
      method: 'PUT',
      headers: getHeaders(), 
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error("Failed to update flight");
    return response.json();
  }

  async function deleteFlight(id) {
    const response = await fetch(`${API_URL}/flights/${id}`, {
      method: 'DELETE',
      headers: getHeaders() 
    });
    
    if (!response.ok) throw new Error("Failed to delete flight");
    return true;
  }

  // Aici este funcția care îți aduce un singur zbor (pentru Edit și Detail)
  async function getById(id) {
    const response = await fetch(`${API_URL}/flights/${id}`, {
      method: 'GET',
      headers: getHeaders() 
    });
    
    if (!response.ok) throw new Error("Flight not found");
    return response.json();
  }

  async function fetchStats() {
    const response = await fetch(`${API_URL}/flights/stats`, {
      method: 'GET',
      headers: getHeaders(),
      cache: 'no-store' 
    });
    
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
  }

  return { 
    fetchFlights, 
    addFlight, 
    updateFlight, 
    deleteFlight, 
    getById, 
    fetchStats, 
    fetchFlightById: getById 
  };}