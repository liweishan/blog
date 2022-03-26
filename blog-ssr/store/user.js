import {
  getToken,
  setToken,
  getUser,
  setUser,
  clearStorage
} from '@/utils/auth'
import { setCookieAll, clearCookieAll } from '~/utils/cookie'
import { login } from '@/api/user'

const state = () => ({
  token: getToken(),
  userInfo: getUser()
})

const mutations = {
  SET_TOKEN: (s, val) => {
    s.token = val
  },
  SET_USERINFO: (s, val) => {
    s.userInfo = val
  }
}

const actions = {
  async login({ commit }, opt) {
    const { userName, userPsd, rememberPsd } = opt
    const data = {
      name: userName.trim(),
      password: userPsd
    }
    try {
      const res = await login(data)
      if (rememberPsd) {
        setCookieAll(opt, 7)
      } else {
        clearCookieAll(Object.keys(opt))
      }
      const userInfo = res.data
      commit('SET_TOKEN', userInfo.token)
      commit('SET_USERINFO', userInfo)
      setToken(userInfo.token)
      setUser(userInfo)
      return userInfo
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
