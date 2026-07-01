import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import simpleImport from "eslint-plugin-simple-import-sort";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";
import unusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  {
    ignores: ["node_modules/", "dist/"],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      react: react,
      import: importPlugin,
      js,
      "react-hooks": reactHooks,
      "simple-import-sort": simpleImport,
      "@typescript-eslint": tseslint.plugin,
      "unused-imports": unusedImports,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",

      // コンポーネント名をパスカルケース
      "react/jsx-pascal-case": "error",

      "@typescript-eslint/naming-convention": [
        "error",
        {
          // 関数の引数をキャメルケース
          selector: "parameter",
          format: ["camelCase"],
        },
        {
          // 変数をキャメルケース
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
        },
        {
          // booleanの変数の始まり方
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: ["is", "can", "has", "open"],
        },
        {
          // Arrayの変数の終わり方
          selector: "variable",
          types: ["array"],
          format: ["camelCase"],
          suffix: ["s", "List"],
        },
      ],
      // ネストの深さ
      "max-depth": ["error", { max: 3 }],
      complexity: ["error", { max: 20 }],

      "react/jsx-closing-tag-location": "error",
      "react/jsx-curly-spacing": "error",
      "react/self-closing-comp": "error",
      "react/no-multi-comp": "error",

      "@typescript-eslint/no-unused-vars": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: ["../*", "./*"],
        },
      ],
      "unused-imports/no-unused-imports": "error",
    },
    settings: {
      react: { version: "detect" },
    },
    extends: ["js/recommended", "@typescript-eslint/recommended"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.browser,
    },
  },
  prettier,
]);
