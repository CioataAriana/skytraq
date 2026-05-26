import { useState, useEffect } from 'react';

export const useAirlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const response = await fetch('https://172.20.10.4:3000/api/airlines');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setAirlines(data);
      } catch (error) {
        console.error('Error fetching airlines:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAirlines();
  }, []);

  return { airlines, loading };
};