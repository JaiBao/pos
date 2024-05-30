<template>
  <div>
    <div class="row w-100">
      <q-table
        class="w-100 sticky-table"
        :rows="orders"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :rows-per-page-options="[0]"
        :visible-columns="visibleColumns"
        v-model:pagination="paginations"
      >
        <template v-slot:top>
          <div class="col-12 row q-pa-md items-center bg-dark justify-center">
            <!-- <q-input
              standout="bg-pink-2 text-black"
              v-model="filters.filter_code"
              label="編號"
              class="q-mx-xs col inputsearch"
            />
            <q-input
              outlined
              v-model="filters.filter_personal_name"
              label="姓名"
              class="q-mx-xs col inputsearch"
            />
            <q-input
              outlined
              v-model="filters.filter_phone"
              label="手機或市話"
              class="q-mx-xs col inputsearch"
            />
            <q-input
              outlined
              v-model="filters.filter_payment_tin"
              label="統編"
              class="q-mx-xs col inputsearch"
            /> -->
            <q-btn
              to="/search"
              round
              icon="home"
              color="primary"
              class="q-mx-md"
            />
            <q-input
              outlined
              v-model="filters.filter_delivery_date"
              label="送達日"
              class="q-mx-xs col inputsearch"
              readonly
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    v-model="datepicker"
                    style="width: 800px"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="filters.filter_delivery_date"
                      mask="YYYY-MM-DD"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <div class="text-h4 text-white q-mx-md">
              {{ timenow }}
            </div>
            <!-- <q-select
              outlined
              v-model="filters.filter_is_payed_off"
              label="收款狀態"
              :options="orderStatus"
              emit-value
              map-options
              class="q-mx-xs col columnselect"
            />
            <q-select
              outlined
              v-model="filters.filter_payment_method"
              label="付款方式"
              :options="paymentMethod"
              emit-value
              map-options
              class="q-mx-xs col columnselect"
            /> -->
            <!-- <q-btn
              round
              flat
              icon="restart_alt"
              @click="reset"
              color="white"
              class="q-mx-xs"
            /> -->

            <q-select
              v-model="visibleColumns"
              multiple
              outlined
              :display-value="$q.lang.table.columns"
              emit-value
              map-options
              label="顯示欄位"
              :options="columns"
              option-value="field"
              options-cover
              class="q-mx-xs col columnselect"
            />
            <q-input
              outlined
              v-model="alertminute"
              class="q-mx-xs col columnselect"
              label="幾分鐘提醒"
              readonly
            />
            <q-btn
              @click="speak('測試播放')"
              label="測試"
              color="primary"
              class="q-mx-md"
            />

            <q-slider v-model="delivery.soundRate" :min="0" :max="2"  :step="0.1" class="col-1"  label
      label-always  :label-value="'速度:' + delivery.soundRate"/>
            <!-- <q-btn
              @click="submitAll(orders)"
              label="儲存"
              color="white"
              class="text-black"
            /> -->
            <!-- <q-btn
              @click="driverdialog = true"
              label="外送員設定"
              color="white"
              class="text-black"
            /> -->
            <!-- <q-input
              outlined
              v-model="timer"
              class="q-mx-xs col columnselect"
              label="多久提醒(分)"
            /> -->
          </div>
        </template>
        <template v-slot:header="props">
          <q-tr>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              :style="{ 'font-size': '24px' }"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell="props">
          <q-td class="w-125" :props="props" :class="isOuted(props.row)">
            {{ props.value }}
          </q-td>
        </template>
        <template v-slot:body-cell-id="props">
          <q-td
            class="text-center w-60px"
            :props="props"
            :class="isOuted(props.row)"
          >
            {{ props.row.code }}
          </q-td>
        </template>
        <template v-slot:body-cell-payment_company="props">
          <q-td class="w-125" :props="props" :class="isOuted(props.row)">
            {{ truncate(props.row.payment_company, 6) }}
          </q-td>
        </template>
        <template v-slot:body-cell-production_start_time="props">
          <q-td
            class="w-125"
            key="desc"
            :props="props"
            :class="isOuted(props.row)"
          >
            {{ props.row.production_start_time }}
            <q-popup-edit
              v-model="props.row.production_start_time"
              title="製餐時間"
              auto-save
              v-slot="scope"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="handleEnter(scope)"
              />
            </q-popup-edit>
          </q-td>
        </template>
        <template v-slot:body-cell-production_ready_time="props">
          <q-td
            class="w-125"
            key="desc"
            :props="props"
            :class="isOuted(props.row)"
          >
            {{ props.row.production_ready_time }}
            <q-popup-edit
              v-model="props.row.production_ready_time"
              title="出餐時間"
              auto-save
              v-slot="scope"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="handleEnter(scope)"
              />
            </q-popup-edit>
          </q-td>
        </template>
        <template v-slot:body-cell-production_sort_order_of_the_day="props">
          <q-td
            class="w-125"
            key="desc"
            :props="props"
            :class="isOuted(props.row)"
          >
            {{ props.row.production_sort_order_of_the_day }}
            <q-popup-edit
              v-model="props.row.production_sort_order_of_the_day"
              title="序列"
              auto-save
              v-slot="scope"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
        </template>
        <template v-slot:body-cell-shipping_status="props">
          <q-td
            key="shipping_status"
            :props="props"
            class="w-125"
            :class="isOuted(props.row)"
          >
            {{ productStatus(props.row.shipping_status) }}
          </q-td>
        </template>
        <template v-slot:body-cell-edit="props">
          <q-td key="edit" :props="props" :class="isOuted(props.row)">
            <!-- <q-btn label="save" color="primary" @click="submitTime(props.row)" class="q-mx-md"/> -->
            <q-btn
              label="製作完畢"
              color="secondary"
              @click="submitFinish(props.row)"
            />
          </q-td>
        </template>
        <!-- <template v-slot:body-cell-delivery_name="props">
          <q-td key="name" :props="props" :class="isOuted(props.row)">
            <q-select
              dense
              v-model="props.row.delivery_name"
              :options="deliveryselect"
              @update:model-value="handleselect($event, props.row)"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-delivery_fee="props">
          <q-td key="fee" :props="props" :class="isOuted(props.row)">
            {{ props.row.delivery_fee }}
            <q-popup-edit
              v-model="props.row.delivery_fee"
              title="外送費"
              auto-save
              v-slot="scope"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="
                  handleselect(props.row.delivery_name, props.row, scope)
                "
              />
            </q-popup-edit>
          </q-td>
        </template> -->
        <template v-slot:bottom>
          <div class="row w-100 justify-end">
            <q-pagination
              v-model="pagination.page"
              :max="pagination.pages"
              :max-pages="6"
              direction-links
              boundary-links
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
              active-color="pink-5"
              color="black"
            />
          </div>
        </template>
      </q-table>
    </div>
  </div>
  <!-- dialog -->
  <!-- <q-dialog v-model="driverdialog" full-width>

    <div class="row w-100">

      <DriverDialog class="col-12" @close="driverdialog = false" />

    </div>
  </q-dialog> -->
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted, computed } from 'vue'
import { apiAuth, apiShit } from 'src/boot/axios' //, api
import { debounce, useQuasar } from 'quasar' // exportFile
import { UseMealStore } from 'src/stores/meal.js'
import { DateTime } from 'luxon'
// import DriverDialog from 'src/components/DriverDialog.vue'
// import PaymentTable from 'src/components/PaymentTable.vue'
import { useDeliveryStore } from 'src/stores/delivery'
// import { saveAs } from 'file-saver'

