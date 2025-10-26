import { API_AUTH } from './api';
import { FormDataCadastroLojaType } from '../types/cadastro/cadastro';

export const createLoja = async (loja: FormDataCadastroLojaType, userId: number) => {
  try {
    const formData = new FormData();
    formData.append('user', String(userId));
    formData.append('categoria', String(loja.categoria || 1));
    formData.append('descricao', loja.descricao || '');

    if (loja.logo) {
      formData.append('logo', {
        uri: loja.logo,
        type: 'image/jpeg',
        name: 'logo.jpg',
      } as any);
    }

    // Fotos múltiplas
    loja.fotos.forEach((uri, index) => {
      formData.append('fotos_upload', {
        uri,
        type: 'image/jpeg',
        name: `foto${index}.jpg`,
      } as any);
    });

    const response = await API_AUTH.post('/empresa/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar loja:', error.response?.data || error.message);
    throw error;
  }
};
