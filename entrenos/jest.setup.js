process.env.EXPO_OS = 'ios';

import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('react-native-screens', () => ({
    ...jest.requireActual('react-native-screens'),
    enableScreens: jest.fn(),
}));

jest.mock('expo-modules-core', () => ({
    ...jest.requireActual('expo-modules-core'),
    NativeModulesProxy: {
        ...jest.requireActual('expo-modules-core').NativeModulesProxy,
        EXDevLauncher: {},
        ExpoFontLoader: {}
    },
}));

jest.mock('expo-font', () => ({
  loadAsync: () => Promise.resolve(),
  isLoaded: () => true,
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  FontAwesome: 'FontAwesome',
}));


jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock for react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is what we want
  Reanimated.default.call = (callback) => callback();

  return Reanimated;
});

// Comprehensive mock for react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => children, // Mock SafeAreaProvider
  SafeAreaView: ({ children }) => children, // Mock SafeAreaView
}));

// Comprehensive mock for react-native
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    RN.NativeModules.UIManager.getConstants = () => ({
        someConstant: 'someValue',
    });
    return RN;
});