const delivery = useDeliveryStore()
const meal = UseMealStore()
const today = DateTime.now().toFormat('yyyy-MM-dd')
const timenow = ref('')
// 多久提醒
const alertminute = ref(60)
const timer = ref(25)
const interval = computed(() => {
  return timer.value * 1000
})

setInterval(() => {
  timenow.value = DateTime.now().toFormat('HH:mm:ss')
}, 1000)

console.log(today)
// const route = useRoute()
const $q = useQuasar()
const orders = ref([])
// const driverdialog = ref(false)
const visibleColumns = ref([
  'id',
  // 'status_name',
  'personal_name',
  'mobile',
  'payment_company',
  'shipping_road',
  // 'production_start_time',
  'production_ready_time',
  'delivery_time_range',
  // 'production_sort_order_of_the_day',
  'shipping_status',
  // 'delivery_date_ymd',
  // 'status_name',
  // 'payment_unpaid',
  // 'payment_method',
  'edit'
  // 'delivery_id',
  // 'delivery_name',
  // 'delivery_phone',
  // 'delivery_cartype',
  // 'delivery_fee'
])
const datesNeedtoGet = ref({
  start: '',
  end: ''
})
// ---------------------------------------
const deliveryselect = ref([])
const orderStatus = [
  { label: '製餐中', value: 1 },
  { label: '已製餐', value: 2 },
  { label: '未製餐', value: 0 }
]
const productStatus = (val) => {
  const result = orderStatus.find((status) => status.value === val)
  return result.label ? result.label : val
}
// const paymentMethod = [
//   { label: '全部', value: '' },
//   { label: '現金', value: 'cash' },
//   { label: '預付款', value: 'credit' },
//   { label: '轉帳', value: 'wire' },
//   { label: '月結', value: 'debt' },
//   { label: 'uber', value: 'uber' }
// ]
// { label: '未確認', value: 101 },
// { label: '已確認', value: 103 },
// { label: '已確認待配餐', value: 116 },
// { label: '未結清', value: 117 },
// { label: '已結案', value: 118 },
// { label: '作廢', value: 115 }
const filters = reactive({
  filter_code: '',
  filter_personal_name: '',
  filter_phone: '',
  filter_payment_tin: '',
  filter_delivery_date: today,
  filter_is_payed_off: '',
  filter_payment_method: ''
})
const pagination = reactive({
  page: 1,
  rowsPerPage: 1000, // change this to control how many rows you want to display per page
  pages: 1000 // change this to control how many pages you want to display in the pagination
  // sortBy: 'payed'
})
const paginations = reactive({
  // sortBy: 'production_ready_time'
  // descending: false
})
// background color
const isOuted = (val) => {
  const format = 'HHmm'
  // 檢查 val.delivery_date 是否為 null 或 undefined
  if (val.delivery_date_ymd !== DateTime.now().toFormat('yyyy-MM-dd')) {
    // 處理無效的輸入，例如返回預設值
    return 'bg-white' // 或者是其他適當的處理方式
  }
  if (!val.delivery_date) {
    // 處理無效的輸入，例如返回預設值
    return 'bg-warning' // 或者是其他適當的處理方式
  }
  const d1 = DateTime.fromFormat(val.production_ready_time, format)
  const d2 = DateTime.now() // 直接使用 DateTime.now() 獲取當前時間
  // 檢查 d1 是否有效
  if (!d1.isValid) {
    // 處理無效的日期解析
    return 'bg-white' // 或者是其他適當的處理方式
  }
  const diff = Math.ceil(d1.diff(d2, 'minutes').minutes)
  // console.log(diff)
  // 比較日期
  if (diff <= alertminute.value && val.shipping_status !== 2) {
    // submitStart(val)
    return 'blinking-background'
  }
  if (d1 >= d2) {
    return 'bg-white'
  } else {
    return 'bg-warning'
  }
}
const filter = ref('')

