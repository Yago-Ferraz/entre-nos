import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

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
  SafeAreaProvider: ({ children }: any) => children, // Mock SafeAreaProvider
  SafeAreaView: ({ children }: any) => children, // Mock SafeAreaView
}));

// Comprehensive mock for react-native
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  Image: 'Image',
  TextInput: 'TextInput',
  TouchableOpacity: 'TouchableOpacity',
  Alert: {
    alert: jest.fn(),
  },
  StyleSheet: {
    create: (styles: any) => styles,
    flatten: jest.fn((style) => style),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 300, height: 600 })), // Mock a default window size
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((options: any) => options.ios),
  },
}));