import axios, { AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react-native'; // Import 'act'
import { createProduto, getProdutos, getProdutosAnalytics, patchProduto, deleteProduto } from '../../services/produto';
import { ProdutoPayload, Produto, ProdutoDetalhado, UpsellProduto } from '../../types/produto';
import { API_AUTH } from '../../services/api';

// Import the actual components to be tested
import CreateProduto from '../../views/home/produtos/createproduto';
import ProdutoScreem from '../../views/home/produtos/viewproduto';

import * as ProdutoService from '../../services/produtoService'; // Keep if still used by components, otherwise remove.


// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({ token: 'fake-token' }))),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Mock @react-navigation/native
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockSetParams = jest.fn(); // Mock setParams as well
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: jest.fn(),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    setParams: mockSetParams,
  }),
  useFocusEffect: jest.fn((cb) => cb()), // Mock useFocusEffect to execute callback immediately
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock custom components to simplify testing
jest.mock('../../components/cards/cardbase', () => {
  const { View } = jest.requireActual('react-native');
  return ({ children }: any) => <View testID="CardBase">{children}</View>;
});
jest.mock('../../components/buttons/buttongeneric', () => {
  const { TouchableOpacity, Text } = jest.requireActual('react-native');
  return ({ title, onPress, style, width, leftIcon }: any) => (
    <TouchableOpacity testID={`ButtonGeneric-${title}`} onPress={onPress} style={style}>
      {leftIcon}
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});
jest.mock('../../components/header/header', () => {
  const { View, Text, TouchableOpacity } = jest.requireActual('react-native');
  return ({ title, showBackButton, onBackPress }: any) => (
    <View testID="Header">
      {showBackButton && <TouchableOpacity testID="HeaderBackButton" onPress={onBackPress}><Text>Back</Text></TouchableOpacity>}
      <Text>{title}</Text>
    </View>
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
    </View>
  );
});

jest.mock('../../components/customInput/customInput', () => {
  const { View, Text, TextInput } = jest.requireActual('react-native');
  return ({ label, placeholder, value, onChangeText, testID, keyboardType }: any) => (
    <View testID={`CustomInput-${testID}`}>
      {label && <Text>{label}</Text>}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        testID={testID}
        keyboardType={keyboardType}
      />
    </View>
  );
});

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons', // Mocking the component itself
  default: 'Icon', // For FontAwesome or other icon libraries
}));

// Mock react-native-vector-icons/FontAwesome (used in viewproduto)
jest.mock('react-native-vector-icons/FontAwesome', () => ({
  __esModule: true,
  default: 'FontAwesome', // Mocking the default export
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: 'file://mock/path/to/image.jpg' }],
    })
  ),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