const columns = [
  {
    name: 'id',
    label: '編號',
    align: 'left',
    field: 'code',
    sortable: true,
    style: 'font-size: 18px;'
  },
  {
    name: 'personal_name',
    label: '姓名',
    align: 'left',
    field: 'personal_name',
    style: 'font-size: 18px;'
  },
  {
    name: 'mobile',
    label: '手機',
    align: 'left',
    field: 'mobile',
    style: 'font-size: 18px;'
  },
  {
    name: 'telephone',
    label: '市話',
    align: 'left',
    field: 'telephone',
    style: 'font-size: 18px;'
  },
  {
    name: 'production_start_time',
    label: '製餐時間',
    align: 'left',
    sortable: true,
    field: 'production_start_time',
    style: 'font-size: 18px;'
  },
  {
    name: 'production_ready_time',
    label: '出餐時間',
    align: 'left',
    sortable: true,
    field: 'production_ready_time',
    style: 'font-size: 18px;'
  },
  {
    name: 'delivery_date_ymd',
    label: '送達日',
    align: 'left',
    sortable: true,
    field: 'delivery_date_ymd',
    style: 'font-size: 18px;'
  },
  {
    name: 'delivery_time_range',
    label: '時間範圍',
    align: 'left',
    sortable: true,
    field: 'delivery_time_range',
    style: 'font-size: 18px;'
  },
  {
    name: 'scheduled_payment_date',
    label: '預計付款日',
    align: 'left',
    sortable: true,
    field: 'scheduled_payment_date',
    style: 'font-size: 18px;'
  },
  {
    name: 'production_sort_order_of_the_day',
    label: '序列',
    align: 'left',
    sortable: true,
    field: 'production_sort_order_of_the_day',
    style: 'font-size: 18px;'
  },
  {
    name: 'status_name',
    label: '訂單狀態',
    align: 'left',
    sortable: true,
    field: 'status_name',
    style: 'font-size: 18px;'
  },
  {
    name: 'shipping_status',
    label: '製餐狀態',
    align: 'left',
    sortable: true,
    field: 'shipping_status',
    style: 'font-size: 18px;'
  },
  // {
  //   name: 'payment_method',
  //   label: '方式',
  //   align: 'left',
  //   sortable: true,
  //   field: 'payment_method',
  //   format: (val) => {
  //     const method = paymentMethod.find((method) => method.value === val)
  //     return method ? method.label : val
  //   },
  //   style: 'font-size: 18px;'
  // },
  // {
  //   name: 'payed',
  //   label: '狀態',
  //   align: 'left',
  //   field: 'is_payed_off',
  //   sortable: true,
  //   format: (val) => (val === true ? '已付款' : '未付款'), // 根據值來決定顯示文字
  //   style: 'font-size: 18px;'
  // },
  {
    name: 'payment_company',
    label: '公司',
    align: 'left',
    field: 'payment_company',
    style: 'font-size: 18px;'
  },
  {
    name: 'edit',
    label: 'edit',
    align: 'left',
    sortable: true,
    field: 'edit',
    style: 'font-size: 18px;'
  }
  // {
  //   name: 'delivery_id',
  //   label: '外送員編號',
  //   align: 'left',
  //   field: 'delivery_id',
  //   style: 'font-size: 18px;'
  // },
  // {
  //   name: 'delivery_name',
  //   label: '司機',
  //   align: 'left',
  //   field: 'delivery_name',
  //   style: 'font-size: 18px;'
  // },
  // {
  //   name: 'delivery_fee',
  //   label: '外送費',
  //   align: 'left',
  //   field: 'delivery_fee',
  //   style: 'font-size: 18px;'
  // },
  // {
  //   name: 'delivery_phone',
  //   label: '手機',
  //   align: 'left',
  //   field: 'delivery_phone',
  //   style: 'font-size: 18px;'
  // },
  // {
  //   name: 'delivery_cartype',
  //   label: '車種',
  //   align: 'left',
  //   field: 'delivery_cartype',
  //   format: (val) => {
  //     const cartype = delivery.transport.find(
  //       (cartype) => cartype.value === val
  //     )
  //     return cartype ? cartype.label : val
  //   },
  //   style: 'font-size: 18px;'
  // }
]

