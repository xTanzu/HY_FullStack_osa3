module.exports = {
  "env": {
    "node": true,
    "commonjs": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "overrides": [
    {
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      },
      // "rules": {
      //   // "no-unused-vars": ["error", { "args": "none" }]
      //   "no-unused-vars": 0,
      // }
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "never"
    ],
    "eqeqeq": "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": [
      "error", "always"
    ],
    "arrow-spacing": [
      "error", { "before": true, "after": true }
    ],
    "no-console": 0,
    "no-unused-vars": ["error", { "args": "none" }],
  }
}
