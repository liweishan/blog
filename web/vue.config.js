const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

const path = require('path')

module.exports = {
  publicPath: '/',
  productionSourceMap: process.env.VUE_APP_CURRENTMODE === 'test' ? true : false, // 测试打包需要调试文件，正式打包不需要
  outputDir: process.env.VUE_APP_CURRENTMODE, // 打包后的文件名
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#5DD5C8'
        },
        javascriptEnabled: true
      }
    }
  },
  // lintOnSave: false,
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://tp5.com',
        // target: 'https://www.liweishan.top',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV !== 'production') return;
    return {
      plugins: [
        new PrerenderSPAPlugin({
          staticDir: path.join(__dirname, process.env.VUE_APP_CURRENTMODE),
          routes: ['/home', '/article', '/about', '/login'],
          renderer: new Renderer({
            inject: {
              foo: 'bar'
            },
            headless: false,
            renderAfterDocumentEvent: 'render-event'
          })
        })
      ]
    }
  }
}