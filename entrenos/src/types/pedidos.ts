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
  itens: ItemPedidoGet[];
}

export type PedidosResponse = PedidoGet[];


export interface ItemPedidoPost {
  produto: number;
  quantidade: number;
}

export interface PedidoPost {
  usuario: number;
  itens: ItemPedidoPost[];
}