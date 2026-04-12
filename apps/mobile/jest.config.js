// pnpm monorepo: packages live in ../../node_modules/.pnpm/<pkg>@ver/node_modules/<pkg>/
// transformIgnorePatterns must allow the inner node_modules of matching packages to be transformed.
// We match on the inner "node_modules/<pkg>" segment for the packages we want transformed.
const allowList = [
  '(jest-)?react-native',
  '@react-native(-community)?',
  '@react-native/[a-z-]+',
  'expo(nent)?',
  '@expo(nent)?(/.*)?',
  '@expo-google-fonts(/.*)?',
  'react-navigation',
  '@react-navigation(/.*)?',
  '@unimodules(/.*)?',
  'unimodules',
  'sentry-expo',
  'native-base',
  'react-native-svg',
  '@gorhom(/.*)?',
].join('|');

module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  transformIgnorePatterns: [
    // This handles both standard and pnpm .pnpm virtual store layouts.
    // The regex: ignore if the last "node_modules/<thing>" in the path is NOT in the allowList.
    `node_modules/(?!.*node_modules/(?:${allowList})|(?:${allowList}))`,
  ],
  moduleNameMapper: {
    // react-native-svg triggers native bridge in jest; replace with a no-op.
    '^react-native-svg$': '<rootDir>/src/__mocks__/react-native-svg.js',
    '^react-native-svg/(.*)$': '<rootDir>/src/__mocks__/react-native-svg.js',
  },
};
