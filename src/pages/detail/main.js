import Vue from 'vue'
import Detail from './Detail'

const app = new Vue(Detail)
app.$mount()

export default {
  config: {
    usingComponents: {
      'i-button': '/static/dist/button/index',
      'i-input' : '/static/dist/input/index'
    },
  }
}
