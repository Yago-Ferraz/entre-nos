import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import Cadastro from "../views/cadastro/cadastro";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext, AuthProvider } from "../AuthContext";
import * as userService from '../services/userService';

// Mock do timer
jest.useFakeTimers();

// Mock de módulos e serviços
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('../services/userService');
const mockedCreateUser = userService.createUser as jest.Mock;

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

// Helper de renderização com providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <NavigationContainer>
      <AuthProvider>{component}</AuthProvider>
    </NavigationContainer>
  );
};

describe("Cadastro - Validação de E-mail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedCreateUser.mockResolvedValue({ status: 201 }); // Comportamento padrão
  });

  const advanceToStep = (getByText: any, step: number) => {
    for (let i = 1; i < step; i++) {
        fireEvent.press(getByText("Próximo"));
    }
  };


  it("(TC003) [Validação] Formato de E-mail INVÁLIDO ao perder o foco (RF-002)", async () => {
    const { getByPlaceholderText, getByText, findByText } = renderWithProviders(<Cadastro />);
    
    // Navega até a etapa de e-mail
    fireEvent.press(getByText("Empresa")); 
    fireEvent.press(getByText("Próximo")); // Para nome
    fireEvent.press(getByText("Próximo")); // Para telefone
    fireEvent.press(getByText("Próximo")); // Para CNPJ
    fireEvent.press(getByText("Próximo")); // Para senha
    fireEvent.press(getByText("Próximo")); // Para email

    const emailInput = getByPlaceholderText("Digite seu e-mail...");
    fireEvent.changeText(emailInput, "teste@invalido");
    fireEvent(emailInput, "blur");

    const errorMessage = await findByText("Formato de e-mail inválido");
    expect(errorMessage).toBeTruthy();
  });

  it("TC004 deve alternar a visibilidade da senha ao tocar no ícone de olho", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = renderWithProviders(<Cadastro />);

    // Avança até o passo de senha
    fireEvent.press(getByText("Próximo")); // Para nome
    fireEvent.press(getByText("Próximo")); // Para telefone
    fireEvent.press(getByText("Próximo")); // Para CNPJ
    fireEvent.press(getByText("Próximo")); // Para senha

    const senhaInput = getByPlaceholderText("Digite sua senha...");
    const toggleVisibilityButton = getByTestId("toggle-visibility");

    // Senha deve começar segura
    expect(senhaInput.props.secureTextEntry).toBe(true);

    // Clica para mostrar a senha
    fireEvent.press(toggleVisibilityButton);
    await waitFor(() => {
      expect(senhaInput.props.secureTextEntry).toBe(false);
    });

    // Clica para esconder novamente
    fireEvent.press(toggleVisibilityButton);
    await waitFor(() => {
      expect(senhaInput.props.secureTextEntry).toBe(true);
    });
  });

  it("MUN-5 TC006 [Validação] deve bloquear o cadastro se campos obrigatórios estiverem vazios", async () => {
    const { getByText } = renderWithProviders(<Cadastro />);

    // Avança até a etapa final sem preencher nada
    fireEvent.press(getByText("Empresa")); 
    fireEvent.press(getByText("Próximo")); // Para nome
    fireEvent.press(getByText("Próximo")); // Para telefone
    fireEvent.press(getByText("Próximo")); // Para CNPJ
    fireEvent.press(getByText("Próximo")); // Para senha
    fireEvent.press(getByText("Próximo")); // Para email

    // Tenta finalizar
    fireEvent.press(getByText("Próximo"));

    // Verifica que a API não foi chamada
    await waitFor(() => {
      expect(mockedCreateUser).not.toHaveBeenCalled();
    });
  });

  it("MUN-5 TC007 [Validação] deve exibir erro ao inserir senha com menos de 6 caracteres", async () => {
    const { getByPlaceholderText, getByText, findByText } = renderWithProviders(<Cadastro />);

    // Avança até a etapa de senha
    advanceToStep(getByText, 5);

    const senhaInput = getByPlaceholderText("Digite sua senha...");
    fireEvent.changeText(senhaInput, "123");
    fireEvent(senhaInput, "blur");

    const errorMessage = await findByText("A senha deve ter no mínimo 6 caracteres.");
    expect(errorMessage).toBeTruthy();
  });
  
  it("MUN-5 TC008 [UX] deve exibir mensagens de erro abaixo de cada campo correspondente", async () => {
    const { getByPlaceholderText, getByText, findByText } = renderWithProviders(<Cadastro />);
  
    // Força erro no campo Nome
    advanceToStep(getByText, 2);
    const nomeInput = getByPlaceholderText("Insira seu nome...");
    fireEvent.changeText(nomeInput, "");
    fireEvent(nomeInput, "blur");
    expect(await findByText("O campo Nome é obrigatório.")).toBeTruthy();
  
    // Força erro no campo de senha
    advanceToStep(getByText, 5); 
    const senhaInput = getByPlaceholderText("Digite sua senha...");
    fireEvent.changeText(senhaInput, "123");
    fireEvent(senhaInput, "blur");
    expect(await findByText("A senha deve ter no mínimo 6 caracteres.")).toBeTruthy();
  
    // Força erro no campo de e-mail
    advanceToStep(getByText, 6);
    const emailInput = getByPlaceholderText("Digite seu e-mail...");
    fireEvent.changeText(emailInput, "invalid-email");
    fireEvent(emailInput, "blur");
    expect(await findByText("Formato de e-mail inválido")).toBeTruthy();
  });
  

  it("TC009 deve desabilitar o botão durante a requisição", async () => {
    mockedCreateUser.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ status: 201 }), 1000)));

    const { getByText, getByPlaceholderText, getByTestId } = renderWithProviders(<Cadastro />);

    // Preenche todos os passos corretamente
    fireEvent.press(getByText("Empresa"));
    fireEvent.press(getByText("Próximo"));
    fireEvent.changeText(getByPlaceholderText("Insira seu nome..."), "Yago");
    fireEvent.press(getByText("Próximo"));
    fireEvent.changeText(getByPlaceholderText("Digite seu telefone..."), "11999999999");
    fireEvent.press(getByText("Próximo"));
    fireEvent.changeText(getByPlaceholderText("Digite seu CNPJ..."), "12345678000100");
    fireEvent.press(getByText("Próximo"));
    fireEvent.changeText(getByPlaceholderText("Digite sua senha..."), "123456");
    fireEvent.changeText(getByPlaceholderText("Confirme sua senha..."), "123456");
    fireEvent.press(getByText("Próximo"));
    fireEvent.changeText(getByPlaceholderText("Digite seu e-mail..."), "teste@email.com");

    // Clica para finalizar
    const finalizarButton = getByTestId("botaoProximo");
    fireEvent.press(finalizarButton);

    // Botão deve estar desabilitado
    await waitFor(() => {
        expect(getByTestId("botaoProximo").props.accessibilityState.disabled).toBe(true);
    });

    // Avança os timers para completar a promise
    await act(async () => {
        jest.runAllTimers();
    });

    // Botão deve estar habilitado novamente
    await waitFor(() => {
        expect(getByTestId("botaoProximo").props.accessibilityState.disabled).toBe(false);
    });
});


  it("TC011 [Validação] E-mail Válido no Limite Inferior (Ex: a@b.co)", async () => {
    const { getByText, getByPlaceholderText, queryByText } = renderWithProviders(<Cadastro />);
    
    // Avança para a etapa de e-mail
    advanceToStep(getByText, 6);

    const emailInput = getByPlaceholderText("Digite seu e-mail...");
    fireEvent.changeText(emailInput, "a@b.co");
    fireEvent(emailInput, "blur");

    await waitFor(() => {
      expect(queryByText("Formato de e-mail inválido")).toBeNull();
    });
  });

  it("TC0014 [Validação] Campo Nome Vazio, E-mail e Senha Válidos", async () => {
    const { getByText, getByPlaceholderText, findByText, queryByText } = renderWithProviders(<Cadastro />);
    
    // Pula o nome
    advanceToStep(getByText, 2);
    fireEvent.changeText(getByPlaceholderText("Insira seu nome..."), " ");
    fireEvent.press(getByText("Próximo"));

    // Preenche o resto
    advanceToStep(getByText, 5); // vai para senha
    fireEvent.changeText(getByPlaceholderText("Digite sua senha..."), "123456");
    fireEvent.changeText(getByPlaceholderText("Confirme sua senha..."), "123456");
    fireEvent.press(getByText("Próximo"));

    advanceToStep(getByText, 6); // vai para email
    fireEvent.changeText(getByPlaceholderText("Digite seu e-mail..."), "teste@teste.com");
    fireEvent.press(getByText("Próximo"));

    // Tenta finalizar
    fireEvent.press(getByText("Próximo"));
    
    // Verifica a mensagem de erro apenas para o nome
    const errorMessage = await findByText("O campo Nome é obrigatório.");
    expect(errorMessage).toBeTruthy();
    expect(queryByText("Formato de e-mail inválido")).toBeNull();
    expect(queryByText("A senha deve ter no mínimo 6 caracteres")).toBeNull();
  });
});
