// AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    isLoggedIn: false,
    userId: null,
    userRole: null,
    authToken: null, // New field for the auth token
    username: null,
    csrfToken: null,
  });
  async function getCsrfToken() {
    // Make an AJAX request to the Django view that returns the CSRF token
    try {
      const response = await fetch('http://3.108.151.50/get-csrf-token/');
      const data = await response.json();
      const csrfToken = data.csrfToken;
      console.log('CSRF Token:', csrfToken);
      
      return csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  }
  

  useEffect(() => {
    // Load authentication data from local storage on component mount
    const storedAuthData = JSON.parse(localStorage.getItem('authData'));
    if (storedAuthData) {
      setAuthData(storedAuthData);
    }
  }, []);

  const login = (userId, userRole, authToken,username) => {
    const csrfToken = getCsrfToken();
    setAuthData({
      isLoggedIn: true,
      userId,
      userRole,
      authToken, // Set the auth token
      username,
      csrfToken,
    });
    // Save authentication data to local storage
    localStorage.setItem('authData', JSON.stringify({
      isLoggedIn: true,
      userId,
      userRole,
      authToken, // Save the auth token
      username,
      csrfToken,
    }));
  };

  const logout = () => {
    setAuthData({
      isLoggedIn: false,
      userId: null,
      userRole: null,
      authToken: null, // Clear the auth token
      username: null,
      csrfToken: null,
    });
    // Remove authentication data from local storage
    localStorage.removeItem('authData');
  };

  return (
    <AuthContext.Provider value={{ ...authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};