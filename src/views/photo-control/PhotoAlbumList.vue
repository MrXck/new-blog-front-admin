<script setup>
import {
  NButton,
  NCard,
  NIcon,
  NInput,
  NModal,
  NSpace,
  useMessage,
  NDropdown,
  NGrid,
  NGridItem,
  NUpload, NUploadDragger, NImage, NPagination
} from "naive-ui";
import {onMounted, reactive, ref} from "vue";
import {
  addPhotoAlbumApi,
  deletePhotoAlbumByIdApi,
  getPhotoAlbumByPageApi,
  updatePhotoAlbumApi
} from "@/api/photoAlbumApi";
import {Close} from "@vicons/ionicons5";
import {IMAGE_URL} from "@/utils/Constant";
import {uploadImageApi} from "@/api/uploadApi";
import {ArchiveOutline as ArchiveIcon} from "@vicons/ionicons5";
import {to} from "@/utils/routerUtils";

const add = ref({
  name: '',
  cover: null,
  intro: '',
})
const showAddModal = ref(false)
const update = ref({
  id: '',
  name: '',
  cover: '',
  intro: '',
})
const type = ref('')
const showUpdateModal = ref(false)
const keyword = ref('')
const data = reactive([])
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
const options = [
  {
    label: "编辑",
    key: "update",
    style: {
      color: 'yellow'
    },
    props: {
      onClick: (e) => {
        const id = e.target.parentNode.parentNode.parentNode.getAttribute('data')
        showUpdateModal.value = true
        const find = data.find(item => item.id === id);
        update.value.name = find.name
        update.value.id = find.id
        update.value.cover = find.cover
        update.value.intro = find.intro
        type.value = 'update'
      }
    }
  },
  {
    label: "删除",
    key: "remove",
    style: {
      color: 'red'
    },
    props: {
      onClick: (e) => {
        const id = e.target.parentNode.parentNode.parentNode.getAttribute('data')
        deleteById(id)
      }
    }
  },
]

function init() {
  getPhotoAlbumByPageApi({
    pageSize: pagination.pageSize,
    pageNum: pagination.page,
    keyword: keyword.value
  }).then(res => {
    if (res.code === 0) {
      data.length = 0
      let page = res.data.photoAlbumVOS
      pagination.totalPage = Math.ceil(res.data.count / pagination.pageSize)
      pagination.total = res.data.count
      data.push(...page)
    } else {
      message.error(res.msg)
    }
  })
}

function deleteById(id) {
  deletePhotoAlbumByIdApi(id).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
      init()
    } else {
      message.error(res.msg)
    }
  })
}

function updateData() {
  updatePhotoAlbumApi(update.value).then(res => {
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
  addPhotoAlbumApi(add.value).then(res => {
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

function uploadImage(value) {
  const formData = new FormData()
  formData.append('file', value.file.file)
  uploadImageApi(formData).then(res => {
    if (type.value === 'add') {
      add.value.cover = res
    } else {
      update.value.cover = res
    }
  })
}

function addFunc() {
  showAddModal.value = true
  type.value = 'add'
}

onMounted(() => {
  init()
})
</script>

<template>
  <div style="padding: 10px">
    <n-card title="相册列表">
      <n-space vertical>
        <n-space>
          <n-button @click="addFunc">新增</n-button>
        </n-space>
        <n-space>
          <n-grid cols="1 1000:5 800:4 600:3 400:2" :x-gap="10" :y-gap="10">
            <n-grid-item :span="1" v-for="item in data">
              <div class="album" @click="to({name: 'photo-album-detail', params: {id: item.id}})">
                <img draggable="false" class="album-cover" :src="IMAGE_URL + item.cover" alt="">
                <div class="album-name">{{ item.name }}</div>
                <div class="album-option">
                  <n-dropdown trigger="hover" :options="options" :data="item.id">
                    <n-button :bordered="false" style="color: white">···</n-button>
                  </n-dropdown>
                </div>
                <div class="album-num">{{ item.photoCount }}</div>
              </div>
            </n-grid-item>
          </n-grid>
        </n-space>
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
    </n-card>
  </div>

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
      <n-space vertical>
        <n-space align="center">
          <n-space style="width: 100px">
            相册名
          </n-space>
          <n-space>
            <n-input v-model:value="add.name" placeholder="请输入相册名"/>
          </n-space>
        </n-space>
        <n-space align="center">
          <n-space style="width: 100px">
            相册描述
          </n-space>
          <n-space>
            <n-input v-model:value="add.intro" placeholder="请输入相册描述"/>
          </n-space>
        </n-space>
        <n-space align="center">
          <n-space style="width: 100px">
            相册封面
          </n-space>
          <n-space>
            <n-upload
                :max="1"
                :custom-request="uploadImage"
                list-type="image-card"
                @remove="add.cover = null"
                accept="image/*"
            >
              <n-upload-dragger>
                <n-icon v-show="add.cover === null" size="48" :depth="3">
                  <archive-icon/>
                </n-icon>
                <n-image @click.stop width="100%" v-show="add.cover !== null" :src="IMAGE_URL + add.cover"></n-image>
              </n-upload-dragger>
            </n-upload>
          </n-space>
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
      <n-space vertical>
        <n-space align="center">
          <n-space style="width: 100px">
            相册名
          </n-space>
          <n-space>
            <n-input v-model:value="update.name" placeholder="请输入相册名"/>
          </n-space>
        </n-space>
        <n-space align="center">
          <n-space style="width: 100px">
            相册描述
          </n-space>
          <n-space>
            <n-input v-model:value="update.intro" placeholder="请输入相册描述"/>
          </n-space>
        </n-space>
        <n-space align="center">
          <n-space style="width: 100px">
            相册封面
          </n-space>
          <n-space>
            <n-upload
                :max="1"
                :custom-request="uploadImage"
                list-type="image-card"
                @remove="update.cover = null"
                accept="image/*"
            >
              <n-upload-dragger>
                <n-icon v-show="update.cover === null" size="48" :depth="3">
                  <archive-icon/>
                </n-icon>
                <n-image @click.stop width="100%" v-show="update.cover !== null"
                         :src="IMAGE_URL + update.cover"></n-image>
              </n-upload-dragger>
            </n-upload>
          </n-space>
        </n-space>
      </n-space>
      <template #footer>
        <n-button type="info" @click="updateData">保存</n-button>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>
.album-cover {
  object-fit: cover;
  width: 100%;
  height: 200px;
  border-radius: 10px;
  filter: brightness(.80)
}

.album {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.album-name {
  font-size: 18px;
}

.album-option {
  position: absolute;
  right: 0;
  top: 6px;
}

.album-num {
  position: absolute;
  left: 12px;
  bottom: 30px;
  font-size: 20px;
  font-weight: bold;
  color: white;
}
</style>