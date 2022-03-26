
<template>
  <div class="wrap">
    <div class="bg" />
    <div class="content">
      <a-col :xl="17" :sm="24" :xs="24">
        <!-- <list ref="list" /> -->
        <my-list
          :lower-threshold="50"
          :is-loadding="paging.isLoadding"
          :is-more="paging.isMore"
          :length="artList.length"
          class="list-box"
          @scrolltolower="scrolltolower"
        >
          <ul>
            <li v-for="(v, i) of artList" :key="i">
              <span class="name-bar">
                <span class="name hover" @click="handleDetails(v.art_id)">{{ v.title }}</span>
              </span>
              <a-divider class="time" orientation="right">
                <div class="time-content">
                  <span class="month">{{ v.month }}</span>
                  <span class="year">{{ v.year }}</span>
                  <span class="day">{{ v.day }}</span>
                </div>
              </a-divider>
              <em class="img-box">
                <a-col class="img" :md="9" :sm="24" :xs="24">
                  <img :src="v.suo" alt="">
                </a-col>
                <a-col :md="{ span: 14, offset: 1 }" :sm="24" :xs="24">
                  <div class="art">{{ v.remarks }}</div>
                </a-col>
              </em>
              <a-divider class="read-more" orientation="left">
                <span class="hover" @click="handleDetails(v.art_id)">继续阅读</span>
              </a-divider>
              <div class="foot">
                <div class="tags fl">
                  <a-icon type="tags" />
                  <span class="tag">{{ v.catname }}</span>
                </div>
                <div class="fr">
                  <span class="read fl">
                    <i class="liulan iconfont" />
                    <i>{{ v.readnum }}</i>
                  </span>
                  <span class="fr comment">
                    <i class="pinglun iconfont" />
                    <i>{{ v.comm }}</i>
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </my-list>
      </a-col>
      <a-col :xl="{ span: 6, offset: 1 }" :sm="24" :xs="24">
        <a-affix :offset-top="80">
          <div ref="catAside" class="cat-aside">
            <div class="search-bar">
              <a-input-search placeholder="输入关键字搜索" size="large" @search="onSearch" />
            </div>
            <ul>
              <li :style="{top: `${curIndex * 40}px`}" class="sider" />
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
              <div class="title">
                分类导航
              </div>
              <div class="hr" />
              <div class="list">
                <div
                  v-for="(v, i) of catList"
                  :key="i"
                  class="li"
                  :class="{active: curIndex === i}"
                  @click="handCat(i)"
                >
                  {{ v.catname }}
                </div>
              </div>
            </div>
          </div>
        </a-affix>
      </a-col>
    </div>
  </div>
</template>

<script>
import { Divider, Col, Icon, Affix, Input } from 'ant-design-vue'
// import Cat from './components/Cat.vue'
import List from '~/components/list/index.vue'
import { getArt, getCat } from '~/api/blog'
import { getFormatTime } from '~/utils/util'
// import { Col } from 'ant-design-vue'
// import List from './components/List.vue'

const { Search } = Input

// asyncData里面没有vue的实例，只能把方法封装在外面
async function requestArtList(data) {
  const { cat_id, curPage, pageSize } = data
  const params = {
    cat_id,
    curPage,
    pageSize
  }
  try {
    const res = await getArt(params)
    const { total, result } = res.data
    for (const v of result.values()) {
      const date = getFormatTime('Y-M-D', v.pubtime * 1e3)
      if (date) {
        const dates = date.split('-')
        const [year, month, day] = dates
        v.day = day
        v.month = `${month}月`
        v.year = year
      }
      v.suo = `${process.env.NUXT_ENV.baseURL}/${v.suo}`
      v.pic = `${process.env.NUXT_ENV.baseURL}/${v.pic}`
    }
    return {
      artList: result,
      isRequest: true,
      paging: {
        ...data,
        curPage: data.curPage + 1,
        total,
        isMore: total <= result.length
      }
    }
  } catch (err) {
    return {}
  }
}

async function requestCatList() {
  try {
    const res = await getCat()
    const catList = res.data
    const obj = {
      cat_id: '',
      catname: '全部文章'
    }
    catList.unshift(obj)
    return {
      catList
    }
  } catch (err) {
    return {}
  }
}