// --------------------------------
async function fetchOrderFilter () {
  try {
    // const regex = /(?![\u3105-\u3129])[a-zA-Z0-9\u3105-\u3129]{2,}/
    const shouldFetch = true
    console.log('fetchOrderFilter is triggered')
    if (shouldFetch) {
      // Add delay
      await new Promise((resolve) => setTimeout(resolve, 250))

      const response = await apiAuth.get('sale/order', {
        params: {
          ...filters,
          limit: 1000,
          page: pagination.page
        }
      })

      // Handle the response as needed
      // 首先按 delivery_time_range 排序
      const sortedData = response.data.data.sort((a, b) => {
        const timeA = a.production_ready_time
        const timeB = b.production_ready_time
        return timeA.localeCompare(timeB)
      })
      orders.value = await sortOrders(sortedData)
      // const deliveryDate = await delivery.getDeliveryDate(filters.filter_delivery_date)
      // console.log(deliveryDate)
      // for (let i = 0; i < orders.value.length; i++) {
      //   const result = deliveryDate.find(
      //     (item) => item.order_code === orders.value[i].code
      //   )
      //   console.log(result)
      //   orders.value[i] = { ...orders.value[i], ...result }
      // }

      pagination.pages = response.data.last_page
    }
  } catch (error) {
    console.error(error)
  }
}

