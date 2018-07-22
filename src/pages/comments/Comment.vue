<template>
  <div class="container">
    <div class="login" v-if="!userInfo.openid">
      没有登录T_T
        <img class="img"
            src="./test.gif"
            mode='aspectFit'
          >
    </div>
    <CommentList v-if='userInfo.openid' type='user' :comments="comments">
    </CommentList>
    <div v-if='userInfo.openid'>
      <div class="page-title">添加的图书</div>
      <Card v-for='(book,index) in scanBooks' :key='index' :book='book' type='scanBooks' @updateData="updateData"></Card>
      <div v-if='!scanBooks.length'>暂时还没添加过书，快去添加几本吧</div>
    </div>
      <div v-if='userInfo.openid'>
      <div class="page-title">收藏的图书</div>
         <Card v-for='(book,index) in collectBooks' :key='index' :book='book' type='collectBooks' @updateData="updateData">></Card>
      <div v-if='!collectBooks.length'>暂时还没收藏过书，快去收藏几本吧</div>
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
      scanBooks: [],
      collectBooks: [],
    }
  },
  components: {
    CommentList,
    Card,
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
      this.getScanBooks()
      this.getCollectBook()
      wx.hideNavigationBarLoading()
    },
    updateData (type) {
      console.log(type);
      if(type === 'scanBooks') {
        this.getScanBooks()
        console.log(111);
      }
      if(type === 'collectBooks') {
        this.getCollectBook()
        console.log(222);
      }
    },
    async getScanBooks() {
      const books = await getData(config.booksTableID,'openid','=',store.state.userInfo.openid)
      this.scanBooks = books
    },
    async getComments() {
      const comments = await getData(config.commentsTableID,'openid','=',store.state.userInfo.openid)
      this.comments = comments
    },
    async getCollectBook () {
      const getCollectBook = await getData(config.collectBooksTableID,'openid','=',store.state.userInfo.openid)
      this.collectBooks = getCollectBook
    }
  },
  onPullDownRefresh() {
    if (store.state.userInfo.openid) {
       this.init()
       wx.stopPullDownRefresh()
    }
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
<style lang="stylus">
  .login
    text-align: center;
    font-size: 60rpx;
    color: #515151;
    margin-top: 80rpx;
    margin-bottom: 80rpx;
    .img
      margin-top 80rpx;
</style>