describe('Product Service', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(API_AUTH); // Use API_AUTH here
  });

  afterEach(() => {
    mock.reset(); // Reset mocks after each test
  });

  afterAll(() => {
    mock.restore(); // Restore axios to its original state
  });

  it('should be able to create a product', async () => {
    const newProductPayload: ProdutoPayload = {
      nome: 'Test Product',
      descricao: 'This is a test product',
      preco: 100,
      quantidade: 10,
      imagem: 'https://example.com/image.jpg',
    };
    const createdProduct: Produto = {
      id: 1,
      created_at: '2023-01-01T10:00:00Z',
      updated_at: '2023-01-01T10:00:00Z',
      criador_nome: 'Test User',
      created_by_nome: 'Test User',
      updated_by_nome: 'Test User',
      results: {
        nome: 'Test Product',
        descricao: 'This is a test product',
        preco: '100',
        quantidade: 10,
        imagem: 'https://example.com/image.jpg',
      },
    };

    mock.onPost('/produtos/').reply(201, createdProduct);

    const result = await createProduto(newProductPayload);
    expect(result).toEqual(createdProduct);
  });

  it('should handle error when creating a product', async () => {
    const newProductPayload: ProdutoPayload = {
      nome: 'Test Product',
      descricao: 'This is a test product',
      preco: 100,
      quantidade: 10,
      imagem: 'https://example.com/image.jpg',
    };

    mock.onPost('/produtos/').reply(400, { message: 'Bad Request' });

    await expect(createProduto(newProductPayload)).rejects.toThrow();
  });

  it('should be able to create a product with an image (multipart)', async () => {
    const newProductPayload: ProdutoPayload = {
      nome: 'Product with Image',
      descricao: 'This product has an image',
      preco: 200,
      quantidade: 5,
      imagem: 'file://path/to/image.jpg',
    };

    const formData = new FormData();
    formData.append('nome', newProductPayload.nome);
    formData.append('descricao', newProductPayload.descricao);
    formData.append('preco', newProductPayload.preco.toString());
    formData.append('quantidade', newProductPayload.quantidade.toString());
    formData.append('imagem', {
      uri: newProductPayload.imagem,
      name: 'image.jpg',
      type: 'image/jpeg',
    } as any);

    const createdProduct: Produto = {
      id: 2,
      created_at: '2023-01-01T11:00:00Z',
      updated_at: '2023-01-01T11:00:00Z',
      criador_nome: 'Test User',
      created_by_nome: 'Test User',
      updated_by_nome: 'Test User',
      results: {
        nome: 'Product with Image',
        descricao: 'This product has an image',
        preco: '200',
        quantidade: 5,
        imagem: 'https://example.com/uploaded_image.jpg',
      },
    };

    mock.onPost('/produtos/').reply((config: AxiosRequestConfig) => {
      // Basic check for form data
      if (config.headers?.['Content-Type']?.includes('multipart/form-data')) {
        return [201, createdProduct];
      }
      return [400, { message: 'Invalid Content-Type' }];
    });

    const result = await createProduto(formData, true);
    expect(result).toEqual(createdProduct);
  });

  it('should get a list of products', async () => {
    const products: Produto[] = [
      {
        id: 1,
        created_at: '2023-01-01T10:00:00Z',
        updated_at: '2023-01-01T10:00:00Z',
        criador_nome: 'Test User',
        created_by_nome: 'Test User',
        updated_by_nome: 'Test User',
        results: {
          nome: 'Test Product 1',
          descricao: 'Desc 1',
          preco: '100',
          quantidade: 10,
          imagem: 'image1.jpg',
        },
      },
      {
        id: 2,
        created_at: '2023-01-01T11:00:00Z',
        updated_at: '2023-01-01T11:00:00Z',
        criador_nome: 'Test User',
        created_by_nome: 'Test User',
        updated_by_nome: 'Test User',
        results: {
          nome: 'Test Product 2',
          descricao: 'Desc 2',
          preco: '200',
          quantidade: 20,
          imagem: 'image2.jpg',
        },
      },
    ];

    mock.onGet('/produtos/').reply(200, products);

    const result = await getProdutos();
    expect(result).toEqual(products);
  });

  it('should get product analytics', async () => {
    const analytics = {
      total_products: 5,
      total_value: 1500.50,
      average_price: 300.10,
    };

    mock.onGet('/produtos/analytics/').reply(200, analytics);

    const result = await getProdutosAnalytics();
    expect(result).toEqual(analytics);
  });

  it('should be able to update a product', async () => {
    const productId = 1;
    const updatedProductPayload = {
      nome: 'Updated Product Name',
      preco: 150,
    };
    const updatedProduct: Produto = {
      id: productId,
      created_at: '2023-01-01T10:00:00Z',
      updated_at: '2023-01-01T12:00:00Z',
      criador_nome: 'Test User',
      created_by_nome: 'Test User',
      updated_by_nome: 'Test User',
      results: {
        nome: 'Updated Product Name',
        descricao: 'This is a test product',
        preco: '150',
        quantidade: 10,
        imagem: 'https://example.com/image.jpg',
      },
    };

    mock.onPatch(`/produtos/${productId}/`).reply(200, updatedProduct);

    const result = await patchProduto(productId, updatedProductPayload);
    expect(result).toEqual(updatedProduct);
  });

  it('should be able to update a product with an image', async () => {
    const productId = 1;
    const updatedProductPayload = {
      nome: 'Updated Product Name with Image',
      imagem: 'file://path/to/new_image.png',
    };
    const updatedProduct: Produto = {
      id: productId,
      created_at: '2023-01-01T10:00:00Z',
      updated_at: '2023-01-01T13:00:00Z',
      criador_nome: 'Test User',
      created_by_nome: 'Test User',
      updated_by_nome: 'Test User',
      results: {
        nome: 'Updated Product Name with Image',
        descricao: 'This is a test product',
        preco: '100',
        quantidade: 10,
        imagem: 'https://example.com/new_image.png',
      },
    };

    mock.onPatch(`/produtos/${productId}/`).reply((config: AxiosRequestConfig) => {
      if (config.headers?.['Content-Type']?.includes('multipart/form-data')) {
        return [200, updatedProduct];
      }
      return [400, { message: 'Invalid Content-Type' }];
    });

    const result = await patchProduto(productId, updatedProductPayload);
    expect(result).toEqual(updatedProduct);
  });


  it('should handle error when updating a product', async () => {
    const productId = 999;
    const updatedProductPayload = {
      nome: 'Updated Product Name',
    };

    mock.onPatch(`/produtos/${productId}/`).reply(404, { message: 'Product not found' });

    await expect(patchProduto(productId, updatedProductPayload)).rejects.toThrow();
  });

  it('should be able to delete a product', async () => {
    const productId = 1;

    mock.onDelete(`/produtos/${productId}/`).reply(204); // No content for successful delete

    const result = await deleteProduto(productId);
    expect(result).toBeUndefined(); // Assuming no data is returned on successful delete
  });

  it('should handle error when deleting a product', async () => {
    const productId = 999;

    mock.onDelete(`/produtos/${productId}/`).reply(404, { message: 'Product not found' });

    await expect(deleteProduto(productId)).rejects.toThrow();
  });

});



