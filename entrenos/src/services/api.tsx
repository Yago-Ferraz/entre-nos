import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const baseurl= 'http://192.168.1.64:8003'

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
