<template>
  <div class="container">
    <div class="menu-aside" :class="collapsed ? 'animation' : ''">
      <div class="logo">
        <a href="/">
          <img src="@/assets/img/logo2.png" alt="logo" />
          <span class="title">WeiShan</span>
        </a>
      </div>
      <a-menu
        mode="inline"
        theme="dark"
        :defaultOpenKeys="openKeys"
        :defaultSelectedKeys="defaultKeys"
        :inlineCollapsed="collapsed"
        @openChange="onOpenChange"
        @click="handClick"
      >
        <a-sub-menu v-for="v of menuList" :key="v.path">
          <span slot="title"><a-icon type="mail" /><span>{{ v.meta.title }}</span></span>
          <a-menu-item v-for="e of v.children" :key="e.path">{{ e.meta.title }}</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <div class="main">
      <div class="head">
        <a-icon type="menu-fold" @click="handleOpen" />
        <a-dropdown>
          <div class="user-wrap">
            <img src="@/assets/img/avatar2.jpg" >
            <div class="name">{{ userInfo.name }}</div>
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
      <router-view />
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../../common/css/your-theme-file.less';
.ant-dropdown-menu {
  width: 150px;
  li {
    &:hover {
      color: @primary-color;
    }
  }
}
.container {
  display: flex;
  min-height: 100vh;
  .menu-aside {
    width: 256px;
    transition: .4s;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: @antd-bg;
    .logo {
      height: 64px;
      line-height: 64px;
      padding-left: 24px;
      a {
        img {
          height: 32px;
          vertical-align: top;
          border-style: none;
          margin: 16px 0 0;
        }
        .title {
          font-size: @four-size;
          color: @base-fff;
          font-weight: 600;
          margin: 0 0 0 12px;
        }
      }
    }
    /deep/ .ant-menu {
      flex: 1;
      max-width: 256px;
    }
  }
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .head {
      overflow: hidden;
      padding: 0 24px 0 0;
      height: 64px;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      /deep/ i {
        font-size: @four-size;
        line-height: 64px;
        padding: 0 24px 0 12px;
        float: left;
        cursor: pointer;
      }
      .user-wrap {
        float: right;
        overflow: hidden;
        cursor: pointer;
        padding: 0 12px;
        img {
          width: 24px;
          height: 24px;
          margin: 20px 8px 0 0;
          float: left;
        }
        .name {
          float: right;
          color: @text-color;
          font-size: @text-size;
          line-height: 64px;
        }
      }
    }
  }
}
.animation {
  width: 80px !important;
  transition: width .4s;
  .logo {
    span {
      display: none;
    }
  }
}
</style>

<script>
import { mapGetters } from 'vuex'
import { Menu, Icon, Dropdown } from 'ant-design-vue'
import { getCopyObj } from '@/utils/util'


const { SubMenu, Item, Divider } = Menu

export default {
  components: {
    AMenu: Menu,
    ASubMenu: SubMenu,
    AMenuItem: Item,
    AMenuDivider: Divider,
    AIcon: Icon,
    ADropdown: Dropdown
  },
  computed: {
    ...mapGetters([
      'addRoutes',
      'userInfo'
    ])
  },
  data() {
    return {
      openKeys: [],
      defaultKeys: [],
      menuList: [],
      collapsed: false
    }
  },
  created() {
    const { $route, addRoutes } = this
    const { meta } = $route
    if (!addRoutes.length) return
    const menus = addRoutes.filter(e => e.meta?.parentName === meta.parentName)
    this.menuList = this.getMenus(getCopyObj(menus))
    if (!menus.length) return
    const [v] = $route.matched
    this.openKeys.push(v.path)
    const defaultKeys = this.getDefaultKeys(this.menuList)
    this.defaultKeys.push(defaultKeys)
  },
  methods: {
    getMenus(menus) {
      for (const [i, v] of menus.entries()) {
        if (v.meta && v.meta.hideMenu) {
          menus.splice(i, 1)
          break
        }
        if (v.children instanceof Array && v.children.length) {
          v.children = this.getMenus(v.children)
        }
      }
      return menus
    },
    /**
     * 获取当前菜单的active
     */
    getDefaultKeys(menuList) {
      const { path } = this.$route
      let curPath = ''
      for (const v of menuList.values()) {
        const paths = path.split('/')
        if (path === v.path || paths.includes(v.path.replace('/', ''))) {
          curPath = v.path
        } else if (v.children instanceof Array && v.children.length && !curPath) {
          curPath = this.getDefaultKeys(v.children)
        }
      }
      return curPath
    },
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
      if (this.menuList.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    handClick({ key }) {
      const { defaultKeys, $router, $route } = this
      const i = defaultKeys.findIndex(e => e === key)
      if (i === -1 || $route.path !== key) {
        this.defaultKeys = [key]
        $router.push({ path: key })
      }
    },
    handleOpen() {
      const { collapsed, defaultKeys } = this
      if (collapsed) {
        this.openKeys = []
      } else {
        this.openKeys = defaultKeys
      }
      this.collapsed = !collapsed
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
      const { $store, $router } = this
      $store.dispatch('user/logout')
      $router.replace({ path: '/' })
      const accessRoutes = await $store.dispatch('permission/generateRoutes', '')
      // 添加首页等导航栏页面
      if (accessRoutes.length) $router.addRoutes(accessRoutes)
    }
  }
}
</script>
