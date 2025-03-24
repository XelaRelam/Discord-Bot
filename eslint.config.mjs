import eslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser";

export default [
  {
    plugins: {
      "@typescript-eslint": eslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    ignores: [
      "*/node_modules/*",
      "*dist/**/*.d.ts",
      "./.github/*",
      "scripts/*"
    ],
    files: [
      "**/*.ts"
    ],
    rules: {
      indent: [
        "error",
        2,
        {
          SwitchCase: 1
        }
      ],
      semi: "error",
    }
  }
];