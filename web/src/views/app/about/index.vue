<template>
  <div class="wrap">
    <div class="canvas-box">
      <my-canvas />
    </div>
    <div class="canvas-text">披荆斩浪，无所畏惧</div>
    <div class="content">
      <section>
        <div class="cur-title">
          <div class="icon"></div>
          关于我
        </div>
        <p>本人切图仔一枚，对不会的东西都比较感兴趣，get到骚操作会有那么一丢丢成就感，然后撸码主要是为了生活。。。</p>
        <dl>
          <dt>可以通过以下方式联系到我：</dt>
          <dd>
            <div class="label">邮箱：</div>
            <div class="val contact">925385859@qq.com</div>
          </dd>
        </dl>
      </section>
      <section>
        <div class="cur-title">
          <div class="icon"></div>
          关于本站
        </div>
        <p>本站建于2021年5月，主要用来记录一些技术要点，然后就是写着玩玩，没错就是玩。</p>
        <dl>
          <dt>本站结构：</dt>
          <dd>
            <div class="label">前端：</div>
            <div class="val skill">VUE + Ant Design Vue</div>
          </dd>
          <dd>
            <div class="label">后端：</div>
            <div class="val skill">TP5 + MYSQL</div>
          </dd>
        </dl>
      </section>
      <section>
        <div class="cur-title">
          <div class="icon"></div>
          特别说明
        </div>
        <p class="text">本站文章仅代表个人观点，和任何组织或个人无关。</p>
        <p class="text">本站浏览器兼容性只考虑ie10+，建议使用谷歌。</p>
        <p class="text">用户邮箱仅作回复消息用，不对外使用。</p>
        <br />
        <br />
        <img src="@/assets/img/bg9.jpg" alt="">
      </section>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../../common/css/your-theme-file.less';

.wrap {
  min-height: 100vh;
  padding: 60px 0 0;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
  .canvas-box {
    height: 300px;
    overflow: hidden;
    margin: 0 0 20px;
  }
  .canvas-text {
    width: 100%;
    height: 300px;
    line-height: 300px;
    color: @base-fff;
    font-size: @three-size;
    text-align: center;
    position: absolute;
    top: 60px;
    left: 0;
    z-index: 9;
  }
  .content {
    .content();
    width: 90%;
    background: @base-fff;
    margin-bottom: 20px;
    section {
      padding: 20px;
      .cur-title {
        color: @main-title;
        font-size: @title-size;
        font-weight: bolder;
        line-height: 20px;
        margin: 0 0 20px;
        .icon {
          float: left;
          width: 3px;
          height: 20px;
          background: @primary-color;
          margin-right: 12px;
        }
      }
      p, dl {
        color: @text-color;
        padding-left: 14px;
      }
      .text {
        margin: 0;
        line-height: 28px;
      }
      img {
        width: 100%;
        height: 320px;
      }
      dl {
        dt {
          line-height: 16px;
          margin: 0 0 4px;
        }
        dd {
          overflow: hidden;
          line-height: 28px;
          margin: 0;
          .label {
            float: left;
          }
          .contact {
            color: @link-color;
            cursor: pointer;
          }
          .skill {
            color: @primary-color;
            font-family: "Menlo,Monaco,Consolas,Courier New,monospace";
          }
        }
      }
    }
  }
}
</style>

<script>
import Canvas from './components/canvas.vue'

export default {
  name: 'About',
  components: {
    MyCanvas: Canvas
  }
}
</script>
