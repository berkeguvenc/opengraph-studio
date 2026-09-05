import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node', // Code generation tests mostly just involve string manipulation
    globals: true,
  },
})
