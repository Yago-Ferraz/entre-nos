// src/navigation/navigationTypes.ts
import {FormDataCadastroLojaType} from '../types/cadastro/cadastro';

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
  singuploja: { formData: FormDataCadastroLojaType };
};


