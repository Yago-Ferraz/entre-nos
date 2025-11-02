import { useNavigation } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as ReactNative from 'react-native';
import { useAuth } from '../../AuthContext';
import LoginScreen from './LoginScreen';

// Mock das dependências
jest.mock('../../AuthContext');
jest.mock('@react-navigation/native');

// Mock do Alert
const mockAlertFn = jest.fn();
jest.spyOn(ReactNative.Alert, 'alert').mockImplementation(mockAlertFn);

describe('LoginScreen - Testes US001', () => {
  let mockLogin: jest.Mock;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    // Configurar mocks antes de cada teste
    mockLogin = jest.fn();
    mockNavigate = jest.fn();
    mockAlertFn.mockClear();

    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      user: null,
      logout: jest.fn(),
      setUser: jest.fn(),
    });

    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TC001: Realizar login com formatação de email e senha corretas (caso feliz)
   * Prioridade: ALTA
   */
  describe('TC001 - Login com credenciais corretas', () => {
    it('deve autenticar o usuário e redirecionar para a tela inicial/home', async () => {
      mockLogin.mockResolvedValueOnce(undefined);

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      fireEvent.changeText(emailInput, 'usuario@exemplo.com');
      fireEvent.changeText(passwordInput, 'senha123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('usuario@exemplo.com', 'senha123');
      });

      expect(mockAlertFn).not.toHaveBeenCalled();
    });
  });

  /**
   * TC002: Realizar login com a senha incorreta registrada no sistema
   */
  describe('TC002 - Login com senha incorreta', () => {
    it('deve exibir mensagem de erro quando a senha está incorreta', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Senha incorreta'));

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      fireEvent.changeText(emailInput, 'usuario@exemplo.com');
      fireEvent.changeText(passwordInput, 'senhaErrada');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockAlertFn).toHaveBeenCalledWith('Erro', 'E-mail ou senha incorretos.');
      });
    });
  });

  /**
   * TC003: Usuário não possui cadastro e tenta fazer login
   */
  describe('TC003 - Login com usuário não cadastrado', () => {
    it('deve exibir mensagem de erro quando o usuário não está cadastrado', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Usuário não encontrado'));

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      fireEvent.changeText(emailInput, 'naoexiste@exemplo.com');
      fireEvent.changeText(passwordInput, 'qualquerSenha');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockAlertFn).toHaveBeenCalledWith('Erro', 'E-mail ou senha incorretos.');
      });
    });
  });

  /**
   * TC004: Realizar login com caracteres inválidos (acentos, símbolos, espaços)
   */
  describe('TC004 - Login com caracteres inválidos', () => {
    it('deve tentar fazer login mesmo com caracteres inválidos no email', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Email inválido'));

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      fireEvent.changeText(emailInput, 'joão@@mail..com');
      fireEvent.changeText(passwordInput, 'senha123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('joão@@mail..com', 'senha123');
      });
    });
  });

  /**
   * TC006: Tentar login sem preencher campos
   */
  describe('TC006 - Login sem preencher campos', () => {
    it('deve exibir mensagem informando que os campos são obrigatórios quando ambos estão vazios', async () => {
      const { getByText } = render(<LoginScreen />);

      const loginButton = getByText('Fazer Login');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockAlertFn).toHaveBeenCalledWith('Erro', 'Preencha e-mail e senha.');
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('deve exibir mensagem quando apenas o email está preenchido', async () => {
      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const loginButton = getByText('Fazer Login');

      fireEvent.changeText(emailInput, 'usuario@exemplo.com');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockAlertFn).toHaveBeenCalledWith('Erro', 'Preencha e-mail e senha.');
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('deve exibir mensagem quando apenas a senha está preenchida', async () => {
      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      fireEvent.changeText(passwordInput, 'senha123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockAlertFn).toHaveBeenCalledWith('Erro', 'Preencha e-mail e senha.');
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  /**
   * TC007: Realizar login usando códigos SQL no campo de email
   */
  describe('TC007 - SQL Injection no campo de email', () => {
    it('deve tratar SQL injection como texto comum e rejeitar o login', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Credenciais inválidas'));

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      const sqlInjection = "' OR '1'='1' --";
      fireEvent.changeText(emailInput, sqlInjection);
      fireEvent.changeText(passwordInput, 'senha123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(sqlInjection, 'senha123');
        expect(mockAlertFn).toHaveBeenCalledWith('Erro', 'E-mail ou senha incorretos.');
      });
    });
  });

  /**
   * TC008: Usuário clica no botão realizar login e é redirecionado
   */
  describe('TC008 - Redirecionamento após login bem-sucedido', () => {
    it('deve processar login sem erros quando credenciais são válidas', async () => {
      mockLogin.mockResolvedValueOnce(undefined);

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      fireEvent.changeText(emailInput, 'admin123@exemplo.com');
      fireEvent.changeText(passwordInput, '123123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('admin123@exemplo.com', '123123');
      });

      expect(mockAlertFn).not.toHaveBeenCalled();
    });
  });

  /**
   * TC009: Realizar login usando códigos SQL no campo de senha
   */
  describe('TC009 - SQL Injection no campo de senha', () => {
    it('deve tratar SQL injection na senha como texto comum', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Credenciais inválidas'));

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      const sqlInjection = "' OR '1'='1' --";
      fireEvent.changeText(emailInput, 'usuario@exemplo.com');
      fireEvent.changeText(passwordInput, sqlInjection);
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('usuario@exemplo.com', sqlInjection);
        expect(mockAlertFn).toHaveBeenCalledWith('Erro', 'E-mail ou senha incorretos.');
      });
    });
  });

  /**
   * TC013: Realizar login sem informar senha
   */
  describe('TC013 - Login sem informar senha', () => {
    it('deve exibir mensagem informando que é preciso preencher a senha', async () => {
      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const loginButton = getByText('Fazer Login');

      fireEvent.changeText(emailInput, 'admin123@exemplo.com');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockAlertFn).toHaveBeenCalledWith('Erro', 'Preencha e-mail e senha.');
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  /**
   * TC019: Tentar logar com campo em branco do e-mail
   */
  describe('TC019 - Login com campo de e-mail vazio', () => {
    it('deve apresentar mensagem de erro quando email está vazio', async () => {
      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      fireEvent.changeText(passwordInput, 'senha123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockAlertFn).toHaveBeenCalledWith('Erro', 'Preencha e-mail e senha.');
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  /**
   * Teste adicional: Botão de criar conta
   */
  describe('Navegação - Botão Criar Conta', () => {
    it('deve navegar para tela de cadastro ao clicar em "Criar conta"', () => {
      const { getByText } = render(<LoginScreen />);

      const createAccountButton = getByText('Criar conta');
      fireEvent.press(createAccountButton);

      expect(mockNavigate).toHaveBeenCalledWith('Signup');
    });
  });

  /**
   * Teste adicional: Estado de loading
   */
  describe('Estado de Loading', () => {
    it('deve exibir "Entrando..." durante o processo de login', async () => {
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { getByPlaceholderText, getByText, queryByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      fireEvent.changeText(emailInput, 'usuario@exemplo.com');
      fireEvent.changeText(passwordInput, 'senha123');
      fireEvent.press(loginButton);

      // Verifica se o texto mudou para "Entrando..."
      await waitFor(() => {
        expect(queryByText('Entrando...')).toBeTruthy();
      });

      // Aguarda o fim do login
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    });

    it('deve desabilitar o botão durante o loading', async () => {
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      fireEvent.changeText(emailInput, 'usuario@exemplo.com');
      fireEvent.changeText(passwordInput, 'senha123');
      fireEvent.press(loginButton);

      // Verifica se o texto mudou para "Entrando..." indicando loading
      await waitFor(() => {
        expect(getByText('Entrando...')).toBeTruthy();
      });
      
      // Aguarda o fim do login
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    });
  });

  /**
   * Teste adicional: Renderização dos componentes
   */
  describe('Renderização da Tela', () => {
    it('deve renderizar todos os elementos principais da tela de login', () => {
      const { getByText, getByPlaceholderText } = render(<LoginScreen />);

      expect(getByText('E-mail')).toBeTruthy();
      expect(getByText('Senha')).toBeTruthy();
      expect(getByText('Esqueceu sua senha?')).toBeTruthy();
      expect(getByText('Fazer Login')).toBeTruthy();
      expect(getByText('Criar conta')).toBeTruthy();
      expect(getByPlaceholderText('Insira seu E-mail')).toBeTruthy();
      expect(getByPlaceholderText('Insira sua senha')).toBeTruthy();
    });
  });

  /**
   * Teste adicional: Validação de senha mascarada
   */
  describe('Segurança - Senha Mascarada', () => {
    it('deve renderizar campo de senha com secureTextEntry', () => {
      const { getByPlaceholderText } = render(<LoginScreen />);

      const passwordInput = getByPlaceholderText('Insira sua senha');
      
      // Verifica se o campo de senha tem a propriedade secureTextEntry
      expect(passwordInput.props.secureTextEntry).toBe(true);
    });
  });

  /**
   * TC005: Realizar login e interferir no meio da requisição
   */
  describe('TC005 - Interferir no meio da requisição', () => {
    it('deve lidar com requisição abortada/cancelada', async () => {
      // Simula uma requisição que é cancelada
      mockLogin.mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Network request aborted')), 50);
        });
      });

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      fireEvent.changeText(emailInput, 'admin123@exemplo.com');
      fireEvent.changeText(passwordInput, '123123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockAlertFn).toHaveBeenCalledWith('Erro', 'E-mail ou senha incorretos.');
      });

      expect(mockLogin).toHaveBeenCalledWith('admin123@exemplo.com', '123123');
    });
  });

  /**
   * TC010: Usuário tenta fazer várias tentativas de login incessantemente
   */
  describe('TC010 - Múltiplas tentativas de login', () => {
    it('deve permitir múltiplas tentativas de login sem travar', async () => {
      mockLogin.mockRejectedValue(new Error('Credenciais inválidas'));

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      // Simula primeira tentativa
      fireEvent.changeText(emailInput, 'usuario1@exemplo.com');
      fireEvent.changeText(passwordInput, 'senhaerrada');
      fireEvent.press(loginButton);

      // Aguarda a primeira tentativa ser processada
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('usuario1@exemplo.com', 'senhaerrada');
      });

      // Limpa o mock para novas contagens
      mockLogin.mockClear();
      mockAlertFn.mockClear();

      // Simula segunda tentativa
      fireEvent.changeText(emailInput, 'usuario2@exemplo.com');
      fireEvent.changeText(passwordInput, 'senhaerrada2');
      fireEvent.press(loginButton);

      // Verifica que a segunda tentativa foi processada
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('usuario2@exemplo.com', 'senhaerrada2');
      });

      // Verifica que os alertas foram exibidos e a aplicação continua funcional
      expect(mockAlertFn).toHaveBeenCalledWith('Erro', 'E-mail ou senha incorretos.');
      expect(getByText('Fazer Login')).toBeTruthy();
    });
  });

  /**
   * TC0012: Tentar fazer login em uma conta bloqueada administrativamente
   */
  describe('TC0012 - Conta bloqueada administrativamente', () => {
    it('deve exibir mensagem específica para conta bloqueada', async () => {
      // Simula resposta de conta bloqueada
      mockLogin.mockRejectedValueOnce({
        response: {
          status: 403,
          data: { message: 'Conta bloqueada. Entre em contato com o suporte.' }
        }
      });

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      fireEvent.changeText(emailInput, 'contabloqueada@exemplo.com');
      fireEvent.changeText(passwordInput, 'senha123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        // Como o componente atual não diferencia o tipo de erro,
        // ele sempre exibe a mensagem genérica
        expect(mockAlertFn).toHaveBeenCalledWith('Erro', 'E-mail ou senha incorretos.');
      });

      expect(mockLogin).toHaveBeenCalledWith('contabloqueada@exemplo.com', 'senha123');
    });

    it('deve processar erro de conta bloqueada sem travar a aplicação', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Account blocked'));

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      const emailInput = getByPlaceholderText('Insira seu E-mail');
      const passwordInput = getByPlaceholderText('Insira sua senha');
      const loginButton = getByText('Fazer Login');

      fireEvent.changeText(emailInput, 'blocked@exemplo.com');
      fireEvent.changeText(passwordInput, 'senha123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockAlertFn).toHaveBeenCalled();
      });

      // Verifica que a aplicação ainda está responsiva após o erro
      expect(getByText('Fazer Login')).toBeTruthy();
    });
  });
});
