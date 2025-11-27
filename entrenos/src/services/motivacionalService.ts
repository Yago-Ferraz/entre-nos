import { API_AUTH } from './api';
import { MotivationalPhrase } from '../types/motivacional';

export const getMotivationalPhrase = async (): Promise<MotivationalPhrase> => {
  try {
    const response = await API_AUTH.get('/motivacional/');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar frase motivacional:', error.response?.data || error.message);
    throw error;
  }
};
