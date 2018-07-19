<template>
  <div class='bookinfo'>
    <div class="thumb">
      <img class='back'
        :src="info.image"
        mode='aspectFill'>
      <img class="img"
            :src="info.image"
            mode='aspectFit'
          >
      <div class="info">
        <div class="title">
          {{info.title}}
        </div>
        <div class="author">
          {{info.author}}
        </div>
      </div>
    </div>
    <div class="detail">
      <img :src="info.image" class='avatar' mode='aspectFit'>
      {{info.name}}
      <div class="right text-primary">
        {{info.rate}}分
      </div>
    </div>
    <div class="detail">
      {{info.publisher}}
      <div class="right">
        {{info.price}}
      </div>
    </div>
    <div class="tags">
      <div class="badge" :key='tag' v-for='tag in info.tags'>{{tag}}</div>
      <i class="iconfont icon-sousuo" @click="collectBook"></i>
    </div>
    <div class="summary">
      <p :key='i' v-for='(sum,i) in info.summary'>{{sum}}</p>
    </div>
  </div>
</template>

<script>
import Rate from '@/components/Rate'
import store from '@/store'
import config from '@/utils/config'
import { getData,addData,showModal } from '@/utils/index'
export default {
  components: {
    Rate
  },
  props: ['info'],
  data () {
    return {
      bookid: '',
      formatInfo:[]
    }
  },
  methods:{
    async collectBook () {
      if(!store.state.userInfo.openid){
        showModal("失败",'请先登录')
        return
      }
      const bookid = this.bookid
      const openid = store.state.userInfo.openid
      const getcollectBook = await getData(config.collectBooksTableID,'bookid','=',bookid)
      if (getcollectBook.length >= 1) {
        getcollectBook.map(v => {
          if(v.openid === openid) {
            showModal("失败",'已收藏过该图书')
            this.isCollect = true
          }
        })
      }
      if(this.isCollect) {
        this.isCollect = false
        return
      }
      const image = this.info.image
      const addPersonName = store.state.userInfo.nickName
      const title = this.info.title
      const publisher = this.info.publisher
      const rate =  this.info.rate
      const author = this.info.author
      const count = this.info.count
      const dataInfo = {openid,image,bookid,title,addPersonName,publisher,rate,title,author,count}
      addData(config.collectBooksTableID,dataInfo)
    }
  },
  mounted(){
    this.bookid = this.$root.$mp.query.id
  }
}
</script>

<style lang='stylus'>
  .bookinfo
    font-size: 14px;
    .badge
      display: inline-block;
      margin:5px;
      padding:5px;
      border-radius: 10px;
      border:1px #EA5A49 solid;
      color:#EA5A49;
    i
      float: right;
      margin-right: 20rpx;
      margin-top: 20rpx;
    .summary
      padding:0 15px;
      margin-top:10px;
      p
        text-indent: 2em;
        font-size:14px;
    .right
      float: right;
    .detail
      padding:5px 10px;
      .avatar
        width:20px;
        height:20px;
        border-radius: 50%;
        vertical-align: middle;
    .thumb
      width:750rpx;
      height:500rpx;
      overflow:hidden;
      position: relative;
      .back
        filter: blur(15px);
        width:100%;
      .img
        position: absolute;
        width:100%;
        height:300rpx;
        left: 0;
        top:30rpx;
      .info
        color:white;
        position: absolute;
        width:100%;
        left:0;
        top:330rpx;
        text-align: center;
        .title
          font-size:20px;
        .author
          font-size: 14px;
</style>
