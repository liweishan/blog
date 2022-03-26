<template>
  <div class="wrap">
    <a-back-top />
    <Nav />
    <nuxt />
    <Foot />
  </div>
</template>

<script>
import { BackTop } from 'ant-design-vue'
import Foot from '~/layouts/Foot.vue'
import Nav from '~/layouts/Nav.vue'

export default {
  name: 'App',
  components: {
    [BackTop.name]: BackTop,
    Foot,
    Nav
  }
}
</script>
