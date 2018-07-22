<template>
  <div class="book-card">
    <a :href="detailUrl">
        <div class="thumb" @click.stop="preview">
          <img :src="book.image"
                class="img"
                mode="aspectFit"
                />
        </div>
        <div class="detail">
          <div class="row text-primary">
            <div class="right">
              {{book.rate}} <Rate :value='book.rate'></Rate>
            </div>
            <div class="left">
              {{book.title}}
            </div>
          </div>
          <div class="row">
            <div class="right text-primary">
              浏览量:{{book.count}}
            </div>
            <div class="left">
              {{book.author}}
            </div>
          </div>
          <div class="row">
            <div class="right">
              {{book.addBookPerson}}
            </div>
             <div class="left">
              {{book.publisher}}
            </div>
          </div>
        </div>
    </a>
    <div class="delete" v-if="!(type === 'libraryBook')">
      <i class="iconfont icon-jiantouarrow486" v-on:click="deleteItem"></i>
    </div>
  </div>

</template>
<script>
import Rate from '@/components/Rate'
import config from '@/utils/config'
import { showSuccess,getData,addData,showModal } from '@/utils/index'
export default {
  components:{
    Rate
  },
  props:['book','type'],
  data () {
    return {
      updateDataFlag: true
    }
  },
  computed:{
    detailUrl(){
      if(this.type === 'scanBooks') {
        return '/pages/detail/main?id='+this.book.id
      }
      if(this.type === 'collectBooks') {
        return '/pages/detail/main?id='+this.book.bookid
      }
      if(this.type === 'libraryBook') {
        return '/pages/detail/main?id='+this.book.id
      }
    }
  },
  methods:{
    preview() {
      wx.previewImage({
        current:this.book.image,
        urls:[this.book.image]
      })
    },
    deleteItem() {
      self = this
      if(this.type === 'collectBooks') {
        wx.showModal({
          title: '删除',
          content: '确定要删除吗？',
          success: function(res) {
            if (res.confirm) {
              let Product = new wx.BaaS.TableObject(config.collectBooksTableID)
              let query = new wx.BaaS.Query()
              query.compare('bookid', '=', self.book.bookid)
              query.compare('addPersonName', '=', self.book.addPersonName)
              Product.delete(query).then(res => {
                // success
                self.$emit('updateData',self.type)
              }, err => {
                // err
                console.log(err)
              })
              console.log('用户点击确定')
              //触发父组件更新数据
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }

      if (this.type === 'scanBooks') {
        wx.showModal({
          title: '删除',
          content: '确定要删除吗？',
          success: function(res) {
            if (res.confirm) {
              let Product = new wx.BaaS.TableObject(config.booksTableID)
              let query = new wx.BaaS.Query()
              query.compare('bookIsbn', '=', self.book.bookIsbn)
              query.compare('openid', '=', self.book.openid)
              Product.delete(query).then(res => {
                // success
                self.$emit('updateData',self.type)
              }, err => {
                // err
                console.log(err)
              })
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }

    }
  }
}
</script>
<style lang='stylus' scoped>
  .book-card
    position: relative;
    padding:5px;
    overflow: hidden;
    margin-top:5px;
    margin-bottom:5px;
    font-size:14px;
    box-shadow: 0 2px 7px rgba(0,0,0,.15);
    border-color: transparent;
    .thumb
      width:90px;
      height:90px;
      float: left;
      margin:0 auto;
      overflow:hidden;
      .img
        max-width: 100%;
        max-height: 100%;
    .detail
      margin-left: 100px;
      .row
        line-height:20px;
        margin-bottom:3px;
      .right
        float: right;
      .left
        margin-right:80px;
    .delete
      float: right;
</style>

