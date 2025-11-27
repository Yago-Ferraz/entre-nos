import { API_AUTH } from './api';
import { Carteira, Transacao, NovaTransacaoPayload } from '../types/moeda';


 //Busca o saldo da carteira do usuário autenticado.
 

export const getCarteira = async (): Promise<Carteira> => {
  try {
    const response = await API_AUTH.get<Carteira>('/carteira/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar carteira:', error);
    throw error;
  }
};


 //Busca todas as transações da carteira do usuário autenticado.


export const getTransacoes = async (): Promise<Transacao[]> => {
  try {
    const response = await API_AUTH.get<Transacao[]>('/carteira/transacoes/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    throw error;
  }
};


  // Registra uma nova transação na carteira do usuário autenticado.

export const postTransacao = async (data: NovaTransacaoPayload): Promise<Transacao> => {
  try {
    const response = await API_AUTH.post<Transacao>('/carteira/', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar transação:', error);
    throw error;
  }
};
