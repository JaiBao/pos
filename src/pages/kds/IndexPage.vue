<template>
  <div class="row w-100 justify-center">
    <q-table
      :rows="rows"
      grid
      :columns="columns"
      class="w-100"
      row-key="id"
      virtual-scroll
      v-model:pagination="pagination"
      rows-per-page-options="3"
      id="sliderTable"
      no-data-label="目前沒有餐點"
      v-model:expanded="expanded"
    >
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered>
            <q-card-section class="q-pa-xs">
              <div class="row items-center justify-center">
                <div class="col text-center">
                  <q-btn color="green" class="q-pa-xs" @click="click(val)">廚房區<q-icon
                    name="done"
                    color="white"
                    size="1.5rem"
                    class="q-mx-xs"
                  /></q-btn>
                </div>
                <div class="col text-center">
                  <q-btn color="yellow" class="q-pa-xs">
                    包餅區
                  <q-spinner color="white" size="1.5rem" class="q-mx-xs" />
                  </q-btn>
                </div>
                <div class="col text-center">
                  <q-btn color="red" class="q-pa-xs">
                    製餐區<q-icon
                    name="close"
                    color="red"
                    size="1.5rem"
                    class="q-mx-xs"
                  />
                  </q-btn>
                </div>
                <div class="col text-center">
                  <q-btn color="red" class="q-pa-xs">
                    外送區<q-icon
                    name="close"
                    color="red"
                    size="1.5rem"
                    class="q-mx-xs"
                  />
                  </q-btn>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="text-center">
              <div class="column h-100">
                <div class="col text-h5">訂單編號:{{ props.row.code }}</div>
                <div class="col text-h5">
                  時間區間:{{ props.row.delivery_time_range }}
                </div>
                <div class="col text-h5">
                  訂購人:{{ props.row.personal_name }}
                </div>
                <div class="col text-h5">
                  送達路段:{{ props.row.shipping_road_abbr }}
                </div>
                <div class="col-6 text-h5">
                  備料: 炸地瓜*100 <br>
                      廚娘油飯*100 <br>
                      酥炸菇菇*100 <br>
                      芋頭糕*100 <br>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { apiAuth } from 'src/boot/axios'
import { DateTime } from 'luxon'
import { useStatusStore } from 'src/stores/status'
const today = DateTime.now().toFormat('yyyy-MM-dd')
const status = useStatusStore()
const getdata = async () => {
  const { data } = await apiAuth.get(`/sale/order/schedule/list/${today}`)
  data.orders.forEach((element) => {
    rows.push(element)
  })
}
const click = (val) => status.increment()
getdata()
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
</script>

<style lang="scss" scoped>
.h-100 {
  max-height: 70vh;
}
</style>
