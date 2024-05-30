<template>
  <q-card class="q-pt-md">
    <div class="row w-100 justify-end">
      <div class="col-11"></div>
      <q-btn
        round
        icon="close"
        @click="emitClose"
        color="primary"
        class="text-white q-mr-md"
      />
      <div class="col-12">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="setting" label="外送員設定" class="text-h6" />
          <q-tab name="list" label="外送員統計" class="text-h6" />
        </q-tabs>
      </div>
    </div>
    <div class="row w-100 justify-center">
      <q-tab-panels v-model="tab" animated class="row w-100">
        <q-tab-panel name="setting">
          <div class="text-h4 q-my-md col-12 text-center">外送員設定</div>
          <div class="row justify-center col-12">
            <q-table
              :rows="rows"
              :columns="columns"
              row-key="name"
              class="col-6 q-ma-md"
            >
              <template v-slot:body-cell-edit="props">
                <q-td>
                  <q-btn
                    color="primary"
                    size="md"
                    round
                    icon="edit"
                    class="q-mx-md"
                    @click="edit(props.row)"
                  />
                  <q-btn
                    color="primary"
                    size="md"
                    round
                    icon="delete"
                    @click="deleteman(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
            <div class="column col-4">
              <div v-if="!deliveryForm.id" class="text-h6 text-center q-my-md">
                新增
              </div>
              <div v-if="deliveryForm.id" class="text-h6 text-center q-my-md">
                編輯
              </div>
              <q-input
                outlined
                v-model="deliveryForm.id"
                readonly
                class="col-1 q-ma-md"
                label="id"
              />
              <q-input
                outlined
                v-model="deliveryForm.name"
                class="col-1 q-ma-md"
                label="姓名"
              />
              <q-input
                outlined
                v-model="deliveryForm.phone"
                class="col-1 q-ma-md"
                label="手機"
              />
              <q-select
                outlined
                v-model="deliveryForm.cartype"
                :options="delivery.transport"
                class="col-1 q-ma-md"
                label="車種"
                emit-value
                map-options
              />
              <q-input
                outlined
                v-model="deliveryForm.plate"
                class="col-1 q-ma-md"
                label="車牌"
              />
              <div class="col-1 q-pa-md row justify-end">
                <q-btn
                  v-if="!deliveryForm.id"
                  color="primary"
                  size="md"
                  label="新增"
                  @click="addman(deliveryForm)"
                  class="text-white q-mr-md"
                />
                <q-btn
                  v-if="deliveryForm.id"
                  color="secondary"
                  size="md"
                  label="修改"
                  @click="updateman(deliveryForm)"
                  class="text-white q-mr-md"
                />
                <q-btn
                  color="black"
                  size="md"
                  label="取消"
                  @click="edit"
                  class="text-white q-mr-md"
                />
              </div>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="list">
          <div class="row w-100 justify-center">
            <q-table
              title="費用明細"
              :rows="rowsday"
              :columns="columns2"
              row-key="name"
              :visible-columns="visibleColumns1"
              class="col-5 q-ma-md"
            />
            <q-table
              title="費用統計"
              :rows="rowsCalculate"
              :columns="columns2"
              row-key="name"
              :visible-columns="visibleColumns2"
              class="col-5 q-ma-md"
              :rows-per-page-options="[0]"
            >
              <template v-slot:top-right>
                <q-btn
                  color="primary"
                  class="q-ma-xs"
                  icon-right="archive"
                  label="csv"
                  no-caps
                  @click="exportTable"
                />
              </template>
            </q-table>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
// import { apiShit } from 'src/boot/axios'
import { useDeliveryStore } from 'src/stores/delivery'
import { useQuasar, exportFile } from 'quasar'
import { DateTime } from 'luxon'

const today = DateTime.now().toFormat('yyyy-MM-dd')
const $q = useQuasar()
const tab = ref('setting')
const emit = defineEmits(['close'])
const emitClose = () => {
  emit('close')
}
const delivery = useDeliveryStore()
const rows = ref([])
const rowsday = ref([])
const rowsCalculate = ref([])
const deliveryForm = ref({
  id: '',
  name: '',
  phone: '',
  cartype: '',
  plate: ''
})
const visibleColumns1 = ref([
  'name',
  'phone',
  'delivery_fee',
  'cartype',
  'plate'
])
const visibleColumns2 = ref([
  'name',
  'phone',
  'delivery_fee',
  'plate',
  'delivery_count'
])
const edit = (val) => {
  deliveryForm.value.id = val.id
  deliveryForm.value.name = val.name
  deliveryForm.value.phone = val.phone
  deliveryForm.value.cartype = val.cartype
  deliveryForm.value.plate = val.plate
}
const columns = [
  // { name: 'id', align: 'center', label: 'id', field: 'id', sortable: true },
  {
    name: 'name',
    align: 'center',
    label: '名字',
    field: 'name',
    sortable: true
  },
  {
    name: 'phone',
    align: 'center',
    label: '手機',
    field: 'phone',
    sortable: true
  },
  {
    name: 'cartype',
    align: 'center',
    label: '車種',
    field: 'cartype',
    format: (val) => {
      const cartype = delivery.transport.find(
        (cartype) => cartype.value === val
      )
      return cartype ? cartype.label : val
    },
    sortable: true
  },
  {
    name: 'plate',
    align: 'center',
    label: '車牌',
    field: 'plate',
    sortable: true
  },
  {
    name: 'edit',
    align: 'center',
    label: '動作',
    field: 'edit',
    sortable: true,
    skip: true
  }
]

