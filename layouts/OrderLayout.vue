<template>
  <q-layout view="hHh lpR fFf">
    <q-header >
      <div class="oderfooter">
        <q-btn-group spread>
    <q-btn
          color="teal-5"
          label="點餐"
          icon="restaurant"
          to="/Order"
        />
        <q-btn
          color="teal-5"
          label="訂單"
          icon="list_alt"
          :href="api.defaults.baseURL + 'backend/sale/orders'"
          target="_blank"
        />
        <q-btn
          color="teal-5"
          label="會員"
          icon="manage_accounts"
          target="_blank"
          :href="api.defaults.baseURL + 'backend/member/members'"
        />
        <q-btn
          color="grey"
          label="暫無功能"
          icon="inventory"
        to="/Setting"
        />
        <q-btn
          color="teal-5"
          label="設定"
          icon="settings"
          to="/Setting"
          target="_blank"
          :href="api.defaults.baseURL + 'backend/catalog/products'"
        />
        <q-btn
          color="red"
         to="/index"
          label="取消訂單"
          icon="logout"

        />
        </q-btn-group>
      </div>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer  >

    </q-footer>

  </q-layout>
</template>

<script setup>
import { api } from 'src/boot/axios'

</script>

<style lang="scss" scoped>
.q-layout__section--marginal{
  background: #FFFFFF;
}
.oderfooter{
  display: flex!important;
  justify-content: space-between!important;
  height: 70px;
  width: 1280px!important;
  margin: 1px!important;
  .q-btn{
    flex: 1;
    width: 213.67px!important;
  height: 70px;
  // background: #477DE7;
  color: #FFFFFF;
  font-size: 28px;
  // box-shadow: 10px 10px 0px 2px #1564ad;
  // font-size: 42px;

  }
}

</style>
