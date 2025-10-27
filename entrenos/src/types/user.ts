// types/user.ts

// Cada foto da empresa
export type FotoEmpresa = {
  id: number;
  imagem: string;
};

// Empresa associada ao usuário
export type Empresa = {
  id: number;
  categoria: number;
  descricao: string;
  logo: string;
  user: number;
  fotos: FotoEmpresa[];
};

// Usuário logado
export type User = {
  id: number;
  name: string;
  email: string;
  token: string;
  usertype: number;
  empresa: Empresa | null; // null se o usuário ainda não tiver loja
} | null;
