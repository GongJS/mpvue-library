<template>
  <div class="container">
    <div class="userinfo">
      <img :src="userInfo.avatarUrl" alt="">
      <button open-type="getUserInfo" @getuserinfo="userInfoHandler" v-if="!userInfo.openid" class='btn'>登录</button>
      <p v-if="userInfo.openid">{{userInfo.nickName}}</p>
      <YearProgress></YearProgress>
      <button v-if="userInfo.openid" @click='scanBook' class='btn'>添加图书</button>
    </div>
    <div class="test">
      <div>pppp</div>
    </div>
  </div>
</template>

<script>
import store from './store';
import { showSuccess, get, showModal } from '@/utils/index';
import YearProgress from '@/components/YearProgress';
export default {
  components: {
    YearProgress
  },
  data() {
    return {
      tableID: 38446 //从知晓云后台查询得到
    };
  },
  computed: {
    userInfo() {
      return store.state.userInfo;
    }
  },
  methods: {
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
          let Books = new wx.BaaS.TableObject(this.tableID); //实例化对应 tableID 的数据表对象
          let book = Books.create(); // 创建一条记录
          let bookIsbn = res.result;
          let openid = store.state.userInfo.openid;
          let query = new wx.BaaS.Query();
          query.compare('bookIsbn', '=', bookIsbn);
          if (bookIsbn && openid) {
            Books.setQuery(query).find().then(res => {
                  // success
                  if (res.data.meta.total_count === 0) {
                    let url = 'https://api.douban.com/v2/book/isbn/' + bookIsbn
                    wx.BaaS.invokeFunction('doubanApi', { url: url }).then(res => {
                        if (res.code === 0) {
                          // success·
                          const bookinfo = res.data;
                          console.log(bookinfo)
                          const rate = bookinfo.rating.average;
                          const { title,image,alt,publisher,summary,price} = bookinfo;
                          const tags = bookinfo.tags.map(v => {return `${v.title} ${v.count}`}).join(',')
                          const author = bookinfo.author.join(',')
                          console.log(openid,bookIsbn,rate,title,image,alt,publisher,summary,price,tags,author)
                          book.set({openid,bookIsbn,rate,title,image,alt,publisher,summary,price,tags,author}).save()
                            .then(() => {
                              //...
                              showModal('添加成功', `${title}添加成功`)
                            });
                        } else {
                          // fail
                          console.log(res.error.message);
                        }
                      }
                    );
                  } else {
                    showModal('添加失败', '该图书已经存在');
                  }
                },
                err => {
                  // err
                }
              );
          }
        }
      });
    }
  }
};
</script>

<style lang="stylus">
.container {
  padding: 0 30rpx;

  .userinfo {
    margin-top: 100rpx;
    text-align: center;

    img {
      width: 150rpx;
      height: 150rpx;
      margin: 20rpx;
      border-radius: 50%;
    }
  }

  .test {
    height: 150rpx;
    width: 150rpx;
    background: red;
  }
}
</style>
