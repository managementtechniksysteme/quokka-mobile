module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  env: {
    node: true
  },
  plugins: [
    "react",
    "react-hooks",
    "react-native",
    "@typescript-eslint"
  ],
  extends: [
    "eslint:recommended", 
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  rules: {
    "react/no-did-mount-set-state": "error",
    "react/no-direct-mutation-state": "error",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-vars": "error",
    "no-undef": "error",
    "react/prop-types": "error",
    "react/jsx-no-bind": "error",
    "react/jsx-no-duplicate-props": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  settings: {
    react: {
      version: "detect"
    },
  },
}
