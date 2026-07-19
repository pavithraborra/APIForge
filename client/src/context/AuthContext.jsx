import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await authService.getMe();
      setUser(res.data);
    } catch (err) {
      console.error('Failed to load user', err);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(credentials);
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register(userData);
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (userData) => {
    try {
      const res = await authService.updateProfile(userData);
      setUser(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Update failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
