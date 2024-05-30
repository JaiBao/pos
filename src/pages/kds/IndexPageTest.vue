<template>
  <div v-html="html"></div>
</template>

<script setup>
import { apiFuck } from 'src/boot/axios'
import { ref } from 'vue'
const html = ref('')
const get = async () => {
  const res = await apiFuck.get('zh-Hant/sale/mrequisition/printForm/230911')
  console.log(res)
  html.value = res.data
}
get()
</script>
