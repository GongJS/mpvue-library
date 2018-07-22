<template>
  <div class="comment-list">
    <div class="page-title" v-if='comments.length'>
      评论
      <i class="iconfont icon-jiantouxia" @click="changeCommentsDisplay"></i>
    </div>
    <div v-if="displayComments">
        <div class="comment"
            v-for='comment in comments'
            :key='comment.id'
            @click='handleClick(comment)'
            >
          <div class="user">
            <div class="inline">
              <img :src="comment.image"
                    class="avatar"
                    mode='aspectFit'
                >
              {{comment.title}}
            </div>
            <div class="right">
              {{comment.location||'未知地点'}}
              <span class="text-primary">
                --
              </span>
              {{comment.phone||'未知型号'}}
            </div>
          </div>
          <div class="content">
            {{comment.comment}}
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['comments','type'],
  data () {
    return {
      displayComments: true
    }
  },
  methods:{
    changeCommentsDisplay(){
      this.displayComments = !this.displayComments
    },
    handleClick(comment){
      if(this.type === 'user'){
        wx.navigateTo({
          url:'/pages/detail/main?id='+comment.bookid
        })
      }
    }
  }
}
</script>

<style lang='stylus'>
  .comment-list
    background:#eee;
    font-size:14px;
    i
      margin-right: 25rpx;
    .comment
      background: white;
      margin-bottom:10px;
      padding:5px 20px;
      .content
        margin:10px 0;
      .user
        .inline
          display:inline;
          .avatar
            width:20px;
            height:20px;
            border-radius: 50%;
</style>
