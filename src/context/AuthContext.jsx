
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //  Check if user is already logged in 
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  //  Login Function 
  const login = async (username, password) => {
    try {
      // Backend Route: /api/admin/login
      const response = await api.post('/admin/login', { username, password });
      
      const { token, user } = response.data;

      if (token && user) {
        // Save to LocalStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || "Invalid Username or Password" 
      };
    }
    return { success: false, message: "Login failed" };
  };

  // 3. Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);