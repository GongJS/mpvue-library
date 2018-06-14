<template>
  <div>
    <TopSwiper :tops='tops'></TopSwiper>
    <Card :key='book.id' v-for='book in books' :book='book'></Card>
    <p class='text-footer' v-if='!more'>
      没有更多数据
    </p>
  </div>
</template>
<script>
// 每次加载6条
// page 当前第几页
// 没有更多数据
// 1. page=0 不能显示这条提醒
// 2. page>0 数据长度<6 停止触底加载
import config from '@/utils/config'
import {getData} from '@/utils/index'
import Card from '@/components/Card'
import TopSwiper from '@/components/TopSwiper'
export default {
  components:{
    Card,
    TopSwiper
  },
  data(){
    return {
      books:[],
      tops: [],
      page:0,
      more:true
    }
  },
  methods:{
    async getList(init){
      if(init){
        this.page = 0
        this.more = true
      }
      wx.showNavigationBarLoading()
      const bookList = await getData(config.booksTableID,'count','>=',0,6,this.page*6,'-created_at')
      if(bookList.length<6 && this.page>0){
        this.more = false
      }
      if(init){
        this.books = bookList
        wx.stopPullDownRefresh()
      }else{
        // 下拉刷新，不能直接覆盖books 而是累加
        this.books = this.books.concat(bookList)
      }
      wx.hideNavigationBarLoading()
    },
    async getTop(){
      const topsList = await getData(config.booksTableID,'count','>=',0,9,undefined,'count')
      this.tops = topsList
    }
  },
  onPullDownRefresh(){
    this.getList(true)
    this.getTop()
  },
  onReachBottom(){
    if(!this.more){
      return false
    }
    this.page = this.page+1
    this.getList()
  },
  mounted(){
    this.getList(true)
    this.getTop()
  }
}
</script>
<style lang='stylus'>
</style>