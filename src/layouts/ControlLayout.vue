<template>
  <q-layout view="hHh lpr fFr" class="body">
    <q-header class="bg-pink-3 text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="text-bold"> Bing Control </q-toolbar-title>
        <q-space />
        <span class="gt-xs">
          現在時刻 : {{ today }}
        </span>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
      :breakpoint="500"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-list>
        <q-item to="/control/net" v-ripple>
          <q-item-section avatar>
            <q-avatar text-color="black" icon="token" />
          </q-item-section>
          <q-item-section>官網數量控制</q-item-section>
        </q-item>
        <q-item to="/control/table" v-ripple>
          <q-item-section avatar>
            <q-avatar text-color="black" icon="token" />
          </q-item-section>
          <q-item-section>控單表</q-item-section>
        </q-item>
        <q-item to="/sound" v-ripple>
          <q-item-section avatar>
            <q-avatar text-color="black" icon="token" />
          </q-item-section>
          <q-item-section>製餐狀態</q-item-section>
        </q-item>
        <q-item to="/search" v-ripple>
          <q-item-section avatar>
            <q-avatar text-color="black" icon="home" />
          </q-item-section>
          <q-item-section>回首頁</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container class="body">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// import { ResizeObserver } from '@juggle/resize-observer'
import { ref } from 'vue'
// import { useUserStore } from 'src/stores/user'
// import { useRouter } from 'vue-router'
import { DateTime } from 'luxon'

const today = ref(DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'))
setInterval(() => {
  today.value = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
}, 1000)
// import { useQuasar } from 'quasar'
// const $q = useQuasar()

// const isDark = ref($q.dark.isActive)

// function toggleDarkMode () {
//   isDark.value = !isDark.value
//   $q.dark.set(isDark.value)
// }
// const router = useRouter()
// const user = useUserStore()
const miniState = ref(true)
// if (user.Permit !== true) {
//   router.push('/')
// }
const leftDrawerOpen = ref(false)
function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
// const check = () => {
//   if (user.Permit !== true) {
//     router.push('/')
//   }
// }
// onMounted(() => {
//   check()
// })

// watch(
//   () => user.Permit,
//   (value) => {
//     check()
//   }
// )
// const ro = new ResizeObserver((entries, observer) => {
//   console.log('Body has resized!')
//   observer.disconnect() // Stop observing
// })

// ro.observe(document.body) // Watch dimension changes on body
</script>

<style lang="scss" scoped>
.body{
  background:#eee;
}
</style>
