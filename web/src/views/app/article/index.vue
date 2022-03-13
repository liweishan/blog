<template>
  <div class="wrap">
    <div class="content">
      <a-col :xl="17" :sm="24" :xs="24">
        <list ref="list" />
      </a-col>
      <a-col :xl="{ span: 6, offset: 1 }" :sm="24" :xs="24">
        <cat @initList="initList" />
      </a-col>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../../common/css/your-theme-file.less';

.wrap {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  padding: 60px 0 40px;
  .content {
    .content();
    overflow: hidden;
    padding: 20px 0 0;
  }
}
</style>

<script>
import { Col } from 'ant-design-vue'
import List from './components/List.vue'
import Cat from './components/Cat.vue'

export default {
  components: {
    ACol: Col,
    List,
    Cat
  },
  methods: {
    /**
     * 初始化数据
     * @param {Number} id catId
     */
    initList(id) {
      const { $refs } = this
      $refs.list.requestList(id)
    }
  }
}
</script>
