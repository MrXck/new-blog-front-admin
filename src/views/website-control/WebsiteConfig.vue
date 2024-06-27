<script setup>
import {NSpace, NUpload, NUploadDragger, NIcon, NInput, NDatePicker, useMessage, NButton, NImage} from 'naive-ui'
import {IMAGE_URL} from "@/utils/Constant";
import {ArchiveOutline as ArchiveIcon} from "@vicons/ionicons5";
import {uploadImageApi} from "@/api/uploadApi";
import {onMounted, ref} from "vue";
import {getWebsiteConfigApi, updateApi} from "@/api/websiteConfigApi";

const data = ref({
  authorCover: null,
})
const message = useMessage()

function uploadImage(value) {
  const formData = new FormData()
  formData.append('file', value.file.file)
  uploadImageApi(formData).then(res => {
    data.value.authorCover = res
  })
}

function init() {
  getWebsiteConfigApi().then(res => {
    data.value = res.data.websiteConfigs[0]
  })
}

function save() {
  updateApi(data.value).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
    } else {
      message.error(res.msg)
    }
  })
}

onMounted(() => {
  init()
})
</script>

<template>
<n-space>
  <n-space vertical>
    <n-space style="width: 100px">
      作者头像
    </n-space>
    <n-space>
      <n-upload
          :max="1"
          :custom-request="uploadImage"
          list-type="image-card"
          @remove="data.authorCover = null"
          accept="image/*"
      >
        <n-upload-dragger>
          <n-icon v-show="data.authorCover === null" size="48" :depth="3">
            <archive-icon/>
          </n-icon>
          <n-image @click.stop width="100%" v-show="data.authorCover !== null" :src="IMAGE_URL + data.authorCover"></n-image>
        </n-upload-dragger>
      </n-upload>
    </n-space>
    <n-space>
      作者名称
    </n-space>
    <n-space>
      <n-input v-model:value="data.authorName"></n-input>
    </n-space>
    <n-space>
      作者简介
    </n-space>
    <n-space>
      <n-input v-model:value="data.authorDesc"></n-input>
    </n-space>
    <n-space>
      建站时间
    </n-space>
    <n-space>
      <n-date-picker date-format="yyyy-MM-dd" v-model:formatted-value="data.websiteCreateTime"></n-date-picker>
    </n-space>
    <n-space>
      网站公告
    </n-space>
    <n-space>
      <n-input v-model:value="data.websiteAnnouncement"></n-input>
    </n-space>
    <n-space>
      github
    </n-space>
    <n-space>
      <n-input v-model:value="data.githubUrl"></n-input>
    </n-space>
    <n-space>
      gitee
    </n-space>
    <n-space>
      <n-input v-model:value="data.giteeUrl"></n-input>
    </n-space>
    <n-space>
      qq
    </n-space>
    <n-space>
      <n-input v-model:value="data.qqUrl"></n-input>
    </n-space>
    <n-space>
      wechat
    </n-space>
    <n-space>
      <n-input v-model:value="data.wechatUrl"></n-input>
    </n-space>
    <n-space>
      wb
    </n-space>
    <n-space>
      <n-input v-model:value="data.wbUrl"></n-input>
    </n-space>
    <n-space>
      csdn
    </n-space>
    <n-space>
      <n-input v-model:value="data.csdnUrl"></n-input>
    </n-space>
    <n-space>
      知乎
    </n-space>
    <n-space>
      <n-input v-model:value="data.zhihuUrl"></n-input>
    </n-space>
    <n-space>
      掘金
    </n-space>
    <n-space>
      <n-input v-model:value="data.juejinUrl"></n-input>
    </n-space>
    <n-space>
      twitter
    </n-space>
    <n-space>
      <n-input v-model:value="data.twitterUrl"></n-input>
    </n-space>
    <n-space>
      stackoverflow
    </n-space>
    <n-space>
      <n-input v-model:value="data.stackoverflowUrl"></n-input>
    </n-space>
  </n-space>
  <n-button @click="save">保存</n-button>
</n-space>
</template>

<style scoped>

</style>
