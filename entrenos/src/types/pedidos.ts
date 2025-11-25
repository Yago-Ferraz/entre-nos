export interface ItemPedidoGet {
  id: number;
  produto: number;
  quantidade: number;
  preco_unitario: string; 
  subtotal: string;       
}

export interface PedidoGet {
  id: number;
  usuario: number;
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