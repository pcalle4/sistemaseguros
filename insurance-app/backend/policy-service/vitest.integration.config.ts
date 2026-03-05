import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['test/integration/**/*.spec.ts'],
    hookTimeout: 120000,
    testTimeout: 120000,
    pool: 'forks',
  },
});
