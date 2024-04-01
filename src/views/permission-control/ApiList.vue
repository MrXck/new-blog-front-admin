<script setup>
import {NButton, NDataTable, NInput, NPagination, NSpace, useMessage, NModal, NCard, NIcon, NSwitch, NRadio, NRadioGroup} from 'naive-ui'
import {h, onMounted, reactive, ref} from "vue";
import {Close} from "@vicons/ionicons5";
import {
  addResourceApi, addResourceParentApi,
  deleteResourceByIdApi, deleteResourceParentByIdApi,
  getResourceByPageApi,
  updateResourceApi, updateResourceParentApi,
  uploadResourceAnonymousApi
} from "@/api/resourceApi";

const update = ref({
  id: '',
  name: '',
  method: '',
  path: '',
  isAnonymous: '',
})
const updateParent = ref({
  id: '',
  name: ''
})
const add = ref({
  name: '',
  path: '',
  method: '',
  isAnonymous: 0,
  parentId: ''
})
const addParent = ref({
  name: '',
})
const showAddModal = ref(false)
const showAddParentModal = ref(false)
const showUpdateModal = ref(false)
const showUpdateParentModal = ref(false)
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
    title: '路径',
    key: 'path',
  },
  {
    title: '请求方式',
    key: 'method',
  },
  {
    title: '匿名',
    render(row) {
      if (row.parentId) {
        return h(NSwitch, {
          'default-value': row.isAnonymous,
          'checked-value': 1,
          'unchecked-value': 0,
          'on-update:value': (value) => {
            uploadResourceAnonymousApi(row.id, value).then(res => {
              if (res.code === 0) {
                message.success('操作成功')
              } else {
                message.error(res.msg)
              }
            })
          }
        })
      }
    }
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
            row.parentId ? '' : h(NButton,
                {
                  size: 'small',
                  type: 'info',
                  ghost: true,
                  onClick: () => {
                    showAddModal.value = true
                    add.value.parentId = row.id
                  }
                },
                {default: () => "新增"}),
            h(NButton,
                {
                  size: 'small',
                  type: 'info',
                  style: 'margin-left: 10px',
                  ghost: true,
                  onClick: () => {
                    if (row.parentId) {
                      update.value = Object.assign({}, row)
                      showUpdateModal.value = true
                    } else {
                      updateParent.value.id = row.id
                      updateParent.value.name = row.name
                      showUpdateParentModal.value = true
                    }
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
                    if (row.parentId) {
                      deleteById(row.id)
                    } else {
                      deleteParentById(row.id)
                    }
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
  getResourceByPageApi({
    pageSize: pagination.pageSize,
    pageNum: pagination.page,
    keyword: keyword.value
  }).then(res => {
    if (res.code === 0) {
      data.length = 0
      let page = res.data.page
      pagination.totalPage = page.pages
      pagination.total = page.total

      page.records.map(item => {
        if (!item.parentId) {
          data.push(Object.assign({}, item, {children: []}))
        }
      })

      page.records.map(item => {
        if (item.parentId) {
          data.find(obj => obj.id === item.parentId).children.push(item)
        }
      })
    } else {
      message.error(res.msg)
    }
  })
}

function deleteById(id) {
  deleteResourceByIdApi(id).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
      init()
    } else {
      message.error(res.msg)
    }
  })
}

