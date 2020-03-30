import Vue from 'vue'
// import _ from 'lodash'
import { Message } from 'element-ui'
import { getChinaArea, getQnaireById, getUserInfo, login, submitAnswer } from '@/utils/requests'
import { setToken } from '~/utils/cookies'

export const state = () => ({
  mobile: false,
  qnaire: {},
  answer: [],
  id: 0,
  token: '',
  showLoginModal: false,
  chinaArea: [],
  userInfo: {},
  role: '',
  files: []
})

export const mutations = {
  changeRole (state, payload) {
    state.role = payload
  },
  setMobile (state, payload) {
    state.mobile = payload
  },
  setID (state, payload) {
    state.id = payload
  },
  setQnaire (state, payload) {
    state.qnaire = payload
  },
  setToken (state, payload) {
    state.token = payload
  },
  setChinaArea (state, payload) {
    state.chinaArea = payload
  },
  setUserInfo (state, payload) {
    state.userInfo = payload
  },
  toggleLoginModal (state) {
    state.showLoginModal = !state.showLoginModal
  },
  initAnswer (state) {
    const temp = []
    state.qnaire.form.forEach((i) => {
      if (i.type === 'qnaire-input') {
        temp.push('')
      } else if (i.type === 'qnaire-checkbox' || i.type === 'area-picker') {
        temp.push([])
      } else {
        temp.push('')
      }
    })
    state.answer = temp
  },
  updateAnswer (state, { id, value }) {
    Vue.set(state.answer, id, value)
  },
  appendFile (state, payload) {
    state.files.push(payload)
  }
}

export const actions = {
  getQnaire ({ state, commit }) {
    return getQnaireById(state.id).then((res) => {
      const qnaire = res.data.message[0]
      qnaire.form = qnaire.form.map((q, i) => {
        return { ...q, id: i }
      })
      commit('setQnaire', qnaire)
      commit('initAnswer')
      return qnaire
    })
  },
  getUserInfo ({ state, commit }) {
    return getUserInfo(state.token).then((res) => {
      commit('setUserInfo', res.data.message)
      return res.data.message
    })
  },
  async login (context, { id, password }) {
    id = id.trim()
    try {
      const { message } = await login({ id, password })
      setToken(message)
      context.commit('setToken', message)
      context.commit('toggleLoginModal')
      return context.dispatch('getUserInfo')
    } catch (e) {
      const { message } = e.response.data
      if (message === 'Authentication error') {
        Message.error('登陆失败，学号或密码错误')
      } else {
        Message.error('登陆失败')
      }
    }
  },
  getChinaArea (context) {
    if (context.state.chinaArea.length > 0) { return }
    getChinaArea().then((res) => {
      context.commit('setChinaArea', res.data)
    })
  },
  submitAnswer (context) {
    submitAnswer(context.state.answer, context.state.id)
  }
}
