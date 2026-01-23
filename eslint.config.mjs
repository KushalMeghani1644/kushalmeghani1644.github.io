import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      ".next/**",
      ".vinxi/**",
      ".output/**",
      ".vercel/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "app.config.timestamp_*.js",
      "**/*.gen.ts",
    ],
  }
);
