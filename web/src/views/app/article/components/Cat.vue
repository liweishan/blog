<template>
  <a-affix :offsetTop="80">
    <div class="cat-aside" ref="catAside">
      <div class="search-bar">
        <a-input-search placeholder="输入关键字搜索" size="large" @search="onSearch" />
      </div>
      <ul>
        <li class="sider" :style="{top: `${curIndex * 40}px`}"></li>
        <li
          v-for="(v, i) of catList"
          :key="i"
          @mouseenter="mouseenter(i)"
          @mouseleave="mouseleave(i)"
        >
          <span @click="handCat(i)">{{ v.catname }}</span>
        </li>
      </ul>
    </div>
    <div class="cat-menu">
      <div class="cat-toggle" @click="showMenu = true">
        <a-icon type="left" />
      </div>
      <div
        class="mask"
        :style="{display: !showMenu ? 'none' : 'block'}"
        @click="showMenu = false"
      />
      <div class="menu-list" :class="!showMenu ? 'menu-close' : 'menu-open'">
        <div class="title">分类导航</div>
        <div class="hr"></div>
        <div class="list">
          <div
            class="li"
            :class="{active: curIndex === i}"
            v-for="(v, i) of catList"
            :key="i"
            @click="handCat(i)"
          >
          {{ v.catname }}
          </div>
        </div>
      </div>
    </div>
  </a-affix>
</template>

<style lang="less" scoped>
@import '../../../../common/css/your-theme-file.less';

.cat-aside {
  background: #fff;
  .search-bar {
    background: @one-border;
    padding: 20px;
  }
  ul {
    position: relative;
    overflow: hidden;
    padding: 0 0 20px;
    margin: 20px 0 0;
    li {
      padding: 0 30px;
      height: 40px;
      line-height: 40px;
      position: relative;
      z-index: 2;
      span {
        display: block;
        padding: 0 20px;
        color: @submenu-color;
        cursor: pointer;
      }
    }
    .sider {
      width: 100%;
      height: 40px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      border-right: 6px solid @sider-border;
      background: @text-bg;
      transition: .2s linear;
    }
  }
}
.cat-menu {
  display: none;
}
@media screen and (max-width: 1100px) {
  .cat-aside {
    display: none;
  }
  .cat-menu {
    display: block;
    .cat-toggle {
      width: 14px;
      color: #fff;
      padding: 30px 1px;
      background: @primary-color;
      position: fixed;
      top: 40%;
      right: 0;
      z-index: 1;
    }
    .mask {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, .7);
      z-index: 2;
    }
    .menu-list {
      height: 100%;
      position: fixed;
      top: 0;
      right: -180px;
      z-index: 9;
      padding: 70px 10px 10px;
      background: @antd-bg;
      .title {
        font-size: @six-size;
        color: @base-fff;
        line-height: 28px;
        text-align: center;
      }
      .hr {
        height: 1px;
        background: @primary-color;
        margin: 0 0 5px;
      }
      .list {
        width: 160px;
        .li {
          width: 98%;
          background: @primary-color;
          color: @base-fff;
          font-size: @text-size;
          height: 30px;
          line-height: 30px;
          text-align: center;
          margin: 4px 0;
        }
        .li.active {
          background: @select-color;
        }
      }
    }
    .menu-open {
      right: 0;
      transition: .2s;
    }
    .menu-close {
      right: -180px;
      transition: .2s;
    }
  }
}
</style>

<script>
import { Input, Affix, Icon } from 'ant-design-vue'
import { getCat } from '@/api/blog'

const { Search } = Input

export default {
  name: 'Cat',
  components: {
    AInputSearch: Search,
    AAffix: Affix,
    AIcon: Icon
  },
  data() {
    return {
      catList: [],
      curIndex: 0,
      oldIndex: 0,
      isHandState: true,
      showMenu: false
    }
  },
  mounted() {
    this.requestCat()
  },
  methods: {
    async requestCat() {
      try {
        const res = await getCat()
        const { data } = res
        const obj = {
          cat_id: '',
          catname: '全部文章'
        }
        data.unshift(obj)
        this.catList = data
        const [v] = data
        this.$emit('initList', v.cat_id)
      } catch (err) {
        this.catList = []
      }
    },
    onSearch() {
      // console.log('搜索')
    },
    /**
     * 点击栏目
     * @param {Number} i 当前下标
     */
    handCat(i) {
      const { oldIndex, catList } = this
      this.isHandState = false
      if (oldIndex === i) return
      this.showMenu = false
      this.oldIndex = i
      const item = catList[i]
      this.$emit('initList', item.cat_id)
    },
    /**
     * 光标移入
     * @param {Number} i 当前下标
     */
    mouseenter(i) {
      const { curIndex } = this
      if (curIndex === i) return
      this.isHandState = true
      this.curIndex = i
    },
    /**
     * 光标移出
     * @param {Number} i 当前下标
     */
    mouseleave(i) {
      const { oldIndex, isHandState } = this
      if (oldIndex === i || !isHandState) return
      this.isHandState = true
      this.curIndex = oldIndex
    }
  }
}
</script>
