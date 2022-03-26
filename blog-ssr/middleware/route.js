export default function ({ isHMR, route, redirect, store }) {
  if (isHMR) return
  // cookie.js中间件先执行，如果有token这里是可以拿到的
  if (['/', '/app', '/app/'].includes(route.fullPath)) {
    // 根目录重定向到首页
    return redirect('/app/home')
  } else if (['/user', '/user/'].includes(route.fullPath)) {
    // /user路由且没有token重定向到/login页面
    return redirect('/user/login')
  }
}
