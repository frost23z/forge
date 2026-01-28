import css from "@eslint/css"
import js from "@eslint/js"
import json from "@eslint/json"
import markdown from "@eslint/markdown"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import pluginReact from "eslint-plugin-react"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
    {
        ignores: ["build/**", ".docusaurus/**"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.browser },
    },
    tseslint.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        ...pluginReact.configs.flat.recommended,
        settings: { react: { version: "detect" } },
        rules: {
            "react/react-in-jsx-scope": "off", // Not needed for React 17+
        },
    },
    {
        files: ["**/*.json"],
        plugins: { json },
        language: "json/json",
        extends: ["json/recommended"],
        ignores: ["package-lock.json"],
    },
    {
        files: ["**/*.jsonc", "tsconfig*.json"],
        plugins: { json },
        language: "json/jsonc",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.md"],
        plugins: { markdown },
        language: "markdown/gfm",
        extends: ["markdown/recommended"],
        rules: {
            "markdown/no-missing-label-refs": "off", // Allows missing label refs in blog posts
        },
    },
    { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
    eslintConfigPrettier,
])
