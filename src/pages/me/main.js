import Vue from 'vue'
import Me from './Me'

const app = new Vue(Me)
app.$mount()

export default{
  config:{
    usingComponents: {
      "calendar": "plugin://calendar/calendar"
    },
  }
}
