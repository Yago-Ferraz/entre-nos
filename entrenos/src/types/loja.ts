export interface DashboardStats {
  vendas_semana: {
    total_vendas: number;
    percentual_variacao: string;
  };
  produto_mais_vendido: {
    nome: string;
    porcentagem_total: string;
  };
  media_diaria_semana: {
    valor_medio_diario: string;
    periodo_referencia: string;
  };
}

export interface WeeklyDashboardSummaryResponse {
  total_venda_semana: string;
  produto_mais_vendido_semana: {
    nome: string;
    porcentagem_total: string;
  };
  meta_diaria: number;
  meta_semanal: number;
  frases_dra_clara: string[];
  alertas_inteligentes: string[];
  vendas_por_dia_semana: {
    segunda: number;
    terca: number;
    quarta: number;
    quinta: number;
    sexta: number;
  };
}

export interface LojaUser {
  name: string;
  email: string;
  phone: string;
}

export interface LojaFoto {
  imagem: string;
}

export interface LojaProduto {
  id: number;
  created_at: string;
  updated_at: string;
  imagem: string;
  nome: string;
  descricao: string;
  preco: string;
  quantidade: number;
  created_by: number;
  updated_by: number;
}

export interface LojaDetails {
  id: number;
  descricao: string;
  avaliacao: number;
  logo: string;
  user: LojaUser;
  fotos: LojaFoto[];
  produtos: LojaProduto[];
}

