import globals from 'globals';
import pluginJs from '@eslint/js';
import neostandard from 'neostandard';

export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...neostandard({
    semi: ['error', 'always'],
    'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
    'prefer-const': 'warn',
    'no-duplicate-imports': 'error',

  }),

];
