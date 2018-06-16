<template>
<div>
  <div class="header">
    <div class='header-left'>搜索</div>
    <div class='header-input'>
      <input class="input" placeholder="请输入图书名称" v-model="search">
         <img  class="img" mode='aspectFit' src="./test.png" >
    </div>
    <div class='header-right'>
      <p class="header-right-text">{{selectItem}}</p>
      <img class="img" mode='aspectFit' src="./test1.png" v-on:click='wrap'>
    </div>
  </div>
  <ul class="select" :class="active">
      <li class="li" :key=index v-for='(item,index) of list' v-on:click='selectLi(item)'>{{item}}</li>
  </ul>
</div>
</template>
<script>
// vue-tiny-rate

export default {
  data() {
    return {
      list:['图书','科幻','小说','人工智能','金融','区块链'],
      selectItem:'图书',
      search:'',
      timer: null,
      isActive:true
    }
  },
  computed: {
    active () {
      return this.isActive ? 'active' : ''
    }
  },

  methods: {
    wrap () {
       this.isActive = !this.isActive
    },
    selectLi(item) {
      this.selectItem = item.substr(0,2)
      this.isActive = !this.isActive
      this.$emit('receive', item)
    }
  },
  watch: {
    'search': function () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout (() => {
        this.$emit('searchBook',this.search)
      },1000)
    }
  }
}
</script>
<style lang='stylus'>
  .header
    display: flex
    background: #00bcd4
    line-height: 86rpx
    color: #fff
    .header-left
      width: 110rpx
      float: left
      margin-left: 10rpx
    .header-input
      flex: 1
      line-height 64rpx
      height: 64rpx
      margin-top: 12rpx
      margin-left: -15rpx
      background: #fff
      border-radius: 10rpx
      color: #ccc
      position: relative
      .input
        height: 100%
        position: absolute
        margin-left:60rpx
        top: 0
        font-size:30rpx
        color:red
      .img
        width: 50rpx
        height: 50rpx
        margin-top: 7rpx
        margin-left: 5rpx
      .input-text
        display: inline-block
        font-size: 30rpx
        line-height 64rpx
        height: 64rpx
    .header-right
      float: right
      width: 144rpx
      text-align: center
      margin-right: 20rpx
      margin-top: 0rpx
      margin-left:-10rpx
      .header-right-text
        display: inline-block
      .img
        float: right
        width: 50rpx
        height: 50rpx
        margin-top: 20rpx
        margin-right: -10rpx
        margin-left:-20rpx
  .select
    position: absolute;
    z-index: 1
    right:0
    background:white
    border-left: solid 1rpx #00bcd4
    border-bottom: solid 1rpx #00bcd4
    .li
      font-size:35rpx;
      padding-left:10rpx;
      padding-right:10rpx;
    .li:hover
      background: red
  .active
    display:none

</style>
