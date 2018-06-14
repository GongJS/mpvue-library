// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {
      avatarUrl: '../../static/img/unlogin.png'
    }
  },
  mutations: {
    updateUserInfo (state,data) {
      state.userInfo = data
    }
  }
})

export default store
