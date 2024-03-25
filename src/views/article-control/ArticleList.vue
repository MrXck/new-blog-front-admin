<script setup>
import {NButton, NDataTable, NSpace, NPagination, useMessage, NInput, NImage, NSwitch} from 'naive-ui'
import {to} from '@/utils/routerUtils'
import {h, onMounted, reactive, ref} from "vue";
import {deleteArticleByIdApi, getArticlesByPageApi} from "@/utils/apiUtils";
import {BASEURL} from "@/utils/Constant";


const data = reactive([])
const keyword = ref('')
const columns = [
  {
    title: '#',
    key: 'key'
  },
  {
    title: '文章封面',
    key: 'cover',
    render(row) {
      return h(NImage, {
        src: BASEURL + row.cover,
        width: '100'
      });
    }
  },
  {
    title: '标题',
    key: 'title',
  },
  {
    title: '分类',
    key: 'categoryId',
  },
  {
    title: '标签',
    key: 'title',
  },
  {
    title: '类型',
    key: 'type',
  },
  {
    title: '顶置',
    render(row) {
      return undefined
    }
  },
  {
    title: '推荐',
    render(row) {
      // todo 修改不生效
      return h(NSwitch, {
        'v-model:value': row.isFeatured,
        'checked-value': 1,
        'unchecked-value': 0
      })
    }
  },
  {
    title: '创建时间',
    render(row) {
      return row.createTime.replace('T', ' ')
    }
  },
  {
    title: '修改时间',
    render(row) {
      return row.updateTime?.replace('T', ' ')
    }
  },
  {
    title: '操作',
    render(row) {
      return h('div',
          [
            h(NButton,
                {
                  size: 'small',
                  type: 'info',
                  ghost: true,
                  onClick: () => {
                    to({name: 'note-edit', params: {id: row.id}})
                  }
                },
                {default: () => "编辑"}),
            h(NButton,
                {
                  size: 'small',
                  type: 'error',
                  ghost: true,
                  style: 'margin-left: 10px',
                  onClick: () => {
                    deleteById(row.id)
                  }
                },
                {default: () => "删除"})
          ]
      )
    }
  },
]
const message = useMessage()
const pagination = reactive({
  page: 1,
  pageSize: 15,
  pageSizes: [10, 15, 20, 25, 30],
  totalPage: 0,
  total: 0,
  updatePage: (page) => {
    pagination.page = page
    init()
  },
  updatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    init()
  },
})

function init() {
  getArticlesByPageApi({
    pageSize: pagination.pageSize,
    pageNum: pagination.page,
    keyword: keyword.value
  }).then(res => {
    if (res.code === 0) {
      data.length = 0
      let page = res.data.page
      pagination.totalPage = page.pages
      pagination.total = page.total
      for (let i = 0; i < page.records.length; i++) {
        let record = page.records[i]
        record.key = i + 1
        data.push(record)
      }
    } else {
      message.error(res.msg)
    }
  })
}

function deleteById(id) {
  deleteArticleByIdApi(id).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
      init()
    } else {
      message.error(res.msg)
    }
  })
}

function rowKey(row) {
  return row.id
}

onMounted(() => {
  init()
})
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-button type="info" @click="to({name: 'article-add'})">新增</n-button>
      <n-input placeholder="请输入标题" v-model:value="keyword" @keydown.enter="init" />
      <n-button @click="init">搜索</n-button>
    </n-space>
    <n-data-table
        :columns="columns"
        :data="data"
        :bordered="true"
        :row-key="rowKey"
    />
    <n-space justify="end" align="center">
      <div>共 {{pagination.total}} 条</div>
      <n-pagination
          v-show="pagination.totalPage >= 1"
          v-model:page="pagination.page"
          :page-count="pagination.totalPage"
          size="medium"
          show-quick-jumper
          show-size-picker
          :page-sizes="[10, 15, 20, 25, 30]"
          :page-size="pagination.pageSize"
          @update:page="pagination.updatePage"
          @update:page-size="pagination.updatePageSize"
      >
      </n-pagination>
    </n-space>
  </n-space>
</template>

<style scoped>

</style>