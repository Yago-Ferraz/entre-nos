import { Produto } from '../types/produto';

export interface ItemPedidoGet {
  id: number;
  produto: Produto;
  quantidade: number;
  preco_unitario: string;
  subtotal: number;
}

export interface PedidoGet {
  id: number;
  usuario: number;
  empresa: number;
  status: string;
  valor_total: string;
  descricao?: string;
  itens: ItemPedidoGet[];
}

export type PedidosResponse = PedidoGet[];



export const STATUS_CHOICES = [
  "pendente",
  "processando",
  "pago",
  "cancelado",
  "concluido",
] as const;

export type StatusPedido = typeof STATUS_CHOICES[number];

export interface PedidoStatusUpdate {
  status: StatusPedido;
  descricao?: string;
}

export interface ItemPedidoPost {
  produto: number;
  quantidade: number;
}


export interface PedidoPost {
  usuario: number;
  itens: ItemPedidoPost[];
}