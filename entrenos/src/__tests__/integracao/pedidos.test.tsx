import React from 'react';
import { render, screen, waitFor, fireEvent, act, within } from '@testing-library/react-native';
import MeusPedidos from '../../views/home/pedidos/pedidos';
import { useNavigation } from '@react-navigation/native';
import * as PedidoService from '../../services/pedidos';
import { Alert } from 'react-native';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

jest.mock('../../services/pedidos', () => ({
  pedidoService: {
    getPedidos: jest.fn(),
    updatePedidoStatus: jest.fn(),
  },
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return Object.setPrototypeOf({
    Alert: {
      alert: jest.fn(),
    },
    // Mock FlatList internal components if necessary for testing renderItem
    FlatList: ({ renderItem, data, keyExtractor }: any) => {
      if (!data || data.length === 0) {
        return RN.Text ? <RN.Text>No items</RN.Text> : null;
      }
      return (
        <RN.ScrollView>
          {data.map((item: any, index: number) =>
            renderItem({ item, index, separators: {} }, index)
          )}
        </RN.ScrollView>
      );
    },
  }, RN);
});


jest.mock('@/src/components/header/header', () => {
  const { View, Text, TouchableOpacity } = jest.requireActual('react-native');
  return ({ title, showBackButton, onBackPress }: any) => (
    <View testID="Header">
      {showBackButton && <TouchableOpacity testID="HeaderBackButton" onPress={onBackPress}><Text>Back</Text></TouchableOpacity>}
      <Text>{title}</Text>
    </View>
  );
});

jest.mock('@/src/components/cards/cardbase', () => {
  const { View, TouchableOpacity } = jest.requireActual('react-native');
  return ({ children, onPress, style }: any) => (
    <TouchableOpacity testID="CardBase" onPress={onPress} style={style}>{children}</TouchableOpacity>
  );
});


// Mock data
const mockPedidos = [
  {
    id: 1,
    comprador: 'Cliente A',
    status: 'pendente',
    valor_total: '150.00',
    descricao: 'Observação do pedido 1',
    itens: [
      { quantidade: 1, produto: { results: { nome: 'Produto X', imagem: 'http://example.com/x.jpg' } }, preco_unitario: '75.00' },
      { quantidade: 1, produto: { results: { nome: 'Produto Z', imagem: 'http://example.com/z.jpg' } }, preco_unitario: '75.00' },
    ],
  },
  {
    id: 2,
    comprador: 'Cliente B',
    status: 'processando',
    valor_total: '200.00',
    descricao: '',
    itens: [
      { quantidade: 1, produto: { results: { nome: 'Produto Y', imagem: 'http://example.com/y.jpg' } }, preco_unitario: '200.00' },
    ],
  },
];

describe('MeusPedidos Integration Tests', () => {
  const mockNavigate = jest.fn();
  const mockGoBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      goBack: mockGoBack,
    });
    jest.spyOn(Alert, 'alert').mockClear();
  });

  it('should display loading text initially', async () => {
    (PedidoService.pedidoService.getPedidos as jest.Mock).mockReturnValueOnce(new Promise(() => {})); // Never resolve
    render(<MeusPedidos />);
    expect(screen.getByText('Carregando pedidos...')).toBeVisible();
  });

  it('should display "Nenhum pedido encontrado." when no orders are fetched', async () => {
    (PedidoService.pedidoService.getPedidos as jest.Mock).mockResolvedValueOnce([]);
    render(<MeusPedidos />);
    await waitFor(() => expect(screen.getByText('Nenhum pedido encontrado.')).toBeVisible());
  });

  it('should display a list of orders when fetched successfully', async () => {
    (PedidoService.pedidoService.getPedidos as jest.Mock).mockResolvedValueOnce(mockPedidos);
    render(<MeusPedidos />);
    await waitFor(() => {
      expect(screen.getByText('2 itens')).toBeVisible();
      expect(screen.getByText('R$ 150.00')).toBeVisible();
      expect(screen.getByText('PENDENTE')).toBeVisible();

      expect(screen.getByText('Pedido Cliente B')).toBeVisible();
      expect(screen.getByText('1 item')).toBeVisible();
      expect(screen.getByText('R$ 200.00')).toBeVisible();
      expect(screen.getByText('PROCESSANDO')).toBeVisible();
    });
  });

  it('should show an alert if fetching orders fails', async () => {
    (PedidoService.pedidoService.getPedidos as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    render(<MeusPedidos />);
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Não foi possível carregar os pedidos.');
    });
  });

  it('should open modal with order details when an order card is pressed', async () => {
    (PedidoService.pedidoService.getPedidos as jest.Mock).mockResolvedValueOnce(mockPedidos);
    render(<MeusPedidos />);

    await waitFor(() => expect(screen.getByText('Pedido Cliente A')).toBeVisible());
    fireEvent.press(screen.getByText('Pedido Cliente A'));

    await waitFor(() => {
      expect(screen.getByText('Detalhes do Pedido #1')).toBeVisible();
      expect(screen.getByText('Cliente: Cliente A')).toBeVisible();
      expect(screen.getByText('Status:')).toBeVisible();
      expect(screen.getByText('1x Produto X')).toBeVisible();
      expect(screen.getByText('1x Produto Z')).toBeVisible();
      expect(within(screen.getByTestId('modal-content')).getByText('R$ 150.00')).toBeVisible();
      expect(screen.getByDisplayValue('Observação do pedido 1')).toBeVisible();
    });
  });

  it('should allow changing order status and saving changes', async () => {
    (PedidoService.pedidoService.getPedidos as jest.Mock)
      .mockResolvedValueOnce(mockPedidos) // Initial fetch
      .mockResolvedValueOnce([ // Re-fetch after update
        { ...mockPedidos[0], status: 'pago' },
        mockPedidos[1],
      ]);
    (PedidoService.pedidoService.updatePedidoStatus as jest.Mock).mockResolvedValueOnce({});

    render(<MeusPedidos />);

    await waitFor(() => expect(screen.getByText('Pedido Cliente A')).toBeVisible());
    fireEvent.press(screen.getByText('Pedido Cliente A'));

    await waitFor(() => expect(screen.getByText('Detalhes do Pedido #1')).toBeVisible());
    
    // Open status selector
    fireEvent.press(screen.getByText('Pendente'));
    expect(screen.getByText('Pago')).toBeVisible();

    // Select new status
    fireEvent.press(screen.getByText('Pago'));

    // Change description
    fireEvent.changeText(screen.getByPlaceholderText('Ex: Tocar a campainha...'), 'Nova observação');

    // Save changes
    fireEvent.press(screen.getByText('Salvar Alterações'));

    await waitFor(() => {
      expect(PedidoService.pedidoService.updatePedidoStatus).toHaveBeenCalledWith(1, {
        status: 'pago',
        descricao: 'Nova observação',
      });
      expect(Alert.alert).toHaveBeenCalledWith('Sucesso', 'Pedido atualizado com sucesso!');
      expect(screen.queryByText('Detalhes do Pedido #1')).toBeNull(); // Modal should close
    });
    // Verify list is updated
    await waitFor(() => expect(screen.getByText('PAGO')).toBeVisible());
  });

  it('should show an alert if updating order fails', async () => {
    (PedidoService.pedidoService.getPedidos as jest.Mock).mockResolvedValueOnce(mockPedidos);
    (PedidoService.pedidoService.updatePedidoStatus as jest.Mock).mockRejectedValueOnce(new Error('Update Error'));

    render(<MeusPedidos />);

    await waitFor(() => expect(screen.getByText('Pedido Cliente A')).toBeVisible());
    fireEvent.press(screen.getByText('Pedido Cliente A'));

    await waitFor(() => expect(screen.getByText('Detalhes do Pedido #1')).toBeVisible());
    
    fireEvent.press(screen.getByText('Salvar Alterações'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Não foi possível atualizar o pedido.');
    });
  });

  it('should close the modal when close button is pressed', async () => {
    (PedidoService.pedidoService.getPedidos as jest.Mock).mockResolvedValueOnce(mockPedidos);
    render(<MeusPedidos />);

    await waitFor(() => expect(screen.getByText('Pedido Cliente A')).toBeVisible());
    fireEvent.press(screen.getByText('Pedido Cliente A'));

    await waitFor(() => expect(screen.getByText('Detalhes do Pedido #1')).toBeVisible());
    fireEvent.press(screen.getByTestId('close-modal-button'));

    await waitFor(() => {
      expect(screen.queryByText('Detalhes do Pedido #1')).toBeNull();
    });
  });

  it('should navigate back when header back button is pressed', async () => {
    (PedidoService.pedidoService.getPedidos as jest.Mock).mockResolvedValueOnce([]);
    render(<MeusPedidos />);
    await waitFor(() => expect(screen.getByTestId('HeaderBackButton')).toBeVisible());
    fireEvent.press(screen.getByTestId('HeaderBackButton'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
