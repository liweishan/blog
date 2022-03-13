<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
@import 'common/css/base.less';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
&.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
export default {
  mounted() {
    this.resize()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize() {
      const { $store } = this
      $store.dispatch('app/setWindowState')
    }
  }
}
</script>
