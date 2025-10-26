import {FormDataCadastroLojaType} from '@/src/types/cadastro/cadastro';
export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
  singuploja: { formData: FormDataCadastroLojaType };
  Home: undefined;
};