export default {
  name: 'Article',
  components: {
    [Col.name]: Col,
    [Divider.name]: Divider,
    [Icon.name]: Icon,
    [Search.name]: Search,
    [Affix.name]: Affix,
    MyList: List
    // Cat
  },
  async asyncData() {
    const paging = {
      pageSize: 5,
      curPage: 1
    }
    try {
      const res = await Promise.all([requestArtList(paging), requestCatList()])
      return res.reduce((data, v) => {
        data = {
          ...v,
          ...data
        }
        return data
      }, {})
    } catch (error) {
      // console.log(error, '数据获取失败')
    }
  },
  data() {
    const paging = {
      curPage: 1,
      pageSize: 5
    }
    return {
      artList: [],
      paging,
      isRequest: false,
      catList: [],
      curIndex: 0,
      oldIndex: 0,
      isHandState: true,
      showMenu: false
    }
  },
  methods: {
    /**
     * 请求数据
     * @param {*} id 栏目id
     */
    async requestList(id) {
      const { paging, artList } = this
      if (typeof id !== 'undefined') {
        paging.cat_id = id
        this.initData()
      }
      this.$set(paging, 'isLoadding', true)
      try {
        const res = await requestArtList(paging)
        res.artList = [...artList, ...res.artList]
        res.paging.isLoadding = false
        res.paging.isMore = res.paging.total <= res.artList.length
        for (const [k, v] of Object.entries(res)) {
          this[k] = v
        }
      } catch (err) {
        this.artList = []
        this.$set(paging, 'isLoadding', false)
      }
    },
    /**
     * 初始化参数
     */
    initData() {
      const { paging } = this
      this.$set(paging, 'curPage', 1)
      this.$set(paging, 'isMore', false)
      this.artList = []
    },
    /**
     * 触底事件
     */
    scrolltolower() {
      const { isRequest, paging } = this
      const { isMore } = paging
      if (!isRequest || isMore) return
      this.isRequest = false
      this.requestList()
    },
    /**
     * 点击查看文章详情
     * @param {Number} artId 文章id
     */
    handleDetails(artId) {
      const { $router } = this
      const opt = {
        path: `/app/article/${artId}`
      }
      $router.push(opt)
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
      this.requestList(item.cat_id)
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

<style lang="less" scoped>
@import '~/assets/style/your-theme-file.less';

.wrap {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  padding: 60px 0 40px;
  .bg {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: url(~/assets/img/bg9.jpg);
    background-size: 100% 100%;
    z-index: 1;
  }
  .content {
    .content();
    overflow: hidden;
    padding: 20px 0 0;
    position: relative;
    z-index: 9;
    .list-box {
      ul {
        li {
          background: @base-fff;
          margin: 0 0 20px;
          padding: 16px 30px 25px;
          .name-bar {
            overflow: hidden;
            display: block;
            height: 20px;
            line-height: 20px;
            padding: 0 0 0 5px;
            .name {
              float: left;
              color: @main-title;
              font-size: @six-size;
            }
          }
          .img-box {
            display: block;
            overflow: hidden;
            /deep/ .ant-col-xs-24 {
              margin-top: 16px;
            }
            /deep/ .ant-col-xs-24.img {
              height: 180px;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              img {
                width: 100%;
                height: auto;
              }
            }
            p {
              overflow: hidden;
              margin: 0;
            }
          }
          /deep/ .time {
            margin: 0;
            .time-content {
              position: relative;
              color: @msg-color;
              font-size: @text-size;
              line-height: 18px;
              .month {
                margin-right: 10px;
              }
              .day {
                width: 100%;
                position: absolute;
                top: -30px;
                left: 0;
                color: @primary-color;
                font-size: @one-size;
                line-height: 32px;
                text-align: center;
              }
            }
          }
          /deep/ .read-more {
            .hover {
              color: @text-color;
              font-weight: bold;
              font-size: @text-size;
            }
          }
          .hover:hover {
            color: @primary-color;
            text-decoration: underline;
            cursor: pointer;
          }
          .foot {
            height: 26px;
            color: @msg-color;
            .tags {
              overflow: hidden;
              line-height: 22px;
              padding: 2px 0;
              .tag {
                background: @msg-bg;
                font-size: @min-size;
                display: block;
                float: left;
                padding: 0 4px;
              }
              /deep/ i {
                margin: 3px 5px 0 0;
                float: left;
                font-size: @six-size;
              }
            }
            .fr {
              .read {
                margin: 0 18px 0 0;
              }
              span {
                display: block;
                overflow: hidden;
                i, /deep/ i {
                  line-height: 26px;
                  float: left;
                  display: block;
                  margin: 0 0 0 2px;
                }
              }
            }
          }
        }
      }
    }
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
  }
}

@media screen and (max-width: 1100px) {
  .list-box {
    ul {
      width: 90%;
      margin: 0 auto;
    }
  }
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
