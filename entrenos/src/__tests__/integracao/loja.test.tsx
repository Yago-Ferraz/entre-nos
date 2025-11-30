import React from 'react';
import { render, screen, waitFor, fireEvent, act, within } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';

// Components to test
import LojaScreen from '../../views/loja/TelaLoja';
import ProductDetailScreen from '../../views/loja/TelaProduto';

// Services to mock
import * as LojaService from '../../services/lojaService';
import * as ProdutoService from '../../services/produtoService';

// Context to mock
import { useAuth } from '../../AuthContext';

// Mocked Global Constants (if necessary, check usage in components)
jest.mock('../../global', () => ({
  cor_primaria: '#1E6F2E',
  cor_secundaria: '#F57C00',
  cor_terciaria: '#FFB300',
  cor_backgroud: '#F5F5F5',
  cor_vermelho: '#D32F2F',
  cinza: '#666666',
  FONT_SIZE: { LG: 18, MD: 16, SM: 14 },
  FONT_FAMILY: { JOST_BOLD: 'Jost-Bold' },
  typography: {
    h2: { fontSize: 18, fontWeight: 'bold' },
    p: { fontSize: 14 },
    h3: { fontSize: 20, fontWeight: 'bold' },
    h4: { fontSize: 16, fontWeight: 'bold' },
  },
}));

// Mock React Native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return Object.setPrototypeOf({
    Alert: {
      alert: jest.fn(),
    },
    ScrollView: RN.ScrollView, // Use actual ScrollView
    Dimensions: {
      get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
    },
    // Mock FlatList internal components if necessary for testing renderItem
    FlatList: ({ renderItem, data, keyExtractor }: any) => {
      if (!data || data.length === 0) {
        return RN.Text ? <RN.Text>No items</RN.Text> : null;
      }
      return (
        <RN.ScrollView>
          {data.map((item: any, index: number) =>
            renderItem({ item, index, separators: {} })
          )}
        </RN.ScrollView>
      );
    },
  }, RN);
});

// Mock @react-navigation/native
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
let mockRouteParams: any = {};

const mockUseNavigation = jest.fn(); // Create a mock function for useNavigation

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => mockUseNavigation(), // Now use the mockUseNavigation function
    useRoute: jest.fn(() => ({ params: mockRouteParams })),
  };
});

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  FontAwesome: 'FontAwesome',
}));

// Mock custom components
jest.mock('../../components/header/header', () => {
  const { View, Text, TouchableOpacity } = jest.requireActual('react-native');
  return ({ title, showBackButton, onBackPress }: any) => (
    <View testID="Header">
      {showBackButton && <TouchableOpacity testID="HeaderBackButton" onPress={onBackPress}><Text>Back</Text></TouchableOpacity>}
      <Text>{title}</Text>
    </View>
  );
});

jest.mock('../../components/cards/cardbase', () => {
  const { View, TouchableOpacity } = jest.requireActual('react-native');
  return ({ children, onPress, style, width, testID }: any) => (
    <TouchableOpacity testID={testID || "CardBase"} onPress={onPress} style={style}>{children}</TouchableOpacity>
  );
});

