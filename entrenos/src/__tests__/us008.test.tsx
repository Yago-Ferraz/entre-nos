import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import LojaScreen from '../views/loja/TelaLoja';
import { AuthContext } from '../AuthContext';
import { getLojaDetails } from '../services/lojaService';
import { LojaDetails } from '../types/loja';
import { User } from '../types/user';

// Mocking the services and native modules
jest.mock('../services/lojaService');

const mockGetLojaDetails = getLojaDetails as jest.Mock;

// Mock data
const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  name: 'Test User',
  usertype: 1,
  empresa: {
    id: 1,
    categoria: 1,
    descricao: 'Descrição da loja teste',
    logo: 'https://via.placeholder.com/150',
    user: 1,
    fotos: [],
  },
  token: 'test-token',
};

const mockLojaDetails: LojaDetails = {
  id: 1,
  user: {
    name: 'Loja Teste',
    email: 'loja@teste.com',
    phone: '123456789',
  },
  descricao: 'Descrição da loja teste',
  avaliacao: 4.5,
  fotos: [{ imagem: 'https://via.placeholder.com/400' }],
  produtos: [
    {
      id: 1,
      nome: 'Produto Teste',
      descricao: 'Descrição do produto teste',
      preco: '10.50',
      imagem: 'https://via.placeholder.com/150',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      quantidade: 10,
      created_by: 1,
      updated_by: 1,
    },
  ],
  logo: 'https://via.placeholder.com/150',
};

const mockLojaDetailsWithMultipleProducts: LojaDetails = {
    id: 1,
    user: {
      name: 'Loja Teste',
      email: 'loja@teste.com',
      phone: '123456789',
    },
    descricao: 'Descrição da loja teste',
    avaliacao: 4.5,
    fotos: [],
    produtos: [
      {
        id: 1,
        nome: 'Bolo de Chocolate',
        descricao: 'Delicioso bolo de chocolate',
        preco: '25.00',
        imagem: 'https://via.placeholder.com/150',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        quantidade: 10,
        created_by: 1,
        updated_by: 1,
      },
      {
        id: 2,
        nome: 'Bolo Red Velvet',
        descricao: 'Bolo vermelho com cobertura de cream cheese',
        preco: '35.00',
        imagem: 'https://via.placeholder.com/150',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        quantidade: 5,
        created_by: 1,
        updated_by: 1,
      },
      {
        id: 3,
        nome: 'Torta de Limão',
        descricao: '', // No description
        preco: '20.00',
        imagem: 'https://via.placeholder.com/150',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        quantidade: 15,
        created_by: 1,
        updated_by: 1,
      },
    ],
    logo: 'https://via.placeholder.com/150',
};


const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const mockRoute = {
  key: 'LojaScreen',
  name: 'TelaLoja' as const,
  params: { lojaId: 1 } 
};

