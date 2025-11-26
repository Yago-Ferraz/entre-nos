import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { onLogoutCallback } from "../AuthContext"; // Import the logout callback

export const baseurl= 'http://192.168.58.179:8003'

// 1. API pública (ex: criar usuário, login)
export const API_PUBLIC = axios.create({
  baseURL: `${baseurl}/api`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// 2. API autenticada (envia token automaticamente)
export const API_AUTH = axios.create({
  baseURL: `${baseurl}/api`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

API_AUTH.interceptors.request.use(async (config) => {
  const storedUser  = await AsyncStorage.getItem("@user")
   if (storedUser) {
    const token = JSON.parse(storedUser).token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to API_AUTH
API_AUTH.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Check if the error is due to an unauthorized request (e.g., expired token)
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized API request - logging out.");
      // Call the globally available logout function if it exists
      if (onLogoutCallback) {
        await onLogoutCallback();
      }
    }
    return Promise.reject(error);
  }
);
