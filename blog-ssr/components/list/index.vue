<template>
  <div class="list-box">
    <slot />
    <p v-show="isMore && length">
      已经到底了
    </p>
    <p v-show="isMore && !length">
      暂无数据
    </p>
    <div v-show="isLoadding" class="loading">
      <a-spin tip="Loading..." />
    </div>
  </div>
</template>

<script>
import { Spin } from 'ant-design-vue'

export default {
  name: 'List',
  components: {
    ASpin: Spin
  },
  props: {
    lowerThreshold: {
      type: Number,
      default: 0
    },
    isLoadding: {
      type: Boolean,
      default: false
    },
    isMore: {
      type: Boolean,
      default: false
    },
    length: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scroll)
  },
  methods: {
    scroll() {
      const { lowerThreshold, isMore } = this
      if (isMore) return
      // 当前滚动条位置（给ie做兼容）
      const wScrollY = window.scrollY || document.documentElement.scrollTop || 0
      // const wScrollyIe = document.documentElement.scrollTop
      // 设备窗口的高度（不会变）
      const wInnerH = window.innerHeight
      // 滚动条总高度
      const bScrollH = document.body.scrollHeight
      if (wScrollY + wInnerH >= bScrollH - lowerThreshold) {
        this.$emit('scrolltolower')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~/assets/style/your-theme-file.less';

.list-box {
  p {
    text-align: center;
    margin: 10px 0;
    font-size: @text-size;
    color: @msg-color;
  }
  .loading {
    display: flex;
    justify-content: center;
  }
}
</style>
