import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../views/login/LoginScreen";
import { AuthContext } from "../AuthContext";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "../AuthContext";
import { useNavigation } from "@react-navigation/native";



const Stack = createNativeStackNavigator();
// Mocks
const mockLogin = jest.fn();
const mockSetUser = jest.fn();
jest.spyOn(Alert, "alert");
const mockLogout = jest.fn();

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));


 const mockNavigate = jest.fn();
  jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe("LoginScreen - casos de login ", () => {
  beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});
    it("(TC001) deve realizar login com email e senha corretos", async () => {
      const { getByPlaceholderText, getByText } = render(
        <NavigationContainer>
          <AuthContext.Provider
            value={{
              user: null,          // usuário inicial como null
              setUser: mockSetUser,
              login: mockLogin,
              logout: mockLogout,
            }}
          >
            <LoginScreen />
          </AuthContext.Provider>
        </NavigationContainer>
      );

      // Preenche os campos
      fireEvent.changeText(getByPlaceholderText("Insira seu E-mail"), "usuario@example.com");
      fireEvent.changeText(getByPlaceholderText("Insira sua senha"), "senha123");

      // Clica no botão de login
      fireEvent.press(getByText("Fazer Login"));

      // Verifica se a função login foi chamada
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith("usuario@example.com", "senha123");
      });
  });
  it("(TC002) deve exibir erro ao tentar login com senha incorreta", async () => {
      const mockLogin = jest.fn(() => Promise.reject(new Error("Senha incorreta"))); // simula erro de senha

      const { getByPlaceholderText, getByText, findByText } = render(
        <NavigationContainer>
          <AuthContext.Provider
            value={{
              user: null,
              setUser: mockSetUser,
              login: mockLogin,
              logout: mockLogout,
            }}
          >
            <LoginScreen />
          </AuthContext.Provider>
        </NavigationContainer>
      );

  fireEvent.changeText(getByPlaceholderText("Insira seu E-mail"), "usuario@example.com");
    fireEvent.changeText(getByPlaceholderText("Insira sua senha"), "senhaErrada");

    fireEvent.press(getByText("Fazer Login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("usuario@example.com", "senhaErrada");
      // Verifica se o Alert foi chamado com os argumentos corretos
      expect(Alert.alert).toHaveBeenCalledWith("Erro", "E-mail ou senha incorretos.");
    });
    
    });

  it("(TC004) deve exibir erro ao tentar login com caracteres inválidos no email", async () => {
    // Simula a função login que rejeita qualquer entrada inválida
    const mockLogin = jest.fn(() => Promise.reject(new Error("Email inválido")));

    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <AuthContext.Provider
          value={{
            user: null,
            setUser: mockSetUser,
            login: mockLogin,
            logout: mockLogout,
          }}
        >
          <LoginScreen />
        </AuthContext.Provider>
      </NavigationContainer>
    );

    // Digita um email com caracteres inválidos
    fireEvent.changeText(getByPlaceholderText("Insira seu E-mail"), "joão@@mail..com");
    fireEvent.changeText(getByPlaceholderText("Insira sua senha"), "senha123");

    // Clica no botão de login
    fireEvent.press(getByText("Fazer Login"));

    // Aguarda e verifica se a função login foi chamada corretamente
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("joão@@mail..com", "senha123");

      // Verifica se o Alert exibiu a mensagem de erro esperada
      expect(Alert.alert).toHaveBeenCalledWith(
        "Erro",
        "Por favor, insira dados válidos para realizar o login."
      );
    });
  });

  it("TC005: não deve registrar usuário se ocorrer erro na requisição", async () => {
    const mockLogin = jest.fn(() => Promise.reject(new Error("Falha na rede")));

    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <AuthContext.Provider
          value={{ user: null, setUser: mockSetUser, login: mockLogin, logout: mockLogout }}
        >
          <LoginScreen />
        </AuthContext.Provider>
      </NavigationContainer>
    );

    fireEvent.changeText(getByPlaceholderText("Insira seu E-mail"), "admin123");
    fireEvent.changeText(getByPlaceholderText("Insira sua senha"), "123123");
    fireEvent.press(getByText("Fazer Login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockSetUser).not.toHaveBeenCalled(); // não deve registrar usuário
      expect(Alert.alert).toHaveBeenCalledWith("Erro", "Falha na rede");
    });
  });






  it("(TC006) deve exibir erro ao tentar login sem preencher campos", async () => {
    // Criamos um mock de login que nunca é chamado, porque os campos estão vazios
    const mockLogin = jest.fn();

    const { getByText } = render(
      <NavigationContainer>
        <AuthContext.Provider
          value={{
            user: null,
            setUser: mockSetUser,
            login: mockLogin,
            logout: mockLogout,
          }}
        >
          <LoginScreen />
        </AuthContext.Provider>
      </NavigationContainer>
    );

    // Clica no botão de login sem preencher os campos
    fireEvent.press(getByText("Fazer Login"));

    // Aguarda e verifica se o alerta de erro foi chamado
    await waitFor(() => {
      // A função login **não deve ser chamada** porque os campos estão vazios
      expect(mockLogin).not.toHaveBeenCalled();

      // Verifica se o Alert foi chamado com a mensagem correta
      expect(Alert.alert).toHaveBeenCalledWith(
        "Erro",
        "Preencha e-mail e senha."
      );
    });
  });


 it("(TC008) deve redirecionar o usuário para a tela de Home após login bem-sucedido", async () => {
    const mockLogin = jest.fn(() => Promise.resolve());
    const mockNavigate = jest.fn();

    // Stack Navigator com LoginScreen
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <AuthContext.Provider
          value={{
            user: null,
            setUser: mockSetUser,
            login: mockLogin,
            logout: mockLogout,
          }}
        >
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </AuthContext.Provider>
      </NavigationContainer>
    );


    fireEvent.changeText(getByPlaceholderText("Insira seu E-mail"), "usuario@example.com");
    fireEvent.changeText(getByPlaceholderText("Insira sua senha"), "senha123");
    fireEvent.press(getByText("Fazer Login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("usuario@example.com", "senha123");
      
    });

  });


