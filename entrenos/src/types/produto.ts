export type ProdutoPayload = {
  nome: string;
  descricao: string;
  preco: string | number;
  quantidade: number;
  imagem: string;
};

export type Produto = {
  id: number;
  created_at: string;
  updated_at: string;
  criador_nome?: string; 
  created_by_nome: string | null;
  updated_by_nome: string | null;
  results: {
    nome: string;
    descricao: string;
    preco: string;     
    quantidade: number;
    imagem: string;
  };
};

export type UpsellProduto = {
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
};

export type ProdutoDetalhado = {
    id: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
    imagem: string;
    nome: string;
    descricao: string;
    preco: string;
    quantidade: number;
    upsell_produtos: UpsellProduto[];
};
