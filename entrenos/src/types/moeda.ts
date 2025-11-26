export interface Carteira {
  saldo_dinheiro: string;
  saldo_moeda: string;
  atualizado_em: string;
}

export interface Transacao {
  id: number;
  created_at: string;
  updated_at: string;
  tipo_ativo: string;
  tipo_operacao: string;
  valor: string;
  valor_movimentado: string;
  descricao: string;
  created_by: number | null;
  updated_by: number | null;
  carteira: number;
}

export interface NovaTransacaoPayload {
  valor: string;
  tipo_ativo: string;
  tipo_operacao: string;
  descricao: string;
}
