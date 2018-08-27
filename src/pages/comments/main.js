import Vue from 'vue'
import Comment from './Comment'

const app = new Vue(Comment)
app.$mount()

export default{
  config:{
    enablePullDownRefresh:true,
    usingComponents: {
      'i-button': '/static/dist/button/index'
    },
  }
}
