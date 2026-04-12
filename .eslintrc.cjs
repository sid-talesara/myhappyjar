module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  ignorePatterns: ['node_modules', 'dist', 'apps/landing', '.expo', 'android', 'ios'],
  overrides: [
    {
      files: ['packages/core/**/*.ts'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['react-native', 'expo', 'expo-*'], message: 'packages/core must stay pure TS (no RN/Expo)' }
          ]
        }]
      }
    }
  ]
};
