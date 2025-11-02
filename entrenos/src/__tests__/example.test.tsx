
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../views/login/LoginScreen';

// Mock do useNavigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock do useAuth
const mockLogin = jest.fn();
jest.mock('../AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock do CadastroInput (para evitar problemas de import)
jest.mock('../components/inputs/cadastroInput', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return (props: any) => <TextInput {...props} />;
});

// Mock da imagem para não dar erro
jest.mock('../../assets/images/logoEntreNos.png', () => 1);

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve realizar login com email e senha corretos', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    // Preenche email e senha
    const emailInput = getByPlaceholderText('Insira seu E-mail');
    const passwordInput = getByPlaceholderText('Insira sua senha');
    fireEvent.changeText(emailInput, 'yago@test.com');
    fireEvent.changeText(passwordInput, '123456');

    // Clica no botão Fazer Login
    const loginButton = getByText('Fazer Login');
    fireEvent.press(loginButton);

    // Espera que a função login tenha sido chamada com os valores corretos
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('yago@test.com', '123456');
    });
  });
});
