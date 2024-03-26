<script setup>
import {NButton, NDataTable, NInput, NPagination, NSpace, useMessage, NModal, NCard, NIcon} from 'naive-ui'
import {h, onMounted, reactive, ref} from "vue";
import {Close} from "@vicons/ionicons5";
import {addCategoryApi, deleteCategoryByIdApi, getCategoryPageApi, updateCategoryApi} from "@/api/categoryApi";

const update = ref({
  id: '',
  name: ''
})
const add = ref({
  name: ''
})
const showAddModal = ref(false)
const showUpdateModal = ref(false)
const data = reactive([])
const keyword = ref('')
const columns = [
  {
    title: '#',
    key: 'key'
  },
  {
    title: '名称',
    key: 'name',
  },
  {
    title: '创建时间',
    render(row) {
      return row.createTime.replace('T', ' ')
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
                    update.value.id = row.id
                    update.value.name = row.name
                    showUpdateModal.value = true
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
  getCategoryPageApi({
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
  deleteCategoryByIdApi(id).then(res => {
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

function updateData() {
  updateCategoryApi(update.value).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
      showUpdateModal.value = false
      init()
    } else {
      message.error(res.msg)
      init()
    }
  })
}

function addData() {
  addCategoryApi(add.value).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
      showAddModal.value = false
      init()
    } else {
      message.error(res.msg)
      init()
    }
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-button type="info" @click="showAddModal = true">新增</n-button>
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

  <n-modal v-model:show="showAddModal">
    <n-card
        style="width: 500px"
        title="新增"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
      <template #header-extra>
        <n-button circle size="small" strong secondary @click="showAddModal = false">
          <template #icon>
            <n-icon>
              <Close/>
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-space align="center">
        <n-space>
          分类名
        </n-space>
        <n-space>
          <n-input v-model:value="add.name" placeholder="请输入分类名"/>
        </n-space>
      </n-space>
      <template #footer>
        <n-button type="info" @click="addData">保存</n-button>
      </template>
    </n-card>
  </n-modal>

  <n-modal v-model:show="showUpdateModal">
    <n-card
        style="width: 500px"
        title="编辑"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
      <template #header-extra>
        <n-button circle size="small" strong secondary @click="showUpdateModal = false">
          <template #icon>
            <n-icon>
              <Close/>
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-space align="center">
        <n-space>
          分类名
        </n-space>
        <n-space>
          <n-input v-model:value="update.name" placeholder="请输入分类名"/>
        </n-space>
      </n-space>
      <template #footer>
        <n-button type="info" @click="updateData">保存</n-button>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>