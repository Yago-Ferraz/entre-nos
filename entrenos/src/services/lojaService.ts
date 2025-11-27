import { API_AUTH } from './api';
import { FormDataCadastroLojaType } from '../types/cadastro/cadastro';
import { DashboardStats, WeeklyDashboardSummaryResponse, LojaDetails } from '../types/loja';

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

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await API_AUTH.get('/empresa/dashboard-stats/');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas do dashboard:', error.response?.data || error.message);
    throw error;
  }
};

export const getEmpresaStats = async () => {
  try {
    const response = await API_AUTH.get('/empresa/stats/');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas da empresa:', error.response?.data || error.message);
    throw error;
  }
};

export const updateMeta = async (meta: number) => {
  try {
    const response = await API_AUTH.post('/empresa/meta/', { meta }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Erro ao atualizar a meta:', error.response?.data || error.message);
    throw error;
  }
};

export const getMeta = async () => {
  try {
    const response = await API_AUTH.get('/empresa/meta/');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar a meta:', error.response?.data || error.message);
    throw error;
  }
};

export const getDashboard = async () => {
  try {
    const response = await API_AUTH.get('/empresa/dashboard/');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar dados do dashboard:', error.response?.data || error.message);
    throw error;
  }
};

export const getWeeklyDashboardSummary = async (): Promise<WeeklyDashboardSummaryResponse> => {
  try {
    const response = await API_AUTH.get('/empresa/weekly-dashboard-summary/');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar o resumo semanal do dashboard:', error.response?.data || error.message);
    throw error;
  }
};

export const getLojaDetails = async (lojaId: number): Promise<LojaDetails> => {
  try {
    const response = await API_AUTH.get(`loja/empresa/me/`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar detalhes da loja:', error.response?.data || error.message);
    throw error;
  }
};

