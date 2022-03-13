module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': 'off',
    'semi': 'off',
    'linebreak-style': ['off', 'windows'],
    'arrow-parens': 'off',
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
    'no-async-promise-executor': 'off'
  }
}
