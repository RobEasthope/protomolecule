import type { Linter } from 'eslint';

// ESLint configuration for release automation scripts
// These scripts have different requirements than production code:
// - Console logging is essential for CI/CD output
// - Abbreviated names are common and acceptable in automation scripts
// - Scripts may use patterns optimized for clarity over strictness

const config: Linter.Config[] = [
  {
    files: ['**/*.ts', '**/*.test.ts'],
    rules: {
      // Allow console methods - essential for CI/CD logging
      'no-console': 'off',

      // Allow abbreviated names common in automation scripts
      'unicorn/prevent-abbreviations': 'off',

      // Allow unused vars in test files (test fixtures)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          // Allow unused imports in test files
          ignoreRestSiblings: true
        }
      ],

      // Allow any in tests for mock data
      '@typescript-eslint/no-explicit-any': 'warn',

      // Allow promise/then for better error handling in scripts
      'promise/prefer-await-to-then': 'off',

      // Allow consistent-return for script exit patterns
      'consistent-return': 'off'
    }
  }
];

export default config;
