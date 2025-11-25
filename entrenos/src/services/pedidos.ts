import { API_AUTH } from './api';
import { PedidoGet, PedidoPost, PedidosResponse } from '../types/pedidos';

export const pedidoService = {
  
  getPedidos: async (): Promise<PedidosResponse> => {
    try {
      const response = await API_AUTH.get<PedidosResponse>('/pedidos/');
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar pedidos:", error.response?.data || error.message);
      throw error;
    }
  },

  
  createPedido: async (pedidoData: PedidoPost): Promise<PedidoGet> => {
    try {
      // O backend espera multipart/form-data, então convertemos o JSON.
      const formData = new FormData();
      formData.append('usuario', String(pedidoData.usuario));
      
      // A lista de itens precisa ser serializada como JSON
      formData.append('itens', JSON.stringify(pedidoData.itens));

      const response = await API_AUTH.post<PedidoGet>('/pedidos/', formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar pedido:", error.response?.data || error.message);
      throw error;
    }
  },
};
