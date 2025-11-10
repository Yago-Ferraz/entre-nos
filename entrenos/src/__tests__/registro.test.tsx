import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Cadastro from "../views/cadastro/cadastro";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../AuthContext";
import * as userService from '../services/userService';
import { act } from "@testing-library/react-native";


jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));


jest.spyOn(userService, 'createUser').mockImplementation(
  () => new Promise(res => setTimeout(res, 500)) // 500ms delay
);

// Mock do AuthContext
const mockLogin = jest.fn();
const mockSetUser = jest.fn();
const mockLogout = jest.fn();


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


describe("Cadastro - Validação de E-mail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("(TC003) [Validação] Formato de E-mail INVÁLIDO ao perder o foco (RF-002)", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <NavigationContainer>
        <AuthContext.Provider
          value={{
            user: null,
            setUser: mockSetUser,
            login: mockLogin,
            logout: mockLogout,
          }}
        >
          <Cadastro />
        </AuthContext.Provider>
      </NavigationContainer>
    );

    // Avançar até o passo de e-mail (id = 6)
    for (let i = 0; i < 5; i++) {
      fireEvent.press(getByText("Próximo"));
    }

    const emailInput = getByPlaceholderText("Digite seu e-mail...");

    // Digita um e-mail inválido
    fireEvent.changeText(emailInput, "teste@teste");

    // Simula perda de foco
    fireEvent(emailInput, "blur");

    // Verifica se a mensagem de erro aparece
    await waitFor(() => {
      expect(queryByText("Formato de e-mail inválido")).toBeTruthy();
    });
  });

    it("TC004 deve alternar a visibilidade da senha ao tocar no ícone de olho (esperado: FAIL)", async () => {
    const { getByText, getByPlaceholderText, queryByTestId } = render(<Cadastro />);

    // Avança até o passo 5 (senha). Botão mostrado como "Próximo" na UI
    const btnProximo = getByText("Próximo");
    for (let i = 0; i < 4; i++) {
      fireEvent.press(btnProximo);
    }

    // Confirma que estamos no passo de senha
    const senhaInput = getByPlaceholderText("Digite sua senha...");
    expect(senhaInput).toBeTruthy();

    // Procura o toggle (testID que NÃO existe no componente atual)
    const toggle = queryByTestId("toggle-visibility");

    // Assertion que deve FAIL porque toggle === null (não implementado)
    await waitFor(() => {
      expect(toggle).toBeTruthy(); // <-- este expect vai falhar no estado atual
    });
  });


it("MUN-5 TC006 [Validação] deve bloquear o cadastro se campos obrigatórios estiverem vazios (equivalente ao botão Cadastrar)", async () => {
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
        <Cadastro />
      </AuthContext.Provider>
    </NavigationContainer>
  );

  // Avança até o passo 6 (email) — onde normalmente o usuário finaliza o preenchimento
  const btnProximo = getByText("Próximo");
  for (let i = 0; i < 5; i++) {
    fireEvent.press(btnProximo);
  }

  // Espia a função createUser()
  const spyCreateUser = jest.spyOn(require("../services/userService"), "createUser");

  // Simula clique no botão "Próximo" sem preencher nada
  fireEvent.press(btnProximo);

  // Verifica se NÃO chamou o createUser
  await waitFor(() => {
    expect(spyCreateUser).not.toHaveBeenCalled();
  });
});

it("MUN-5 TC007 [Validação] deve exibir erro ao inserir senha com menos de 6 caracteres (esperado: FAIL)", async () => {
  const { getByPlaceholderText, getByText, queryByText } = render(
    <NavigationContainer>
      <AuthContext.Provider
        value={{
          user: null,
          setUser: mockSetUser,
          login: mockLogin,
          logout: mockLogout,
        }}
      >
        <Cadastro />
      </AuthContext.Provider>
    </NavigationContainer>
  );

  // Avança até o passo da senha (geralmente passo 5)
  const btnProximo = getByText("Próximo");
  for (let i = 0; i < 4; i++) {
    fireEvent.press(btnProximo);
  }

  // Digita uma senha curta
  const senhaInput = getByPlaceholderText("Digite sua senha...");
  fireEvent.changeText(senhaInput, "123"); // senha < 6 caracteres

  // Simula perda de foco (blur) para disparar validação
  fireEvent(senhaInput, "blur");

  // Verifica se a mensagem de erro aparece
  await waitFor(() => {
    expect(queryByText("A senha deve ter no mínimo 6 caracteres")).toBeTruthy();
  });
});

