<template>
  <div class="container">
    <div v-if="!userInfo.openid">
      还没有登陆哦
    </div>
    <CommentList v-if='userInfo.openid' type='user' :comments="comments"></CommentList>
    <div v-if='userInfo.openid'>
      <div class="page-title">我的图书</div>
      <Card v-for='book in books' :key='book.id' :book='book'></Card>
      <div v-if='!books.length'>暂时还没添加过书，快去添加几本把</div>
    </div>
  </div>
</template>
<script>
import store from '@/store'
import config from '@/utils/config'
import {getData} from '@/utils/index'
import CommentList from '@/components/CommentList'
import Card from '@/components/Card'
export default {
  data() {
    return {
      comments: [],
      books: []
    }
  },
  components: {
    CommentList,
    Card
  },
  computed: {
    userInfo() {
      return store.state.userInfo;
    }
  },
  methods: {
    init() {
      wx.showNavigationBarLoading()
      this.getComments()
      this.getBooks()
      wx.hideNavigationBarLoading()
    },
    async getBooks() {
      const books = await getData(config.booksTableID,'openid','=',store.state.userInfo.openid)
      this.books = books
    },
    async getComments() {
      const comments = await getData(config.commentsTableID,'openid','=',store.state.userInfo.openid)
      this.comments = comments
    }
  },
  onPullDownRefresh() {
    this.init()
    wx.stopPullDownRefresh()
  },
  onShow() {
    if (!store.state.userInfo.openid) {
      console.log('还没登录')
    } else {
      this.init()
    }
  }
}
</script>
<style>
</style>