// --------------------------------------
// const getDeliveryman = async () => {
//   await delivery.getDeliveryman()
//   deliveryselect.value = delivery.deliveryman
// }
// ----------------------------------------------------------------
watch(
  () => meal.reorderSuccess,
  (newValue) => {
    if (newValue === true) {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'error',
        position: 'bottom',
        message: '成功,已加入訂單!'
      })
      meal.reorderSuccess = false
      // fetchorder()
    }
  }
)
// ----------------------------------------------------------------
// const reset = () => {
//   filters.filter_shipping_road = ''
//   filters.filter_personal_name = ''
//   filters.filter_phone = ''
//   filters.filter_payment_company = ''
//   filters.filter_telephone = ''
//   filters.filter_delivery_date = today
//   filters.filter_status_id = ''
//   fetchOrderFilter()
// }

const truncate = (string, value) => {
  return string.length > value ? string.substring(0, value) + '...' : string
}
// const truncatecode = (string, value) => {
//   return string.length > value
//     ? string.substring(string.length - value)
//     : string
// }
const datepicker = ref(false)
const datepickerStart = ref(false)
const datepickerEnd = ref(false)
watch(
  () => [
    filters.filter_delivery_date,
    datesNeedtoGet.value.start,
    datesNeedtoGet.value.end
  ],
  () => {
    datepicker.value = false
    datepickerStart.value = false
    datepickerEnd.value = false
  }
)
watch(
  () => filters.filter_delivery_date,
  async (newValue, oldValue) => {
    console.log(`date changed from ${oldValue} to ${newValue}`)
    try {
      await fetchOrderFilter()
      orders.value.forEach((val) => {
        get(val)
      })
    } catch (error) {
      console.error('fetchOrderFilter failed:', error)
    }
  }
)
// 排序
async function sortOrders (data) {
  // 將數據分為兩部分
  const warningRows = data.filter((row) => isOuted(row) === 'bg-warning')
  const normalRows = data.filter((row) => isOuted(row) !== 'bg-warning')
  // 將沒有警告的行放在前面，有警告的行放在後面
  return [...normalRows, ...warningRows]
}

// -----------------------------------------------------------------------
// ----------------------------------------------------------------
let interval1
let interval2
const onmount = async () => {
  await fetchOrderFilter()
  interval1 = setInterval(async () => {
    await fetchOrderFilter()
  }, interval.value)
  console.log('sound is triggered')
  orders.value.forEach((val) => {
    get(val)
  })
  interval2 = setInterval(() => {
    console.log('sound is triggered')
    orders.value.forEach((val) => {
      get(val)
    })
  }, interval.value)
}
onMounted(async () => {
  onmount()
  // await getDeliveryman()
})

