module.exports = {
  root: true,
  extends: [
    '@react-native',
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error'
  },
  env: {
    'react-native/react-native': true,
    jest: true,
    node: true,
    es6: true
  },
  settings: {
    'react-native/style-sheet-object-names': ['StyleSheet', 'styles']
  },
  ignorePatterns: ['lib/', 'node_modules/', 'coverage/']
}; 