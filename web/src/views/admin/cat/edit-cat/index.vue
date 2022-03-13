<template>
  <div class="edit-cat">
    <div class="content">
      <a-form :form="oForm" ref="formLogin" @submit="handleSubmit">
        <a-form-item>
          <a-input
           size="large"
           placeholder="请输入栏目名"
           v-decorator="rules.catname"
          />
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
.edit-cat {
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
import { editCat } from '@/api/admin'

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
        msg: '必须为汉字、字母、数字，且长度为2-8'
      }
    })

    return {
      loginBtn: false,
      oForm: $form.createForm(this),
      rules,
      info: {}
    }
  },
  mounted() {
    const { $route: { query }, oForm } = this

    oForm.setFieldsValue({
      catname: query.catname
    })
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      const {
        oForm: { validateFields },
        $route: { query },
        $router
      } = this

      this.loginBtn = true

      const validateFieldsKey = ['catname']

      validateFields(validateFieldsKey, { force: true }, async (err, values) => {
        if (!err) {
          const { catname } = values
          try {
            const res = await editCat({ catname, cat_id: query.cat_id })
            Message.success(res.message)
            $router.go(-1)
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