onUnmounted(() => {
  console.log('onUnmounted is triggered')
  clearInterval(interval1)
  clearInterval(interval2)
})
// ----------------------------------------------------------------
watch(
  () => alertminute.value,
  async (newValue, oldValue) => {
    console.log(`minute changed from ${oldValue} to ${newValue}`)
    try {
      if (newValue >= 10) {
        await debounce(fetchOrderFilter(), 1000)
      }
    } catch (error) {
      console.error('fetchOrderFilter failed:', error)
    }
  }
)
// ----------------------------------------------------------------
// 語音
const get = async (val) => {
  try {
    // console.log(val)
    if (val.delivery_date_ymd !== DateTime.now().toFormat('yyyy-MM-dd')) {
      // 處理無效的輸入，例如返回預設值
      console.log('not today')
      return // 或者是其他適當的處理方式
    }
    const outtime = val.production_ready_time
    // console.log(outtime, 'outtime')
    const time = DateTime.fromFormat(outtime, 'HHmm')
    // const timesaid = time.toFormat('a hh:mm')
    // 獲取當前時間
    const now = DateTime.now()
    // 計算差異（以分鐘為單位）
    const diff = Math.ceil(time.diff(now, 'minutes').minutes)
    // 檢查時間差
    console.log(diff, 'diff')
    const alertValues = [60, 40, 20, 10, 5]
    if (diff <= alertminute.value && diff > 0 && alertValues.includes(diff)) {
      const saying = `現在時刻${DateTime.now().toFormat('a hh:mm')},${
        val.payment_company
      },剩${diff}分`
      console.log(saying)
      await speak(saying)
      await submitStart(val)
    } else if (
      diff <= alertminute.value &&
      diff === 0 &&
      val.shipping_status !== 2
    ) {
      const saying = `現在時刻${DateTime.now().toFormat('a hh:mm')},${
        val.payment_company
      },已經遲到`
      console.log(saying)
      await speak(saying)
      // await submitFinish(val)
      // playAudio()
    } else if (
      diff <= alertminute.value &&
      Math.abs(diff % 10) === 0 &&
      val.shipping_status !== 2
    ) {
      const saying = `現在時刻${DateTime.now().toFormat('a hh:mm')},${
        val.payment_company
      },已經遲到${Math.abs(diff)}分`
      console.log(saying)
      await speak(saying)
      // await submitFinish(val)
      // playAudio()
    }
  } catch (error) {
    console.log(error)
  }
}

const synth = window.speechSynthesis
const speak = (val) => {
  const u = new SpeechSynthesisUtterance()
  const voices = synth.getVoices()
  let voiceFound = false
  for (const voice of voices) {
    if (voice.name === 'Microsoft Yating - Chinese (Traditional, Taiwan)') {
      u.voice = voice
      voiceFound = true
      break
    }
  }
  if (!voiceFound) {
    u.lang = 'zh-TW'
  }
  u.text = val
  u.rate = delivery.soundRate
  synth.speak(u)
}
// function playAudio () {
//   const audio = document.createElement('audio')
//   audio.src = '/alarm.mp3'
//   audio.play()
// }
// ---------------------------------------------------------

const updateForm = ref({
  code: '',
  production_start_time: '',
  production_ready_time: '',
  production_sort_order_of_the_day: ''
})

const clearUpdateForm = () => {
  updateForm.value.code = ''
  updateForm.value.production_start_time = ''
  updateForm.value.production_ready_time = ''
  updateForm.value.production_sort_order_of_the_day = ''
}

const submitUpdate = async (formValue) => {
  try {
    const { data } = await apiShit.post('/pay/updateTime', formValue)
    console.log(data)
    await fetchOrderFilter()
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'error',
      position: 'bottom',
      message: `成功${data.result.info},`
    })
    clearUpdateForm()
  } catch (error) {
    console.log(error)
  }
}

