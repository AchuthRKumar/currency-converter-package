import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['**/dist/', '**/build/', '**/node_modules/'],
  },

  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },

  eslintConfigPrettier,
);
