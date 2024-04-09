<script setup>
import {
  NButton,
  NCard,
  NIcon,
  NModal,
  NSpace,
  useMessage,
  NGrid,
  NGridItem,
  NUpload, NUploadDragger, NPagination, NCheckbox, NCheckboxGroup, NImage
} from "naive-ui";
import {IMAGE_URL} from "@/utils/Constant";
import {ArchiveOutline as ArchiveIcon} from "@vicons/ionicons5";
import {onMounted, reactive, ref} from "vue";
import {Close} from "@vicons/ionicons5";
import {uploadImagePhotoApi} from "@/api/uploadApi";
import {deleteByPhotoAlbumIdApi, getByPhotoAlbumIdApi, updateByPhotoAlbumApi} from "@/api/photoApi";
import {useRoute} from "vue-router";
import {getPhotoAlbumByIdApi} from "@/api/photoAlbumApi";

const route = useRoute()
const photoAlbum = ref({})
const photoAlbumId = ref(null)
const data = reactive([])
const message = useMessage()
const showAddModal = ref(false)
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
const photoIds = reactive([])
const checkIds = ref([])

function uploadImage(value) {
  const formData = new FormData()
  formData.append('file', value.file.file)
  uploadImagePhotoApi(formData).then(res => {
    photoIds.push(res.data)
  })
}

function addData() {
  updateByPhotoAlbumApi({
    photoAlbumId: photoAlbumId.value,
    photoIds: photoIds
  }).then(res => {
    if (res.code === 0) {
      message.success("操作成功")
      showAddModal.value = false
      init()
    } else {
      message.error(res.msg)
    }
  })
}

function init() {
  getPhotoAlbumByIdApi(photoAlbumId.value).then(res => {
    if (res.code === 0) {
      photoAlbum.value = res.data.photoAlbum
    }
  })

  getByPhotoAlbumIdApi(photoAlbumId.value, {
    pageNum: pagination.page,
    pageSize: pagination.pageSize,
  }).then(res => {
    if (res.code === 0) {
      data.length = 0
      const page = res.data.page
      data.push(...page.records)
      pagination.total = page.total
      pagination.totalPage = page.pages
    }
  })
}

function deleteByPhotoAlbumId() {
  if (checkIds.value.length === 0) {
    message.error("请选择需要删除的图片")
    return
  }

  deleteByPhotoAlbumIdApi({
    photoAlbumId: photoAlbumId.value,
    photoIds: checkIds.value
  }).then(res => {
    if (res.code === 0) {
      message.success("操作成功")
      init()
      checkIds.value = []
    } else {
      message.error(res.msg)
    }
  })
}

function checkPhotoId(value) {
  checkIds.value = value
}

function totalCheck(value) {
  if (value) {
    checkIds.value = data.map(item => item.id)
  } else {
    checkIds.value = []
  }
}

onMounted(() => {
  photoAlbumId.value = route.params.id
  init()
})
</script>

<template>
  <div style="padding: 10px">
    <n-card title="相册详情">
      <n-space vertical>
        <n-space>
          <n-space>
            <n-image width="100" height="100" object-fit="cover" :src="IMAGE_URL + photoAlbum.cover" alt=""/>
          </n-space>
          <n-space vertical>
            <n-space style="font-weight: bold;font-size: 24px">{{ photoAlbum.name }}</n-space>
            <n-space>{{ photoAlbum.intro }}</n-space>
          </n-space>
        </n-space>
        <n-space justify="space-between">
          <n-space>
            <n-button @click="showAddModal = true">上传图片</n-button>
          </n-space>
          <n-space>
            <n-checkbox @update:checked="totalCheck" :checked="checkIds.length === data.length && checkIds.length !== 0" :indeterminate="checkIds.length !== data.length && checkIds.length !== 0">全选</n-checkbox>
            <n-button @click="deleteByPhotoAlbumId">批量删除</n-button>
          </n-space>
        </n-space>
        <n-space>
          <n-checkbox-group :value="checkIds" @update:value="checkPhotoId">
            <n-grid cols="1 1000:5 800:4 600:3 400:2" :x-gap="20" :y-gap="20">
              <n-grid-item :span="1" v-for="item in data">
                <div class="photo">
                  <n-image :img-props="{'style': 'width: 100%'}" object-fit="cover" height="160" :src="IMAGE_URL + item.src" alt=""/>
                  <div class="option">
                    <n-checkbox :value="item.id"/>
                  </div>
                </div>
              </n-grid-item>
            </n-grid>
          </n-checkbox-group>
        </n-space>
        <n-space justify="end" align="center">
          <div>共 {{ pagination.total }} 张</div>
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

    <n-modal v-model:show="showAddModal">
      <n-card
          style="width: 700px"
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
          <n-space vertical>
            <n-upload
                :custom-request="uploadImage"
                list-type="image-card"
                accept="image/*"
                multiple
            >
              <n-upload-dragger>
                <n-icon size="48" :depth="3">
                  <archive-icon/>
                </n-icon>
              </n-upload-dragger>
            </n-upload>
          </n-space>
        </n-space>
        <template #footer>
          <n-button type="info" @click="addData">保存</n-button>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<style scoped>
.photo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.option {
  position: absolute;
  top: 4px;
  left: 4px;
}
</style>