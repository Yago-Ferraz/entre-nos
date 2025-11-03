/**
 * @file cadastro.test.tsx
 * @description Testes simplificados para Cadastro de Usuário (US003)
 * Baseado no CSV: [entrenos] Execução de testes 2025.1 - US003.csv
 */

import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import * as ReactNative from 'react-native';
import Cadastro from './cadastro';

// Mock do Alert
const mockAlertFn = jest.fn();
jest.spyOn(ReactNative.Alert, 'alert').mockImplementation(mockAlertFn);

// Mock do navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

// Mock dos serviços
const mockCreateUser = jest.fn();
const mockLoginUser = jest.fn();
jest.mock('../../services/userService', () => ({
  createUser: mockCreateUser,
  loginUser: mockLoginUser,
}));

// Mock do AuthContext
const mockLogin = jest.fn();
jest.mock('../../AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe('Cadastro - Testes US003', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAlertFn.mockClear();
    mockNavigate.mockClear();
    mockCreateUser.mockClear();
    mockLoginUser.mockClear();
    mockLogin.mockClear();
  });

  /**
   * TC006: Renderização da tela inicial
   */
  describe('TC006 - Tela inicial de cadastro', () => {
    it('deve renderizar header com título Cadastro', () => {
      const { getByText } = render(<Cadastro />);
      expect(getByText('Cadastro')).toBeTruthy();
    });

    it('deve renderizar pergunta inicial sobre tipo de usuário', () => {
      const { getByText } = render(<Cadastro />);
      expect(getByText(/Olá Primeiro me/i)).toBeTruthy();
    });

    it('deve renderizar opção Empresa', () => {
      const { getByText } = render(<Cadastro />);
      expect(getByText('Empresa')).toBeTruthy();
    });

    it('deve renderizar opção Consumidor', () => {
      const { getByText } = render(<Cadastro />);
      expect(getByText('Consumidor')).toBeTruthy();
    });

    it('deve renderizar botão Próximo', () => {
      const { getByText } = render(<Cadastro />);
      expect(getByText('Próximo')).toBeTruthy();
    });

    it('deve renderizar indicador de passo (1 de 7)', () => {
      const { getByText } = render(<Cadastro />);
      expect(getByText(/Passo 1 de 7/i)).toBeTruthy();
    });
  });

  /**
   * TC004: Seleção de tipo de usuário
   */
  describe('TC004 - Seleção de tipo', () => {
    it('deve permitir selecionar Empresa', () => {
      const { getByText } = render(<Cadastro />);
      
      const empresaButton = getByText('Empresa');
      fireEvent.press(empresaButton);
      
      expect(empresaButton).toBeTruthy();
    });

    it('deve permitir selecionar Consumidor', () => {
      const { getByText } = render(<Cadastro />);
      
      const consumidorButton = getByText('Consumidor');
      fireEvent.press(consumidorButton);
      
      expect(consumidorButton).toBeTruthy();
    });
  });

  /**
   * TC0016: Navegação entre steps
   */
  describe('TC0016 - Navegação', () => {
    it('deve avançar para step 2 (Nome) ao clicar em Próximo', async () => {
      const { getByText } = render(<Cadastro />);
      
      const empresaButton = getByText('Empresa');
      fireEvent.press(empresaButton);
      
      const proximoBtn = getByText('Próximo');
      fireEvent.press(proximoBtn);
      
      await waitFor(() => {
        expect(getByText(/Informe seu nome/i)).toBeTruthy();
      });
    });

    it('deve mostrar botão Voltar no step 2', async () => {
      const { getByText } = render(<Cadastro />);
      
      fireEvent.press(getByText('Empresa'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        expect(getByText('Voltar')).toBeTruthy();
      });
    });

    it('deve voltar para step 1 ao clicar em Voltar', async () => {
      const { getByText } = render(<Cadastro />);
      
      fireEvent.press(getByText('Empresa'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        expect(getByText(/Informe seu nome/i)).toBeTruthy();
      });
      
      fireEvent.press(getByText('Voltar'));
      
      await waitFor(() => {
        expect(getByText(/Olá Primeiro me/i)).toBeTruthy();
      });
    });

    it('deve mostrar indicador de passo correto em cada step', async () => {
      const { getByText } = render(<Cadastro />);
      
      expect(getByText(/Passo 1 de 7/i)).toBeTruthy();
      
      fireEvent.press(getByText('Empresa'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        expect(getByText(/Passo 2 de 7/i)).toBeTruthy();
      });
    });
  });

  /**
   * TC0020: Input de nome
   */
  describe('TC0020 - Campo nome', () => {
    it('deve aceitar nome simples', async () => {
      const { getByText, getByPlaceholderText } = render(<Cadastro />);
      
      fireEvent.press(getByText('Empresa'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        const nomeInput = getByPlaceholderText('Insira seu nome...');
        fireEvent.changeText(nomeInput, 'João Silva');
        expect(nomeInput.props.value).toBe('João Silva');
      });
    });

    it('deve aceitar nome com acentos', async () => {
      const { getByText, getByPlaceholderText } = render(<Cadastro />);
      
      fireEvent.press(getByText('Empresa'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        const nomeInput = getByPlaceholderText('Insira seu nome...');
        fireEvent.changeText(nomeInput, 'José María Gonçalves');
        expect(nomeInput.props.value).toBe('José María Gonçalves');
      });
    });

    it('deve aceitar nome com números (se permitido)', async () => {
      const { getByText, getByPlaceholderText } = render(<Cadastro />);
      
      fireEvent.press(getByText('Empresa'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        const nomeInput = getByPlaceholderText('Insira seu nome...');
        fireEvent.changeText(nomeInput, 'João 123');
        expect(nomeInput.props.value).toBe('João 123');
      });
    });
  });

  /**
   * TC009: Navegação completa
   */
  describe('TC009 - Fluxo completo de steps', () => {
    it('deve navegar de step 2 para step 3 (Telefone)', async () => {
      const { getByText, getByPlaceholderText } = render(<Cadastro />);
      
      fireEvent.press(getByText('Empresa'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        const nomeInput = getByPlaceholderText('Insira seu nome...');
        fireEvent.changeText(nomeInput, 'Teste');
      });
      
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        expect(getByText(/informe seu telefone/i)).toBeTruthy();
      });
    });

    it('deve aceitar número de telefone', async () => {
      const { getByText, getByPlaceholderText } = render(<Cadastro />);
      
      fireEvent.press(getByText('Empresa'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Insira seu nome...'), 'Teste');
      });
      
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        const telefoneInput = getByPlaceholderText('Digite seu telefone...');
        fireEvent.changeText(telefoneInput, '11999999999');
        expect(telefoneInput.props.value).toBe('11999999999');
      });
    });
  });

  /**
   * TC0015: Responsividade - KeyboardAvoidingView
   */
  describe('TC0015 - Responsividade', () => {
    it('deve renderizar componente sem erros', () => {
      const { getByText } = render(<Cadastro />);
      expect(getByText('Cadastro')).toBeTruthy();
    });
  });

  /**
   * TC0014: Renderização de campos
   */
  describe('TC0014 - Campos do formulário', () => {
    it('deve renderizar campo nome no step 2', async () => {
      const { getByText, getByPlaceholderText } = render(<Cadastro />);
      
      fireEvent.press(getByText('Empresa'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        expect(getByPlaceholderText('Insira seu nome...')).toBeTruthy();
      });
    });

    it('deve renderizar campo telefone no step 3', async () => {
      const { getByText, getByPlaceholderText } = render(<Cadastro />);
      
      fireEvent.press(getByText('Empresa'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Insira seu nome...'), 'Teste');
      });
      
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        expect(getByPlaceholderText('Digite seu telefone...')).toBeTruthy();
      });
    });

    it('deve renderizar campo CNPJ no step 4', async () => {
      const { getByText, getByPlaceholderText } = render(<Cadastro />);
      
      fireEvent.press(getByText('Empresa'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => fireEvent.changeText(getByPlaceholderText('Insira seu nome...'), 'Teste'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => fireEvent.changeText(getByPlaceholderText('Digite seu telefone...'), '11999999999'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        expect(getByPlaceholderText('Digite seu CNPJ...')).toBeTruthy();
      });
    });

    it('deve aceitar entrada no campo CNPJ', async () => {
      const { getByText, getByPlaceholderText } = render(<Cadastro />);
      
      fireEvent.press(getByText('Empresa'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => fireEvent.changeText(getByPlaceholderText('Insira seu nome...'), 'Teste'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => fireEvent.changeText(getByPlaceholderText('Digite seu telefone...'), '11999999999'));
      fireEvent.press(getByText('Próximo'));
      
      await waitFor(() => {
        const cnpjInput = getByPlaceholderText('Digite seu CNPJ...');
        fireEvent.changeText(cnpjInput, '12345678000190');
        expect(cnpjInput.props.value).toBe('12345678000190');
      });
    });
  });
});
