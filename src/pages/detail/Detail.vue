<template>
<div>
  <BookInfo :info='info'></BookInfo>
  <CommentList :comments="comments"></CommentList>
  <div class="comment" v-if="showAdd">
    <textarea v-model='comment'
              class='textarea'
              :maxlength='100'
              placeholder='请输入图书短评'></textarea>
    <div class='location'>
      地理位置：
      <switch color='#2db7f5' :checked='location' @change='getGeo'></switch>
      <span>{{location}}</span>
    </div>
    <div class='phone'>
      手机型号：
      <switch color='#2db7f5' :checked='phone' @change='getPhone'></switch>
      <span>{{phone}}</span>
    </div>
    <i-button type="info" shape="circle" size="small" @click='addComment'>
      评论
    </i-button>
  </div>
  <div v-if="!userInfo.openid" class='text-footer'>
    登录后才能发布评论
  </div>
  <div v-if="userInfo.openid && isComment" class='text-footer'>
    已经发表过评论了
  </div>
  <div class="fix-bottom">
    <i-button type="info" @click="backHome" shape="circle" size="small">返回</i-button>
    <i-button  open-type='share' type="info" shape="circle" size="small">转发给好友</i-button>
  </div>
</div>

</template>
<script>
import BookInfo from '@/components/BookInfo'
import CommentList from '@/components/CommentList'
import store from '@/store'
import config from '@/utils/config'
import { showSuccess,getData,addData,showModal } from '@/utils/index'
export default {
   components: {
    BookInfo,
    CommentList
  },
  data(){
    return {
      bookid:'',
      comments: [],
      info: {},
      comment: '',
      location: '',
      phone: '',
      isComment: false,
      isCollect: false
    }
  },
   computed: {
      userInfo() {
      return store.state.userInfo;
    },
    showAdd () {
      // 没登录
      if (!store.state.userInfo.openid) {
        return false
      }
      // 评论页面里查到有自己的openid
      if (this.comments.filter(v => v.openid === store.state.userInfo.openid).length) {
        this.isComment = true
        return false
      }
      if(this.isComment){
        return false
      }
      return true
    }
  },
  methods:{
    async addComment () {
      // 评论内容 手机型号  地理位置 图书id 用户的openid
      if(this.comment === ''){
        showModal("失败",'评论内容不能为空')
        return
      }
       const openid = store.state.userInfo.openid
       const image = store.state.userInfo.avatarUrl
       const addPersonName = store.state.userInfo.nickName
       const bookid = this.bookid
       const comment = this.comment
       const location = this.location
       const phone = this.phone
       const dataInfo = {openid,image,bookid,comment,location,phone,addPersonName}
       const addComment = await addData(config.commentsTableID,dataInfo,addPersonName)
       if (addComment.statusCode === 201) {
         this.comment = ''
         this.isComment = true
         this.getComments()
       }
    },
    async getComments () {
      const getBookComments = await getData(config.commentsTableID,'bookid','=',this.bookid)
      this.comments = getBookComments || []

    },
    async getGeo (e) {
      const ak = 'nEzZImjWniLd9hMOgXezCWvjYqa8c2WC'
      const url = 'https://api.map.baidu.com/geocoder/v2/'
      if (e.target.value) {
        wx.getLocation({
          success: geo => {
            wx.request({
              url,
              data: {
                ak,
                location: `${geo.latitude},${geo.longitude}`,
                output: 'json'
              },
              success: res => {
                console.log(res)
                if (res.data.status === 0) {
                  this.location = res.data.result.addressComponent.city
                } else {
                  this.location = '未知地点'
                  // console.log('出错了')
                }
              }
            })
          }
        })
      } else {
        this.location = ''
      }
    },
    async getPhone (e) {
      console.log('手机型号获取种')
      if (e.target.value) {
        const phoneInfo =await wx.getSystemInfoSync()
        // console.log(phoneInfo)
        this.phone = await phoneInfo.model
      } else {
        // 没选中
        this.phone = ''
      }
    },
    async getDetail(){
      let Books = new wx.BaaS.TableObject(config.booksTableID); //实例化对应 tableID 的数据表对象
      let book = await Books.getWithoutData(this.bookid)
          book.incrementBy('count', 1)
      const update = await book.update().then(res => {

      }, err => {
        console.log(err)
      })
      const bookData = await getData(config.booksTableID,'id','=',this.bookid)
      this.info = bookData[0]
      this.info.tags = this.info.tags.split(",")
      this.info.summary = this.info.summary.split(",")
      wx.setNavigationBarTitle({
      title: this.info[0].title
      })
    },
    backHome () {
      wx.reLaunch({
        url: '/pages/me/main'
      })
    }
  },
    onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: `${this.info.title}`,
      imageUrl:`${this.info.image}`
    }
  },
  mounted(){
    this.bookid = this.$root.$mp.query.id
    this.getDetail()
    this.getComments()
    this.isComment = false
  }
}
</script>
<style lang='stylus'>
.comment
  margin-top:10px
  .textarea
    height:200rpx
    background:#fff
    padding:10rpx
    border-radius: 10rpx;
    border: 1px solid #dddee1;
    margin-left: 10rpx;
    margin-right: 10rpx;
  .location
    margin-top:10px;
    padding:5px 10px;
    color: #495060;
  .phone
    margin-top:10px
    padding:5px 10px;
    color: #495060;
</style>
