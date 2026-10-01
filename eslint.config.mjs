import next from 'eslint-config-next';
import globals from 'globals';

export default [
  ...next,
  {
    name: 'project/import-order',
    files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
    },
  },
  {
    // These three rules were introduced with the React Compiler-aware lint set.
    // They flag real smells, but the existing codebase predates them and the
    // affected call sites are being rewritten as part of the data-layer tickets
    // (#152, #153, #154). Downgraded to warnings so `pnpm lint` can act as a
    // gate now; they should be restored to 'error' once those tickets land.
    name: 'project/legacy-debt',
    files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react/no-unescaped-entities': 'warn',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'storybook-static/**',
      'next-env.d.ts',
    ],
  },
];
