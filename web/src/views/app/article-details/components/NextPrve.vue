<template>
  <div class="next-prve">
    <div class="title">延伸阅读</div>
    <div v-if="prve" class="item">
      <span class="label">上一篇：</span>
      <a @click="handleLink(prve.art_id)">{{ prve.title }}</a>
    </div>
    <div v-if="next" class="item">
      <span class="label">下一篇：</span>
      <a @click="handleLink(next.art_id)">{{ next.title }}</a>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../../../common/css/your-theme-file.less';

.next-prve {
  .title {
    margin: 20px 0 10px;
    border-left: 3px solid @primary-color;
    min-height: 26px;
    line-height: 26px;
    padding: 5px 20px;
    background: @other-bg;
    font-size: @six-size;
    font-weight: 400;
    color: @text-color;
    text-shadow: 0 1px 0 rgba(255,255,255,.5);
    clear: both;
  }
  .item {
    overflow: hidden;
    font-size: @text-size;
    line-height: 28px;
    .label {
      float: left;
      color: @text-color;
    }
    a {
      color: @link-color;
      float: left;
    }
  }
}
</style>


<script>
export default {
  name: 'NextPrve',
  props: {
    next: {
      type: Object,
      default: null
    },
    prve: {
      type: Object,
      default: null
    }
  },
  methods: {
    handleLink(artId) {
      const { $router } = this
      const opt = {
        query: {
          artId
        }
      }
      $router.push(opt)
      this.$emit('handleLink')
    }
  }
}
</script>
