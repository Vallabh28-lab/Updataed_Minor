import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['vitest.global-setup.js'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/test/**',
        '**/__tests__/**',
        'vitest.config.js',
        'vitest.global-setup.js',
        'vite.config.ts',
        'tsconfig*.json',
      ],
      thresholds: {
        lines: 50,
        functions: 45,
        branches: 45,
        statements: 50,
      },
    },
  },
});
