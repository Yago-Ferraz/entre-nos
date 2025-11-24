import {FormDataCadastroLojaType} from '@/src/types/cadastro/cadastro';
import { Produto } from '@/src/types/produto';
export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
  singuploja: { formData: FormDataCadastroLojaType };
  Home: undefined;
  CREATEPRODUTO: { produto: Produto } | undefined;
};