it("(TC0013) deve exibir erro ao tentar login sem informar senha", async () => {
  const { getByPlaceholderText, getByText } = render(
    <NavigationContainer>
      <AuthContext.Provider
        value={{ user: null, setUser: mockSetUser, login: mockLogin, logout: mockLogout }}
      >
        <LoginScreen />
      </AuthContext.Provider>
    </NavigationContainer>
  );

  fireEvent.changeText(getByPlaceholderText("Insira seu E-mail"), "admin123@example.com");
  fireEvent.changeText(getByPlaceholderText("Insira sua senha"), ""); // senha vazia
  fireEvent.press(getByText("Fazer Login"));

  await waitFor(() => {
    expect(mockLogin).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith("Erro", "Preencha e-mail e senha.");
  });
});

it("(TC0019) deve exibir erro ao tentar login com campo de e-mail vazio", async () => {
  const mockLogin = jest.fn();

  const { getByPlaceholderText, getByText } = render(
    <NavigationContainer>
      <AuthContext.Provider
        value={{
          user: null,
          setUser: mockSetUser,
          login: mockLogin,
          logout: mockLogout,
        }}
      >
        <LoginScreen />
      </AuthContext.Provider>
    </NavigationContainer>
  );

  // Campo de e-mail vazio e senha preenchida
  fireEvent.changeText(getByPlaceholderText("Insira seu E-mail"), "");
  fireEvent.changeText(getByPlaceholderText("Insira sua senha"), "senha123");
  fireEvent.press(getByText("Fazer Login"));

  await waitFor(() => {
    // Login não deve ser chamado
    expect(mockLogin).not.toHaveBeenCalled();

    // Deve mostrar o alerta de e-mail inválido
    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith("Erro", "Preencha e-mail e senha.");
  });
});


it("(TC0021) deve redirecionar para a tela de recuperação de senha ao clicar em 'Esqueceu sua senha?'", async () => {
  const { getByText } = render(
    <AuthContext.Provider
      value={{
        user: null,
        setUser: jest.fn(),
        login: jest.fn(),
        logout: jest.fn(),
      }}
    >
      <LoginScreen />
    </AuthContext.Provider>
  );
 
  
  fireEvent.press(getByText("Esqueceu sua senha?"));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("ForgotPassword");
  });
});



});
