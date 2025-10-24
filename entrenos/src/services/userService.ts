// src/services/userService.ts
import { API_PUBLIC, API_AUTH } from '../services/api';
import {FormDataCadastroLojaType} from '../types/cadastro/cadastro'

// Criar usuário (registro) - não precisa de token
export const createUser = async (user: FormDataCadastroLojaType) => {
  try {
    const formData = new FormData();

    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("phone", user.phone || "");
    formData.append("cnpj", user.cnpj || "");
    formData.append("categoria", user.categoria || 1);
    formData.append("descricao", user.descricao || "");

    // Logo
    if (user.logo) {
        formData.append("logo", {
            uri: user.logo,      // URI da imagem
            type: "image/jpeg",  // tipo do arquivo
            name: "logo.jpg",    // nome do arquivo
        } as any);
        }

    // Múltiplas fotos
    user.fotos.forEach((uri: string, index: number) => {
        formData.append("fotos", {
            uri,
            type: "image/jpeg", // ou tipo real
            name: `foto${index}.jpg`,
        } as any);
        });

    const response = await API_PUBLIC.post("/users/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
  if (error.response) {
    console.log("Django respondeu:", error.response.data);
  } else if (error.request) {
    console.log("Requisição enviada mas sem resposta:", error.request);
  } else {
    console.log("Erro desconhecido:", error.message);
  }
}
};

// Exemplo de chamada autenticada
export const getUserProfile = async () => {
  try {
    const response = await API_AUTH.get('/users/me/');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar perfil:', error.response?.data || error.message);
    throw error;
  }
};
