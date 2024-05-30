<template>
  <div class="h-100">
    <q-splitter
      horizontal
      style="
         {
          min-height: 50vh;
        }
      "
    >
      <template v-slot:before>
        <q-tabs
          inline-label
          mobile-arrows
          outside-arrows
          v-model="tab"
          class="text-white"
        >
          <q-tab
            v-for="row in rows"
            :name="row.personal_name"
            :key="row.id"
            :label="row.code + '  ' + row.personal_name"
          >
            <q-spinner
              color="primary"
              size="1rem"
              class="q-mx-md"
              :thickness="10"
            />
          </q-tab>
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel
            v-for="row in rows"
            :name="row.personal_name"
            :key="row.id"
          >
            <div class="row w-100">
              <div class="col-12 text-h4 q-my-md">訂單編號:{{ row.code }}</div>
              <div class="col-12 text-h4 q-my-md">
                送達路段:{{ row.shipping_road_abbr }}
              </div>
              <div class="col-12 text-h4 q-my-md">
                送達時間:{{ row.delivery_date_hi }}
              </div>
              <div class="col-12 text-h4 q-my-md">
                餐點內容: <br />炸蝦潤餅*5 <br />
                滷肉潤餅*100 <br />
                炒雞潤餅*100 <br />
              </div>
            <div class="col-12">
              <q-btn label="開始製作" color="green" class="q-ma-xs"/>
              <q-btn label="完成製作" color="green" class="q-ma-xs"/>
            </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from 'vue'

import { apiAuth } from 'src/boot/axios'
import { DateTime } from 'luxon'
const today = DateTime.now().toFormat('yyyy-MM-dd')
const rows = reactive([])
const tab = ref('')
const getdata = async () => {
  const { data } = await apiAuth.get(`/sale/order/schedule/list/${today}`)
  data.orders.forEach((element) => {
    rows.push(element)
  })
  tab.value = rows[0].personal_name
}
onBeforeMount(() => {
  getdata()
})
</script>

<style lang="scss" scoped>
.h-100 {
  height: 100vh;
}
</style>