function deleteParentById(id) {
  deleteResourceParentByIdApi(id).then(res => {
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
  updateResourceApi(update.value).then(res => {
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

function updateParentData() {
  updateResourceParentApi(updateParent.value).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
      showUpdateParentModal.value = false
      init()
    } else {
      message.error(res.msg)
      init()
    }
  })
}

function addData() {
  addResourceApi(add.value).then(res => {
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

function addParentData() {
  addResourceParentApi(addParent.value).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
      showAddParentModal.value = false
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
      <n-button type="info" @click="showAddParentModal = true">新增模块</n-button>
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
      <n-space>
        <n-space align="center">
          <n-space style="width: 100px">
            资源名
          </n-space>
          <n-space>
            <n-input v-model:value="add.name" placeholder="请输入资源名"/>
          </n-space>
        </n-space>
        <n-space align="center">
          <n-space style="width: 100px">
            路径
          </n-space>
          <n-space>
            <n-input v-model:value="add.path" placeholder="请输入路径"/>
          </n-space>
        </n-space>
        <n-space align="center">
          <n-space style="width: 100px">
            请求方式
          </n-space>
          <n-space>
            <n-radio-group v-model:value="add.method" name="method">
              <n-space>
                <n-radio key="GET" value="GET">GET</n-radio>
                <n-radio key="POST" value="POST">POST</n-radio>
                <n-radio key="PUT" value="PUT">PUT</n-radio>
                <n-radio key="DELETE" value="DELETE">DELETE</n-radio>
              </n-space>
            </n-radio-group>
          </n-space>
        </n-space>
        <n-space align="center">
          <n-space style="width: 100px">
            匿名
          </n-space>
          <n-space>
            <n-switch v-model:value="add.isAnonymous" :checked-value="1" :unchecked-value="0"></n-switch>
          </n-space>
        </n-space>
      </n-space>
      <template #footer>
        <n-button type="info" @click="addData">保存</n-button>
      </template>
    </n-card>
  </n-modal>

  <n-modal v-model:show="showAddParentModal">
    <n-card
        style="width: 500px"
        title="新增"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
      <template #header-extra>
        <n-button circle size="small" strong secondary @click="showAddParentModal = false">
          <template #icon>
            <n-icon>
              <Close/>
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-space align="center">
        <n-space>
          模块名
        </n-space>
        <n-space>
          <n-input v-model:value="addParent.name" placeholder="请输入模块名"/>
        </n-space>
      </n-space>
      <template #footer>
        <n-button type="info" @click="addParentData">保存</n-button>
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
      <n-space>
        <n-space align="center">
          <n-space style="width: 100px">
            资源名
          </n-space>
          <n-space>
            <n-input v-model:value="update.name" placeholder="请输入资源名"/>
          </n-space>
        </n-space>
        <n-space align="center">
          <n-space style="width: 100px">
            路径
          </n-space>
          <n-space>
            <n-input v-model:value="update.path" placeholder="请输入路径"/>
          </n-space>
        </n-space>
        <n-space align="center">
          <n-space style="width: 100px">
            请求方式
          </n-space>
          <n-space>
            <n-radio-group v-model:value="update.method" name="method">
              <n-space>
                <n-radio key="GET" value="GET">GET</n-radio>
                <n-radio key="POST" value="POST">POST</n-radio>
                <n-radio key="PUT" value="PUT">PUT</n-radio>
                <n-radio key="DELETE" value="DELETE">DELETE</n-radio>
              </n-space>
            </n-radio-group>
          </n-space>
        </n-space>
        <n-space align="center">
          <n-space style="width: 100px">
            匿名
          </n-space>
          <n-space>
            <n-switch v-model:value="update.isAnonymous" :checked-value="1" :unchecked-value="0"></n-switch>
          </n-space>
        </n-space>
      </n-space>
      <template #footer>
        <n-button type="info" @click="updateData">保存</n-button>
      </template>
    </n-card>
  </n-modal>

  <n-modal v-model:show="showUpdateParentModal">
    <n-card
        style="width: 500px"
        title="编辑"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
      <template #header-extra>
        <n-button circle size="small" strong secondary @click="showUpdateParentModal = false">
          <template #icon>
            <n-icon>
              <Close/>
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-space align="center">
        <n-space>
          资源名
        </n-space>
        <n-space>
          <n-input v-model:value="updateParent.name" placeholder="请输入资源名"/>
        </n-space>
      </n-space>
      <template #footer>
        <n-button type="info" @click="updateParentData">保存</n-button>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>