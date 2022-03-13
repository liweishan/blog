import router from '@/router'
import { getToken } from '@/utils/auth'
import store from './store'

const whiteList = ['/login', '/register', '/retrievePassword']
router.beforeEach(async (to, from, next) => {
  // document.title = to.meta.title
  const hasToken = getToken()
  // 是否有token，有直接跳转
  const { path, meta } = to
  const checkBasePath = whiteList.some(e => e === path)
  // 有token的时候禁止跳转到登录等页面
  if (hasToken && checkBasePath) {
    next({ ...from, replace: true })
  } else if (hasToken || !meta.requireAuth) {
    const hasRoutes = store.getters.routes && store.getters.routes.length
    if (hasRoutes) {
      next()
    } else {
      const { userInfo } = store.getters
      const accessRoutes = await store.dispatch('permission/generateRoutes', userInfo.name)
      if (accessRoutes.length) {
        for (const route of accessRoutes.values()) {
          router.addRoute(route)
        }
      }
      next({ ...to, replace: true })
    }
  } else if (meta.requireAuth) {
    next(`/login?redirect=${path}`)
  }
})

router.afterEach(() => {
  // console.log('afterEach')
})
