import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      { find: 'crypto', replacement: 'node:crypto' },
      // Force CJS resolution for @kiro/agent. Its ESM build bundles cross-spawn via
      // rolldown's CJS runtime, which calls require() at module load — that crashes
      // under Node's native ESM loader. The CJS build uses real require() and works.
      {
        find: /^@kiro\/agent$/,
        replacement: new URL('../../node_modules/@kiro/agent/dist/index.cjs', import.meta.url).pathname,
      },
    ],
  },
  test: {
    setupFiles: ['vitest.global-setup.js'],
    server: {
      deps: {
        external: [/@kiro\/agent/, /@kiro\/shared/],
      },
    },
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.test.ts', '**/*.pbt-test.ts', '**/__tests__/**', '**/__mocks__/**'],
      thresholds: {
        lines: 63,
        functions: 62,
        branches: 57,
        statements: 63,
        'src/auth/portal/**': {
          lines: 90,
          functions: 85,
          branches: 88,
          statements: 90,
        },
        'src/mcp/{oauth,registry}/**': {
          lines: 85,
          functions: 67,
          branches: 73,
          statements: 85,
        },
        'src/storage/**': {
          lines: 90,
          functions: 100,
          branches: 82,
          statements: 90,
        },
        'src/utils/**': {
          lines: 95,
          functions: 95,
          branches: 85,
          statements: 95,
        },
        'src/telemetry/**': {
          lines: 85,
          functions: 95,
          branches: 90,
          statements: 84,
        },
      },
    },
  },
});
