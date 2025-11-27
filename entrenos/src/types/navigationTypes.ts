import {FormDataCadastroLojaType} from '@/src/types/cadastro/cadastro';
import { Produto } from '@/src/types/produto';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
  singuploja: { formData: FormDataCadastroLojaType };
  Home: undefined;
  CREATEPRODUTO: { produto: Produto } | undefined;
};

import { LojaProduto } from './loja';

export type LojaStackParamList = {
  TelaLoja: undefined;
  TelaProduto: { productId: number };
};

export type HomeStackParamList = {
  HomeInitial: undefined;
  PRODUTOSCREEM: { productId: number } | undefined; // Assuming productId is passed
  CREATEPRODUTO: { produto: Produto } | undefined;
  CAIXA: undefined;
  PEDIDOS: undefined;
  EXTRATO: undefined;
  BI: undefined;
};

export type BIScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'BI'>;
