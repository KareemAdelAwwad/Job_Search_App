import pluginJs from "@eslint/js";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-multiple-empty-lines": ["warn", { "max": 1 }],
      semi: ["warn", "always"],
      quotes: ["warn", "double"],
      "no-unused-vars": "warn",
      "arrow-body-style": ["warn", "as-needed"],
    }
  }
];