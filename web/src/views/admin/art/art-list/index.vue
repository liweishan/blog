<template>
  <div class="cat-list">
    <div class="cat-table-box" ref="box">
      <a-table
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        rowKey="art_id"
        :scroll="{ y: h, x: 1200 }"
      >
        <template slot="operation" slot-scope="text, record">
          <a href="javascript:;" @click="handleEdit(record.art_id)">
            <a-icon type="edit" />Edit
          </a>
          <a-divider type="vertical" />
          <a href="javascript:;" @click="handleDelete(record)">
            <a-icon type="delete" />Delete
          </a>
        </template>
        <p slot-scope="record" class="table-more">
          <span>{{ record.pic }}</span>
          <span>{{ record.suo }}</span>
        </p>
      </a-table>
      <div class="paging-box">
        <a-pagination
          showQuickJumper
          :current="pageing.current"
          :total="pageing.total"
          :pageSize="pageing.pageSize"
          @change="onChange"
        />
      </div>
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
            // display: inline-block;
            height: 54px;
          }
        }
      }
      tr {
        .nth1 {
          max-width: 100px !important;
          width: 100px !important;
        }
        .nth2, .nth3, .nth4, .nth5, .nth6 {
          max-width: 180px !important;
          width: 180px !important;
        }
        .nth7, .nth8 {
          max-width: 220px !important;
          width: 220px !important;
        }
        .nth9 {
          max-width: 200px !important;
          width: 200px !important;
        }
      }
    }
    .table-more {
      display: flex;
      span {
        flex: 1;
      }
    }
    .paging-box {
      display: flex;
      justify-content: center;
      padding: 20px 0 0;
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
  Modal,
  Pagination
} from 'ant-design-vue'
import { getArt } from '@/api/blog'
import { deleteArt } from '@/api/admin'
import { getFormatTime } from '@/utils/util'

export default {
  components: {
    ATable: Table,
    AIcon: Icon,
    ADivider: Divider,
    APagination: Pagination
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
        title: '文章名称',
        dataIndex: 'title',
        className: 'nth3',
        align: 'center'
      },
      {
        title: '文章描述',
        dataIndex: 'remarks',
        className: 'nth4',
        align: 'center'
      },
      {
        title: '文章内容',
        dataIndex: 'content',
        className: 'nth5',
        align: 'center'
      },
      {
        title: '创建时间',
        dataIndex: 'time',
        className: 'nth6',
        align: 'center'
      },
      {
        title: '大图',
        dataIndex: 'pic',
        className: 'nth7',
        align: 'center'
      },
      {
        title: '小图',
        dataIndex: 'suo',
        className: 'nth8',
        align: 'center'
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
        className: 'nth9',
        fixed: 'right'
      },
      {
        title: '',
        dataIndex: 'empty',
        key: 'empty',
        align: 'center',
        className: 'nth10'
      }
    ]
    const pageing = {
      current: 1,
      pageSize: 10,
      total: 0
    }
    return {
      columns,
      data: [],
      h: 0,
      pageing
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
      if (!$refs.box) return
      const h = $refs.box.clientHeight
      // 76是表格头的高度，52为分页高度
      this.h = h - 76 - 52
    },
    async requestData() {
      const { pageing } = this
      const { pageSize, current } = pageing
      const opt = {
        curPage: current,
        pageSize
      }
      try {
        const res = await getArt(opt)
        const { result, total } = res.data
        for (const v of result.values()) {
          v.time = getFormatTime('Y-M-D h:m:s', v.pubtime * 1e3)
        }
        this.data = result
        this.$set(pageing, 'total', total)
      } catch (err) {
        // console.log(err)
      }
    },
    /**
     * 点击分页按钮
     */
    onChange(curPage) {
      const { pageing } = this
      this.$set(pageing, 'current', curPage)
      this.requestData()
    },
    handleEdit(artId) {
      this.$router.push({
        path: '/artList/editArt',
        query: {
          artId
        }
      })
    },
    /**
     * 点击删除文章
     * @param {Object} row 当前行的数据
     */
    handleDelete(row) {
      const data = {
        cat_id: row.cat_id,
        art_id: row.art_id
      }
      const { confirm } = Modal
      confirm({
        title: '警告',
        content: () => <div class="test">确定删除该篇文章？</div>,
        onOk: async () => {
          try {
            const res = await deleteArt(data)
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
