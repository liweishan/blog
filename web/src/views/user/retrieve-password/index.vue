<template>
  <div class="login">
    <div class="top">
      <div class="header">
        <a href="/">
          <img src="@/assets/img/logo5.png" alt="logo" class="logo" />
          <!-- <span class="title">Li WeiShan</span> -->
        </a>
      </div>
      <div class="desc">本博客主要用于技术分享与交流</div>
    </div>
    <div class="main">
      <a-form :form="form" ref="formLogin" @submit.prevent="handleSubmit">
        <a-form-item class="mobile-item">
          <a-input size="large" placeholder="请输入手机号" v-decorator="rules.mobile" />
          <a-button
            v-if="!second"
            size="large"
            block
            type="primary"
            @click="handleSms"
          >
            获取验证码
          </a-button>
          <a-button
            v-else
            size="large"
            block
            type="primary"
          >
            {{ second }}s
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-input
            size="large"
            :type="toggle ? 'text' : 'password'"
            placeholder="请输入密码"
            v-decorator="rules.userPsd"
          >
            <a-icon @click="toggle = true" v-show="!toggle" slot="suffix" type="eye-invisible" />
            <a-icon @click="toggle = false" v-show="toggle" slot="suffix" type="eye" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input size="large" placeholder="请输入验证码" v-decorator="rules.code" />
        </a-form-item>
        <a-form-item>
          <a-button
            size="large"
            block
            type="primary"
            html-type="submit"
            :loading="isLoding"
          >
            Submit
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="foot">
      <p>
        已有账号？
        <a href="javascript:;" @click="handleLogin">立即登录</a>
        </p>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../../common/css/your-theme-file.less';
.login {
  min-height: 100vh;
  background: url('../../../assets/svg/bg.svg');
  background-size: 100% 100%;
  padding: 110px 0 144px;
  box-sizing: border-box;
  .top {
    text-align: center;
    overflow: hidden;
    .header {
      // height: 42px;
      // line-height: 42px;
      a {
        img {
          height: 68px;
          vertical-align: top;
          margin-right: 16px;
          border-style: none;
        }
        .title {
          font-size: @one-size;
          color: @main-title;
          font-weight: 600;
          position: relative;
          top: 4px;
        }
      }
    }
    .desc {
      color: @msg-color;
      margin: 12px 0 40px;
    }
  }
  .main {
    width: 100%;
    max-width: 378px;
    padding: 0 5px;
    box-sizing: border-box;
    margin: 0 auto;
    overflow: hidden;
    ::v-deep .ant-form {
      .mobile-item {
        .ant-form-item-children {
          display: flex;
          input {
            flex: 1;
            border-radius: 4px 0 0 4px;
          }
          button {
            width: 114px;
            border-radius: 0 4px 4px 0;
          }
        }
      }
    }
  }
  .foot {
    overflow: hidden;
    p {
      text-align: center;
      color: @msg-color;
      a {
        color: @link-color;
      }
    }
  }
}
</style>

<script>
import {
  Form,
  Button,
  Input,
  Icon,
  Message
} from 'ant-design-vue'
import getRules from '@/utils/strategy'
import { countDown } from '@/utils/util'
import { retrievePwd, sms } from '@/api/user'

const { Item } = Form

export default {
  components: {
    AForm: Form,
    AButton: Button,
    AInput: Input,
    AFormItem: Item,
    AIcon: Icon
  },
  data() {
    const { $form } = this
    const rules = getRules({
      userPsd: [
        {
          key: '',
          msg: '密码不能为空'
        },
        {
          key: 'userPsd',
          msg: '必须要数字或者字母，且长度为6-18'
        }
      ],
      mobile: [
        {
          key: '',
          msg: '手机号码不能为空'
        },
        {
          key: 'mobile',
          msg: '请输入手机号码'
        }
      ],
      code: [
        {
          key: '',
          msg: '验证码不能为空'
        },
        {
          key: 'code',
          msg: '请输入正确的验证码'
        }
      ]
    })

    return {
      form: $form.createForm(this),
      rules,
      isLoding: false,
      second: 0,
      close: null,
      toggle: false
    }
  },
  beforeDestroy() {
    const { second } = this
    // 如果该值大于0那么倒计时还没有结束就手动结束
    if (second > 0 && this.close) {
      this.close()
    }
    this.close = null
  },
  methods: {
    /**
     * 点击提交按钮
     */
    handleSubmit() {
      const {
        form: { validateFields },
        $router
      } = this

      this.isLoding = true
      const validateFieldsKey = ['userName', 'userPsd', 'mobile', 'code']
      const opt = {
        force: true,
        firstFields: true
      }
      validateFields(validateFieldsKey, opt, async (validate, values) => {
        if (!validate) {
          values.password = values.userPsd
          delete values.userPsd
          try {
            await retrievePwd(values)
            $router.replace({ path: '/login' })
            Message.success('已成功找回密码！')
          } catch (err) {
            // console.log(err)
          }
          this.isLoding = false
        } else {
          setTimeout(() => {
            this.isLoding = false
          }, 600)
        }
      })
    },
    /**
     * 复选框值改变
     * @param {Event} e
     */
    handChange(e) {
      const val = e.target.checked
      this.rememberPsd = val
    },
    /**
     * 点击获取验证码按钮
     */
    async handleSms() {
      const {
        form: { validateFields }
      } = this
      const validateFieldsKey = ['mobile']

      validateFields(validateFieldsKey, { force: true }, async (validate, values) => {
        if (!validate) {
          countDown(60, (num, close) => {
            if (num < 0) {
              return
            }
            this.close = close
            this.second = num
          })
          try {
            await sms(values)
            Message.success('验证码发送成功！')
          } catch (err) {
            this.second = 0
            if (this.close) this.close()
          }
        }
      })
    },
    /**
     * 点击立即登录
     */
    handleLogin() {
      const { $router } = this
      const opt = {
        path: '/login'
      }
      $router.replace(opt)
    }
  }
}
</script>
