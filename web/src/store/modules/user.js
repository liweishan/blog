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
  },
  SET_USERINFO: (s, val) => {
    state.userInfo = val
  }
}

const actions = {
  login({ commit }, opt) {
    return new Promise(async (resolve, reject) => {
      const { userName, userPsd } = opt
      try {
        const res = await login({ name: userName.trim(), password: userPsd })
        const { data } = res
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        commit('SET_USERINFO', data)
        setUser(data)
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
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
