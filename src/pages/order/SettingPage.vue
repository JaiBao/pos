<template>
  <div>
    <input v-model="name" placeholder="Enter name" />
    <q-btn @click="startRest" label="我要休息了" color="red" />
    <q-table
      :rows="rests"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[]"
      title-style="font-size: 24px;"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import moment from 'moment'

const name = ref('')
const rests = ref([])

const columns = [
  { name: 'Name', required: true, label: '姓名', align: 'left', field: 'name', sortable: true, style: 'font-size: 18px;' },
  { name: 'StartTime', required: true, label: '休息時間', align: 'left', field: 'startTime', sortable: true, style: 'font-size: 18px;' },
  { name: 'EndTime', required: true, label: '結束休息時間', align: 'left', field: 'endTime', sortable: true, style: 'font-size: 18px;' }
]

const startRest = () => {
  const startTime = moment().format('YYYY-MM-DD HH:mm:ss')
  const endTime = moment().add(45, 'minutes').format('YYYY-MM-DD HH:mm:ss')
  rests.value.push({ name: name.value, startTime, endTime })
  name.value = ''
}
</script>
