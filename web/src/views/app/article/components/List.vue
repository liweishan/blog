<template>
  <my-list
    :lowerThreshold="50"
    :isLoadding="paging.isLoadding"
    :isMore="paging.isMore"
    :length="artList.length"
    @scrolltolower="scrolltolower"
    class="list-box"
  >
    <ul>
      <li v-for="(v, i) of artList" :key="i">
        <span class="name-bar">
          <span class="name hover" @click="handleDetails(v.art_id)">{{ v.title }}</span>
        </span>
        <a-divider class="time" orientation="right">
          <div class="time-content">
            <span class="month">{{ v.month }}</span>
            <span class="year">{{ v.year }}</span>
            <span class="day">{{ v.day }}</span>
          </div>
        </a-divider>
        <em class="img-box">
          <a-col class="img" :md="9" :sm="24" :xs="24">
            <img :src="v.suo" alt="">
          </a-col>
          <a-col :md="{ span: 14, offset: 1 }" :sm="24" :xs="24">
            <div class="art">{{ v.remarks }}</div>
          </a-col>
        </em>
        <a-divider class="read-more" orientation="left">
          <span class="hover" @click="handleDetails(v.art_id)">继续阅读</span>
        </a-divider>
        <div class="foot">
          <div class="tags fl">
            <a-icon type="tags" />
            <span class="tag">{{ v.catname }}</span>
          </div>
          <div class="fr">
            <span class="read fl">
              <i class="liulan iconfont"></i>
              <i>{{ v.readnum }}</i>
            </span>
            <span class="fr comment">
              <i class="pinglun iconfont"></i>
              <i>{{ v.comm }}</i>
            </span>
          </div>
        </div>
      </li>
    </ul>
  </my-list>
</template>

<style lang="less" scoped>
@import '../../../../common/css/your-theme-file';

.list-box {
  ul {
    li {
      background: @base-fff;
      margin: 0 0 20px;
      padding: 16px 30px 25px;
      .name-bar {
        overflow: hidden;
        display: block;
        height: 20px;
        line-height: 20px;
        padding: 0 0 0 5px;
        .name {
          float: left;
          color: @main-title;
          font-size: @six-size;
        }
      }
      .img-box {
        display: block;
        overflow: hidden;
        /deep/ .ant-col-xs-24 {
          margin-top: 16px;
        }
        /deep/ .ant-col-xs-24.img {
          height: 180px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          img {
            width: 100%;
            height: auto;
          }
        }
        p {
          overflow: hidden;
          margin: 0;
        }
      }
      /deep/ .time {
        margin: 0;
        .time-content {
          position: relative;
          color: @msg-color;
          font-size: @text-size;
          line-height: 18px;
          .month {
            margin-right: 10px;
          }
          .day {
            width: 100%;
            position: absolute;
            top: -30px;
            left: 0;
            color: @primary-color;
            font-size: @one-size;
            line-height: 32px;
            text-align: center;
          }
        }
      }
      /deep/ .read-more {
        .hover {
          color: @text-color;
          font-weight: bold;
          font-size: @text-size;
        }
      }
      .hover:hover {
        color: @primary-color;
        text-decoration: underline;
        cursor: pointer;
      }
      .foot {
        height: 26px;
        color: @msg-color;
        .tags {
          overflow: hidden;
          line-height: 22px;
          padding: 2px 0;
          .tag {
            background: @msg-bg;
            font-size: @min-size;
            display: block;
            float: left;
            padding: 0 4px;
          }
          /deep/ i {
            margin: 3px 5px 0 0;
            float: left;
            font-size: @six-size;
          }
        }
        .fr {
          .read {
            margin: 0 18px 0 0;
          }
          span {
            display: block;
            overflow: hidden;
            i, /deep/ i {
              line-height: 26px;
              float: left;
              display: block;
              margin: 0 0 0 2px;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1100px) {
  .list-box {
    ul {
      width: 90%;
      margin: 0 auto;
    }
  }
}
</style>

<script>
import List from '@/components/list/index.vue'
import { getArt } from '@/api/blog'
import { getFormatTime } from '@/utils/util'
import { Divider, Col, Icon } from 'ant-design-vue'

export default {
  components: {
    MyList: List,
    ADivider: Divider,
    ACol: Col,
    AIcon: Icon
  },
  data() {
    const paging = {
      curPage: 1,
      pageSize: 5
    }
    return {
      artList: [],
      catId: 0,
      paging,
      isRequest: false
    }
  },
  methods: {
    /**
     * 请求数据
     * @param {*} id 栏目id
     */
    async requestList(id) {
      if (typeof id !== 'undefined') {
        this.catId = id
        this.initData()
      }
      const { catId, paging, artList } = this
      const { curPage, pageSize } = paging
      this.$set(paging, 'isLoadding', true)
      const obj = {
        curPage,
        pageSize,
        catId
      }
      try {
        const res = await getArt(obj)
        const { total, result } = res.data
        for (const v of result.values()) {
          const date = getFormatTime('Y-M-D', v.pubtime * 1e3)
          if (date) {
            const dates = date.split('-')
            const [year, month, day] = dates
            v.day = day
            v.month = `${month}月`
            v.year = year
          }
          v.suo = `${process.env.VUE_APP_HTTP}/${v.suo}`
          v.pic = `${process.env.VUE_APP_HTTP}/${v.pic}`
          artList.push(v)
        }
        if (total <= artList.length) {
          this.$set(paging, 'isMore', true)
        }
        this.$set(paging, 'curPage', curPage + 1)
      } catch (err) {
        this.artList = []
      }
      this.$set(paging, 'isLoadding', false)
      this.isRequest = true
    },
    /**
     * 初始化参数
     */
    initData() {
      const { paging } = this
      this.$set(paging, 'curPage', 1)
      this.$set(paging, 'isMore', false)
      this.artList = []
    },
    /**
     * 触底事件
     */
    scrolltolower() {
      const { isRequest, paging } = this
      const { isMore } = paging
      if (!isRequest || isMore) return
      this.isRequest = false
      this.requestList()
    },
    /**
     * 点击查看文章详情
     * @param {Number} artId 文章id
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
