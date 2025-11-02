module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/src/__tests__/setup.ts'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(?:' +
      [
        'react-native',
        '@react-native',
        'expo',
        '@expo',
        'expo-modules-core',
        'expo-router',
        'expo-font',
        'expo-asset',
        'expo-constants',
        '@expo-google-fonts',
        '@testing-library',
        '@react-navigation',
        'react-clone-referenced-element',
        '@expo/vector-icons',
      ].join('|') +
      ')/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/', '.csv'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    '\\.png$': '<rootDir>/__mocks__/fileMock.js',
    '\\.jpg$': '<rootDir>/__mocks__/fileMock.js',
  },
};
