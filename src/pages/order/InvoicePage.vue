<template>
  <div>
    <q-table title="發票" :rows="rows" :columns="columns" row-key="id" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { apiShit } from 'src/boot/axios'
import { DateTime } from 'luxon'
const rows = ref([])
const today = ref(DateTime.now().toFormat('yyyy-MM-dd'))
const columns = [
  { name: 'id', label: 'id', field: 'id' },
  { name: 'order_code', label: '編號', field: 'order_code' },
  {
    name: 'invoice_num',
    label: '發票號碼',
    field: 'invoice_num',
    sortable: true
  },
  {
    name: 'date',
    label: '日期',
    field: 'date',
    format: (val) => { return DateTime.fromISO(val).toFormat('yyyy-MM-dd') }
  },
  {
    name: 'is_active',
    label: '狀態',
    field: 'is_active',
    format: (val) => {
      if (val === '0') {
        return '作廢'
      } else if (val === '1') {
        return '正常'
      }
    }
  }

]
const fetchInvoice = async () => {
  const { data } = await apiShit.post('/pay/findinvoice/date', {
    date: today.value
  })
  rows.value = data
  console.log(data)
}

onBeforeMount(async () => {
  await fetchInvoice()
})
</script>
