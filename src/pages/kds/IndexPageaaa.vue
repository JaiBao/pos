<template>
  <div class="row w-100 justify-center">
    <q-table
      :rows="rows"
      grid
      :columns="columns"
      class="w-100"
      title="餐點區"
      row-key="id"
      virtual-scroll
      v-model:pagination="pagination"
      rows-per-page-options="4"
      id="sliderTable"
      no-data-label="目前沒有餐點"
      v-model:expanded="expanded"
    >
      <template v-slot:item="props">
        <div class="q-pa-xs col-12">
          <q-card class="my-card" flat bordered>
            <q-card-section horizontal class="row items-center">
           <div class="text-h4 col">
            訂單編號:{{ props.row.code }}
            <div class="br-container"></div>
            送達時間:{{ props.row.delivery_date_hi }}
           </div>
           <div class="text-h4 col">
            訂購人: {{props.row.personal_name}}
           </div>
           <div class="text-h4 col">
            送達路段:{{ props.row.shipping_road_abbr }}
           </div>
             </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
// import { ref } from 'vue'

import { apiAuth } from 'src/boot/axios'
import { reactive } from 'vue'
import { DateTime } from 'luxon'

const today = DateTime.now().toFormat('yyyy-MM-dd')
const columns = [
  {
    name: 'shipping_date',
    required: true,
    label: '日期',
    align: 'left',
    field: 'shipping_date',
    sortable: true
  },
  {
    name: 'delivery_date_hi',
    align: 'center',
    label: '時間',
    field: 'delivery_date_hi',
    sortable: true
  }
  // { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  // { name: 'carbs', label: 'Carbs (g)', field: 'carbs' }
]

const rows = reactive([])

const getdata = async () => {
  const { data } = await apiAuth.get(`/sale/order/schedule/list/${today}`)
  data.orders.forEach(element => {
    rows.push(element)
  })
}
getdata()
</script>

<style lang="scss" scoped>
.br-container {
  margin: 20px;
}
</style>
