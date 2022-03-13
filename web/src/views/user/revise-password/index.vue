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
import { editPwd } from '@/api/user'

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
      ]
    })

    return {
      form: $form.createForm(this),
      rules,
      isLoding: false,
      toggle: false
    }
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
      const validateFieldsKey = ['userPsd']
      const opt = {
        force: true,
        firstFields: true
      }
      validateFields(validateFieldsKey, opt, async (validate, values) => {
        if (!validate) {
          const password = values.userPsd
          try {
            await editPwd({ password })
            Message.success('修改密码成功')
            $router.go(-1)
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
    }
  }
}
</script>
