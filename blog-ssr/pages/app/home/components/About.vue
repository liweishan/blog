<template>
  <div class="about-box">
    <ul class="links">
      <li v-for="(v, i) of links" :key="i">
        <a href="javascript:;">{{ v.title }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    const links = this.getLinks()
    return {
      links
    }
  },
  methods: {
    getLinks() {
      return [
        {
          url: '/app/about',
          title: '关于'
        },
        {
          url: '/Links',
          title: '友情链接'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/style/your-theme-file.less';

.about-box {
  background-position: center;
  background-attachment: fixed;
  background-image: url(~/assets/img/22.jpg);
  padding: 100px 0;
  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
  }
  .links {
    position: relative;
    z-index: 9;
    .content();
    display: flex;
    justify-content: center;
    li {
      width: 200px;
      height: 46px;
      line-height: 46px;
      margin: 0 10px;
      position: relative;
      a {
        position: relative;
        z-index: 9;
        display: block;
        color: @base-fff;
        font-size: @text-size;
        border: 1px solid @base-fff;
        text-align: center;
      }
      &::after {
        content: '';
        width: 0;
        background-color: @primary-color;
        height: 48px;
        position: absolute;
        left: 0;
        top: 0;
        transition: all .4s linear;
        z-index: 0;
      }
      &:hover::after {
        width: 100% !important;
        transition: all .4s linear;
      }
    }
  }
}
</style>
