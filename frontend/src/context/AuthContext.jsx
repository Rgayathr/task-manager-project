// Authentication Context
// Provides auth state and methods (login, register, logout) to the entire app
// Uses React Context API to avoid prop drilling
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

// Create context with default value
const AuthContext = createContext(null);

// Custom hook for easy access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Auth Provider component - wraps the app and provides auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // Current authenticated user
  const [loading, setLoading] = useState(true);   // Loading state during initial auth check

  // On app load, check if user is already authenticated via cookie
  // The JWT cookie is automatically sent with the request
  useEffect(() => {
    checkAuth();
  }, []);

  // Verify current authentication status
  const checkAuth = async () => {
    try {
      const { data } = await API.get('/auth/me');
      setUser(data.user);
    } catch {
      // Not authenticated - cookie missing or expired
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Register a new user
  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    setUser(data.user);
    return data;
  };

  // Login with email and password
  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    setUser(data.user);
    return data;
  };

  // Logout - clears cookie on server side
  const logout = async () => {
    await API.post('/auth/logout');
    setUser(null);
  };

  // Provide auth state and methods to children
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
