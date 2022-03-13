<template>
  <div class="add-cat">
    <div class="content">
      <a-form
        :form="form"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 22 }"
        @submit="handleSubmit"
      >
        <a-form-item label="标题：">
          <a-input size="large" placeholder="请输入标题" v-decorator="rules.title" />
        </a-form-item>
        <a-form-item label="栏目：">
          <a-select size="large" placeholder="请选择文章栏目" v-decorator="rules.cat_id">
            <a-select-option
              v-for="(v, i) of catList"
              :key="i"
              :value="v.cat_id"
            >
              {{ v.catname }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="描述：">
          <a-textarea  :rows="4" placeholder="请输入文章描述" v-decorator="rules.remarks" />
        </a-form-item>
        <a-form-item label="内容：">
          <div class="edit_container">
            <quill-editor
              v-decorator="rules.content"
              ref="myQuillEditor"
              :options="editorOption"
            >
            </quill-editor>
        </div>
        </a-form-item>
        <a-form-item label="图片">
          <a-upload
            accept="image/*"
            v-decorator="rules.file"
            :fileList="fileList"
            :multiple="true"
            :beforeUpload="beforeUpload"
            :remove="fileRemove"
          >
            <a-button> <a-icon type="upload" /> Upload </a-button>
          </a-upload>
        </a-form-item>
        <a-button
          size="large"
          block
          type="primary"
          html-type="submit"
          :loading="loginBtn"
        >
          Submit
        </a-button>
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
    padding: 2% 5% 0;
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
  Select,
  Upload,
  Icon,
  Message
} from 'ant-design-vue'
import getRules from '@/utils/strategy'
import { addArt } from '@/api/admin'
import { getCat } from '@/api/blog'
// 因为要满足表单组件的v-decorator指令，vue-quill-editor的change事件参数只需要返回html的字符串
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

const { Item } = Form
const { Option } = Select
const { TextArea } = Input

export default {
  components: {
    AForm: Form,
    AButton: Button,
    AInput: Input,
    ATextarea: TextArea,
    AFormItem: Item,
    ASelect: Select,
    AUpload: Upload,
    AIcon: Icon,
    ASelectOption: Option,
    quillEditor
  },
  data() {
    const { $form } = this
    const rules = getRules({
      title: {
        key: 'title',
        msg: '标题长度不超过20'
      },
      cat_id: {
        msg: '请选择文章栏目'
      },
      remarks: {
        msg: '文章描述不能为空'
      },
      content: {
        msg: '内容不能为空'
      },
      file: {
        msg: '请选择图片'
      }
    })
    // rules.catname[1].initialValue = 'jack'
    return {
      loginBtn: false,
      form: $form.createForm(this),
      rules,
      catList: [],
      fileList: [],
      fd: null,
      editorOption: {}
    }
  },
  created() {
    this.requestCatList()
  },
  methods: {
    async requestCatList() {
      try {
        const res = await getCat()
        this.catList = res.data
      } catch (err) {
        // console.log(err)
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        rules
      } = this

      this.loginBtn = true
      const validateFieldsKey = Object.keys(rules)

      validateFields(validateFieldsKey, { force: true }, async (err, values) => {
        if (!err) {
          const { file } = values
          const fd = new FormData()
          for (const [k, v] of Object.entries(values)) {
            fd.append(k, v)
          }
          fd.append('file', file.file)
          try {
            const res = await addArt(fd)
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
    },
    /**
     * 图片上传之前的钩子
     */
    beforeUpload(file) {
      this.fileList = [file]
      return false
    },
    /**
     * 文件删除的回调
     */
    fileRemove() {
      this.fileList = []
    }
  }
}
</script>
