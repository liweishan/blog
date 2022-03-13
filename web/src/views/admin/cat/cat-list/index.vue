<template>
  <div class="cat-list">
    <div class="cat-table-box" ref="box">
      <a-table
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        rowKey="cat_id"
        :scroll="{ y: h }"
      >
        <template slot="operation" slot-scope="text, record">
          <a href="javascript:;" @click="handleEdit(record)">
            <a-icon type="edit" />Edit
          </a>
          <a-divider type="vertical" />
          <a href="javascript:;" @click="handleDelete(record.cat_id)">
            <a-icon type="delete" />Delete
          </a>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.cat-list {
  padding: 20px 20px 10px;
  flex: 1;
  overflow: hidden;
  .cat-table-box {
    height: 100%;
    overflow: hidden;
    ::v-deep .ant-table-wrapper {
      .anticon {
        margin: 0 3px 0 0;
      }
      .ant-table-body {
        tr {
          td, th {
            white-space: nowrap !important;
            text-overflow: ellipsis !important;
            overflow: hidden !important;
          }
        }
      }
      tr {
        .nth1 {
          max-width: 100px !important;
          width: 100px !important;
        }
        .nth2 {
          max-width: 20% !important;
          width: 20% !important;
        }
        .nth3 {
          max-width: 20% !important;
          width: 20% !important;
        }
        .nth4 {
          max-width: 20% !important;
          width: 20% !important;
        }
      }
    }
  }
}
</style>

<script>
import {
  Table,
  Icon,
  Divider,
  Message,
  Modal
} from 'ant-design-vue'
import { getCat } from '@/api/blog'
import { deleteCat } from '@/api/admin'

export default {
  components: {
    ATable: Table,
    AIcon: Icon,
    ADivider: Divider
  },
  data() {
    const columns = [
      {
        title: '序号',
        className: 'nth1',
        align: 'center',
        customRender: (text, record, index) => index + 1,
      },
      {
        title: '栏目名称',
        dataIndex: 'catname',
        className: 'nth2',
        align: 'center'
      },
      {
        title: '文章数',
        dataIndex: 'num',
        className: 'nth3',
        align: 'center'
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
        className: 'nth4'
      },
      {
        title: '',
        dataIndex: 'empty',
        key: 'empty',
        align: 'center',
        className: 'nth5'
      }
    ]
    return {
      columns,
      data: [],
      h: 0
    }
  },
  mounted() {
    this.setHeight()
    this.requestData()
    window.addEventListener('resize', this.setHeight)
  },
  methods: {
    setHeight() {
      const { $refs } = this
      const h = $refs.box.clientHeight
      // 76是表格头的高度
      this.h = h - 76
    },
    async requestData() {
      try {
        const res = await getCat()
        this.data = res.data
      } catch (err) {
        // console.log(err)
      }
    },
    handleEdit(row) {
      this.$router.push({
        path: '/catList/editCat',
        query: row
      })
    },
    /**
     * 点击删除栏目
     * @param {Number} id 栏目id
     */
    handleDelete(id) {
      const { confirm } = Modal
      confirm({
        title: '警告',
        content: () => <div class="test">确定删除该项？</div>,
        onOk: async () => {
          try {
            const res = await deleteCat({ cat_id: id })
            Message.success(res.message)
            this.requestData()
          } catch (err) {
            // console.log(err)
          }
        },
        onCancel() {
          // console.log('Cancel')
        }
      })
    }
  }
}
</script>
