import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import MockAdapter from 'axios-mock-adapter';
import { API_AUTH } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Dimensions } from 'react-native';

// Import components to test
import ExtratoScreen from '../../views/home/moeda/ExtratoScreen';
import FluxoCaixaScreen from '../../views/home/moeda/caixa';

// Import services to mock
import * as MoedaService from '../../services/moeda';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({ token: 'fake-token' }))),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Mock @react-navigation/native
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
let mockUseFocusEffectCallback: Function | undefined;

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useFocusEffect: jest.fn((callback) => {
    mockUseFocusEffectCallback = callback;
    return jest.fn();
  }),
}));

// Mock Dimensions (already present in produto.test.tsx, reusing)
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return Object.setPrototypeOf({
    Dimensions: {
      get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
    },
  }, RN);
});

// Mock custom components (reusing from produto.test.tsx where applicable)
jest.mock('../../components/header/header', () => {
  const { View, Text, TouchableOpacity } = jest.requireActual('react-native');
  return ({ title, showBackButton, onBackPress }: any) => (
    <View testID="Header">
      {showBackButton && <TouchableOpacity testID="HeaderBackButton" onPress={onBackPress}><Text>Back</Text></TouchableOpacity>}
      <Text>{title}</Text>
    </View>
  );
});

jest.mock('../../components/buttons/buttongeneric', () => {
  const { TouchableOpacity, Text, View } = jest.requireActual('react-native');
  return ({ title, onPress, leftIcon, style, testID }: any) => (
    <TouchableOpacity testID={testID || `ButtonGeneric-${title}`} onPress={onPress} style={style}>
      {leftIcon}
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

jest.mock('../../components/cards/cardbase', () => {
  const { View } = jest.requireActual('react-native');
  return ({ children, style }: any) => <View testID="CardBase" style={style}>{children}</View>;
});

jest.mock('../../components/ActivityItem', () => {
  const { View, Text } = jest.requireActual('react-native');
  return ({ title, date, value, color, barColor }: any) => (
    <View testID={`ActivityItem-${title}`}>
      <Text>{title}</Text>
      <Text>{date}</Text>
      <Text>{value}</Text>
    </View>
  );
});

// Mock Ionicons and MaterialCommunityIcons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  FontAwesome5: 'FontAwesome5',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

describe('Moeda Integration Tests', () => {
  let mockAxios: MockAdapter;

  const mockCarteira = {
    id: 1,
    saldo_dinheiro: '1500.75',
    saldo_moeda: '250',
    created_at: '2023-01-01T10:00:00Z',
    updated_at: '2023-01-01T10:00:00Z',
  };

  const mockTransacoes = [
    {
      id: 1,
      tipo_operacao: 'Venda de Produto',
      tipo_ativo: 'BRL',
      valor: '100.00',
      valor_movimentado: '+100.00',
      created_at: '2023-11-29T10:00:00Z',
    },
    {
      id: 2,
      tipo_operacao: 'Compra de Recurso',
      tipo_ativo: 'COIN',
      valor: '50',
      valor_movimentado: '-50',
      created_at: '2023-11-28T10:00:00Z',
    },
  ];

  beforeAll(() => {
    mockAxios = new MockAdapter(API_AUTH);
  });

  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
    mockUseFocusEffectCallback = undefined;
  });

  afterAll(() => {
    mockAxios.restore();
  });

  describe('ExtratoScreen', () => {
    it('should display loading indicator initially', () => {
      jest.spyOn(MoedaService, 'getTransacoes').mockReturnValueOnce(new Promise(() => {})); // Never resolve
      render(<ExtratoScreen />);
      expect(screen.getByText('Carregando extrato...')).toBeVisible();
    });

    it('should display error message if fetching transactions fails', async () => {
      jest.spyOn(MoedaService, 'getTransacoes').mockRejectedValueOnce(new Error('Network Error'));
      render(<ExtratoScreen />);
      await waitFor(() => expect(screen.getByText('Network Error')).toBeVisible());
      expect(screen.getByText('Não foi possível carregar seu extrato. Tente novamente.')).toBeVisible();
    });

    it('should display no transactions message if no transactions are found', async () => {
      jest.spyOn(MoedaService, 'getTransacoes').mockResolvedValueOnce([]);
      render(<ExtratoScreen />);
      await waitFor(() => expect(screen.getByText('Nenhuma transação encontrada ainda.')).toBeVisible());
    });

    it('should display transactions when fetched successfully', async () => {
      jest.spyOn(MoedaService, 'getTransacoes').mockResolvedValueOnce(mockTransacoes);
      render(<ExtratoScreen />);
      await waitFor(() => {
        expect(screen.getByText('Extrato Completo')).toBeVisible();
        expect(screen.getByText('Venda de Produto')).toBeVisible();
        expect(screen.getByText('Compra de Recurso')).toBeVisible();
        expect(screen.getByText('29/11/2023')).toBeVisible(); // Date format based on pt-BR locale
        expect(screen.getByText('+ R$ 100,00')).toBeVisible();
        expect(screen.getByText('- 50,00 Moedas')).toBeVisible();
      });
    });

    it('should navigate back when back button is pressed', async () => {
      jest.spyOn(MoedaService, 'getTransacoes').mockResolvedValueOnce([]); // Mock to avoid loading issues
      render(<ExtratoScreen />);
      await waitFor(() => expect(screen.getByTestId('HeaderBackButton')).toBeVisible());
      fireEvent.press(screen.getByTestId('HeaderBackButton'));
      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('FluxoCaixaScreen', () => {
    beforeEach(() => {
        jest.spyOn(MoedaService, 'getCarteira').mockResolvedValue(mockCarteira);
        jest.spyOn(MoedaService, 'getTransacoes').mockResolvedValue(mockTransacoes);
    });

    it('should display loading indicator initially', () => {
        jest.spyOn(MoedaService, 'getCarteira').mockReturnValueOnce(new Promise(() => {}));
        jest.spyOn(MoedaService, 'getTransacoes').mockReturnValueOnce(new Promise(() => {}));
        render(<FluxoCaixaScreen />);
        expect(screen.getByText('Carregando dados da carteira...')).toBeVisible();
    });

    it('should display error message if fetching data fails', async () => {
        jest.spyOn(MoedaService, 'getCarteira').mockRejectedValueOnce(new Error('Network Error'));
        render(<FluxoCaixaScreen />);
        await waitFor(() => expect(screen.getByText('Network Error')).toBeVisible());
        expect(screen.getByText('Tente novamente mais tarde.')).toBeVisible();
    });

    it('should display wallet balances and recent activity', async () => {
      render(<FluxoCaixaScreen />);
      await waitFor(() => {
        expect(screen.getByText('Fluxo de Caixa e Moedas')).toBeVisible();
        expect(screen.getByText('Saldo em Reais (R$)')).toBeVisible();
        expect(screen.getByText('R$ 1500,75')).toBeVisible();
        expect(screen.getByText('Saldo de Moedas (App)')).toBeVisible();
        expect(screen.getByText('250 Moedas')).toBeVisible();
        expect(screen.getByText('Atividade Recente')).toBeVisible();
        expect(screen.getByText('Venda de Produto')).toBeVisible();
        expect(screen.getByText('Compra de Recurso')).toBeVisible();
      });
    });

    it('should navigate to ExtratoScreen when "Ver Extrato Completo" button is pressed', async () => {
      render(<FluxoCaixaScreen />);
      await waitFor(() => expect(screen.getByText('Ver Extrato Completo')).toBeVisible());
      fireEvent.press(screen.getByTestId('ButtonGeneric-Ver Extrato Completo'));
      expect(mockNavigate).toHaveBeenCalledWith('EXTRATO');
    });

    it('should log "Copiar Pix" when the button is pressed', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      render(<FluxoCaixaScreen />);
      await waitFor(() => expect(screen.getByText('Copiar Código Pix')).toBeVisible());
      fireEvent.press(screen.getByTestId('ButtonGeneric-Copiar Código Pix'));
      expect(consoleSpy).toHaveBeenCalledWith('Copiar Pix');
    });

    it('should display "Nenhuma atividade recente encontrada." when no transactions', async () => {
      jest.spyOn(MoedaService, 'getTransacoes').mockResolvedValueOnce([]);
      render(<FluxoCaixaScreen />);
      await waitFor(() => {
        expect(screen.getByText('Nenhuma atividade recente encontrada.')).toBeVisible();
      });
    });

  });
});
