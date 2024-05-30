<template>
  <div class="row w-100 q-my-md">
    <q-input v-model="select.startDate" outlined class="col-2" label="開始">
      <template v-slot:before>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            cover
            transition-show="scale"
            transition-hide="scale"
            v-model="showDatePicker"
          >
            <q-date
              v-model="select.startDate"
              mask="YYYY-MM-DD"
              style="width: 800px"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input v-model="select.endDate" outlined class="col-2" label="結束">
      <template v-slot:before>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            cover
            transition-show="scale"
            transition-hide="scale"
            v-model="showDatePicker2"
          >
            <q-date
              v-model="select.endDate"
              mask="YYYY-MM-DD"
              style="width: 800px"
              @input="$emit('close')"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon> </template
    ></q-input>
  </div>

  <!-- <table border="1">
    <tbody>
      <tr>
        <td v-for="(quantity, product) in sortedProducts" :key="product">
          {{ product }}
        </td>
      </tr>
      <tr>
        <td v-for="(quantity, product) in sortedProducts" :key="product">
          {{ quantity }}
        </td>
      </tr>
    </tbody>
  </table> -->
  <q-table
    :columns="columns"
    :rows="rows"
    class="w-100 q-mt-md"
    hide-bottom
  >
  </q-table>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { DateTime } from 'luxon'
import { apiShit } from 'src/boot/axios'

const today = DateTime.now().toFormat('yyyy-MM-dd')
const showDatePicker = ref(false)
const showDatePicker2 = ref(false)
const dataShow = ref({})
const select = ref({ startDate: today, endDate: today })
const sortedItem = ref('')
const columns = ref([])
const rows = ref([])
const fetch = async () => {
  const { data } = await apiShit.post('/fetch', select.value)
  console.log(data.overall)
  dataShow.value = { ...data.overall } // 淺拷貝，避免直接修改原始數據

  // Step 1: 除以 2（並四捨五入）
  const dividedData = Object.fromEntries(
    Object.entries(dataShow.value).map(([key, value]) => {
      // 检查键是否包含 "潤餅"
      if (key.includes('3吋')) {
        const newValue = Math.floor(value / 2) + (value % 2 ? 1 : 0)
        return [key, newValue]
      }
      // 如果键不包含 "潤餅"，保留原始值
      return [key, value]
    })
  )

  const keysToAdd = Object.keys(dataShow.value).filter(
    (key) => key.includes('潤餅') && !key.includes('3吋')
  )
  // Step 2: 將特定項目的數量加到相對應的 "3吋" 項目
  keysToAdd.forEach((key) => {
    const correspondingKey = `${key}3吋`
    if (dividedData[correspondingKey] && dividedData[key]) {
      dividedData[correspondingKey] += dividedData[key]
    }
  })

  // Step 3: 從對象中刪除特定項目
  keysToAdd.forEach((key) => {
    delete dividedData[key]
  })
  const renamedData = Object.fromEntries(
    Object.entries(dividedData).map(([key, value]) => {
      const newKey = key.replace('3吋', '6吋')
      return [newKey, value]
    })
  )

  // 更新 dataShow.value
  dataShow.value = renamedData

  console.log(dataShow.value) // 輸出更新後的值，用於驗證
}

const sortedProducts = computed(() => {
  const entries = Object.entries(dataShow.value)
  const sorted = entries.sort((a, b) => b[0].length - a[0].length)
  return Object.fromEntries(sorted)
})

// check the select value if change do fetch()
watch(select.value, async () => {
  await fetch()
  pushColumns()
})
watch(
  () => [select.value.endDate, select.value.startDate],
  (newDate, oldDate) => {
    showDatePicker.value = false
    showDatePicker2.value = false
  }
)
watch(sortedProducts, (newValue, oldValue) => {
  sortedItem.value = newValue
})

const pushColumns = () => {
  rows.value.splice(0, rows.value.length)
  columns.value.splice(0, columns.value.length)
  const entries = Object.entries(sortedItem.value)
  // 添加列到 columns.value
  entries.forEach(([key]) => {
    columns.value.push({
      name: key,
      label: key,
      field: key,
      align: 'center',
      style: 'border: 1px solid #ccc; padding:10px 0px!important',
      headerClasses: 'header',
      headerStyle: 'white-space: pre-wrap;writing-mode: vertical-rl;text-orientation: upright;border: 1px solid #ccc;padding:10px 0px!important'
    })
  })
  // 添加一行到 rows.value
  rows.value.push(sortedItem.value)
  console.log(rows.value)
}

onMounted(async () => {
  await fetch()
  pushColumns()
})
</script>

<style lang="scss" scoped>

</style>
