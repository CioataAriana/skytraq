import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// It uses your cloud URL if it exists, otherwise falls back to localhost for local testing.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://skytraq.onrender.com/api';

export function AuthProvider({ children }) {
  // 1. Initialize state from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Sync user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  async function login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        // Prisma sends the user directly, not wrapped inside a "user" property
        setUser(userData);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  }

  // REGISTER: Syncs with backend
  async function register(email, password, fullName, license) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, license }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Registration failed:", err);
      return false;
    }
  }

  function logout() {
    setUser(null);
  }


  useEffect(() => {
    let inactivityTimer;
    
    const INACTIVITY_LIMIT = 15 * 60 * 1000; 

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      
      if (user) {
        inactivityTimer = setTimeout(() => {
          alert("For your security, you have been logged out due to inactivity.");
          logout(); 
        }, INACTIVITY_LIMIT);
      }
    };

    const userActions = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

    if (user) {
      resetTimer();
      
      userActions.forEach(action => 
        window.addEventListener(action, resetTimer)
      );
    }

    return () => {
      clearTimeout(inactivityTimer);
      userActions.forEach(action => 
        window.removeEventListener(action, resetTimer)
      );
    };
  }, [user]); 

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}