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
      <switch color='#EA5A49' :checked='location' @change='getGeo'></switch>
      <span class='text-primary'>{{location}}</span>
    </div>
    <div class='phone'>
      手机型号：
      <switch color='#EA5A49' :checked='phone' @change='getPhone'></switch>
      <span class='text-primary'>{{phone}}</span>
    </div>
    <button class="btn" @click='addComment'>
      评论
    </button>
  </div>
  <div v-if="!userInfo.openid" class='text-footer'>
    登录后才能发布评论
  </div>
  <div v-if="userInfo.openid && isComment" class='text-footer'>
    已经发表过评论了
  </div>
  <button  class="btn" @click="collectBook">收藏图书</button>
  <button  open-type='share' class="btn">转发给好友</button>
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
      isComment: false
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
        return false
      }
      if(this.isComment){
        return false
      }
      return true
    }
  },
  methods:{
    async collectBook () {
      console.log(this.info)
       if(!store.state.userInfo.openid){
         showModal("失败",'请先登录')
         return
       }
      const bookid = this.bookid
      const getcollectBook = await getData(config.collectBooksTableID,'bookid','=',bookid)
      if (getcollectBook.length === 1) {
        showModal("失败",'已收藏过该图书')
        return
      }
      const openid = store.state.userInfo.openid
      const image = this.info.image
      const addPersonName = store.state.userInfo.nickName
      const title = this.info.title
      const publisher = this.info.publisher
      const rate =  this.info.rate
      const author = this.info.author
      const count = this.info.count
      const dataInfo = {openid,image,bookid,title,addPersonName,publisher,rate,title,author,count}
      console.log(dataInfo)
      const collectBook = await addData(config.collectBooksTableID,dataInfo)
      if (collectBook.statusCode === 201) {
            showModal("成功",'收藏成功')
          }
    },
    async addComment () {
      if (!this.comment) {
        return
      }
      // 评论内容 手机型号  地理位置 图书id 用户的openid
      console.log(store.state.userInfo)
       const openid = store.state.userInfo.openid
       const image = this.info.image
       const addPersonName = store.state.userInfo.nickName
       const bookid = this.bookid
       const comment = this.comment
       const location = this.location
       const phone = this.phone
       const dataInfo = {openid,image,bookid,comment,location,phone,addPersonName}
       const addComment = await addData(config.commentsTableID,dataInfo,addPersonName)
       if (addComment.statusCode === 201) {
         this.isComment = true
       }
    },
    async getComments () {
      const getBookComments = await getData(config.commentsTableID,'bookid','=',this.bookid)
      this.comments = getBookComments || []
      if(store.state.userInfo.openid){
        const getPersonComments = await getData(config.commentsTableID,'openid','=',store.state.userInfo.openid)
        if(this.comments.filter(v => v.openid === getPersonComments.openid).length) {
           this.isComment = true
        }
      }
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



      console.log(bookData)
      this.info = bookData[0]
      this.info.tags = this.info.tags.split(",")
      this.info.summary = this.info.summary.split(",")
      wx.setNavigationBarTitle({
      title: this.info[0].title
      })
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
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
  }
}
</script>
<style lang='stylus'>
.comment
  margin-top:10px
  .textarea
    width:730rpx
    height:200rpx
    background:#eee
    padding:10rpx
  .location
    margin-top:10px
    padding:5px 10px
  .phone
    margin-top:10px
    padding:5px 10px;
</style>