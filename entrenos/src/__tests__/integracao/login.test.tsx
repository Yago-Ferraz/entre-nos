import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../views/login/LoginScreen';
import { AuthProvider } from '../../AuthContext';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_PUBLIC, API_AUTH } from '../../services/api';
import { ROUTES } from '../../Routes';

// Mocking react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons', // Mock Ionicons as a simple component
  // Add other icon sets if used in components under test
}));

// Mock expo-modules-core and expo-constants
jest.mock('expo-modules-core', () => ({
  ...jest.requireActual('expo-modules-core'),
  // Mock NativeModulesProxy to prevent errors related to native modules
  NativeModulesProxy: {
    // Mock any specific modules that might be accessed
    // e.g., if "ExponentConstants" is accessed, mock it here.
    ExponentConstants: {
      appOwnership: 'expo',
      // Add other properties if needed by your app
    },
    // Mock for DevMenu (if still causing issues)
    DevMenu: {
      show: jest.fn(),
      hide: jest.fn(),
    },
    // Mock for other Expo native modules that might be imported
    // For example, if you see warnings about "EXNativeModulesProxy"
    // it means a module was trying to access a native module.
  },
  // Also ensure process.env.EXPO_OS is defined if your code relies on it.
  Platform: {
    ...jest.requireActual('expo-modules-core').Platform,
    OS: 'ios',
    // Define other platform specific properties if used
  },
}));

// Mock react-native
jest.mock('react-native', () => ({
  // Core components
  View: 'View',
  Text: 'Text',
  Image: 'Image',
  TextInput: 'TextInput',
  TouchableOpacity: 'TouchableOpacity',
  // Alert module
  Alert: {
    alert: jest.fn(),
  },
  // Other commonly used React Native exports that tests might need
  StyleSheet: {
    create: (styles: any) => styles,
    flatten: jest.fn((style) => style), // Add flatten mock
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((options: any) => options.ios),
  },
  // NativeModules is now handled by expo-modules-core mock for DevMenu
  // If other native modules are accessed directly via ReactNative.NativeModules,
  // they would need to be mocked here.
}));

// Mock @react-navigation/native
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock axios instances
jest.mock('../../services/api', () => ({
  API_PUBLIC: {
    post: jest.fn(),
  },
  API_AUTH: {
    get: jest.fn(),
  },
}));

describe('LoginScreen Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should display error message for empty email and password', async () => {
    const { getByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    fireEvent.press(getByText('Fazer Login'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Preencha e-mail e senha.');
    });
    expect(API_PUBLIC.post).not.toHaveBeenCalled();
  });

  it('should display error message for invalid email format', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Insira seu E-mail'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Insira sua senha'), 'password123');
    fireEvent.press(getByText('Fazer Login'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'E-mail inválido.');
    });
    expect(API_PUBLIC.post).not.toHaveBeenCalled();
  });

  it('should successfully log in with valid credentials', async () => {
    // Mock successful API responses
    (API_PUBLIC.post as jest.Mock).mockResolvedValueOnce({
      data: { access: 'mock_access_token' },
    });
    (API_AUTH.get as jest.Mock).mockResolvedValueOnce({
      data: { id: 1, email: 'test@example.com', name: 'Test User' },
    });

    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Insira seu E-mail'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Insira sua senha'), 'password123');
    fireEvent.press(getByText('Fazer Login'));

    await waitFor(() => {
      expect(API_PUBLIC.post).toHaveBeenCalledWith('/auth/jwt/create/', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(API_AUTH.get).toHaveBeenCalledWith('/auth/users/me/', {
        headers: { Authorization: 'Bearer mock_access_token' },
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@user',
        JSON.stringify({ id: 1, email: 'test@example.com', name: 'Test User', token: 'mock_access_token' })
      );
      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });


  it('should display a generic error message for unexpected API errors (e.g., 500)', async () => {
    (API_PUBLIC.post as jest.Mock).mockRejectedValueOnce({
      response: { status: 500 },
      isAxiosError: true,
    });

    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Insira seu E-mail'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Insira sua senha'), 'password123');
    fireEvent.press(getByText('Fazer Login'));

    await waitFor(() => {
      expect(API_PUBLIC.post).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro',
        'Ocorreu um erro inesperado. Tente novamente mais tarde.'
      );
    });
  });

  it('should display error for invalid credentials (401)', async () => {
    (API_PUBLIC.post as jest.Mock).mockRejectedValueOnce({
      response: { status: 401 },
      isAxiosError: true,
    });

    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Insira seu E-mail'), 'wrong@example.com');
    fireEvent.changeText(getByPlaceholderText('Insira sua senha'), 'wrongpassword');
    fireEvent.press(getByText('Fazer Login'));

    await waitFor(() => {
      expect(API_PUBLIC.post).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'E-mail ou senha incorretos.');
    });
  });

  it('should display error for rate limit exceeded (429)', async () => {
    (API_PUBLIC.post as jest.Mock).mockRejectedValueOnce({
      response: { status: 429 },
      isAxiosError: true,
    });

    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Insira seu E-mail'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Insira sua senha'), 'password123');
    fireEvent.press(getByText('Fazer Login'));

    await waitFor(() => {
      expect(API_PUBLIC.post).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        'Limite de Tentativas Excedido',
        'Você excedeu o número máximo de tentativas de login. Tente novamente mais tarde.'
      );
    });
  });

  it('should navigate to sign up screen when "Criar conta" is pressed', async () => {
    const { getByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SIGN_UP);
    });
  });

  it('should navigate to forgot password screen when "Esqueceu sua senha?" is pressed', async () => {
    const { getByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    fireEvent.press(getByText('Esqueceu sua senha?'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.FORGOT_PASSWORD);
    });
  });

});