describe('CreateProduto Screen', () => {
    const mockProduct: Produto = {
        id: 1,
        created_at: '2023-01-01T10:00:00Z',
        updated_at: '2023-01-01T10:00:00Z',
        criador_nome: 'Test User',
        created_by_nome: 'Test User',
        updated_by_nome: 'Test User',
        results: {
            nome: 'Existing Product',
            descricao: 'Existing Description',
            preco: '50.00',
            quantidade: 5,
            imagem: 'https://example.com/existing.jpg',
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset useRoute mock for each test
        (require('@react-navigation/native').useRoute as jest.Mock).mockReturnValue({ params: {} });
    });

    // Removed the "should render the mocked component" test as it's now redundant.

    it('should render correctly in create mode', async () => {
        render(<CreateProduto />);

        expect(screen.getByText('Produto')).toBeVisible();
        expect(screen.getByTestId('name-input')).toBeVisible();
        expect(screen.getByTestId('description-input')).toBeVisible();
        expect(screen.getByTestId('quantity-stepper')).toBeVisible();
        expect(screen.getByTestId('price-input')).toBeVisible();
        expect(screen.getByTestId('save-product-button')).toBeVisible();
        expect(screen.queryByText('Excluir')).toBeNull(); // Delete button should not be visible
    });

    it('should render correctly in edit mode', async () => {
        (require('@react-navigation/native').useRoute as jest.Mock).mockReturnValue({
            params: { produto: mockProduct },
        });

        render(<CreateProduto />);

        expect(screen.getByText('Produto')).toBeVisible();
        expect(screen.getByDisplayValue('Existing Product')).toBeVisible();
        expect(screen.getByDisplayValue('Existing Description')).toBeVisible();
        expect(screen.getByDisplayValue('5')).toBeVisible(); // Quantity
        expect(screen.getByDisplayValue('50.00')).toBeVisible(); // Price

        expect(screen.getByTestId('ButtonGeneric-Salvar')).toBeVisible();
        expect(screen.getByTestId('ButtonGeneric-Excluir')).toBeVisible();
        expect(screen.queryByTestId('save-product-button')).toBeNull(); // Create button should not be visible
    });

    it('should allow inputting new product data and call createProduto', async () => {
        const createProdutoSpy = jest.spyOn(require('../../services/produto'), 'createProduto');
        createProdutoSpy.mockResolvedValueOnce({});

        render(<CreateProduto />);

        fireEvent.changeText(screen.getByTestId('name-input'), 'New Product Name');
        fireEvent.changeText(screen.getByTestId('description-input'), 'New Product Description');
        fireEvent.changeText(screen.getByTestId('price-input'), '120.50');
        
        const quantityStepperIncrement = screen.getByTestId('quantity-stepper-increment');
        fireEvent.press(quantityStepperIncrement); // quantity = 1
        fireEvent.press(quantityStepperIncrement); // quantity = 2

        fireEvent.press(screen.getByText('Clique para adicionar uma foto'));
        await waitFor(() => expect(require('expo-image-picker').launchImageLibraryAsync).toHaveBeenCalled());

        fireEvent.press(screen.getByTestId('save-product-button'));

        await waitFor(() => {
            expect(createProdutoSpy).toHaveBeenCalledWith(expect.any(FormData), true);
        });
        expect(screen.getByText('Produto criado com sucesso!')).toBeVisible();
        expect(mockGoBack).toHaveBeenCalled();
    });

    it('should handle product creation error', async () => {
        const createProdutoSpy = jest.spyOn(require('../../services/produto'), 'createProduto');
        createProdutoSpy.mockRejectedValueOnce(new Error('Failed to create'));

        render(<CreateProduto />);

        fireEvent.changeText(screen.getByTestId('name-input'), 'New Product Name');
        fireEvent.changeText(screen.getByTestId('description-input'), 'New Product Description');
        fireEvent.changeText(screen.getByTestId('price-input'), '120.50');
        fireEvent.press(screen.getByTestId('quantity-stepper-increment'));

        fireEvent.press(screen.getByTestId('save-product-button'));

        await waitFor(() => {
            expect(createProdutoSpy).toHaveBeenCalled();
            expect(screen.getByText('Não foi possível criar o produto.')).toBeVisible();
        });
    });

    it('should update product data and call patchProduto', async () => {
        (require('@react-navigation/native').useRoute as jest.Mock).mockReturnValue({
            params: { produto: mockProduct },
        });
        const patchProdutoSpy = jest.spyOn(require('../../services/produto'), 'patchProduto');
        patchProdutoSpy.mockResolvedValueOnce({});

        render(<CreateProduto />);

        fireEvent.changeText(screen.getByTestId('name-input'), 'Updated Product Name');
        fireEvent.changeText(screen.getByTestId('price-input'), '75.00');

        fireEvent.press(screen.getByTestId('ButtonGeneric-Salvar'));

        await waitFor(() => {
            expect(patchProdutoSpy).toHaveBeenCalledWith(
                mockProduct.id,
                expect.objectContaining({
                    nome: 'Updated Product Name',
                    preco: '75.00',
                })
            );
        });
        expect(mockGoBack).toHaveBeenCalled();
    });

    it('should delete product and call deleteProduto', async () => {
        (require('@react-navigation/native').useRoute as jest.Mock).mockReturnValue({
            params: { produto: mockProduct },
        });
        const deleteProdutoSpy = jest.spyOn(require('../../services/produto'), 'deleteProduto');
        deleteProdutoSpy.mockResolvedValueOnce({});

        render(<CreateProduto />);

        fireEvent.press(screen.getByTestId('ButtonGeneric-Excluir'));

        await waitFor(() => {
            expect(deleteProdutoSpy).toHaveBeenCalledWith(mockProduct.id);
        });
        expect(mockGoBack).toHaveBeenCalled();
    });
}); // Corrected closing brace



