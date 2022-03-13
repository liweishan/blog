<template>
  <div class="wrap">
    <navig />
    <div class="bg">
      <!-- <img src="@/assets/img/11.jpg" alt=""> -->
      <div class="user">
        <div class="user-center">
          <h1>小李子</h1>
          <p>劈荆斩浪，无所畏惧</p>
          <a-button size="large" type="primary" @click="handBtn">Enter Blog</a-button>
        </div>
      </div>
    </div>
    <new-art />
    <about />
  </div>
</template>

<style lang="less" scoped>
.wrap {
  .bg {
    height: 100vh;
    padding: 0;
    background-color: transparent;
    background-image: url(../../../assets/img/11.jpg);
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

<script>
import { mapGetters } from 'vuex'
import { Button } from 'ant-design-vue'
import { NewArt, About, Navig } from './components'

export default {
  name: 'Home',
  components: {
    AButton: Button,
    NewArt,
    About,
    Navig
  },
  data() {
    return {

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