it("MUN-5 TC008 [UX] deve exibir mensagens de erro abaixo de cada campo correspondente (esperado: FAIL)", async () => {
  const { getByPlaceholderText, getByText, queryByText } = render(
    <NavigationContainer>
      <AuthContext.Provider
        value={{
          user: null,
          setUser: mockSetUser,
          login: mockLogin,
          logout: mockLogout,
        }}
      >
        <Cadastro />
      </AuthContext.Provider>
    </NavigationContainer>
  );

  // Avança até o primeiro campo (Nome)
  const btnProximo = getByText("Próximo");

  // Campo Nome vazio → erro
  const nomeInput = getByPlaceholderText("Digite seu nome...");
  fireEvent(nomeInput, "blur");

  // Avança até o E-mail
  fireEvent.press(btnProximo);
  const emailInput = getByPlaceholderText("Digite seu e-mail...");
  fireEvent.changeText(emailInput, "teste@"); // inválido
  fireEvent(emailInput, "blur");

  // Avança até Senha
  fireEvent.press(btnProximo);
  const senhaInput = getByPlaceholderText("Digite sua senha...");
  fireEvent.changeText(senhaInput, "123"); // muito curta
  fireEvent(senhaInput, "blur");

  // Verifica se cada mensagem de erro aparece (o teste deve falhar)
  await waitFor(() => {
    expect(queryByText("Campo obrigatório")).toBeTruthy(); // nome
    expect(queryByText("Formato de e-mail inválido")).toBeTruthy(); // e-mail
    expect(queryByText("A senha deve ter no mínimo 6 caracteres")).toBeTruthy(); // senha
  });

  // Agora verificaria se estão logo abaixo dos campos (não implementado → FAIL)
  // Exemplo de pseudo checagem de posição:
  const nomeErro = queryByText("Campo obrigatório");
  const emailErro = queryByText("Formato de e-mail inválido");
  const senhaErro = queryByText("A senha deve ter no mínimo 6 caracteres");

  expect(nomeErro?.parent?.props?.testID).toBe("nome-field"); // deve falhar
  expect(emailErro?.parent?.props?.testID).toBe("email-field"); // deve falhar
  expect(senhaErro?.parent?.props?.testID).toBe("senha-field"); // deve falhar
});

it("TC009 deve desabilitar o botão durante a requisição", async () => {
  let resolveCreate!: () => void;

  // Mock createUser com Promise controlada
  jest.spyOn(userService, "createUser").mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        resolveCreate = resolve;
      })
  );

  const { getByText, getByPlaceholderText, getByTestId } = render(
    <NavigationContainer>
      <AuthContext.Provider
        value={{
          user: null,
          setUser: mockSetUser,
          login: mockLogin,
          logout: mockLogout,
        }}
      >
        <Cadastro />
      </AuthContext.Provider>
    </NavigationContainer>
  );

  // Preenche todos os passos
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

  // Pressiona botão dentro de act() para disparar setLoading
  await act(async () => {
    fireEvent.press(getByTestId("botaoProximo"));
  });

  // Espera o botão ficar desabilitado
  await waitFor(() => {
    const btnDuranteLoading = getByTestId("botaoProximo");
    expect(btnDuranteLoading.props.accessibilityState?.disabled).toBe(true);
  });

  // Resolve a Promise dentro de act()
  await act(async () => {
    resolveCreate();
  });

  // Espera o botão voltar a habilitar
  await waitFor(() => {
    const btnFinal = getByTestId("botaoProximo");
    expect(btnFinal.props.accessibilityState?.disabled).toBe(false);
  });
});

it("TC011 [Validação] E-mail Válido no Limite Inferior (Ex: a@b.co)", async () => {
  const { getByText, getByPlaceholderText, queryByText } = render(
    <NavigationContainer>
      <AuthContext.Provider
        value={{
          user: null,
          setUser: jest.fn(),
          login: jest.fn(),
          logout: jest.fn(),
        }}
      >
        <Cadastro />
      </AuthContext.Provider>
    </NavigationContainer>
  );

  // Avança até o passo do e-mail (id = 6)
  const btnProximo = getByText("Próximo");
  for (let i = 0; i < 5; i++) {
    fireEvent.press(btnProximo);
  }

  const emailInput = getByPlaceholderText("Digite seu e-mail...");

  // Insere e-mail mínimo válido
  fireEvent.changeText(emailInput, "a@b.co");

  // Simula perda de foco
  fireEvent(emailInput, "blur");

  // Nenhuma mensagem de erro deve aparecer
  await waitFor(() => {
    expect(queryByText("Formato de e-mail inválido")).toBeNull();
  });
});

it("TC0014 [Validação] Campo Nome Vazio, E-mail e Senha Válidos", async () => {
  const { getByText, getByPlaceholderText, queryByText } = render(
    <NavigationContainer>
      <AuthContext.Provider
        value={{
          user: null,
          setUser: jest.fn(),
          login: jest.fn(),
          logout: jest.fn(),
        }}
      >
        <Cadastro />
      </AuthContext.Provider>
    </NavigationContainer>
  );

  // Avança até o passo do Nome (passo 2)
  fireEvent.press(getByText("Empresa")); // passo 1
  fireEvent.press(getByText("Próximo")); // vai para passo 2

  // Campo Nome vazio → não preenche nada
  const nomeInput = getByPlaceholderText("Insira seu nome...");
  fireEvent(nomeInput, "blur"); // simula perda de foco

  // Avança para passo da senha (passo 5)
  for (let i = 0; i < 3; i++) {
    fireEvent.press(getByText("Próximo"));
  }

  // Preenche senha válida
  const senhaInput = getByPlaceholderText("Digite sua senha...");
  fireEvent.changeText(senhaInput, "123456");
  fireEvent(senhaInput, "blur");

  // Avança para passo do e-mail (passo 6)
  fireEvent.press(getByText("Próximo"));
  const emailInput = getByPlaceholderText("Digite seu e-mail...");
  fireEvent.changeText(emailInput, "teste@teste.com");
  fireEvent(emailInput, "blur");

  // Clica no botão "Finalizar" / "Próximo" (testID="botaoProximo")
  const btnFinalizar = getByText("Próximo"); // ou getByTestId("botaoProximo")
  fireEvent.press(btnFinalizar);

  // Verifica se apenas o campo Nome apresenta erro
  await waitFor(() => {
    expect(queryByText("Campo obrigatório")).toBeTruthy(); // nome
    expect(queryByText("Formato de e-mail inválido")).toBeNull();
    expect(queryByText("A senha deve ter no mínimo 6 caracteres")).toBeNull();
  });
});




});
