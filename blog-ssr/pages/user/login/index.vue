<template>
  <div class="login">
    <div class="top">
      <div class="header">
        <div class="link" @click="handleHome">
          <img src="~/assets/img/logo5.png" alt="logo" class="logo">
          <!-- <span class="title">WeiShan</span> -->
        </div>
      </div>
      <div class="desc">
        本博客主要用于技术分享与交流
      </div>
    </div>
    <div class="main">
      <a-form ref="formLogin" :form="form" @submit.prevent="handleSubmit">
        <a-form-item>
          <a-input v-decorator="rules.userName" size="large" placeholder="请输入用户名或手机号" />
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="rules.userPsd"
            size="large"
            :type="toggle ? 'text' : 'password'"
            placeholder="请输入密码"
          >
            <a-icon v-show="!toggle" slot="suffix" type="eye-invisible" @click="toggle = true" />
            <a-icon v-show="toggle" slot="suffix" type="eye" @click="toggle = false" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-checkbox
            v-decorator="['rememberPsd']"
            :checked="rememberPsd"
            @change="handChange"
          >
            记住密码
          </a-checkbox>
          <a href="javascript:;" @click="hanldeEditPsd">忘记密码</a>
          <a href="javascript:;" @click="hanldeRegister">注册</a>
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
    <div class="foot" />
  </div>
</template>

<script>
import {
  Form,
  Button,
  Input,
  Icon,
  Checkbox,
  message
} from 'ant-design-vue'
import getRules from '~/utils/strategy'
import { clearCookieAll, setCookieAll, getCookieAll } from '@/utils/cookie'

const { Item } = Form

export default {
  components: {
    AForm: Form,
    AButton: Button,
    AInput: Input,
    AIcon: Icon,
    AFormItem: Item,
    ACheckbox: Checkbox
  },
  data() {
    const { $form } = this
    const rules = getRules({
      userName: [
        {
          key: '',
          msg: '用户名或手机号不能为空'
        },
        {
          key: ['userName', 'mobile'],
          msg: '请输入正确的用户名或者手机号'
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
      ]
    })

    return {
      form: $form.createForm(this),
      rules,
      rememberPsd: false,
      isLoding: false,
      toggle: false
    }
  },
  beforeMount() {
    this.init()
  },
  methods: {
    /**
     * 初始化form表单
     */
    init() {
      const { rules } = this
      const { userName, userPsd } = getCookieAll()
      if (userName && userPsd) {
        rules.userName[1].initialValue = userName
        rules.userPsd[1].initialValue = userPsd
        this.rememberPsd = true
      }
    },
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
        rememberPsd,
        $store,
        $router,
        $route
      } = this

      const { query: { redirect } } = $route

      this.isLoding = true
      const validateFieldsKey = ['userName', 'userPsd']
      const opt = {
        force: true,
        firstFields: true
      }
      validateFields(validateFieldsKey, opt, async (validate, values) => {
        if (!validate) {
          try {
            await $store.dispatch('user/login', values)
            message.success('用户登录成功！')
            if (rememberPsd) {
              setCookieAll(values, 7)
            } else {
              clearCookieAll()
            }
            if (redirect) {
              $router.replace({ path: redirect })
            } else {
              $router.go(-1)
            }
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
     * 点击注册
     */
    hanldeRegister() {
      const { $router } = this
      const opt = {
        path: '/register'
      }
      $router.replace(opt)
    },
    /**
     * 点击忘记密码
     */
    hanldeEditPsd() {
      const { $router } = this
      const opt = {
        path: '/retrievePassword'
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
    .header {
      // height: 42px;
      // line-height: 42px;
      .link {
        cursor: pointer;
        img {
          height: 68px;
          vertical-align: top;
          margin-right: 10px;
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
    ::v-deep .ant-form-item {
      a {
        float: right;
        margin: 0 0 0 10px;
        color: @link-color;
      }
    }
  }
}
</style>
