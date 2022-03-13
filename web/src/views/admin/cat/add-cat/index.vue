<template>
  <div class="add-cat">
    <div class="content">
      <a-form :form="form" ref="formLogin" @submit="handleSubmit">
        <a-form-item>
          <a-input size="large" placeholder="请输入栏目名" v-decorator="rules.catname" />
        </a-form-item>
        <a-form-item>
          <a-button
            size="large"
            block
            type="primary"
            html-type="submit"
            :loading="loginBtn"
          >
            Submit
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../../../common/css/your-theme-file.less';
.add-cat {
  padding: 40px 20px 20px;
  flex: 1;
  .content {
    padding: 5% 5% 0;
    width: 80%;
    margin: 0 auto;
    border: 1px solid @box-border;
    box-sizing: border-box;
    height: 100%;
  }
}
</style>

<script>
import {
  Form,
  Button,
  Input,
  Message
} from 'ant-design-vue'
import getRules from '@/utils/strategy'
import { addCat } from '@/api/admin'

const { Item } = Form

export default {
  components: {
    AForm: Form,
    AButton: Button,
    AInput: Input,
    AFormItem: Item
  },
  data() {
    const { $form } = this
    const rules = getRules({
      catname: {
        key: 'catname',
        msg: '必须为汉字、字母、数字，且长度为2-50'
      }
    })

    return {
      loginBtn: false,
      form: $form.createForm(this),
      rules
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
      } = this

      this.loginBtn = true

      const validateFieldsKey = ['catname']

      validateFields(validateFieldsKey, { force: true }, async (err, values) => {
        if (!err) {
          try {
            const res = await addCat(values)
            Message.success(res.message)
          } catch (error) {
            // console.log(error)
          }
          this.loginBtn = false
        } else {
          setTimeout(() => {
            this.loginBtn = false
          }, 600)
        }
      })
    }
  }
}
</script>
