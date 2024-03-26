<template>
  <n-space vertical>
    <n-input placeholder="请输入标题" v-model:value="data.title"/>
    <Editor :locale="zhHans" :upload-images="handleUploadFile" :value="data.content" :plugins="plugins"
            @change="handleChange"/>
    <n-space vertical>
      <n-space align="center">
        <n-space style="width: 100px">
          文章分类
        </n-space>
        <n-space>
          <n-select
              :options="category.option"
              filterable
              style="width: 300px"
              v-model:value="data.categoryId"
              @search="category.searchCategory"
              :loading="category.isLoading"
              @scroll="category.scroll"
          >
          </n-select>
        </n-space>
      </n-space>
      <n-space align="center">
        <n-space style="width: 100px">
          文章标签
        </n-space>
        <n-space>
          <n-select
              filterable
              multiple
              :options="tag.option"
              style="width: 300px"
              v-model:value="articleTag"
              @search="tag.search"
          >
          </n-select>
        </n-space>
      </n-space>
      <n-space align="center">
        <n-space style="width: 100px">
          文章类型
        </n-space>
        <n-space>
          <n-select
              :options="ArticleType"
              style="width: 300px"
              v-model:value="data.type"
          >
          </n-select>
        </n-space>
      </n-space>
      <n-space>
        <n-space style="width: 100px">
          上传封面
        </n-space>
        <n-space>
          <n-upload
              :max="1"
              :custom-request="uploadImage"
              list-type="image-card"
              @remove="data.cover = null"
              accept="image/*"
          >
            <n-upload-dragger>
              <n-icon v-show="data.cover === null" size="48" :depth="3">
                <archive-icon/>
              </n-icon>
              <n-image @click.stop width="100%" v-show="data.cover !== null" :src="IMAGE_URL + data.cover"></n-image>
            </n-upload-dragger>
          </n-upload>
        </n-space>
      </n-space>
      <n-space align="center">
        <n-space style="width: 100px">
          置顶
        </n-space>
        <n-space>
          <n-switch v-model:value="data.isTop" :checked-value="1" :unchecked-value="0"></n-switch>
        </n-space>
      </n-space>
      <n-space align="center">
        <n-space style="width: 100px">
          推荐
        </n-space>
        <n-space>
          <n-switch v-model:value="data.isFeatured" :checked-value="1" :unchecked-value="0"></n-switch>
        </n-space>
      </n-space>
      <n-space align="center">
        <n-space style="width: 100px">
          发布形式
        </n-space>
        <n-space>
          <n-select
              :options="ArticleStatus"
              style="width: 300px"
              v-model:value="data.status"
          >
          </n-select>
        </n-space>
      </n-space>
      <n-space>
        <n-space style="width: 100px">
          文章摘要
        </n-space>
        <n-space>
          <n-input v-model:value="data.digest" style="width: 300px" type="textarea"></n-input>
        </n-space>
      </n-space>
      <n-space align="center" v-if="data.status === 2">
        <n-space style="width: 100px">
          访问密码
        </n-space>
        <n-space>
          <n-input v-model:value="data.password" style="width: 300px"></n-input>
        </n-space>
      </n-space>
      <n-space align="center" v-if="data.type === 2">
        <n-space style="width: 100px">
          原文链接
        </n-space>
        <n-space>
          <n-input v-model:value="data.originalUrl" style="width: 300px"></n-input>
        </n-space>
      </n-space>
    </n-space>
    <n-button @click="save">提交</n-button>
  </n-space>

</template>

<script setup>
import {NSpace, NInput, NButton, useMessage, NIcon, NUpload, NUploadDragger, NSelect, NSwitch, NImage} from 'naive-ui'
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {
  addArticleApi,
  getAllTagApi,
  getArticleByIdApi, getArticleTagApi,
  getCategoryPageApi, saveArticleTagApi,
  updateArticleByIdApi,
  uploadImageApi
} from "@/utils/apiUtils";
import {ArchiveOutline as ArchiveIcon} from "@vicons/ionicons5";
import {Editor} from '@bytemd/vue-next'
import gfm from "@bytemd/plugin-gfm";
import gemoji from "@bytemd/plugin-gemoji";
import highlight from "@bytemd/plugin-highlight";
import frontmatter from "@bytemd/plugin-frontmatter";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import breaks from "@bytemd/plugin-breaks";
import zhHans from 'bytemd/locales/zh_Hans.json'
import 'bytemd/dist/index.css'
import 'highlight.js/styles/tokyo-night-dark.min.css'
import {ArticleStatus, ArticleType, IMAGE_URL} from "@/utils/Constant";