const columns2 = [
  // { name: 'id', align: 'center', label: 'id', field: 'id', sortable: true },
  {
    name: 'name',
    align: 'center',
    label: '名字',
    field: 'delivery_name',
    sortable: true
  },
  {
    name: 'phone',
    align: 'center',
    label: '手機',
    field: 'delivery_phone',
    sortable: true
  },
  {
    name: 'delivery_fee',
    align: 'center',
    label: '費用',
    field: 'delivery_fee',
    sortable: true,
    skip: true
  },
  {
    name: 'cartype',
    align: 'center',
    label: '車種',
    field: 'delivery_cartype',
    format: (val) => {
      const cartype = delivery.transport.find(
        (cartype) => cartype.value === val
      )
      return cartype ? cartype.label : val
    },
    sortable: true
  },
  {
    name: 'plate',
    align: 'center',
    label: '車牌',
    field: 'delivery_plate',
    sortable: true
  },
  {
    name: 'delivery_count',
    align: 'center',
    label: '單數',
    field: 'delivery_count',
    sortable: true
  }
]

const fetch = async () => {
  await delivery.getDeliveryman()
  rows.value = delivery.deliverymanFull
}
const getDeliveryDate = async (today) => {
  const result = await delivery.getDeliveryDate(today)
  rowsday.value = result
  console.log(rowsday.value)
  const totalFeesByDeliveryPerson = rowsday.value.reduce((acc, delivery) => {
    // 如果累加器中已經有這個外送員的記錄，則累加其 delivery_fee
    if (acc[delivery.delivery_name]) {
      acc[delivery.delivery_name].delivery_fee += delivery.delivery_fee
      acc[delivery.delivery_name].delivery_count += 1
    } else {
      // 否則，創建一個新的記錄
      acc[delivery.delivery_name] = {
        delivery_name: delivery.delivery_name,
        delivery_phone: delivery.delivery_phone,
        delivery_plate: delivery.delivery_plate,
        delivery_fee: delivery.delivery_fee,
        delivery_count: 1
      }
    }
    return acc
  }, {})

  rowsCalculate.value = Object.values(totalFeesByDeliveryPerson)
}
function isAnyFieldEmpty (val) {
  const { id, ...otherProps } = val
  return Object.values(otherProps).some((value) => !value)
}
const addman = async (val) => {
  const empty = isAnyFieldEmpty(val)
  if (empty) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'cloud',
      position: 'bottom',
      message: '請檢查欄位是否有空白'
    })
    return
  }
  try {
    await delivery.addDeliveryman(val)
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud',
      position: 'bottom',
      message: '新增成功'
    })
    await fetch()
  } catch (error) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'cloud',
      position: 'bottom',
      message: error
    })
  }
}
const updateman = async (val) => {
  const empty = isAnyFieldEmpty(val)
  if (empty) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'cloud',
      position: 'bottom',
      message: '請檢查欄位是否有空白'
    })
    return
  }
  try {
    await delivery.updateDeliveryman(val)
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud',
      position: 'bottom',
      message: '更新成功'
    })
    await fetch()
  } catch (error) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'cloud',
      position: 'bottom',
      message: error
    })
  }
}

const deleteman = async (val) => {
  try {
    await delivery.deleteDeliveryman(val)
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud',
      position: 'bottom',
      message: '成功刪除'
    })
    await fetch()
  } catch (error) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'cloud',
      position: 'bottom',
      message: error
    })
  }
}
// ---------------------------------------------------------------
function wrapCsvValue (val, formatFn, row2) {
  let formatted = formatFn !== undefined ? formatFn(val, row2) : val

  formatted =
    formatted === undefined || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}
function exportTable () {
  const content = [
    columns2.map(col => wrapCsvValue(col.label)), // 列標題
    ...rowsCalculate.value.map(row =>
      columns2.map(col =>
        wrapCsvValue(row[col.field])
      ).join(',')
    )
  ].join('\r\n')

  const status = exportFile('外送員統計表.csv', '\ufeff' + content, 'text/csv')
  if (status !== true) {
    $q.notify({
      message: '無法下載',
      color: 'negative',
      icon: 'warning'
    })
  }
}
onMounted(async () => {
  await fetch()
  await getDeliveryDate(today)
})
onUnmounted(async () => {
  await delivery.getDeliveryman()
})
</script>

<style lang="scss" scoped></style>
