<template>
  <div class="wrap">
    <navig />
    <div class="bg">
      <!-- <img src="@/assets/img/11.jpg" alt=""> -->
      <div class="user">
        <div class="user-center">
          <h1>小李子</h1>
          <p>劈荆斩浪，无所畏惧</p>
          <a-button size="large" type="primary" @click="handBtn">
            Enter Blog
          </a-button>
        </div>
      </div>
    </div>
    <new-art :art-list="artList" />
    <about />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Button } from 'ant-design-vue'
import { NewArt, About, Navig } from './components'

import { getArt } from '~/api/blog'
import { getFormatTime } from '~/utils/util'

export default {
  name: 'Home',
  components: {
    AButton: Button,
    NewArt,
    About,
    Navig
  },
  // 组件里面么有asyncData，所以用传参的方式解决
  async asyncData() {
    const data = {
      pageSize: 3,
      curPage: 1
    }
    try {
      const res = await getArt(data)
      const list = res.data.result
      for (const v of list.values()) {
        v.time = getFormatTime('Y-M-D h:m:s', v.pubtime * 1000)
        v.suo = `${process.env.NUXT_ENV.baseURL}/${v.suo}`
      }
      return {
        artList: list
      }
    } catch (err) {
      // console.log(err)
    }
  },
  data() {
    return {
      artList: []
    }
  },
  computed: {
    ...mapGetters(
      ['height', 'isPc']
    )
  },
  methods: {
    handBtn() {
      const { $router } = this
      $router.push('/article')
    }
  }
}
</script>

<style lang="less" scoped>
.wrap {
  .bg {
    height: 100vh;
    padding: 0;
    background-color: transparent;
    background-image: url(~/assets/img/11.jpg);
    background-position: center;
    background-attachment: fixed;
    // background-repeat: no-repeat;
    position: relative;
    .user {
      height: 100%;
      display: flex;
      align-items: center;
      position: relative;
      z-index: 9;
      .user-center {
        color: #fff;
        flex: 1;
        text-align: center;
        h1 {
          color: #fff;
          font-size: 28px;
          letter-spacing: 5px;
        }
        p {
          font-size: 14px;
          margin: 0 0 40px;
          letter-spacing: 10px;
        }
      }
    }
  }
  .bg::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
  }
}
</style>
