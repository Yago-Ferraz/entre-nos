import { API_AUTH } from './api';
import { ProdutoDetalhado } from '../types/produto';

export const getProdutoById = async (id: number): Promise<ProdutoDetalhado> => {
  try {
    const response = await API_AUTH.get(`/loja/produtos/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar detalhes do produto:', error.response?.data || error.message);
    throw error;
  }
};
