import Vue from 'vue'
import Vuex from 'vuex'
import usersAPI from '../apis/user'

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  state: {
    currentUser: {
      id: -1,
      account: '',
      name: '',
      email: '',
      avatar: '',
      introduction: '',
      banner: '',
      role: '',
      createdAt: '',
      updatedAt: ''
    },
    isAuthenticated: false,
  },
  mutations: {
    setCurrentUser(state, currentUser) {
      state.currentUser = {
        // 預設值
        ...state.currentUser,
        // 將 API 取得的 currentUser 覆蓋掉 Vuex state 中的 currentUser
        ...currentUser
      }
      // 將使用者的登入狀態改為 true
      state.isAuthenticated = true
    },
    // 登出，移除使用者 token
    revokeAuthentication(state) {
      state.currentUser = {}
      state.isAuthenticated = false
      localStorage.removeItem('token')
    }
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      try {
        const { data } = await usersAPI.getCurrentUser()
        if (data.status === 'error') {
          throw new Error(data.message)
        }

        const { id, account, name, email, avatar, introduction, banner, role, createdAt, updatedAt } = data

        commit('setCurrentUser', {
          id, account, name, email, avatar, introduction, banner, role, createdAt, updatedAt
        })
        // token 有效，回傳 role & isAuthenticated
        return { role: this.state.currentUser.role , isAuthenticated: true }
      } catch (error) {
        console.error(error.response.data)
        // token 無效，回傳 role & isAuthenticated
        return { role: '', isAuthenticated: false }
      }
    }
  },
})
