import {FormDataCadastroLojaType} from '@/src/types/cadastro/cadastro';
export const ROUTES = {
  LOGIN: 'Login', // <-- ADICIONE ESTA LINHA
  FORGOT_PASSWORD: 'ForgotPassword',
  SIGN_UP: 'Signup',
  SING_UP_LOJA: "singuploja",
  HOME: 'Home',
  PRODUTOSCREEM: 'ProdutoScreem',
  CREATEPRODUTO: 'Createproduto'

} as const;

// src/navigation/navigationTypes.ts


export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
  singuploja: { formData: FormDataCadastroLojaType };
  Home: undefined;
  PRODUTOSCREEM: undefined,
  CREATEPRODUTO: undefined
};


