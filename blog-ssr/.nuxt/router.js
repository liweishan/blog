import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _b2b3f538 = () => interopDefault(import('..\\pages\\app.vue' /* webpackChunkName: "pages/app" */))
const _6cdaa289 = () => interopDefault(import('..\\pages\\app\\about\\index.vue' /* webpackChunkName: "pages/app/about/index" */))
const _15f30a80 = () => interopDefault(import('..\\pages\\app\\article\\index.vue' /* webpackChunkName: "pages/app/article/index" */))
const _1bac8442 = () => interopDefault(import('..\\pages\\app\\home\\index.vue' /* webpackChunkName: "pages/app/home/index" */))
const _5899cc66 = () => interopDefault(import('..\\pages\\app\\home\\components\\index.js' /* webpackChunkName: "pages/app/home/components/index" */))
const _a2523872 = () => interopDefault(import('..\\pages\\app\\about\\components\\canvas.vue' /* webpackChunkName: "pages/app/about/components/canvas" */))
const _125a3324 = () => interopDefault(import('..\\pages\\app\\home\\components\\About.vue' /* webpackChunkName: "pages/app/home/components/About" */))
const _e1e621d0 = () => interopDefault(import('..\\pages\\app\\home\\components\\Navig.vue' /* webpackChunkName: "pages/app/home/components/Navig" */))
const _43ecbbc8 = () => interopDefault(import('..\\pages\\app\\home\\components\\NewArt.vue' /* webpackChunkName: "pages/app/home/components/NewArt" */))
const _d4b05acc = () => interopDefault(import('..\\pages\\app\\article\\_id\\index.vue' /* webpackChunkName: "pages/app/article/_id/index" */))
const _8be9f66a = () => interopDefault(import('..\\pages\\app\\article\\_id\\components\\index.js' /* webpackChunkName: "pages/app/article/_id/components/index" */))
const _4ecbda9e = () => interopDefault(import('..\\pages\\app\\article\\_id\\components\\Comment.vue' /* webpackChunkName: "pages/app/article/_id/components/Comment" */))
const _c05adf3c = () => interopDefault(import('..\\pages\\app\\article\\_id\\components\\NextPrve.vue' /* webpackChunkName: "pages/app/article/_id/components/NextPrve" */))
const _0f42b3bd = () => interopDefault(import('..\\pages\\error\\404.vue' /* webpackChunkName: "pages/error/404" */))
const _2cde99e1 = () => interopDefault(import('..\\pages\\user\\login\\index.vue' /* webpackChunkName: "pages/user/login/index" */))
const _72159667 = () => interopDefault(import('..\\pages\\user\\register\\index.vue' /* webpackChunkName: "pages/user/register/index" */))
const _4ffcb45e = () => interopDefault(import('..\\pages\\user\\retrieve-password\\index.vue' /* webpackChunkName: "pages/user/retrieve-password/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/blog/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/app",
    component: _b2b3f538,
    name: "app",
    children: [{
      path: "about",
      component: _6cdaa289,
      name: "app-about"
    }, {
      path: "article",
      component: _15f30a80,
      name: "app-article"
    }, {
      path: "home",
      component: _1bac8442,
      name: "app-home"
    }, {
      path: "home/components",
      component: _5899cc66,
      name: "app-home-components"
    }, {
      path: "about/components/canvas",
      component: _a2523872,
      name: "app-about-components-canvas"
    }, {
      path: "home/components/About",
      component: _125a3324,
      name: "app-home-components-About"
    }, {
      path: "home/components/Navig",
      component: _e1e621d0,
      name: "app-home-components-Navig"
    }, {
      path: "home/components/NewArt",
      component: _43ecbbc8,
      name: "app-home-components-NewArt"
    }, {
      path: "article/:id",
      component: _d4b05acc,
      name: "app-article-id"
    }, {
      path: "article/:id/components",
      component: _8be9f66a,
      name: "app-article-id-components"
    }, {
      path: "article/:id/components/Comment",
      component: _4ecbda9e,
      name: "app-article-id-components-Comment"
    }, {
      path: "article/:id/components/NextPrve",
      component: _c05adf3c,
      name: "app-article-id-components-NextPrve"
    }]
  }, {
    path: "/error/404",
    component: _0f42b3bd,
    name: "error-404"
  }, {
    path: "/user/login",
    component: _2cde99e1,
    name: "user-login"
  }, {
    path: "/user/register",
    component: _72159667,
    name: "user-register"
  }, {
    path: "/user/retrieve-password",
    component: _4ffcb45e,
    name: "user-retrieve-password"
  }, {
    path: "*",
    component: _0f42b3bd,
    name: "custom"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
