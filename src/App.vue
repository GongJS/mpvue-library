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
  .text-footer
    text-align: center;
    font-size: 12px;
    margin-bottom:5px;
  .text-primary
    color:#EA5149;
  .page-title
    padding-left:20px;
    background:#eee;
    line-height: 40px;
    font-size: 14px;
  .right
    float: right;
  .btn
    color:white;
    background:#EA5A49;
    margin-bottom: 10px;
    padding-left: 15px;
    padding-left: 15px;
    border-radius: 2px;
    font-size: 16px;
    line-height: 40px;
    height: 40px;
    width: 100%;
  .btn:active
    background: #FA5A49;
</style>
