module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'standard',
    // Optional: you could use 'eslint:recommended' for a basic rule set
    // Or 'plugin:node/recommended' for relaxed node rules
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // General Style – set to warn or off for flexibility:
    semi: 'warn', // won’t block build, just warns
    'comma-dangle': 'off', // allow trailing commas
    camelcase: 'off', // allow snake_case or PascalCase
    'space-before-function-paren': 'off', // don’t enforce space
    'no-multi-spaces': 'warn',
    'object-shorthand': 'off',
    quotes: ['warn', 'single', { avoidEscape: true }],
    'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
    // You can add/remove more rules depending on your needs
    // 'indent': ['warn', 2], // only warn if incorrect indentation
  },
}
