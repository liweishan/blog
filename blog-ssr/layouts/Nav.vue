<template>
  <div v-if="isNav" class="top">
    <header class="pc">
      <div class="logo">
        <img src="~/assets/img/logo2.png">
      </div>
      <nav>
        <a-menu v-model="current" mode="horizontal" @click="handLink">
          <a-menu-item v-for="v of getNavs" :key="v.path">
            {{ v.title }}
          </a-menu-item>
        </a-menu>
      </nav>
      <div v-if="!token" class="login-bar">
        <a href="javascript:;" class="login" @click="handleLogin">
          登录
        </a>
      </div>
      <div v-else class="user">
        <a-dropdown>
          <div class="img">
            <img v-if="userInfo.logo" :src="userInfo.logo">
            <img v-else src="@/assets/img/avatar2.jpg">
            <span>{{ userInfo.name }}</span>
          </div>
          <a-menu slot="overlay" @click="handleItem">
            <a-menu-item key="1">
              <a-icon type="edit" />
              修改密码
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="2">
              <a-icon type="logout" />
              退出登录
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </header>
    <header class="mobile">
      <div v-if="!token" class="login-bar">
        <a href="javascript:;" class="login" @click="handleLogin">
          登录
        </a>
      </div>
      <div v-else class="user" @click="logout">
        <img v-if="userInfo.logo" :src="userInfo.logo">
        <img v-else src="@/assets/img/avatar2.jpg">
      </div>
      <div class="logo">
        <img src="@/assets/img/logo2.png">
      </div>
      <div class="menu-icon" @click="handOpen">
        <a-icon v-show="!showMenu" type="menu-fold" />
        <a-icon v-show="showMenu" type="menu-unfold" />
      </div>
      <transition name="bounce" @after-enter="isLock = true" @after-leave="isLock = true">
        <div v-show="showMenu" class="menu">
          <ul>
            <li
              v-for="(v, i) of getNavs"
              :key="i"
              :class="{active: current[0] === v.path}"
              @click="handLink(v, i)"
            >
              {{ v.title }}
            </li>
          </ul>
        </div>
      </transition>
    </header>
  </div>
</template>

<script>
import {
  Menu,
  Dropdown,
  Icon
} from 'ant-design-vue'
import { mapGetters } from 'vuex'
import { getNavs } from '~/data/app'

const { Item, Divider } = Menu

export default {
  components: {
    AMenu: Menu,
    AMenuItem: Item,
    AMenuDivider: Divider,
    ADropdown: Dropdown,
    AIcon: Icon
  },
  data() {
    return {
      navs: getNavs(),
      isNav: true,
      current: [],
      showMenu: false,
      isLock: true
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'userInfo'
    ]),
    getNavs() {
      return this.navs.filter(nav => !nav.meta.parentPath)
    }
  },
  watch: {
    $route() {
      this.changeRouter()
    }
  },
  created() {
    this.changeRouter()
  },
  methods: {
    handLink(item, i) {
      const { $router, $route } = this
      const empty = typeof i === 'undefined'
      const path = empty ? item.key : item.path
      if ($route.path === path) {
        return
      }
      if (!empty) {
        this.current = [path]
      }
      this.showMenu = false
      this.isLock = true
      $router.replace(path)
    },
    changeRouter() {
      const { $route, navs } = this
      const { path } = $route
      // 根据当前路由获取对应的nav数据，isNav是否需要显示导航栏
      const curNav = navs.find(nav => {
        // 如果有规则就用规则校验
        if (nav.rule) {
          return nav.rule.test(path)
        } else {
          return nav.path === path
        }
      })
      if (curNav) {
        this.isNav = curNav.meta.isNav
        this.current = [curNav.meta.parentPath || path]
      } else {
        this.current = [path]
      }
    },
    /**
     * 点击用户的下拉菜单的item
     */
    handleItem(opt) {
      const { $router } = this
      const { key } = opt
      switch (+key) {
        case 1:
          $router.push({ path: '/revisePassword' })
          break
        default:
          this.logout()
      }
    },
    /**
     * 点击登录
     */
    handleLogin() {
      const { $route, $router } = this
      const to = {
        path: '/user/login',
        query: {
          redirect: encodeURIComponent($route.path)
        }
      }
      $router.push(to)
    },
    /**
     * 点击的退出登录
     */
    logout() {
      const { $store } = this
      $store.dispatch('user/logout')
    },
    /**
     * 点击展开或者闭合移动端的菜单
     */
    handOpen() {
      const { showMenu, isLock } = this
      if (!isLock) return
      this.showMenu = !showMenu
      this.isLock = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/style/your-theme-file.less';
.ant-dropdown-menu {
  width: 150px;
  li {
    &:hover {
      color: @primary-color;
    }
  }
}

.top {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  background: #fff;
  .mobile {
    display: none;
  }
  .pc {
    width: 1200px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
    .logo {
      float: left;
      padding: 5px 0;
      height: 60px;
      margin: 0 20px 0 0;
      img {
        height: 100%;
      }
    }
    nav {
      float: left;
      padding: 9px 0 0;
      line-height: 48px;
      /deep/ .ant-menu {
        border: none;
        .ant-menu-item {
          font-size: 16px;
          margin: 0 5px;
        }
      }
    }
    .login-bar {
      padding: 9px 0 0;
      line-height: 48px;
      float: right;
    }
    .user {
      float: right;
      padding: 11px 0 0;
      img {
        border-radius: 50%;
        width: 42px;
        height: 42px;
        cursor: pointer;
      }
      .img {
        span {
          margin-left: 6px;
          font-size: @min-size;
        }
      }
    }
  }
}
@media screen and (max-width: 1100px) {
  .top {
    .pc {
      display: none;
    }
    .mobile {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 5%;
      position: relative;
      z-index: 9999;
      .logo {
        height: 40px;
        img {
          height: 100%;
        }
      }
      .user {
        border-radius: 50%;
        overflow: hidden;
        img {
          height: 40px;
        }
      }
      .menu-icon {
        font-size: @two-size;
        display: flex;
        align-items: center;
      }
      .menu {
        width: 100%;
        position: absolute;
        top: 100%;
        left: 0;
        padding: 10px 10px 0;
        background: #fff;
        overflow: hidden;
        ul {
          margin: 0;
          li {
            height: 40px;
            line-height: 40px;
            padding: 0 30px;
            border-bottom: 1px solid @two-border;
            margin: 0 0 6px;
          }
          li:last-child {
            margin: 0;
            border-bottom: none;
          }
          li.active {
            position: relative;
            color: @primary-color;
            &::before {
              width: 100%;
              height: 2px;
              background: @primary-color;
              position: absolute;
              bottom: 0;
              left: 0;
            }
          }
        }
      }
    }
  }
}
.bounce-enter-active {
  animation: bounce-in .3s;
  transform-origin: 0 0;
}
.bounce-leave-active {
  animation: bounce-in .3s reverse;
  transform-origin: 0 0;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
