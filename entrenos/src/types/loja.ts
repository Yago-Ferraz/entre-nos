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
