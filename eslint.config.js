import { vinicuncaESLint } from '@vinicunca/eslint-config';

export default vinicuncaESLint(
  {
    pnpm: true,

    rules: {
      'import/first': 'off',
      'import/order': 'off',
      /**
       * We need to turn this off since within vue templates we use a lot of type casting and if we don't wrap it
       * in parenthesis, the syntax highlighting will break.
       */
      'vue/no-extra-parens': 'off',

      // TODO: remove this rule when we update @vinicunca/eslint-config to 3.11.0
      'vue/custom-event-name-casing': ['error', 'camelCase', {
        ignores: [
          '/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u',
        ],
      }],

      'ts/no-empty-object-type': 'off',
      'ts/no-explicit-any': 'off',
    },
  },
);
