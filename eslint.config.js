import { vinicuncaESLint } from '@vinicunca/eslint-config';

export default vinicuncaESLint(
  {
    pnpm: true,

    rules: {
      'import/first': 'off',
      'import/order': 'off',
    },
  },
);
