import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateProduto from '../views/home/produtos/createproduto';
import ProdutoScreem from '../views/home/produtos/viewproduto'; // Import the component to be tested
import { createProduto } from '@/src/services/produto'; // Import the mocked createProduto

// Mocking dependencies
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: jest.fn(),
      navigate: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    useFocusEffect: jest.fn((callback) => {
      // Simulate the effect of useFocusEffect running once when the component "mounts"
      // in the test.
      // We wrap it in a setTimeout to allow the initial render cycle to complete.
      setTimeout(() => callback(), 0);
    }),
  };
});

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true })),
}));

// Mock the services/produto module
jest.mock('@/src/services/produto', () => ({
    createProduto: jest.fn(() => Promise.resolve()),
    patchProduto: jest.fn(() => Promise.resolve()),
    deleteProduto: jest.fn(() => Promise.resolve()),
    getProdutosAnalytics: jest.fn(() => Promise.resolve({ // Mock analytics
      total_produtos: 4,
      estoque_baixo: 0,
      produto_mais_vendido: { nome: 'Bolo red velvet' }
    })),
    getProdutos: jest.fn(() => Promise.resolve([
        { id: '1', results: { nome: 'Bolo red velvet', valor: 25.00, categoria: 'Doces', quantidade: 10, imagem: 'image1.jpg', descricao: 'Delicioso bolo' } },
        { id: '2', results: { nome: 'Bolo de cenoura', valor: 20.00, categoria: 'Doces', quantidade: 15, imagem: 'image2.jpg', descricao: 'Bolo fofinho' } },
        { id: '3', results: { nome: 'Pão de queijo', valor: 5.00, categoria: 'Salgados', quantidade: 50, imagem: 'image3.jpg', descricao: 'Tradicional pão de queijo' } },
        { id: '4', results: { nome: 'Torta de limão', valor: 30.00, categoria: 'Doces', quantidade: 8, imagem: 'image4.jpg', descricao: 'Torta azedinha' } },
    ])),
  }));
  

describe('US007 - Product Management Screen', () => {
  // Clear all mocks before each test to ensure a clean state
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('MUN-147 TC003 - Deve incrementar a quantidade de 0 para 1 ao clicar no botão de incremento', () => {
    const { getByText } = render(<CreateProduto />);

    const quantityDisplay = getByText('0');
    expect(quantityDisplay).toBeTruthy();

    const incrementButton = getByText('+');
    fireEvent.press(incrementButton);

    const updatedQuantityDisplay = getByText('1');
    expect(updatedQuantityDisplay).toBeTruthy();
  });

  it('MUN-147 TC004 - Não deve decrementar a quantidade abaixo de 0 ao clicar no botão de decremento quando o valor é 0', () => {
    const { getByText } = render(<CreateProduto />);

    const quantityDisplay = getByText('0');
    expect(quantityDisplay).toBeTruthy();

    const decrementButton = getByText('-');
    fireEvent.press(decrementButton);

    const updatedQuantityDisplay = getByText('0'); // Should remain 0
    expect(updatedQuantityDisplay).toBeTruthy();
  });

  // New test case for MUN-147 TC009
  it('MUN-147 TC009 - Somente produtos com "Bolo" no nome devem ser exibidos ao pesquisar por "Bolo"', async () => {
    const { getByTestId, queryByTestId } = render(<ProdutoScreem />);

    // Wait for the component to finish loading data
    await waitFor(() => expect(getByTestId('product-name-1')).toBeTruthy());

    const searchInput = getByTestId('search-input');
    fireEvent.changeText(searchInput, 'Bolo');

    // Assert that products containing "Bolo" are visible
    expect(getByTestId('product-name-1')).toBeTruthy(); // Bolo red velvet
    expect(getByTestId('product-name-2')).toBeTruthy(); // Bolo de cenoura

    // Assert that products NOT containing "Bolo" are NOT visible
    expect(queryByTestId('product-name-3')).toBeNull(); // Pão de queijo
    expect(queryByTestId('product-name-4')).toBeNull(); // Torta de limão
  });

  // New test case for MUN-147 TC010
  it('MUN-147 TC010 - Busca de Produto - Não Encontrado', async () => {
    const { getByTestId, queryByTestId } = render(<ProdutoScreem />);

    // Wait for the component to finish loading data
    await waitFor(() => expect(getByTestId('product-name-1')).toBeTruthy());

    const searchInput = getByTestId('search-input');
    fireEvent.changeText(searchInput, 'Produto Inexistente');

    // Assert that none of the products are visible
    expect(queryByTestId('product-name-1')).toBeNull();
    expect(queryByTestId('product-name-2')).toBeNull();
    expect(queryByTestId('product-name-3')).toBeNull();
    expect(queryByTestId('product-name-4')).toBeNull();

    // If there was a "no products found" message, we would assert its presence here.
    // For now, we just assert that the product list is empty.
  });

  // New test case for MUN-147 TC015
  it('MUN-147 TC015 - Validação de Descrição - Campo Obrigatório (Campo vazio deve ser aceito)', async () => {
    const { getByTestId } = render(<CreateProduto />);
    const mockNavigation = require('@react-navigation/native').useNavigation();

    // Fill in required fields
    fireEvent.changeText(getByTestId('name-input'), 'Produto Teste');
    fireEvent.changeText(getByTestId('price-input'), '10.50');
    // For quantity, we need to interact with the stepper or directly call handleChange if possible.
    // For simplicity, we'll assume the default quantity of 0 is incremented once.
    const quantityStepper = getByTestId('quantity-stepper');
    // Assuming Stepper calls onChange with the new value
    fireEvent(quantityStepper, 'onChange', 1);


    // Leave description empty (default state)
    const descriptionInput = getByTestId('description-input');
    expect(descriptionInput.props.value).toBe('');

    // Press save button
    const saveButton = getByTestId('save-product-button');
    fireEvent.press(saveButton);

    // Expect createProduto to be called, indicating successful submission
    await waitFor(() => {
      expect(createProduto).toHaveBeenCalledTimes(1);
    });

    // Also expect navigation.goBack() to be called on success
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });
});