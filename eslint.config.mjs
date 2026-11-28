import { tanstackConfig } from "@tanstack/eslint-config"

export default [
  ...tanstackConfig,
  {
    ignores: [
      ".next/**",
      ".vinxi/**",
      ".output/**",
      ".vercel/**",
      ".delta/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "app.config.timestamp_*.js",
      "**/*.gen.ts",
    ],
  },
]
