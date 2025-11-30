// src/__tests__/registro.test.tsx

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Cadastro from "../views/cadastro/cadastro";
import { AuthContext } from "../AuthContext";
import { Alert } from "react-native";

// Mocks
const mockSetUser = jest.fn();
const mockLogin = jest.fn();
const mockLogout = jest.fn();
jest.spyOn(Alert, "alert");

// Mock de usuário com empresa completa
const mockUser = {
  id: 1,
  name: "Teste",
  email: "teste@empresa.com",
  token: "fakeToken",
  usertype: 2,
  empresa: {
    id: 1,
    categoria: 1,
    descricao: "Descrição da empresa",
    logo: "logo.png",
    nome: "Empresa Teste",
    user: 1, // normalmente é o id do usuário dono da empresa
    fotos: [], // array vazio de fotos
  },
};


describe("Cadastro - validações de formulário", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("TC002 - Inserir CNPJ inválido deve exibir mensagem de erro", async () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <AuthContext.Provider
          value={{ user: mockUser, setUser: mockSetUser, login: mockLogin, logout: mockLogout }}
        >
          <Cadastro />
        </AuthContext.Provider>
      </NavigationContainer>
    );

    // Vai para a etapa do CNPJ (id 4)
    for (let i = 0; i < 3; i++) {
      fireEvent.press(getByText(/Próximo/i));
    }

    fireEvent.changeText(getByPlaceholderText("Digite seu CNPJ..."), "1234567890001");
    fireEvent.press(getByText(/Próximo/i));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Erro", "CNPJ incorreto");
    });
  });

  it("TC003 - Inserir e-mail comercial inválido deve exibir mensagem de erro", async () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <AuthContext.Provider
          value={{ user: mockUser, setUser: mockSetUser, login: mockLogin, logout: mockLogout }}
        >
          <Cadastro />
        </AuthContext.Provider>
      </NavigationContainer>
    );

    // Vai para a etapa do e-mail (id 6)
    for (let i = 0; i < 5; i++) {
      fireEvent.press(getByText(/Próximo/i));
    }

    fireEvent.changeText(getByPlaceholderText("Digite seu e-mail..."), "loja@com");
    fireEvent.press(getByText(/Próximo/i));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Erro", "E-mail incorreto");
    });
  });

  it("TC004 - Inserir telefone com formato incorreto deve exibir mensagem de erro", async () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <AuthContext.Provider
          value={{ user: mockUser, setUser: mockSetUser, login: mockLogin, logout: mockLogout }}
        >
          <Cadastro />
        </AuthContext.Provider>
      </NavigationContainer>
    );

    // Vai para a etapa do telefone (id 3)
    for (let i = 0; i < 2; i++) {
      fireEvent.press(getByText(/Próximo/i));
    }

    fireEvent.changeText(getByPlaceholderText("Digite seu telefone..."), "1234");
    fireEvent.press(getByText(/Próximo/i));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Erro", "Telefone incorreto");
    });
  });
});
