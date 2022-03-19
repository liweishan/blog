<template>
  <div class="wrap">
    <Nav />
    <nuxt />
    <Foot />
  </div>
</template>

<script>
import Foot from '~/layouts/Foot.vue'
import Nav from '~/layouts/Nav.vue'

export default {
  name: 'App',
  components: {
    Foot,
    Nav
  },
  fetch ({ req }) {
    console.log(req.headers.cookie, 111111111)
  }
}
</script>
