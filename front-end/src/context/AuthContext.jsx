import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser, logoutUser } from '../utils/authDomSync';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    const handleStorage = () => setUser(getCurrentUser());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    setUser(userData);
  };

  const logout = (navigate) => {
    logoutUser(navigate);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}
