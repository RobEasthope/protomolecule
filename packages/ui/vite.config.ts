/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, './components'),
      '@/utils': path.resolve(__dirname, './utils'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './vitest.setup.ts',
    include: ['./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    passWithNoTests: true,
    css: {
      include: [/\.css$/],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/**/*.stories.tsx',
        'src/**/*.stories.ts',
        '*.config.*',
      ],
    },
    cache: {
      dir: '.vitest',
    },
    pool: 'vmThreads',
    poolOptions: {
      vmThreads: {
        maxThreads: 4,
        minThreads: 1,
      },
    },
  },
});