// const submitTime = async (val) => {
//   // eslint-disable-next-line camelcase
//   const { code, production_start_time, production_ready_time, production_sort_order_of_the_day } = val
//   // 僅更新這些屬性
//   // eslint-disable-next-line
//   updateForm.value = {
//     code,
//     // eslint-disable-next-line
//     production_start_time,
//     // eslint-disable-next-line
//     production_ready_time,
//     // eslint-disable-next-line
//     production_sort_order_of_the_day,
//     shipping_status: 0
//   }
//   await submitUpdate(updateForm.value)
// }
const submitStart = async (val) => {
  // eslint-disable-next-line camelcase
  const {
    code,
    // eslint-disable-next-line
    production_start_time,
    // eslint-disable-next-line
    production_ready_time,
    // eslint-disable-next-line
    production_sort_order_of_the_day,
  } = val
  // 僅更新這些屬性
  // eslint-disable-next-line
  updateForm.value = {
    code,
    // eslint-disable-next-line
    production_start_time,
    // eslint-disable-next-line
    production_ready_time,
    // eslint-disable-next-line
    production_sort_order_of_the_day,
    shipping_status: 1
  }
  if (val.shipping_status === 0) {
    await submitUpdate(updateForm.value)
  }
  // await submitUpdate(updateForm.value)
}
const submitFinish = async (val) => {
  // eslint-disable-next-line camelcase
  const { code, production_sort_order_of_the_day, production_ready_time } = val
  updateForm.value = {
    code,
    // eslint-disable-next-line
    production_ready_time,
    // eslint-disable-next-line
    production_sort_order_of_the_day,
    production_start_time: DateTime.now().toFormat('HHmm'),
    shipping_status: 2
  }
  await submitUpdate(updateForm.value)
}
const handleEnter = async (scope) => {
  scope.set()
  await submitAll(orders.value)
}

const submitAll = async (val) => {
  const newArray = val.map((item) => {
    // eslint-disable-next-line
    const {
      code,
      // eslint-disable-next-line
      production_start_time,
      // eslint-disable-next-line
      production_ready_time,
      // eslint-disable-next-line
      production_sort_order_of_the_day,
    } = item
    // eslint-disable-next-line
    return {
      code,
      // eslint-disable-next-line
      production_start_time,
      // eslint-disable-next-line
      production_ready_time,
      // eslint-disable-next-line
      production_sort_order_of_the_day,
    }
  })
  try {
    const { data } = await apiShit.post('/pay/updateTime/all', newArray)
    console.log(data)
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'error',
      position: 'bottom',
      message: '成功!' + data.success
    })
    await fetchOrderFilter()
  } catch (error) {
    console.log(error)
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      position: 'bottom',
      message: error
    })
  }
}
// const sentForm = ref({
//   order_code: '',
//   delivery_id: '',
//   name: '',
//   phone: '',
//   cartype: '',
//   fee: 0
// })
// const clearSentForm = () => {
//   sentForm.value.order_code = ''
//   sentForm.value.id = ''
//   sentForm.value.name = ''
//   sentForm.value.phone = ''
//   sentForm.value.cartype = ''
//   sentForm.value.fee = 0
// }
// const handleselect = async (val, row, scope) => {
//   if (scope) {
//     scope.set()
//   }
//   const { data } = await apiShit.get(`/delivery/id/${row.code}`)
//   const search = delivery.deliverymanFull.find((item) => item.name === val)
//   sentForm.value = {
//     order_code: row.code,
//     delivery_id: search.id,
//     name: search.name,
//     phone: search.phone,
//     cartype: search.cartype,
//     fee: scope?.value || row.delivery_fee ? row.delivery_fee : 0,
//     plate: search.plate,
//     date: row.delivery_date_ymd
//   }
//   console.log(sentForm.value)
//   if (data.message[0]) {
//     try {
//       await delivery.updateDelivery(sentForm.value)
//     } catch (error) {
//       console.log(error)
//     }
//   } else {
//     try {
//       await delivery.createDelivery(sentForm.value)
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   await fetchOrderFilter()
//   clearSentForm()
// }
</script>

<style lang="scss" scoped>
@import "../../css/payment.scss";
.w-125 {
  max-width: 125px;
}
.sticky-table {
  max-height: 800px;
  width: 100%;
  .q-table__top,
  thead tr {
    position: sticky;
    z-index: 1;
    background: #fff;
    &:first-child {
      top: 0;
    }
  }
  .q-table__middle,
  tbody tr {
    max-width: 100%;
  }
}
</style>
