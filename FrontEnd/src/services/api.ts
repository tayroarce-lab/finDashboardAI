import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});


// Interceptor: Agrega JWT a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('df_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Maneja errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('df_token');
      localStorage.removeItem('df_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
