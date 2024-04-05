<script setup>
import {NButton, NDataTable, NInput, NPagination, NSpace, useMessage, NModal, NCard, NIcon} from 'naive-ui'
import {h, onMounted, reactive, ref} from "vue";
import {Close} from "@vicons/ionicons5";
import {deleteOperationLogByIdApi, getOperationLogByPageApi} from "@/api/operationLogApi";

const showModal = ref(false)
const data = reactive([])
const keyword = ref('')
const columns = [
  {
    title: '#',
    key: 'key'
  },
  {
    title: '请求方式',
    key: 'method',
  },
  {
    title: '请求路径',
    key: 'path',
    width: 200
  },
  {
    title: '用户id',
    key: 'userId',
  },
  {
    title: '昵称',
    key: 'nickname',
  },
  {
    title: 'ip地址',
    key: 'ipAddress',
  },
  {
    title: 'ip源',
    key: 'ipSource',
  },
  {
    title: '耗时(ms)',
    key: 'consuming',
  },
  {
    title: '创建时间',
    render(row) {
      return row.createTime.replace('T', ' ')
    }
  },
  {
    title: '操作',
    width: 150,
    render(row) {
      return h('div',
          [
            h(NButton,
                {
                  size: 'small',
                  type: 'info',
                  ghost: true,
                  onClick: () => {
                    showModal.value = true
                    log.value = Object.assign({}, row)
                  }
                },
                {default: () => "详情"}),
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
const log = ref({})

function init() {
  getOperationLogByPageApi({
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
  deleteOperationLogByIdApi(id).then(res => {
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
      <n-input placeholder="请输入标题" v-model:value="keyword" @keydown.enter="init"/>
      <n-button @click="init">搜索</n-button>
    </n-space>
    <n-data-table
        :columns="columns"
        :data="data"
        :bordered="true"
        :row-key="rowKey"
    />
    <n-space justify="end" align="center">
      <div>共 {{ pagination.total }} 条</div>
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

  <n-modal v-model:show="showModal">
    <n-card
        style="width: 500px"
        title="查看详情"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
      <template #header-extra>
        <n-button circle size="small" strong secondary @click="showModal = false">
          <template #icon>
            <n-icon>
              <Close/>
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-space vertical>
        <n-space vertical>
          <n-space>
            请求路径
          </n-space>
          <n-space item-style="width: 500px">
            <n-input v-model:value="log.path" disabled/>
          </n-space>
        </n-space>
        <n-space vertical>
          <n-space>
            请求方式
          </n-space>
          <n-space item-style="width: 500px">
            <n-input v-model:value="log.method" disabled/>
          </n-space>
        </n-space>
        <n-space vertical>
          <n-space>
            请求耗时
          </n-space>
          <n-space item-style="width: 500px">
            <n-input v-model:value="log.consuming" disabled/>
          </n-space>
        </n-space>
        <n-space vertical>
          <n-space>
            请求参数
          </n-space>
          <n-space item-style="width: 500px">
            <n-input type="textarea" :rows="3" placeholder="无" v-model:value="log.param" disabled/>
          </n-space>
        </n-space>
        <n-space vertical>
          <n-space>
            响应结果
          </n-space>
          <n-space item-style="width: 500px">
            <n-input type="textarea" :rows="3" placeholder="无" v-model:value="log.response" disabled/>
          </n-space>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>