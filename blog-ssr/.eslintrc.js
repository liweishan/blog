module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'vue/multi-word-component-names': 0,
    curly: 0,
    'space-before-function-paren': 0,
    'arrow-parens': 0,
    camelcase: 0,
    'vue/no-v-html': 0,
    'import/namespace': 0
  }
}
