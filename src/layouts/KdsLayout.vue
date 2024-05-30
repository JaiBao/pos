<template>
  <q-layout view="hHh lpR fFf">
  <q-page-container class="bg-black h-100">
    <div class="row w-100 justify-center">
    <div class="text-white text-h2 q-my-md">{{ today }}</div>
  </div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { DateTime } from 'luxon'

const today = ref(DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'))

setInterval(() => {
  today.value = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
}, 1000)
</script>
<style lang="scss" scoped>

.h-100{
height: 100vh;
}
body{
overflow-x: hidden;
}
</style>
