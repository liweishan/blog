<template>
  <div class="top">
    <a-back-top />
    <header class="pc">
      <div class="logo">
        <img src="@/assets/img/logo2.png" />
      </div>
      <nav>
        <a-menu v-model="current" mode="horizontal" @click="handLink">
          <a-menu-item v-for="v of getNavs" :key="v.path">{{ v.meta.title }}</a-menu-item>
          <a-menu-item :key="'2'">你大爷</a-menu-item>
        </a-menu>
      </nav>
      <div v-if="!token" class="login-bar">
        <nuxt-link class="login" to="/login" >登录</nuxt-link>
      </div>
      <div v-else class="user">
        <a-dropdown>
          <div class="img">
            <img v-if="userInfo.logo" :src="userInfo.logo" />
            <img v-else src="@/assets/img/avatar2.jpg" >
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
        <router-link class="login" to="/login" >登录</router-link>
      </div>
      <div v-else class="user" @click="logout">
          <img v-if="userInfo.logo" :src="userInfo.logo" />
          <img v-else src="@/assets/img/avatar2.jpg" >
      </div>
      <div class="logo">
        <img src="@/assets/img/logo2.png" />
      </div>
      <div class="menu-icon" @click="handOpen">
        <a-icon v-show="!showMenu" type="menu-fold" />
        <a-icon v-show="showMenu" type="menu-unfold" />
      </div>
      <transition name="bounce" @after-enter="isLock = true" @after-leave="isLock = true">
        <div class="menu" v-show="showMenu">
          <ul>
            <li
              v-for="(v, i) of getNavs"
              :key="i"
              :class="{active: current[0] === v.path}"
              @click="handLink(v, i)"
            >
              {{ v.meta.title }}
            </li>
          </ul>
        </div>
      </transition>
    </header>
  </div>
</template>

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

<script>
import {
  Menu,
  Dropdown,
  Icon,
  BackTop
} from 'ant-design-vue'
import { mapGetters } from 'vuex'

const { Item, Divider } = Menu

export default {
  components: {
    AMenu: Menu,
    AMenuItem: Item,
    AMenuDivider: Divider,
    ADropdown: Dropdown,
    AIcon: Icon,
    ABackTop: BackTop
  },
  computed: {
    ...mapGetters([
      'navs',
      'token',
      'userInfo'
    ]),
    getNavs() {
      const { navs } = this
      return navs.filter(e => !e.meta.parentPath)
    }
  },
  data() {
    return {
      current: [],
      showMenu: false,
      isLock: true
    }
  },
  watch: {
    $route() {
      this.changeRouter()
    }
  },
  created() {
    // const { navs } = this
    // this.current = [navs[0].path]
  },
  mounted() {
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
      const { $route } = this
      const { path, meta } = $route
      this.current = [meta.parentPath || path]
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
     * 点击的退出登录
     */
    async logout() {
      const { $store, $router, $route } = this
      $store.dispatch('user/logout')
      const accessRoutes = await $store.dispatch('permission/generateRoutes', '')
      // 添加404页面
      if (accessRoutes.length) $router.addRoute(accessRoutes.pop())
      // 该页面需要权限证明是系统管理页，才需要跳转到首页
      if ($route.meta?.requireAuth) $router.replace({ path: '/' })
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
