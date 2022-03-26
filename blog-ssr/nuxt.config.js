import env from './data/env'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'blog-ssr',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/blog/favicon.ico' },
      { rel: 'stylesheet', href: '//at.alicdn.com/t/font_1729647_b7q9lmf0sqn.css' }
    ]
  },
  env: {
    NUXT_ENV: env[process.env.MODE]
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // 'ant-design-vue/dist/antd.less',
    '~assets/style/base.less'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // '@/plugins/antd-ui'
    { src: '@/plugins/axios.js' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    analyze: true,
    transpile: [/ant-design-vue/],
    babel: {
      plugins: [
        [
          'import',
          {
            libraryName: 'ant-design-vue',
            libraryDirectory: 'es',
            style: true
          }
        ]
      ]
    },
    loaders: {
      less: {
        modifyVars: {
          'primary-color': '#5DD5C8'
        },
        javascriptEnabled: true
      }
    }
  },
  router: {
    // middleware: 'route'  // 即每次路由跳转会调用该中间件
    base: '/blog',
    middleware: ['cookie', 'route'], // 多个中间件写法，并且哪个文件名在前就优先执行
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: 'custom',
          path: '*',
          component: resolve(__dirname, 'pages/error/404.vue')
        }
      )
    }
  }
}
