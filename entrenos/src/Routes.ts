import {FormDataCadastroLojaType} from '@/src/types/cadastro/cadastro';
import { Produto } from '@/src/types/produto';
export const ROUTES = {
  LOGIN: 'Login',
  FORGOT_PASSWORD: 'ForgotPassword',
  SIGN_UP: 'Signup',
  SING_UP_LOJA: "singuploja",
  HOME: 'Home',
  PRODUTOSCREEM: 'PRODUTOSCREEM',
  CREATEPRODUTO: 'CREATEPRODUTO',
  CAIXA: 'CAIXA'

} as const;



export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
  singuploja: { formData: FormDataCadastroLojaType };
  Home: undefined;
  PRODUTOSCREEM: undefined,
  CREATEPRODUTO: { produto: Produto } | undefined;
  CAIXA: undefined,
  
};


