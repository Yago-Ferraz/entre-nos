import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  HAS_SEEN_ONBOARDING: '@entrenos:hasSeenOnboarding',
  USER_TOKEN: '@entrenos:userToken',
};

export const storageService = {
  // Verifica se o usuário já viu o onboarding
  async hasSeenOnboarding(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
      return value === 'true';
    } catch (error) {
      console.error('Erro ao verificar onboarding:', error);
      return false;
    }
  },

  // Marca que o usuário viu o onboarding
  async setHasSeenOnboarding(value: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, value.toString());
    } catch (error) {
      console.error('Erro ao salvar onboarding:', error);
    }
  },

  // Salva o token do usuário
  async setUserToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  },

  // Obtém o token do usuário
  async getUserToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  },

  // Remove o token do usuário (logout)
  async removeUserToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  },

  // Limpa todos os dados (útil para desenvolvimento)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar storage:', error);
    }
  },
};
