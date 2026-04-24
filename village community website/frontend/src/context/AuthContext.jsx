import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../services/config.js';

const AuthContext = createContext(null);

const getApiErrorMessage = (error, fallbackMessage) => {
  const apiMessage = error?.response?.data?.message || error?.response?.data?.error;
  return apiMessage || error?.message || fallbackMessage;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token') || localStorage.getItem('bv_token');
    const savedUser = localStorage.getItem('user') || localStorage.getItem('bv_user');
    if (savedToken) setToken(savedToken);
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch { localStorage.removeItem('user'); }
    }
    setLoading(false);
  }, []);

  const saveSession = (data) => {
    if (!data?.token || !data?.user) throw new Error('Invalid auth response from server');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('bv_token', data.token);
    localStorage.setItem('bv_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      saveSession(res.data);
      return res.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Login failed. Please check your credentials.'));
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, { username, email, password });
      saveSession(res.data);
      return res.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Registration failed. Please try again.'));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('bv_token');
    localStorage.removeItem('bv_user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
