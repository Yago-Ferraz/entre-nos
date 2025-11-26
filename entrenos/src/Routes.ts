import {FormDataCadastroLojaType} from '@/src/types/cadastro/cadastro';
import { Produto } from '@/src/types/produto';
export const ROUTES = {
  LOGIN: 'Login',
  FORGOT_PASSWORD: 'ForgotPassword',
  SIGN_UP: 'Signup',
  SING_UP_LOJA: "singuploja",
  HOME: 'HomeInitial',
  PRODUTOSCREEM: 'PRODUTOSCREEM',
  CREATEPRODUTO: 'CREATEPRODUTO',
  CAIXA: 'CAIXA',
  PEDIDOS: 'PEDIDOS'
} as const;



export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Signup:undefined;
  singuploja: { formData: FormDataCadastroLojaType };
  HomeInitial: undefined;
  PRODUTOSCREEM: undefined,
  CREATEPRODUTO: { produto: Produto } | undefined;
  CAIXA: undefined,
  PEDIDOS: undefined,
};
