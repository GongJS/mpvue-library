import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
const app = new Vue(App)
app.$mount()

export default{
  config: {
    pages: ['^pages/books/main','pages/me/main'],
    'window': {
      'backgroundTextStyle': 'light',
      'navigationBarBackgroundColor': '#F38181',
      'navigationBarTitleText': '小回忆图书馆',
      'navigationBarTextStyle': 'light'
    },
    'tabBar': {
      selectedColor: '#95E1D3',
      list: [
        {
          pagePath: 'pages/books/main',
          text: '图书',
          iconPath: 'static/img/book.png',
          selectedIconPath: 'static/img/book-active.png'
        },
        {
          pagePath: 'pages/comments/main',
          text: '收藏',
          iconPath: 'static/img/todo.png',
          selectedIconPath: 'static/img/todo-active.png'
        },
        {
          pagePath: 'pages/me/main',
          text: '用户',
          iconPath: 'static/img/me.png',
          selectedIconPath: 'static/img/me-active.png'
        }
      ]
    },

  }
}
