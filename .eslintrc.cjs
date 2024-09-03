// eslint-disable-next-line no-undef
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  overrides: [
    {
      files: ['*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        'project': './tsconfig.json'
      }
    }
  ],
  rules: {
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'always']
  }
};