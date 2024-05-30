<template>
  <h5>訂單</h5>
  <div class="row">
    <q-input outlined v-model="data.id" label="訂單編號" class="col q-mx-xs" />
    <q-input
      outlined
      v-model="data.order_date"
      label="訂購日期"
      class="col q-mx-xs"
    />
    <q-input
      outlined
      v-model="data.status_txt"
      label="訂單狀態"
      class="col q-mx-xs"
    />
  </div>
  <h5>送達日</h5>
  <div class="row">
    <q-select
      outlined
      v-model="data.shipping_method"
      label="取貨方式"
      class="col q-mx-xs"
      :options="shippingoptions"
      emit-value
      map-options
      option-label="label"
    />
    <q-input
      outlined
      v-model="data.delivery_date_ymd"
      label="送達日"
      class="col q-mx-xs"
    />
    <q-input
      outlined
      v-model="data.delivery_weekday"
      label="星期"
      class="col q-mx-xs"
    />
    <q-input
      outlined
      v-model="data.delivery_time_range"
      label="送達時間範圍"
      class="col q-mx-xs"
    />
    <q-input
      outlined
      v-model="data.delivery_date_hi"
      label="送達時間"
      class="col q-mx-xs"
    />
  </div>
  <h5>訂購人</h5>
  <div class="row">
    <q-input outlined v-model="data.personal_name" label="訂購人" />
    <q-input outlined v-model="data.customer_id" label="客戶編號" />
    <q-input outlined v-model="data.mobile" label="客戶編號" />
    <q-input outlined v-model="data.telephone_prefix" label="區碼" />
    <q-input outlined v-model="data.telephone" label="電話" />
    <q-input outlined v-model="data.telephone_cut" label="分機" />
  </div>
  <div class="row">
    <q-select
      outlined
      v-model="data.is_payment_tin"
      label="是否統編"
      :options="taxidoptions"
      emit-value
      map-options
      option-label="label"
      class="col"
    />
    <q-input outlined v-model="data.payment_tin" label="統編" class="col" />
  </div>
  <h5>收件人</h5>
  <div class="row">
    <q-input
      outlined
      v-model="data.shipping_personal_name"
      label="收件人"
      class="col"
    />
    <q-input
      outlined
      v-model="data.shipping_company"
      label="送達公司"
      class="col"
    />
    <q-select
      style="padding: 2px; width: 120px; font-size: 20px"
      outlined
      v-model="data.shipping_state_id"
      label="縣市"
      :options="stateoptions"
      class="col"
      emit-value
      map-options
      option-label="label"
    />
    <q-select
      style="padding: 2px; width: 120px; font-size: 20px"
      outlined
      v-model="data.shipping_city_id"
      label="縣市"
      :options="cityoptions"
      class="col"
      emit-value
      map-options
      option-label="label"
    />
    <q-input outlined v-model="data.shipping_road" label="路" />
    <q-input outlined v-model="data.shipping_address1" label="號" />
  </div>
  <div class="row">
    <q-input outlined v-model="data.shipping_phone" label="收件電話" />
  </div>
  <h5>付款方式</h5>
  <div class="row">
    <q-input outlined v-model="data.payment_method" label="付款方式" />
    <q-input outlined v-model="data.payment_total" label="總金額" />
    <q-input outlined v-model="data.payment_paid" label="已付" />
    <q-input outlined v-model="data.payment_unpaid" label="未付" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { apiAuth } from 'src/boot/axios'
import { useRoute } from 'vue-router'
import { UseAddressStore } from 'src/stores/address'

const address = UseAddressStore()
address.getstate()

const stateoptions = address.state
const cityoptions = ref({})
const shippingoptions = [
  { label: '派送', value: 'shipping_delivery' },
  { label: '自取', value: 'shipping_pickup' }
]
const taxidoptions = [
  { label: '需要', value: 1 },
  { label: '不需要', value: 0 }
]

const route = useRoute()
const data = ref({})
const getdata = async () => {
  const result = await apiAuth.get(`/sale/order/${route.params.id}`)
  data.value = result.data
  data.value.telephone_cut = cutTel1(data.value.telephone)
  data.value.telephone = cutTel0(data.value.telephone)
}
// watch(() => data.value.shipping_state_id, (newVal, oldVal) => {
//   console.log('shipping_state_id changed:', newVal)
// })
getdata()

watch(
  () => data.value.shipping_state_id,
  async () => {
    console.log('shipping_state_id changed:', data.value.shipping_state_id)
    await address.getcity(data.value.shipping_state_id)
    cityoptions.value = address.city
  }
)
// -----------------------------------------------------------------
// 分機處理
function cutTel1 (tel) {
  const cuted = tel.split('#')
  console.log(cuted[1])
  return cuted[1]
}
// 市話處理
function cutTel0 (tel) {
  const cuted = tel.split('#')
  console.log(cuted[0])
  return cuted[0]
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.q-input {
font-size: 20px;
}
</style>
