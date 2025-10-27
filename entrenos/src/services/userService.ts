// src/services/userService.ts
import { API_PUBLIC, API_AUTH } from './api';
import { FormDataCadastroLojaType } from '../types/cadastro/cadastro';

// Criar usuário (registro) - apenas dados básicos do usuário
export const createUser = async (user: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  userType: number;
}) => {
  try {
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("phone", user.phone || "");
    formData.append("userType", String(user.userType));

    const response = await API_PUBLIC.post("/users/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error.response?.data || error.message);
    throw error;
  }
};

// Buscar perfil do usuário autenticado
export const getUserProfile = async () => {
  try {
    const response = await API_AUTH.get('/users/me/');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar perfil:', error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await API_PUBLIC.post('/auth/jwt/create/', { email, password });
    return response.data; // { access: '...', refresh: '...' }
  } catch (error: any) {
    console.error("Erro no login:", error.response?.data || error.message);
    throw error;
  }
};