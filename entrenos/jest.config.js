module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(?:' +
      [
        'react-native',
        '@react-native',
        'expo',
        '@expo',
        'expo-modules-core',
        'expo-router',
        '@expo-google-fonts',
        '@testing-library',
        '@react-navigation',
        'react-clone-referenced-element',
      ].join('|') +
      ')/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
