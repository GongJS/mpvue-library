<template>
  <div class="container">
    <div class="login" v-if="!userInfo.openid">
      <p> 没有登录T_T </p>
      <button open-type="getUserInfo" @getuserinfo="userInfoHandler" v-if="!userInfo.openid" class='btn'>马上登录</button>
    </div>

    <div v-if='userInfo.openid'>
      <div class="page-title">添加的图书
        <i class="iconfont icon-jiantouxia" @click="changeAddBookDisplay"></i>
      </div>
      <div v-if="displayAddBook">
          <Card v-for='(book,index) in scanBooks' :key='index' :book='book' type='scanBooks' @updateData="updateData"></Card>
          <div v-if='!scanBooks.length'>暂时还没添加过书，快去添加几本吧</div>
      </div>
    </div>

    <div v-if='userInfo.openid'>
        <div class="page-title">收藏的图书
          <i class="iconfont icon-jiantouxia" @click="changeCollectBookDisplay"></i>
        </div>
        <div v-if="displayCollectBook">
          <Card v-for='(book,index) in collectBooks' :key='index' :book='book' type='collectBooks' @updateData="updateData">></Card>
          <div v-if='!collectBooks.length'>暂时还没收藏过书，快去收藏几本吧</div>
      </div>
    </div>
    <CommentList v-if='userInfo.openid' type='user' :comments="comments"></CommentList>
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
      displayAddBook: true,
      displayCollectBook: true
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
    userInfoHandler(data) {
      wx.BaaS.handleUserInfo(data.mp).then(
       async res => {
        await store.commit('updateUserInfo', res)
        this.getComments()
        this.getScanBooks()
        this.getCollectBook()
        },
        res => {
        }
      )
     
      this.getScanBooks()
      
    },
    changeAddBookDisplay(){
      this.displayAddBook= !this.displayAddBook
    },
    changeCollectBookDisplay(){
      this.displayCollectBook= !this.displayCollectBook
    },
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
      }
      if(type === 'collectBooks') {
        this.getCollectBook()
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
    margin-bottom: 80rpx;
    p
      text-align: center;
      font-size: 54rpx;
      margin-top: 30rpx;
    button
      width: 90%;
      margin-top: 30rpx;
  .page-title
    background: #dddee1;
    margin-bottom: 20rpx;
    i
      float: right;
      margin-right: 25rpx;
</style>
