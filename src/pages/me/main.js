import Vue from 'vue'
import Me from './Me'

const app = new Vue(Me)
app.$mount()

export default {
  config: {
    usingComponents: {
      'i-button': '/static/dist/button/index',
      'i-icon':     '/static/dist/icon/index',
      'calendar': 'plugin://calendar/calendar'
    },
  }
}
