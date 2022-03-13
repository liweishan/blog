import { getClientHeight, getClientWidth, hasPc } from '@/utils/app'

const state = {
  width: 0,
  height: 0,
  isPc: true
}

const mutations = {
  SET_WIDTH: (s, width) => {
    state.width = width
  },
  SET_HEIGHT: (s, height) => {
    state.height = height
  },
  set_IS_PC: (s, isPc) => {
    state.isPc = isPc
  }
}

const actions = {
  setWindowState({ commit }) {
    const width = getClientWidth()
    const height = getClientHeight()
    const isPc = hasPc()
    commit('SET_WIDTH', width)
    commit('SET_HEIGHT', height)
    commit('set_IS_PC', isPc)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
