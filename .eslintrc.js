/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "eslint:recommended"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  rules: {
    "no-unused-vars": "warn",
    "no-undef": "error",
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  }
};