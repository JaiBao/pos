<template>
  <div class="container ">
    <div class="mainMenu">
    <q-btn
          color="blue"
          label="點餐"
          icon="restaurant"
          to="/Order"
          rounded

        />
        <q-btn
          color="blue"
          label="訂單"
          icon="list_alt"
          href="http://ods.dtstw.com/backend/sale/orders"
          target="_blank"
          rounded
        />
        <q-btn
          color="blue"
          label="會員"
          icon="manage_accounts"
          target="_blank"
          href="http://ods.dtstw.com/backend/member/members"
          rounded
        />
        <q-btn
          color="grey"
          label="暫無功能"
          icon="inventory"
          rounded
        />
        <q-btn
          color="green"
          label="設定"
          icon="settings"
          target="_blank"
          href="http://ods.dtstw.com/backend/catalog/products"
          rounded
        />

        <q-btn
          color="red"
          @click="logout"
          label="登出"
          icon="logout"
          rounded
        />
      </div>
  </div>
</template>

<script setup>
// import { ref, reactive } from 'vue'
// import { apiAuth } from 'src/boot/axios'
import { useUserStore } from 'src/stores/user'
import { useRouter } from 'vue-router'

const user = useUserStore()

const router = useRouter()
const logout = async () => {
  await user.logout()
  router.push('/')
}
</script >

<style lang="scss" scoped>

.mainMenu{
text-align: center;
 position: relative;
  top: 50%;
  transform: translate(0, 20%);
width: 100vw;

.q-btn{
width: 300px;
height: 300px;
margin: 20px;
margin-top: 50px;
font-size: 50px!important;
}
}
</style>
