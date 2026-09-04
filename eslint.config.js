import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  { ignores: ['.astro/**', 'dist/**'] },
  tseslint.configs.base,
  ...astro.configs.recommended,
  {
    files: ['**/*.ts', '**/*.astro'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
