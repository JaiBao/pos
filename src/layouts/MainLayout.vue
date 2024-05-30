<template>
  <q-layout view="hHh lpR fFf">

  <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useUserStore } from 'src/stores/user'
// import { useRouter } from 'vue-router'

// const router = useRouter()
const user = useUserStore()
if (user.isLogin === true) {
  // router.push('/ordered')
}
</script>