// Componente de renderização helper
const renderComponent = (userOverride = mockUser, lojaDetailsOverride: LojaDetails | null = mockLojaDetails) => {
  if (lojaDetailsOverride) {
    mockGetLojaDetails.mockResolvedValue(lojaDetailsOverride);
  } else {
    mockGetLojaDetails.mockRejectedValue(new Error('Failed to fetch'));
  }

  return render(
    <AuthContext.Provider value={{ user: userOverride, setUser: jest.fn(), login: jest.fn(), logout: jest.fn() }}>
      <NavigationContainer>
        <LojaScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

describe('US008 - Renderização de dados da loja', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('TC001 - Deve renderizar os dados da loja corretamente', async () => {
    renderComponent();

    // Espera o loading sumir
    await waitFor(() => {
      expect(screen.queryByText('Carregando sua loja...')).toBeNull();
    });

    expect(await screen.findByText('Loja Teste')).toBeTruthy();
    expect(screen.getByText('Descrição da loja teste')).toBeTruthy();
    expect(screen.getByText('loja@teste.com')).toBeTruthy();
    expect(screen.getByText('123456789')).toBeTruthy();
  });

  it('TC002 - Deve exibir o logotipo e a avaliação corretamente', async () => {
    renderComponent();
    
    const logoImage = await screen.findByTestId('logo-image');
    expect(logoImage.props.source.uri).toBe(mockLojaDetails.logo);
    expect(await screen.findByText('(4.5)')).toBeTruthy();
  });

  it('TC003 - Deve renderizar as informações do produto corretamente', async () => {
    renderComponent();

    expect(await screen.findByText('Produto Teste')).toBeTruthy();
    expect(screen.getByText('Descrição do produto teste')).toBeTruthy();
    expect(screen.getByText('R$ 10.50')).toBeTruthy(); 
    const productImage = await screen.findByTestId('product-image-1');
    expect(productImage.props.source.uri).toBe(mockLojaDetails.produtos[0].imagem);
  });

  it('TC004 - Deve exibir um alerta ao tentar adicionar um item ao carrinho', async () => {
    renderComponent(mockUser, mockLojaDetails);

    const addToCartButton = await screen.findByTestId('add-to-cart-button-1');
    fireEvent.press(addToCartButton);

    const alert = await screen.findByText('Você não pode comprar seus próprios itens.');
    expect(alert).toBeTruthy();
  });

  
  it('TC007 - Deve pesquisar e encontrar produtos com sucesso', async () => {
    renderComponent(mockUser, mockLojaDetailsWithMultipleProducts);

    const searchInput = await screen.findByPlaceholderText('pesquisar');
    fireEvent.changeText(searchInput, 'Red');

    await waitFor(() => {
        expect(screen.queryByText('Bolo de Chocolate')).toBeNull();
        expect(screen.queryByText('Torta de Limão')).toBeNull();
    });
    expect(await screen.findByText('Bolo Red Velvet')).toBeTruthy();
  });

  it('TC008 - Deve pesquisar um produto e não obter resultados', async () => {
    renderComponent(mockUser, mockLojaDetailsWithMultipleProducts);

    const searchInput = await screen.findByPlaceholderText('pesquisar');
    fireEvent.changeText(searchInput, 'Pizza');

    await waitFor(() => {
        expect(screen.queryByText('Bolo de Chocolate')).toBeNull();
        expect(screen.queryByText('Bolo Red Velvet')).toBeNull();
        expect(screen.queryByText('Torta de Limão')).toBeNull();
    });
  });
  
  it('TC009 - Deve navegar para os detalhes do produto ao clicar em um item', async () => {
    renderComponent(mockUser, mockLojaDetailsWithMultipleProducts);

    const productCard = await screen.findByText('Bolo de Chocolate');
    fireEvent.press(productCard);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('TelaProduto', { productId: 1 });
  });



  it('TC013 - Deve limpar a barra de pesquisa e mostrar todos os produtos', async () => {
    renderComponent(mockUser, mockLojaDetailsWithMultipleProducts);
    
    const searchInput = await screen.findByPlaceholderText('pesquisar');
    fireEvent.changeText(searchInput, 'Red');

    // Verifica que o filtro foi aplicado
    await waitFor(() => {
      expect(screen.queryByText('Bolo de Chocolate')).toBeNull();
    });
    expect(await screen.findByText('Bolo Red Velvet')).toBeTruthy();

    // Limpa a pesquisa
    fireEvent.changeText(searchInput, '');
    await waitFor(() => {
        expect(screen.getByText('Bolo de Chocolate')).toBeTruthy();
        expect(screen.getByText('Bolo Red Velvet')).toBeTruthy();
        expect(screen.getByText('Torta de Limão')).toBeTruthy();
    });
  });
  
  it('TC014 - Deve renderizar o produto mesmo sem descrição', async () => {
    renderComponent(mockUser, mockLojaDetailsWithMultipleProducts);
    
    // Espera o loading sumir
    await waitFor(() => {
      expect(screen.queryByText('Carregando sua loja...')).toBeNull();
    });
    
    // Encontra o produto pelo nome
    const product = await screen.findByText('Torta de Limão');
    expect(product).toBeTruthy();

    // Verifica que o preço existe, e a descrição do produto de teste não.
    expect(screen.queryByText('Descrição do produto teste')).toBeNull();
    expect(screen.getByText('R$ 20.00')).toBeTruthy();
  });
});