<template>
  <div class="container">
    <div class="userinfo">
      <img :src="userInfo.avatarUrl" alt="">
      <button open-type="getUserInfo" @getuserinfo="userInfoHandler" v-if="!userInfo.openid" class='btn'>登录</button>
      <p v-if="userInfo.openid">{{userInfo.nickName}}</p>
      <YearProgress></YearProgress>
      <button v-if="userInfo.openid" @click='logOut' class='btn'>注销登录</button>
      <button v-if="userInfo.openid" @click='scanBook' class='btn'>添加图书</button>
      <calendar
        calendar-style="calendar"
        header-style="header"
        board-style="board"
        :days-color="demoDays"
      />
    </div>
  </div>
</template>

<script>
import store from '@/store';
import config from '@/utils/config';
import { getData, addData } from '@/utils/index';
import YearProgress from '@/components/YearProgress';
export default {
  data () {
    return {
      demoDays: [{
        month: 'current',
        day: new Date().getDate(),
        color: 'yellow',
        background: '#84e7d0'
      }]
    }
  },
  components: {
    YearProgress
  },
  computed: {
    userInfo() {
      return store.state.userInfo;
    }
  },
  methods: {
    logOut() {
      store.commit('logOut');
    },
    userInfoHandler(data) {
      wx.BaaS.handleUserInfo(data.mp).then(
        res => {
          store.commit('updateUserInfo', res);
          showSuccess('登录成功');
          // res 包含用户完整信息，详见下方描述
        },
        res => {
          // **res 有两种情况**：用户拒绝授权，res 包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 Error 对象（详情见下方注解）
          // *Tips*：如果你的业务需要用户必须授权才可进行，由于微信的限制，10 分钟内不可再次弹出授权窗口，此时可以调用 [`wx.openSetting`](https://mp.weixin.qq.com/debug/wxadoc/dev/api/setting.html) 要求用户提供授权
        }
      );
    },
    scanBook() {
      wx.scanCode({
        success: async res => {
          let bookIsbn = res.result;
          let openid = store.state.userInfo.openid;
          if (bookIsbn && openid) {
              const book = await getData(config.booksTableID,'bookIsbn','=',bookIsbn)
              if (book.length === 0) {
                let url = 'https://api.douban.com/v2/book/isbn/' + bookIsbn
                //知晓云  云函数
                   wx.BaaS.invokeFunction('doubanApi', { url: url }).then(async res => {
                      if (res.code === 0) {
                        const bookinfo = res.data;
                        const addBookPerson = store.state.userInfo.nickName
                        const rate = bookinfo.rating.average;
                        const {title,alt,image,publisher,summary,price} = bookinfo;
                        const tags = bookinfo.tags.map(v => {return `${v.title} ${v.count}`}).join(',')
                        const author = bookinfo.author.join(',')
                        const dataInfo = {addBookPerson,openid,bookIsbn,rate,title,image,alt,publisher,summary,price,tags,author}
                        const addBook = await addData(config.booksTableID,dataInfo)
                      } else {
                        console.log(res.error.message);
                      }
                    }
                  )
              } else {
                showModal('添加失败', '该图书已经存在');
              }
          }
        }
      })
    }
  }
}
</script>
<style lang="stylus">
.container
  padding: 0 30rpx;
  .userinfo
    margin-top: 50rpx;
    text-align: center;
    .calendar
      background-color: white;
      padding-top: 10px;
      border-radius: 15px;
    .header
      font-size: large;
      color: #59518d;
    .board
      color: #c7cbe2;
      font-weight: bold;
    img
      width: 150rpx;
      height: 150rpx;
      margin: 20rpx;
      border-radius: 50%;
</style>
