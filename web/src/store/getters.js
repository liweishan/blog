const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  width: state => state.app.width,
  height: state => state.app.height,
  isPc: state => state.app.isPc,
  navs: state => state.permission.navs,
  addRoutes: state => state.permission.addRoutes,
  routes: state => state.permission.routes
}

export default getters
