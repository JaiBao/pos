<template>
  <div class="container">
    <div class="mainMenu row w-100 justify-center items-center">
      <q-btn
        color="pink-10"
        label="開始"
        icon="play_circle"
        to="/search"
        rounded
        class="col-3"
      />
      <q-btn
        color="pink-5"
        label="訂單"
        icon="list_alt"
        to="/ordered"
        rounded
        class="col-3"
      />
      <q-btn
        color="pink-5"
        label="會員"
        icon="manage_accounts"
        to="/member"
        rounded
        class="col-3"
      />
      <q-btn
        color="pink-5"
        icon="euro"
        to="/payment"
        label="收入"
        rounded
        class="col-3"
      />
      <q-btn
        color="pink-5"
        icon="supervisor_account"
        to="/control/net"
        label="控制"
        rounded
        class="col-3"
      />
      <!-- <q-btn color="grey" label="敬請期待" icon="inventory" rounded to="/Setting"        class="col-4"/> -->
      <q-btn
        color="grey"
        icon="settings"
        target="_blank"
        :href="api.defaults.baseURL + '/backend'"
        rounded
        label="後台"
        class="col-4"
      />
      <q-btn color="secondary" to="/register"  rounded   label="用戶" icon="pets"  class="col-4"/>
      <!-- <q-btn color="grey" class="col-4" rounded/> -->
      <q-btn color="grey" @click="logout" icon="logout" rounded   label="登出"     class="col-4"/>
    </div>
  </div>
</template>

<script setup>
// import { ref, reactive } from 'vue'
import { api } from 'src/boot/axios'
import { useUserStore } from 'src/stores/user'
import { useRouter } from 'vue-router'

const user = useUserStore()
const router = useRouter()

const logout = async () => {
  await user.logoutShit()
  router.push('/')
}
</script>

<style lang="scss" scoped>
.mainMenu {
  .q-btn {
    width: 300px;
    height: 300px;
    margin: 15px;
    margin-top: 30px;
    font-size: 50px !important;
  }
}
</style>