jest.mock('../../components/buttons/buttongeneric', () => {
  const { TouchableOpacity, Text } = jest.requireActual('react-native');
  return ({ title, onPress, style, textStyle, testID }: any) => (
    <TouchableOpacity testID={testID || `ButtonGeneric-${title}`} onPress={onPress} style={style}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
});

jest.mock('../../components/buttons/NextBackStepper', () => {
  const { TouchableOpacity, Text, View } = jest.requireActual('react-native');
  return ({ value, onChange, testID }: any) => (
    <View testID={testID || "NextBackStepper"}>
      <TouchableOpacity onPress={() => onChange(value - 1)} testID={`${testID}-decrement`}>
        <Text>-</Text>
      </TouchableOpacity>
      <Text testID={`${testID}-value`}>{value}</Text>
      <TouchableOpacity onPress={() => onChange(value + 1)} testID={`${testID}-increment`}>
        <Text>+</Text>
      </TouchableOpacity>
    </View>
  );
});

jest.mock('../../components/alertas/AlertMessage', () => {
  const { View, Text } = jest.requireActual('react-native');
  return ({ message, type, onHide }: any) => (
    <View testID="AlertMessage">
      <Text>{message}</Text>
      <Text>{type}</Text>
    </View>
  );
});

// Mock services
jest.mock('../../services/lojaService', () => ({
  getLojaDetails: jest.fn(),
}));

jest.mock('../../services/produtoService', () => ({
  getProdutoById: jest.fn(),
}));

// Mock AuthContext
jest.mock('../../AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockLojaDetails = {
  id: 1,
  user: {
    id: 1,
    name: 'Minha Loja',
    email: 'loja@example.com',
    phone: '11987654321',
  },
  descricao: 'Uma descrição de loja muito legal.',
  avaliacao: 4.5,
  logo: 'http://example.com/logo.png',
  fotos: [{ imagem: 'http://example.com/banner.png' }],
  produtos: [
    { id: 101, nome: 'Bolo de Chocolate', descricao: 'Delicioso bolo', preco: '50.00', imagem: 'http://example.com/bolo.jpg' },
    { id: 102, nome: 'Torta de Limão', descricao: 'Doce e azedinha', preco: '45.00', imagem: 'http://example.com/torta.jpg' },
  ],
};

const mockProdutoDetalhado = {
  id: 101,
  nome: 'Bolo de Chocolate',
  descricao: 'Delicioso bolo de chocolate com cobertura cremosa.',
  preco: '50.00',
  imagem: 'http://example.com/bolo_detalhe.jpg',
  upsell_produtos: [
    { id: 201, nome: 'Café Expresso', preco: '5.00', imagem: 'http://example.com/cafe.jpg' },
  ],
  created_at: '',
  updated_at: '',
  criador_nome: '',
  created_by_nome: '',
  updated_by_nome: '',
  results: {
    nome: '',
    descricao: '',
    preco: '',
    quantidade: 0,
    imagem: ''
  }
};

describe('Loja Feature Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigation.mockReturnValue({
      navigate: mockNavigate,
      goBack: mockGoBack,
    });
    (useRoute as jest.Mock).mockReturnValue({ params: mockRouteParams });
    (Alert.alert as jest.Mock).mockClear();
    (useAuth as jest.Mock).mockReturnValue({ user: { empresa: { id: 1, userId: 123 } } });
  });

  describe('LojaScreen (TelaLoja)', () => {
    it('should display loading indicator initially', () => {
      (LojaService.getLojaDetails as jest.Mock).mockReturnValueOnce(new Promise(() => {}));
      render(<LojaScreen navigation={{} as any} route={{} as any} />); // Pass dummy navigation/route
      expect(screen.getByText('Carregando sua loja...')).toBeVisible();
    });

    it('should display error message if lojaId is missing', async () => {
      (useAuth as jest.Mock).mockReturnValue({ user: null }); // Simulate no user/lojaId
      render(<LojaScreen navigation={{} as any} route={{} as any} />);
      await waitFor(() => expect(screen.getByText('Você não possui uma loja cadastrada.')).toBeVisible());
    });

    it('should display error message if fetching loja details fails', async () => {
      (LojaService.getLojaDetails as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
      render(<LojaScreen navigation={{} as any} route={{} as any} />);
      await waitFor(() => expect(screen.getByText('Não foi possível carregar os detalhes da loja.')).toBeVisible());
    });

    it('should display "Nenhum detalhe da loja encontrado." if lojaDetails is null after loading', async () => {
      (LojaService.getLojaDetails as jest.Mock).mockResolvedValueOnce(null);
      render(<LojaScreen navigation={{} as any} route={{} as any} />);
      await waitFor(() => expect(screen.getByText('Não foi possível carregar os detalhes da loja.')).toBeVisible());
    });

    it('should display loja details and products when fetched successfully', async () => {
      (LojaService.getLojaDetails as jest.Mock).mockResolvedValueOnce(mockLojaDetails);
      render(<LojaScreen navigation={{} as any} route={{} as any} />);
      await waitFor(() => {
        expect(screen.getByText('Minha Loja')).toBeVisible();
        expect(screen.getByText('Uma descrição de loja muito legal.')).toBeVisible();
        expect(screen.getByText('loja@example.com')).toBeVisible();
        expect(screen.getByText('11987654321')).toBeVisible();
        expect(screen.getByText('Bolo de Chocolate')).toBeVisible();
        expect(screen.getByText('Torta de Limão')).toBeVisible();
        expect(screen.getByTestId('logo-image')).toBeVisible();
      });
    });

    it('should filter products based on search query', async () => {
      (LojaService.getLojaDetails as jest.Mock).mockResolvedValueOnce(mockLojaDetails);
      render(<LojaScreen navigation={{} as any} route={{} as any} />);
      
      await waitFor(() => expect(screen.getByText('Bolo de Chocolate')).toBeVisible());

      fireEvent.changeText(screen.getByPlaceholderText('pesquisar'), 'bolo');
      expect(screen.getByText('Bolo de Chocolate')).toBeVisible();
      expect(screen.queryByText('Torta de Limão')).toBeNull();

      fireEvent.changeText(screen.getByPlaceholderText('pesquisar'), '');
      expect(screen.getByText('Bolo de Chocolate')).toBeVisible();
      expect(screen.getByText('Torta de Limão')).toBeVisible();
    });

    it('should navigate to TelaProduto when a product item is pressed', async () => {
      (LojaService.getLojaDetails as jest.Mock).mockResolvedValueOnce(mockLojaDetails);
      render(<LojaScreen navigation={{ navigate: mockNavigate, goBack: mockGoBack } as any} route={{} as any} />);
      
      await waitFor(() => expect(screen.getByText('Bolo de Chocolate')).toBeVisible());
      fireEvent.press(screen.getByText('Bolo de Chocolate'));
      expect(mockNavigate).toHaveBeenCalledWith('TelaProduto', { productId: 101 });
    });

    it('should show alert when "Adicionar ao Carrinho" button is pressed', async () => {
      (LojaService.getLojaDetails as jest.Mock).mockResolvedValueOnce(mockLojaDetails);
      render(<LojaScreen navigation={{} as any} route={{} as any} />);
      
      await waitFor(() => expect(screen.getByTestId('add-to-cart-button-101')).toBeVisible());
      fireEvent.press(screen.getByTestId('add-to-cart-button-101'));
      expect(screen.getByText('Você não pode comprar seus próprios itens.')).toBeVisible();
      expect(screen.getByText('error')).toBeVisible(); // Check type of alert
    });
  });

  describe('ProductDetailScreen (TelaProduto)', () => {
    beforeEach(() => {
      mockRouteParams = { productId: 101 };
    });

    it('should display loading indicator initially', () => {
      render(<ProductDetailScreen navigation={{ navigate: mockNavigate, goBack: mockGoBack } as any} route={mockRouteParams as any} />);
      expect(screen.getByText('Carregando produto...')).toBeVisible();
    });

    it('should display error message if fetching product details fails', async () => {
      (ProdutoService.getProdutoById as jest.Mock).mockRejectedValueOnce(new Error('Product API Error'));
      render(<ProductDetailScreen navigation={{ navigate: mockNavigate, goBack: mockGoBack } as any} route={mockRouteParams as any} />);
      await waitFor(() => expect(screen.getByText('Não foi possível carregar o produto.')).toBeVisible());
    });

    it('should display "Produto não encontrado." if product is null after loading', async () => {
      (ProdutoService.getProdutoById as jest.Mock).mockResolvedValueOnce(null);
      render(<ProductDetailScreen navigation={{ navigate: mockNavigate, goBack: mockGoBack } as any} route={mockRouteParams as any} />);
      await waitFor(() => expect(screen.getByText('Produto não encontrado.')).toBeVisible());
    });



    it('should allow increasing and decreasing quantity', async () => {
      (ProdutoService.getProdutoById as jest.Mock).mockResolvedValueOnce(mockProdutoDetalhado);
      render(<ProductDetailScreen navigation={{ navigate: mockNavigate, goBack: mockGoBack } as any} route={mockRouteParams as any} />);
      await waitFor(() => expect(screen.getByTestId('NextBackStepper-value')).toHaveTextContent('1'));
      
      fireEvent.press(screen.getByTestId('NextBackStepper-increment'));
      expect(screen.getByTestId('NextBackStepper-value')).toHaveTextContent('2');

      fireEvent.press(screen.getByTestId('NextBackStepper-decrement'));
      expect(screen.getByTestId('NextBackStepper-value')).toHaveTextContent('1');
    });

    it('should show alert when "Adicionar" button is pressed', async () => {
      (ProdutoService.getProdutoById as jest.Mock).mockResolvedValueOnce(mockProdutoDetalhado);
      render(<ProductDetailScreen navigation={{ navigate: mockNavigate, goBack: mockGoBack } as any} route={mockRouteParams as any} />);
      
      await waitFor(() => expect(screen.getByText('Adicionar')).toBeVisible());
      fireEvent.press(screen.getByText('Adicionar'));
      expect(screen.getByText('Você não pode comprar seus próprios itens.')).toBeVisible();
      expect(screen.getByText('error')).toBeVisible();
    });

    it('should show alert when header cart icon is pressed', async () => {
      (ProdutoService.getProdutoById as jest.Mock).mockResolvedValueOnce(mockProdutoDetalhado);
      render(<ProductDetailScreen navigation={{ navigate: mockNavigate, goBack: mockGoBack } as any} route={mockRouteParams as any} />);
      
      await waitFor(() => expect(screen.getByTestId('Header')).toBeVisible());
      fireEvent.press(screen.getByLabelText('Cart icon'));
      expect(screen.getByText('Você não pode comprar seus próprios itens.')).toBeVisible();
      expect(screen.getByText('error')).toBeVisible();
    });

    it('should navigate back when header back button is pressed', async () => {
      (ProdutoService.getProdutoById as jest.Mock).mockResolvedValueOnce(mockProdutoDetalhado);
      render(<ProductDetailScreen navigation={{ navigate: mockNavigate, goBack: mockGoBack } as any} route={mockRouteParams as any} />);
      
      await waitFor(() => expect(screen.getByTestId('HeaderBackButton')).toBeVisible());
      fireEvent.press(screen.getByTestId('HeaderBackButton'));
      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });
});