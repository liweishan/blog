import { getCookieAll } from '~/utils/cookie'

export default function (context) {
  // 是否热模块
  if (context.isHMR) return
  const cookie = context.req?.headers.cookie
  if (cookie) {
    const cookies = getCookieAll(cookie)
    context.store.commit('user/SET_TOKEN', cookies.token)
    context.store.commit('user/SET_USERINFO', cookies.user ? JSON.parse(cookies.user) : {})
  }
}
