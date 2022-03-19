// import { constantRoutes, asyncRoutes } from '@/router/router'
// import navs, { asyncNavs } from '@/router/nav'

const state = {
  navs: [],
  addRoutes: [],
  routes: []
}

const mutations = {
  SET_NAVS: (s, navArr) => {
    state.navs = navArr
  },
  SET_ROUTES: (s, routes) => {
    state.addRoutes = routes
    // state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, role) {
    return new Promise(resolve => {
      let accessedRoutes
      if (role === 'root') {
        accessedRoutes = asyncRoutes || []
        commit('SET_NAVS', navs.concat(asyncNavs))
      } else {
        accessedRoutes = []
        commit('SET_NAVS', navs)
      }
      const route404 = {
        path: '*',
        redirect: '/404',
        hidden: true
      }
      accessedRoutes.push(route404)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
