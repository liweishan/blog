<template>
  <div class="box">
    <my-nav v-show="$route.meta.isNav" />
    <router-view />
    <my-foot />
    <div v-show="$route.meta.isBg" class="bg"></div>
  </div>
</template>

<style lang="less" scoped>
.box {
  .bg {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: url(../assets/img/bg9.jpg);
    background-size: 100% 100%;
    z-index: 1;
  }
}
</style>

<script>
import { Nav, Foot } from './components'

export default {
  components: {
    MyNav: Nav,
    MyFoot: Foot
  }
}
</script>