const plugins = [
  gfm(),
  gemoji(),
  highlight(),
  frontmatter(),
  mediumZoom(),
  breaks(),
]

const route = useRoute();
const message = useMessage();
const type = ref('add')
const isLoading = ref(true)
const articleTag = ref(null)
const fileList = ref([])
const data = ref({
  id: '',
  title: '',
  digest: '',
  password: '',
  cover: null,
  originalUrl: '',
  type: 1,
  status: 1,
  isTop: 0,
  isFeatured: 0,
  categoryId: null,
})

const tag = ref({
  option: [],
  originOption: [],
  getAllTag: () => {
    getAllTagApi().then(res => {
      const data = res.data.tags
      tag.value.option.length = 0
      tag.value.originOption.length = 0
      const options = []
      for (let i = 0; i < data.length; i++) {
        options.push({
          label: data[i].name,
          value: data[i].id,
        })
      }
      tag.value.option.push(...options)
      tag.value.originOption.push(...options)
    })
  },
  search: (value) => {
    tag.value.option = tag.value.originOption.filter((data, index, array) => {
      return data.label.includes(value)
    })
  }
})

const category = ref({
  option: [],
  originOption: [],
  isLoading: false,
  pageNum: 1,
  pageSize: 10,
  keyword: '',
  timer: null,
  isFinished: false,
  getCategory: () => {
    category.value.isLoading = true
    getCategoryPageApi({
      pageNum: category.value.pageNum,
      pageSize: category.value.pageSize,
      keyword: category.value.keyword,
    }).then(res => {
      const data = res.data.page.records
      if (data.length < category.value.pageNum) {
        category.value.isFinished = true
      }
      category.value.originOption.length = 0
      category.value.option.length = 0
      const options = []
      for (let i = 0; i < data.length; i++) {
        options.push({
          label: data[i].name,
          value: data[i].id
        })
      }
      category.value.originOption.push(...options)
      category.value.option.push(...options)
    }).finally(() => {
      category.value.isLoading = false
    })
  },
  searchCategory: (keyword = '') => {
    category.value.pageNum = 1
    category.value.isFinished = false
    category.value.keyword = keyword
    clearTimeout(category.value.timer)
    category.value.timer = setTimeout(() => {
      category.value.getCategory()
    }, 300)
  },
  scroll: () => {
    if (category.value.isFinished || category.value.isLoading) {
      return
    }

    category.value.pageNum += 1
    category.value.getCategory()
  }
})


function save() {
  if (type.value === 'add') {
    addArticleApi(data.value).then(res => {
      if (res.code === 0) {
        data.value.id = res.data.id
        saveArticleTags()
        message.success('操作成功')
      } else {
        message.error(res.msg)
      }
    })
  } else {
    updateArticleByIdApi(data.value).then(res => {
      if (res.code === 0) {
        saveArticleTags()
        message.success('操作成功')
      } else {
        message.error(res.msg)
      }
    })
  }
}

function uploadImage(value) {
  console.log(value)
  const formData = new FormData()
  formData.append('file', value.file.file)
  uploadImageApi(formData).then(res => {
    data.value.cover = res
  })
}

function handleChange(val) {
  data.value.content = val
}

async function handleUploadFile(files) {
  const formData = new FormData();
  formData.append('file', files[0])
  const res = await uploadImageApi(formData)

  if (res.code !== 0) {
    const split = res.split('/')
    return [
      {
        title: split[split.length - 1],
        url: IMAGE_URL + res,
      },
    ]
  } else {
    return []
  }

}

function saveArticleTags() {
  saveArticleTagApi({
    articleId: data.value.id,
    tagIds: articleTag.value
  }).then(res => {
    if (res.code === 0) {
    } else {
      message.error(res.msg)
    }
  })

}

function getArticleTag() {
  getArticleTagApi(route.params.id).then(res => {
    if (res.code === 0) {
      articleTag.value = res.data.tags.map(item => {
        return item.id
      })
    }
  })
}

onMounted(() => {
  if (route.params.id !== null && route.params.id !== undefined) {
    type.value = 'edit'
    data.value.id = route.params.id
    getArticleByIdApi(route.params.id).then(res => {
      if (res.code === 0) {
        data.value = res.data.article
        getArticleTag()
        fileList.value = [{
          id: "c",
          status: "finished",
          url: IMAGE_URL + data.value.cover
        }]
      } else {
        message.error(res.msg)
      }
    })
  } else {
    isLoading.value = false
  }
  category.value.getCategory()
  tag.value.getAllTag()
})

</script>

<style scoped>
:deep(.bytemd) {
  z-index: 999;
}
</style>