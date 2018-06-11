<script>
  require('./utils/sdk-v1.4.0')
export default {
  data (){
    return {
      clientId: 'f9c8f402d42c36263c2d',
      tableId: 38446
    }
  },
  created () {
    // 初始化知晓云
    wx.BaaS.init(this.clientId)
    //简单登陆，获取openid

    console.log('小程序启动')
  }
}
</script>

<style lang="stylus">
  .container
    height: 100%
    display: flex
    flex-direction: column
    align-items: center
    justify-content: space-between
    padding: 200rpx 0
    box-sizing: border-box
    .btn
      color:white;
      background:#EA5A49
      margin-bottom: 10px
      padding-left: 15px
      padding-left: 15px
      border-radius: 2px
      font-size: 16px
      line-height: 40px
      height: 40px
      width: 100%
</style>
