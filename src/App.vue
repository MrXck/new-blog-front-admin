<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-loading-bar-provider>
      <n-message-provider>
        <router-view/>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style>

</style>
<script setup>
import {NLoadingBarProvider, NMessageProvider, NConfigProvider, zhCN, dateZhCN} from 'naive-ui'
</script>