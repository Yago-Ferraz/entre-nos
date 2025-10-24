// src/api/api.ts
import axios from 'axios';

// 1. API pública (ex: criar usuário, login)
export const API_PUBLIC = axios.create({
  baseURL: 'http://192.168.58.179:8003/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// 2. API autenticada (envia token automaticamente)
export const API_AUTH = axios.create({
  baseURL: 'http://192.168.58.179:8003/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});


API_AUTH.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
