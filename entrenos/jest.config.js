// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [
  '@testing-library/jest-native/extend-expect',
  '<rootDir>/jest.setup.js'
],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest', // transforma TS/JS/JSX/TSX
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:' +
      [
        'react-native',
        '@react-native',
        'expo',
        '@expo',
        'expo-font',
        'expo-asset',
        'expo-constants',
        'expo-file-system',
        'expo-modules-core',
        '@expo-google-fonts',
        '@expo/vector-icons',
        '@react-navigation',
        '@testing-library',
        'react-native-vector-icons',
        'react-native-gesture-handler',
        'react-native-reanimated',
        'react-clone-referenced-element',
      ].join('|') +
      ')/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
