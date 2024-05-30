<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <div class="oderfooter">
        <div class="row w-100">
          <q-btn
            flat
            :text-color="buttonColor('/search')"
            class="col bg-accent btn"
            to="/search"
            ><img src="/logo.svg" class="logo"
          /></q-btn>
          <q-btn
            flat
            :text-color="buttonColor('/ordered')"
            label="訂單模組"
            icon="list_alt"
            to="/ordered"
            class="col bg-accent btn"
          />
          <q-btn
            flat
            :text-color="buttonColor('/member')"
            label="會員模組"
            icon="manage_accounts"
            class="col bg-accent btn"
            to="/member"
          />
          <!-- <q-btn
            flat
            :text-color="buttonColor('/Order')"
            label="點餐模組"
            icon="restaurant"
            class="col bg-accent btn"
            to="/Order"
          /> -->
          <q-btn
            flat
            :text-color="buttonColor('/payment')"
            label="收入模組"
            icon="payments"
            class="col bg-accent btn"
            to="/payment"
          />
          <q-btn
            flat
            label="控單模組"
            icon="supervisor_account"
            class="col bg-accent btn"
            to="/control/table"
          />
          <!-- <q-btn
          color="teal-5"
          label="訂單"
          icon="list_alt"
          target="_blank"
          :href="api.defaults.baseURL + 'backend/sale/orders'"
        /> -->
          <!-- <q-btn class="col" :color="buttonColor('/material')" icon="build" /> -->
          <q-btn
            flat
            icon="build"
            class="col bg-accent"
            target="_blank"
            label="後台"
            :href="api.defaults.baseURL + 'backend/'"
          />
          <!-- <q-btn
            class="col"
            color="grey-9"
            to="/ordered"
            label=""
            icon="close"
          /> -->
        </div>
      </div>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer>
      <q-page-sticky position="bottom-right" :offset="fabPos">
        <q-fab color="purple" icon="keyboard_arrow_up" direction="up"  v-touch-pan.prevent.mouse="moveFab"  :disable="draggingFab">

          <q-btn
          round
            @click="logout"
            icon="logout"
            color="primary"
            size="15px"
          ></q-btn>
          <q-btn round to="/index" icon="home" color="dark" class="q-mx-md" size="15px"></q-btn>
          <q-btn :label="welcome" color="dark"></q-btn>
        </q-fab>
      </q-page-sticky>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { api } from 'src/boot/axios'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user'
const user = useUserStore()
// import { useQuasar } from 'quasar'
// const $q = useQuasar()
const fabPos = ref([418, 18])
const draggingFab = ref(false)
function moveFab (ev) {
  draggingFab.value = ev.isFirst !== true && ev.isFinal !== true

  fabPos.value = [
    fabPos.value[0] - ev.delta.x,
    fabPos.value[1] - ev.delta.y
  ]
}
const route = useRoute()
const router = useRouter()
const logout = async () => {
  await user.logoutShit()
  router.push('/')
}
const welcome = ref('使用者  ' + user.name)
const currentRoute = ref(route.path)
// const isDark = ref($q.dark.isActive)
watchEffect(() => {
  currentRoute.value = route.path
})
const buttonColor = (targetRoute) => {
  // console.log(currentRoute.value, targetRoute)
  if (currentRoute.value === targetRoute) {
    return 'warning'
  }
  if (
    targetRoute === '/ordered' &&
    currentRoute.value.startsWith('/ordered/')
  ) {
    return 'warning'
  } else if (
    targetRoute === '/member' &&
    currentRoute.value.startsWith('/member/')
  ) {
    return 'warning'
  } else {
    return 'white'
  }
}
// change dark mode
// const changeDarkMode = () => {
//   isDark.value = !isDark.value
//   $q.dark.set(isDark.value)
// }
</script>

<style lang="scss" scoped>
.q-layout__section--marginal {
  background: #ffffff;
}
.oderfooter {
  display: flex !important;
  justify-content: space-between !important;
  height: 70px;
  width: 100% !important;
  // margin: 1px !important;
  .q-btn {
    // width: 213.67px !important;
    height: 70px;
    color: #ffffff;
    font-size: 28px;
    border-radius: 0;
    // border-right: 1px solid #fff;
  }
}

.btn::after {
  content: "";
  position: absolute;
  top: 20%;
  right: 0%;
  width: 3px;
  height: 42px;
  background: #fff;
}
// .logo{
//   animation: rotate360 2s linear infinite;
// }
</style>
