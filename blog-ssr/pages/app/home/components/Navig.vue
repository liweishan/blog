<template>
  <div class="navig-box">
    <div class="menu-open" @click="handOpen">
      <a-icon :type="showFlag ? 'close' : 'menu'" />
    </div>
    <div v-show="showFlag" class="cover" />
    <transition name="bounce" @after-enter="animationEnter" @after-leave="animationEnter">
      <div v-show="showFlag" class="navig" />
    </transition>
    <ul v-show="showFlag" class="menu">
      <li v-for="(v, i) of navs" :key="i" @click="handLink(v.path)">
        <a href="javascript:;">
          {{ v.title }}
        </a>
      </li>
    </ul>
    <div v-show="showFlag" class="logo">
      <img src="@/assets/img/logo2.png" alt="">
    </div>
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'

import { getNavs } from '~/data/app'

export default {
  components: {
    AIcon: Icon
  },
  data() {
    const navs = getNavs().filter(nav => nav.meta.isHome)
    return {
      showFlag: false,
      isLock: true,
      navs
    }
  },
  methods: {
    handOpen() {
      const { showFlag, isLock } = this
      if (!isLock) return
      this.showFlag = !showFlag
      this.isLock = false
    },
    /**
     * 动画显示完成的回调
     */
    animationEnter() {
      this.isLock = true
    },
    handLink(path) {
      const { $router } = this
      $router.push(path)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/style/your-theme-file.less';

.navig-box {
  width: 0;
  .menu-open {
    position: fixed;
    top: 40px;
    right: 55px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    z-index: 20;
    text-align: center;
    font-size: 20px;
    color: #fff;
    background: rgba(0, 0, 0, .1);
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      background: @primary-color;
    }
  }
  .cover {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, .5);
    z-index: 10;
  }
  .navig {
    width: 60%;
    height: 100vh;
    background: #fff;
    position: fixed;
    top: 0;
    right: 0;
    transform: translateZ(0) translateX(45%) skew(-12deg);
    z-index: 11;
  }
  .menu {
    position: fixed;
    top: 200px;
    right: 0;
    width: 140px;
    z-index: 12;
    li {
      height: 80px;
      line-height: 80px;
      font-size: @four-size;
      text-align: center;
      padding: 0 15px;
      a {
        position: relative;
        display: block;
        color: @text-color;
        &::after {
          transition: all .3s linear;
          content: '';
          width: 0;
          height: 1px;
          background: @primary-color;
          position: absolute;
          top: 50%;
          left: 0;
        }
        &:hover {
          color: @primary-color;
        }
        &:hover::after {
          width: 100%;
        }
      }
    }
  }
  .logo {
    height: 60px;
    position: fixed;
    bottom: 40px;
    right: 55px;
    z-index: 13;
    img {
      height: 100%;
    }
  }
}

.bounce-enter-active {
  animation: bounce-in .2s;
}
.bounce-leave-active {
  animation: bounce-in .2s reverse;
}
@keyframes bounce-in {
  0% {
    width: 0;
  }
  100% {
    width: 60%;
  }
}
@media screen and (max-width: 750px) {
  .navig-box {
    .navig {
      width: 50%;
       transform: translateZ(0) translateX(0) skew(0) !important;
     }
  }
  @keyframes bounce-in {
  0% {
    width: 0;
  }
  100% {
    width: 50%;
  }
}
}
</style>