describe('ProdutoScreem Screen', () => {
  let mock: MockAdapter; // Declare local mock adapter for ProdutoScreem tests

  const mockProdutos: Produto[] = [
    {
      id: 1,
      created_at: '2023-01-01T10:00:00Z',
      updated_at: '2023-01-01T10:00:00Z',
      criador_nome: 'Test User',
      created_by_nome: 'Test User',
      updated_by_nome: 'Test User',
      results: {
        nome: 'Produto A',
        descricao: 'Descrição A',
        preco: '10.00',
        quantidade: 100,
        imagem: 'imageA.jpg',
      },
    },
    {
      id: 2,
      created_at: '2023-01-01T11:00:00Z',
      updated_at: '2023-01-01T11:00:00Z',
      criador_nome: 'Test User',
      created_by_nome: 'Test User',
      updated_by_nome: 'Test User',
      results: {
        nome: 'Produto B',
        descricao: 'Descrição B',
        preco: '20.00',
        quantidade: 50,
        imagem: 'imageB.jpg',
      },
    },
  ];

  const mockAnalytics = {
    total_produtos: 2,
    estoque_baixo: 0,
    produto_mais_vendido: null,
  };

  beforeAll(() => {
    mock = new MockAdapter(API_AUTH); // Initialize mock for ProdutoScreem tests
  });

  afterEach(() => {
    mock.reset(); // Reset mocks after each test
  });

  afterAll(() => {
    mock.restore(); // Restore axios to its original state
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mock.onGet('/produtos/').reply(200, mockProdutos);
    mock.onGet('/produtos/analytics/').reply(200, mockAnalytics);
  });

  it('should display loading indicator initially', async () => {
    mock.onGet('/produtos/').reply(200, new Promise(() => {})); // Never resolve
    mock.onGet('/produtos/analytics/').reply(200, new Promise(() => {})); // Never resolve

    render(<ProdutoScreem />);
    expect(screen.getByText('Carregando...')).toBeVisible();
  });

  it('should render analytics and product list after loading', async () => {
    render(<ProdutoScreem />);

    await waitFor(() => {
      expect(screen.getByText('Visão Geral')).toBeVisible();
      expect(screen.getByText('Total')).toBeVisible();
      expect(screen.getByText('2')).toBeVisible();
      expect(screen.getByText('Produto A')).toBeVisible();
      expect(screen.getByText('Produto B')).toBeVisible();
    });
  });

  it('should filter products based on search input', async () => {
    render(<ProdutoScreem />);

    await waitFor(() => expect(screen.getByText('Produto A')).toBeVisible());

    fireEvent.changeText(screen.getByTestId('search-input'), 'Produto A');
    expect(screen.getByText('Produto A')).toBeVisible();
    expect(screen.queryByText('Produto B')).toBeNull();

    fireEvent.changeText(screen.getByTestId('search-input'), 'NonExistent');
    expect(screen.queryByText('Produto A')).toBeNull();
    expect(screen.queryByText('Produto B')).toBeNull();
  });

  it('should navigate to CreateProduto screen when FAB is pressed', async () => {
    render(<ProdutoScreem />);

    await waitFor(() => expect(screen.getByText('Produtos')).toBeVisible()); // Wait for header

    fireEvent.press(screen.getByText('+')); // Press FAB

    expect(mockNavigate).toHaveBeenCalledWith('CREATEPRODUTO');
  });

  it('should navigate to CreateProduto screen with product details when product item is pressed', async () => {
    render(<ProdutoScreem />);

    await waitFor(() => expect(screen.getByText('Produto A')).toBeVisible());

    fireEvent.press(screen.getByText('Produto A'));

    expect(mockNavigate).toHaveBeenCalledWith('CREATEPRODUTO', { produto: mockProdutos[0] });
  });

  it('should call handleSummaryPress when summary card is pressed', async () => {
    const consoleSpy = jest.spyOn(console, 'log'); // Spy on console.log
    render(<ProdutoScreem />);

    await waitFor(() => expect(screen.getByText('Visão Geral')).toBeVisible());

    fireEvent.press(screen.getByText('Visão Geral'));
    expect(consoleSpy).toHaveBeenCalledWith('Clicou no resumo do estoque');
  });
});