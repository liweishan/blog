<template>
  <div class="login">
    <div class="top">
      <div class="header">
        <div class="link" @click="handleHome">
          <img src="@/assets/img/logo5.png" alt="logo" class="logo">
          <!-- <span class="title">Li WeiShan</span> -->
        </div>
      </div>
      <div class="desc">
        本博客主要用于技术分享与交流
      </div>
    </div>
    <div class="main">
      <a-form ref="formLogin" :form="form" @submit.prevent="handleSubmit">
        <a-form-item>
          <a-input v-decorator="rules.userName" size="large" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="rules.userPsd"
            size="large"
            :type="toggle ? 'text' : 'password'"
            placeholder="请输入密码"
            autocomplete="new-password"
          >
            <a-icon v-show="!toggle" slot="suffix" type="eye-invisible" @click="toggle = true" />
            <a-icon v-show="toggle" slot="suffix" type="eye" @click="toggle = false" />
          </a-input>
        </a-form-item>
        <a-form-item class="mobile-item">
          <a-input v-decorator="rules.mobile" autocomplete="off" size="large" placeholder="请输入手机号" />
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
          <a-input v-decorator="rules.code" size="large" placeholder="请输入验证码" />
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

<script>
import {
  Form,
  Button,
  Input,
  Icon,
  message
} from 'ant-design-vue'
import getRules from '@/utils/strategy'
import { countDown } from '@/utils/util'
import { register, sms } from '@/api/user'

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
      userName: [
        {
          key: '',
          msg: '用户名不能为空'
        },
        {
          key: 'userName',
          msg: '必须为字母或汉字，且长度为3-10'
        }
      ],
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
     * 跳转至首页
     */
    handleHome() {
      const { $router } = this
      $router.replace({ path: '/' })
    },
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
          try {
            values.name = values.userName.trim()
            values.password = values.userPsd
            delete values.userName
            delete values.userPsd
            const res = await register(values)
            $router.replace({ path: '/user/login' })
            message.success(res.message)
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
    handleSms() {
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
            this.second = num
            this.close = close
          })
          try {
            await sms(values)
            message.success('验证码发送成功！')
          } catch (err) {
            this.second = 0
            this.close?.()
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
        path: '/user/login'
      }
      $router.replace(opt)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~/assets/style/your-theme-file.less';
.login {
  min-height: 100vh;
  background: url('~/assets/svg/bg.svg');
  background-size: 100% 100%;
  padding: 110px 0 144px;
  box-sizing: border-box;
  .top {
    text-align: center;
    overflow: hidden;
    .header {
      // height: 42px;
      // line-height: 42px;
      .link {
        cursor: pointer;
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
