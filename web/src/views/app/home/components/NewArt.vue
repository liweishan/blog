<template>
  <div class="art-box">
    <div class="content">
      <h1>最新文章</h1>
      <div class="art-list">
        <a-col v-for="(v, i) of artList" :key="i" :xs="24" :lg="8" :sm="12">
          <div class="img">
            <img :src="v.suo" alt="">
          </div>
          <div class="news-content">
            <a href="javascript:;" class="title">{{ v.title }}</a>
            <div class="time">{{ v.time }}</div>
            <p>{{ v.remarks }}</p>
            <a href="javascript:;" class="more" @click="handleDetails(v.art_id)">阅读更多</a>
          </div>
        </a-col>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import '../../../../common/css/your-theme-file.less';

.art-box {
  padding: 60px 0 40px;
  .content {
    .content();
    h1 {
      font-size: @one-size;
      text-align: center;
      color: @main-title;
      position: relative;
      padding: 0 0 20px;
      &:after {
        position: absolute;
        width: 50px;
        height: 2px;
        content: "";
        left: 50%;
        margin-left: -25px;
        bottom: -1px;
        background: @primary-color;
      }
    }
    .art-list {
      overflow: hidden;
      .ant-col-xs-24 {
        padding: 0 10px;
        .img {
          img {
            width: 100%;
            height: 244px;
          }
        }
        .news-content {
          padding: 30px 15px;
          background: @text-bg;
          a {
            display: block;
          }
          .title {
            color: @main-title;
            padding: 0 0 6px;
          }
          .time {
            color: @placeholder-color;
            padding: 0 0 15px;
          }
          p {
            color: @msg-color;
            height: 72px;
            overflow: hidden;
            word-wrap: break-word
          }
          .more {
            color: @link-color;
          }
          .more:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>

<script>
import { getArt } from '@/api/blog'
import { Col } from 'ant-design-vue'
import { getFormatTime } from '@/utils/util'

export default {
  components: {
    ACol: Col
  },
  data() {
    return {
      artList: []
    }
  },
  async created() {
    const data = {
      pageSize: 3,
      curPage: 1
    }
    try {
      const res = await getArt(data)
      const list = res.data.result
      for (const v of list.values()) {
        v.time = getFormatTime('Y-M-D h:m:s', v.pubtime * 1000)
        v.suo = `${process.env.VUE_APP_HTTP}/${v.suo}`
      }
      this.artList = list
    } catch (err) {
      // console.log(err)
    }
  },
  methods: {
    /**
     * 点击阅读更多跳转文章详情
     */
    handleDetails(artId) {
      const { $router } = this
      const opt = {
        path: '/article/details',
        query: {
          artId
        }
      }
      $router.push(opt)
    }
  }
}
</script>
