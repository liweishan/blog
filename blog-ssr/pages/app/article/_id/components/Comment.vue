<template>
  <div class="comment">
    <a-divider orientation="left">
      发表评论
    </a-divider>
    <a-textarea v-model="comment" :rows="5" />
    <a-button type="primary" :loading="isLoading" @click="submitAddComment">
      提交留言
    </a-button>
    <ul class="comment-list">
      <li v-for="(v, i) of commentList" :key="i" class="comment-li">
        <img src="~/assets/img/avatar2.jpg">
        <span class="name">{{ v.nick }}</span>
        <span class="comment-content">{{ v.content }}</span>
        <span class="time">
          {{ v.pubtime | formatTime }}
          <a href="javascript:;" @click="handleReply(i)">{{ v.isOpen ? '收起' : '回复' }}</a>
        </span>
        <ul class="comment-child">
          <li v-for="(e, j) of v.children" :key="j">
            <img src="~/assets/img/avatar2.jpg">
            <span class="info">
              <span class="name">{{ e.nick }}</span>
              <span class="text">回复</span>
              <span class="name">{{ e.replynick }}</span>
              <span class="comment-content">{{ e.content }}</span>
            </span>
            <span class="time">
              {{ v.pubtime | formatTime }}
              <a href="javascript:;" @click="handleReply(i, j)">{{ e.isOpen ? '收起' : '回复' }}</a>
            </span>
          </li>
        </ul>
        <div v-if="v.isShow" class="sub">
          <a-textarea v-model="v.comment" :placeholder="`回复【${curNode.nick}】`" :rows="3" />
          <a-button
            type="primary"
            size="small"
            :loading="isLoading"
            @click="submitReply(i)"
          >
            提交
          </a-button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  Divider,
  Input,
  Button,
  message
} from 'ant-design-vue'
import { mapGetters } from 'vuex'
import { addComment } from '@/api/blog'
import { getFormatTime } from '@/utils/util'

const { TextArea } = Input

export default {
  name: 'Comment',
  components: {
    ADivider: Divider,
    ATextarea: TextArea,
    AButton: Button
  },
  filters: {
    formatTime(time) {
      return getFormatTime('Y-M-D h:m:s', time * 1e3)
    }
  },
  props: {
    next: {
      type: Object,
      default: null
    },
    prve: {
      type: Object,
      default: null
    },
    commentList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      comment: '',
      isLoading: false,
      curNode: {}
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'token'
    ])
  },
  methods: {
    /**
     * 点击提交按钮提交评论
     */
    submitAddComment() {
      if (!this.checkToken()) {
        return
      }
      const { $route, comment, userInfo } = this
      const { artId } = $route.query
      const data = {
        art_id: artId,
        content: comment,
        nick: userInfo.name
      }
      this.subComment(data)
    },
    /**
     * 点击回复
     * @param {Number} i 第一层的下标
     * @param {Number} j 第二层的下标
     */
    handleReply(i, j) {
      const { commentList } = this
      let info = commentList[i]
      const { children } = commentList[i]
      if (j || j === 0) {
        info = children[j]
        this.$set(commentList[i], 'isOpen', false)
      } else {
        // 清除当前子级的状态
        for (const v of children.values()) {
          v.isOpen = false
          v.isShow = false
        }
      }
      const { isShow, isOpen } = info
      this.$set(info, 'isOpen', !isOpen)
      if (j || j === 0) {
        this.$set(commentList[i], 'isShow', !isShow)
        this.$set(children[j], 'isShow', !isShow)
      } else {
        this.$set(commentList[i], 'isShow', !isOpen)
      }
      this.curNode = info
    },
    /**
     * 提交回复
     * @param {Number} i 第一层的下标
     */
    submitReply(i) {
      if (!this.checkToken()) {
        return
      }
      const {
        list,
        userInfo,
        $route,
        curNode
      } = this
      const { artId } = $route.query
      const v = list[i]
      const data = {
        art_id: artId,
        nick: userInfo.name,
        parent_id: v.comment_id,
        content: v.comment,
        replynick: curNode.nick
      }
      this.subComment(data, v)
    },
    /**
     * 校验token
     */
    checkToken() {
      const { token } = this
      if (!token) {
        message.error('请先登录')
      }
      return !!token
    },
    /**
     * 添加评论
     * @param {Object} data 提交的参数
     * @param {Object|Undefined} v 如果是回复才有值
     */
    async subComment(data, v) {
      this.isLoading = true
      try {
        const res = await addComment(data)
        if (!v) {
          this.comment = ''
        }
        message.success(res.message)
        this.$emit('updateComment')
      } catch (err) {
        // console.log(err)
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '~/assets/style/your-theme-file.less';

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
    font-size: @min-size;
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
</style>
