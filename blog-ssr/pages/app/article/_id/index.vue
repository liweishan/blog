<template>
  <div class="wrap">
    <div class="content">
      <div class="title">
        <h4>{{ info.title }}</h4>
        <div class="grey">
          <em class="item">
            <span class="label">作者：</span>
            <a href="javascript:;" class="val">李维珊</a>
          </em>
          <em class="item">
            <span class="label">更新于</span>
            <span class="val date">{{ info.time }}</span>
          </em>
        </div>
        <div class="time">
          <div class="day">
            {{ info.day }}
          </div>
          <div class="ym">
            <span class="month">{{ info.month }}</span>
            <span class="year">{{ info.year }}</span>
          </div>
        </div>
      </div>
      <div class="ql-snow">
        <div class="ql-editor" v-html="info.content" />
      </div>
      <div class="copyright">
        <p>非特殊说明，本文版权归 李维珊 所有，转载请注明出处.</p>
        <p>
          本文标题：
          <a href="javascript:;">{{ info.title }}</a>
        </p>
        <p>
          本文网址：
          <a href="javascript:;">{{ href }}</a>
        </p>
      </div>
      <next-prve :next="next" :prve="prve" />
      <comment :comment-list="commentList" @updateComment="updateComment" />
    </div>
  </div>
</template>

<script>
import { NextPrve, Comment } from './components'
import { getArtDetails, readnum, getComment } from '@/api/blog'
import { getFormatTime } from '@/utils/util'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

/**
 * 请求文章详情
 * @param {Number} artId 文章id
 */
async function requestArtDetails(artId) {
  try {
    const res = await getArtDetails(artId)
    const { info, next, prve } = res.data
    const { pubtime } = info
    const date = getFormatTime('Y-M-D', pubtime * 1e3)
    if (date) {
      const dates = date.split('-')
      const [year, month, day] = dates
      info.day = day
      info.month = `${month}月`
      info.year = year
    }
    info.pic = `${process.env.VUE_APP_HTTP}/${info.pic}`
    info.time = getFormatTime('Y-M-D h:m:s')
    return {
      info,
      next,
      prve
    }
  } catch (err) {
    // console.log(err)
    return {}
  }
}

/**
 * 请求评论列表
 * @param {Number} artId 文章id
 */
async function requestComment(artId) {
  try {
    const res = await getComment(artId)
    const list = res.data
    return {
      commentList: list
    }
  } catch (err) {
    return {}
  }
}

export default {
  name: 'ArtDetails',
  components: {
    NextPrve,
    Comment
  },
  // 当前的生命周期拿不到vue的实例，方法必须封装在外面，组件没有asyncData的生命周期，使用props解决
  async asyncData({ req, route, params }) {
    const res = await Promise.all([requestComment(params.id), requestArtDetails(params.id)])
    const data = res.reduce((data, v) => {
      data = {
        ...v,
        ...data
      }
      return data
    }, {})
    return {
      ...data,
      href: process.server ? `${req.headers.host}/blog${route.path}` : window.location.href
    }
  },
  data() {
    return {
      info: {},
      next: {},
      prve: {},
      href: '',
      commentList: []
    }
  },
  beforeMount() {
    this.requestReadnum()
  },
  methods: {
    /**
     * 提交评论之后更新评论
     */
    async updateComment() {
      const { $route } = this
      const id = $route.params.id
      const res = await requestComment(id)
      this.commentList = res.commentList || []
    },
    /**
     * 请求增加浏览数量
     */
    async requestReadnum() {
      const { $route } = this
      const id = $route.params.id
      try {
        await readnum({ art_id: id })
      } catch (err) {
        // console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~/assets/style/your-theme-file.less';

.wrap {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  padding: 60px 0 40px;
  .content {
    .content();
    overflow: hidden;
    padding: 20px 30px 25px;
    background: @base-fff;
    margin-top: 20px;
    .title {
      padding: 5px 130px 5px 0;
      position: relative;
      border-bottom: 1px solid @three-border;
      h4 {
        font-size: @title-size;
        font-weight: normal;
        color: @main-title;
        margin: 0;
      }
      .grey {
        overflow: hidden;
        .item {
          color: @submenu-color;
          font-size: @min-size;
          margin: 0 0 0 16px;
        }
        .item:first-child {
          margin: 0;
        }
        .date {
          margin: 0 0 0 2px;
        }
        a {
          color: @link-color;
        }
      }
      .time {
        position: absolute;
        right: 0;
        top: 0;
        .day {
          text-align: center;
          font-weight: 700;
          font-size: 40px;
          line-height: 36px;
          color: @primary-color;
        }
        .ym {
          overflow: hidden;
          color: @msg-color;
          font-size: @six-size;
          .monty {
            float: left;
          }
          .year {
            float: right;
            margin: 0 0 0 10px;
          }
        }
      }
    }
    .top-img {
      max-width: 100%;
      max-height: 400px;
    }
    .art {
      padding: 20px 0 0;
      font-size: @text-size;
      color: @text-color;
    }
    .copyright {
      background: @other-bg;
      margin: 20px 0 0;
      padding: 15px 20px;
      p {
        margin: 0;
        line-height: 22px;
        font-size: @min-size;
        a {
          color: @link-color;
        }
        a:hover {
          color: @primary-color;
        }
      }
    }
    .comment {
      border-top: 1px solid @three-border;
      margin: 20px 0 0;
      padding: 10px 0 0;
      ::v-deep .ant-divider{
        .ant-divider-inner-text {
          color: @text-color;
          font-size: @four-size;
          font-weight: 300;
        }
      }
      ::v-deep .ant-btn {
        margin: 15px 0 0;
      }
      .comment-list {
        padding: 20px 0 0;
        li {
          overflow: hidden;
          img {
            width: 45px;
            height: 45px;
            float: left;
            border-radius: 50%;
          }
          .name, .comment-content, .time {
            display: block;
            margin: 0 0 0 53px;

          }
          .name {
            color: @link-color;
          }
          .comment-content {
            color: @text-color;
            line-height: 24px;
            word-break: break-all;
          }
          .time {
            color: @msg-color;
            a {
              margin: 0 0 0 10px;
            }
          }
          .comment-child {
            margin: 10px 0 0 53px;
            border-top: 1px solid @three-border;
            padding: 10px 0 0;
            li {
              overflow: hidden;
              padding: 5px 0;
              .info {
                margin: 0 0 0 53px;
                display: block;
                .name {
                  display: inline-block;
                  margin: 0;
                }
                .text {
                  margin: 0 6px;
                }
                .comment-content {
                  display: inline;
                  margin: 0 0 0 10px;
                }
              }
            }
          }
          .sub {
            margin: 0 0 0 53px;
            padding: 5px 0 0;
            ::v-deep .ant-btn {
              margin: 5px 0 0;
            }
          }
        }
        .comment-li {
          padding: 15px 0 10px;
          border-bottom: 1px solid @one-border;
        }
        .comment-li:first-child {
          border-top: 1px solid @one-border;
        }
      }
    }
  }
}
@media screen and (max-width: 1100px) {
  .wrap {
    padding: 60px 5% 40px;
    .content {
      .title {
        padding: 5px 0;
        .time {
          display: none;
        }
      }
    }
  }
}
</style>
