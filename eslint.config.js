import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        React: true,
        JSX: true,
        // Chrome extension globals
        chrome: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'no-undef': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': 'off',
      'no-unused-vars': 'off',
      'no-case-declarations': 'off',
    },
  },
  // Separate configuration for Chrome extension files
  {
    files: ['Sheet-to-Form-Automator/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        // Chrome extension specific globals
        chrome: 'readonly',
        console: 'readonly',
        document: 'readonly',
        window: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        fetch: 'readonly',
        Audio: 'readonly',
        MouseEvent: 'readonly',
        Event: 'readonly',
        KeyboardEvent: 'readonly',
        XPathResult: 'readonly',
      },
      parserOptions: {
        sourceType: 'script', // Chrome extension scripts are not modules
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': 'off',
      'no-case-declarations': 'off',
    },
  },
];