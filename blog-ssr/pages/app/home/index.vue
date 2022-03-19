<template>
  <div class="home">
    <div v-for="(v, i) of list" :key="i">
      {{ v.catname }}
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  async asyncData () {
    const res = await axios({
      method: 'GET',
      url: 'http://tp5.com/getCat',
      headers: {
        token: '11111111'
      }
    })
    return { list: res.data.data }
  }
}
</script>
