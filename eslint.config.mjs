import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  tseslint.configs.recommended,

  // Allow intentionally-unused identifiers when prefixed with an underscore
  // (e.g. required-but-unused Express handler params such as `_next`).
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Serialization boundary: these layers translate untyped external data
  // (JSON / XML / CSV payloads and raw DB rows) into domain objects, so an
  // explicit `any` at this edge is intentional. Business logic stays strict.
  {
    files: ["src/mappers/**", "src/parsers/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
