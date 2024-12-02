import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginJest from "eslint-plugin-jest";

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    languageOptions: { globals: globals.browser },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["**/*.{test,spec}.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    plugins: {
      jest: pluginJest,
    },
    extends: ["plugin:jest/recommended", "plugin:jest/style"],
  },
];
