import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Only include tests from the scripts directory
    include: ['**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // Only cover TypeScript files in the scripts directory (relative to root)
      include: ['*.ts'],
      exclude: ['*.test.ts', 'vitest.config.ts', 'tsconfig.json'],
      all: true,
      // Set working directory for coverage
      reportsDirectory: 'coverage'
    }
  },
  // Set root to scripts directory
  root: resolve(__dirname)
});
