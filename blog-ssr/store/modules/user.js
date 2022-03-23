import {
  getToken,
  setToken,
  getUser,
  setUser,
  clearStorage
} from '@/utils/auth'
import { login } from '@/api/user'

const state = {
  token: getToken(),
  userInfo: getUser()
}

const mutations = {
  SET_TOKEN: (s, val) => {
    state.token = val
    setToken(val)
  },
  SET_USERINFO: (s, val) => {
    state.userInfo = val
    setUser(val)
  }
}

const actions = {
  async login({ commit }, opt) {
    const { userName, userPsd } = opt
    try {
      const res = await login({ name: userName.trim(), password: userPsd })
      const { data } = res
      commit('SET_TOKEN', data.token)
      commit('SET_USERINFO', data)
      return data
    } catch (err) {
      return Promise.reject(err)
    }
  },
  logout({ commit }) {
    clearStorage()
    commit('SET_TOKEN', '')
    commit('SET_USERINFO', {})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
