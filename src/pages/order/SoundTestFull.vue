<template>
  <div>
    <div class="row w-100 table-container">
      <!-- 表一 -->
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
          <div class="col-12 row q-pa-md items-center bg-dark ">
            <q-btn
              to="/search"
              round
              icon="home"
              color="primary"
            />
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
            <div class="text-h6 text-white">
              上午出餐 :{{Morningfinishquantity}}/{{ rowMorningquantity }}<br />
              下午出餐 :{{Afternoonfinishquantity}}/{{ rowAfternoonquantity }}<br>
              Total &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {{ rowTotal }}
            </div>
            <div class="text-h6 text-white q-mx-md">
              上午出餐潤餅 :{{Morningfinishburritoquantity}}/{{ Morningburritoquantity }}<br />
              下午出餐潤餅 :{{Afternoonfinishburritoquantity}}/{{ Afternoonburritoquantity }}<br>
              潤餅 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   : {{burritoquantity}}
            </div>
            <!-- <div class="text-h6 text-white q-mx-md">
              Total : {{ rowTotal }}
            </div> -->
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
            <q-btn
              @click="speak('測試播放')"
              label="測試"
              color="primary"
              class="q-mx-xs"
            />
           <div class="text-h4 text-white q-mx-md">
            {{ timenow }}
            </div>
            <q-slider
              v-model="delivery.soundRate"
              :min="0"
              :max="2"
              :step="0.1"
              label
              label-always
              style="width: 50px"
              :label-value="'速度:' + delivery.soundRate"
            />
            <!-- <q-btn
              @click="submitAll(orders)"
              label="儲存"
              color="white"
              class="text-black"
            /> -->

            <q-input
              outlined
              v-model="filters.filter_delivery_date"
              label="送達日"
              class="q-mx-xs col-1 inputsearch"
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
            <q-input

              v-model="week"

              class="q-mx-xs col columnWeek "
              readonly
            />
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
              @click="driverdialog = true"
              label="外送員設定"
              color="primary"
              class="q-mx-xs"
            />
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
              :style="{ 'font-size': '16px' }"
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
          <q-td class="w-130" :props="props" :class="isOuted(props.row)">
            {{ truncate(props.row.payment_company, 20) }}
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
              title="出發時間"
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
              title="出發時間"
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
            <q-btn  :color="buttonColor(props.row.shipping_status)" @click="submitFinish(props.row)">
              {{ productStatus(props.row.shipping_status) }}</q-btn
            >
          </q-td>
        </template>
        <template v-slot:body-cell-delivery_name="props">
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
        </template>
        <template v-slot:bottom>
          <div class="row w-100 justify-end">
            <!-- <div v-show="delay !== 0 || ontime !== 0" class="text-h5">
              遲到 : {{ delay }} , 準時:{{ ontime }} ,
            </div> -->
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
      <!-- 表二 -->
      <q-table
        class="w-100 sticky-table2"
        :rows="orders2"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :rows-per-page-options="[0]"
        :visible-columns="visibleColumns"
        v-model:pagination="paginations"
      >
        <template v-slot:top>
          <div class="col-12 row q-pa-md items-center bg-dark justify-center">

           <div v-show="delay !== 0 || ontime !== 0" class="text-h6 text-white">
            完單區 ,遲到 : {{ delay }} , 準時:{{ ontime }}
            </div>

          </div>
        </template>
        <template v-slot:header="props">
          <q-tr>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              :style="{ 'font-size': '16px' }"
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
          <q-td class="w-130" :props="props" :class="isOuted(props.row)">
            {{ truncate(props.row.payment_company, 20) }}
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
              title="出發時間"
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
              title="出發時間"
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
            <q-btn  :color="buttonColor(props.row.shipping_status)" @click="submitFinish(props.row)">
              {{ productStatus(props.row.shipping_status) }}</q-btn
            >
          </q-td>
        </template>
        <template v-slot:body-cell-delivery_name="props">
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
        </template>
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
  <q-dialog v-model="driverdialog" full-width>
    <div class="row w-100">
      <DriverDialog class="col-12" @close="driverdialog = false" />
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted, computed } from 'vue'
import { apiAuth, apiShit } from 'src/boot/axios' //, api
import { debounce, useQuasar } from 'quasar' // exportFile
import { UseMealStore } from 'src/stores/meal.js'
import { DateTime } from 'luxon'
import DriverDialog from 'src/components/DriverDialog.vue'
// import PaymentTable from 'src/components/PaymentTable.vue'
import { useDeliveryStore } from 'src/stores/delivery'
// import { saveAs } from 'file-saver'

const delivery = useDeliveryStore()
const meal = UseMealStore()
const today = DateTime.now().toFormat('yyyy-MM-dd')
const timenow = ref('')
// 多久提醒
const alertminute = ref(15)
const timer = ref(59)
const rowMorning = ref([])
const rowAfternoon = ref([])
// 05/17修改 增加上下午的總潤餅數和 上下午潤餅出餐數kevin
const rowMorningquantity = ref(0)
const rowAfternoonquantity = ref(0)
const Morningfinishquantity = ref(0)
const Afternoonfinishquantity = ref(0)
const rowMorningfinish = ref([])
const rowAfternoonfinish = ref([])
// const rowMorningburrito = ref([])
// const rowAfternoonburrito = ref([])
const Morningburritoquantity = ref(0)
const Afternoonburritoquantity = ref(0)
const Morningfinishburritoquantity = ref(0)
const Afternoonfinishburritoquantity = ref(0)
const burritoquantity = ref(0)
const rowTotal = computed(() => {
  return rowMorningquantity.value + rowAfternoonquantity.value
})
const interval = computed(() => {
  return timer.value * 1000
})

const week = computed(() => {
  const date = DateTime.fromISO(filters.filter_delivery_date)
  return date.weekdayLong
})
// clock
setInterval(() => {
  timenow.value = DateTime.now().toFormat('HH:mm:ss')
}, 1000)

console.log(today)
// const route = useRoute()
const $q = useQuasar()
const orders = ref([])
const orders2 = ref([])
const driverdialog = ref(false)
const visibleColumns = ref([
  'id',
  // 'status_name',
  'personal_name',
  'mobile',
  'payment_company',
  'shipping_road',
  // 'production_start_time',
  'godelivery_time',
  'production_ready_time',
  'delivery_time_range',

  // 'production_sort_order_of_the_day',
  // 'shipping_status',
  // 'delivery_date_ymd',
  // 'status_name',
  // 'payment_unpaid',
  // 'payment_method',
  'edit',
  // 'delivery_id',
  'delivery_name',
  'delivery_phone',
  // 'delivery_cartype',
  'delivery_fee'
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
  { label: '未製餐', value: 0 },
  { label: '已出餐', value: 3 }
]
const productStatus = (val) => {
  const result = orderStatus.find((status) => status.value === val)
  return result.label ? result.label : val
}

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
// calculate status
const delay = ref(0)
const ontime = ref(0)
const visible = ref(true)
const CalculateStatus = (val) => {
  visible.value = true
  console.log('calculating...')
  delay.value = 0
  ontime.value = 0
  val.forEach((val) => {
    const time1 = DateTime.fromFormat(val.production_start_time, 'HHmm')
    const time2 = DateTime.fromFormat(val.production_ready_time, 'HHmm')
    const diff = time2.diff(time1, 'minutes').minutes
    console.log(diff)
    if (diff >= 0) {
      ontime.value++
    } else if (diff < 0) {
      delay.value++
    } else if (isNaN(diff)) {
      ontime.value++
    }
  })
  visible.value = false
}
// background color
const isOuted = (val) => {
  const format = 'HHmm'
  // 檢查 val.delivery_date 是否為 null 或 undefined
  // if (val.delivery_date_ymd !== DateTime.now().toFormat('yyyy-MM-dd')) {
  //   // 處理無效的輸入，例如返回預設值
  //   return 'bg-white' // 或者是其他適當的處理方式
  // }
  if (!val.delivery_date) {
    // 處理無效的輸入，例如返回預設值
    return 'bg-warning' // 或者是其他適當的處理方式
  }
  const d1 = DateTime.fromFormat(val.production_ready_time, format)
  const d2 = DateTime.now()
  const d3 = DateTime.fromFormat(val.production_start_time, format)
  // 檢查 d1 是否有效
  if (!d1.isValid) {
    // 處理無效的日期解析
    return 'bg-white' // 或者是其他適當的處理方式
  }
  const diff = Math.ceil(d1.diff(d2, 'minutes').minutes)
  // console.log(diff, d1 >= d2)
  // 比較日期
  if (diff <= alertminute.value && val.shipping_status !== 3) {
    // submitStart(val)
    return 'blinking-background'
  }
  if (d1 >= d2 && (val.shipping_status !== 3)) {
    return 'bg-white'
  } else if (val.shipping_status === 3 && d1 < d3) {
    return 'bg-red-3'
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
    label: '完成時間',
    align: 'left',
    sortable: true,
    field: 'production_start_time',
    style: 'font-size: 18px;'
  },
  {
    name: 'production_ready_time',
    label: '預計出發時間',
    align: 'left',
    sortable: true,
    field: 'production_ready_time',
    style: 'font-size: 18px;'
  }, {
    name: 'godelivery_time',
    label: '外送員取餐時間',
    align: 'left',
    sortable: true,
    field: 'godelivery_time',
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
    label: '製餐狀態',
    align: 'left',
    sortable: true,
    field: 'edit',
    style: 'font-size: 18px;'
  },
  {
    name: 'delivery_id',
    label: '外送員編號',
    align: 'left',
    field: 'delivery_id',
    style: 'font-size: 18px;'
  },
  {
    name: 'delivery_name',
    label: '司機',
    align: 'left',
    field: 'delivery_name',
    style: 'font-size: 18px;'
  },
  {
    name: 'delivery_fee',
    label: '外送費',
    align: 'left',
    field: 'delivery_fee',
    style: 'font-size: 18px;'
  },
  {
    name: 'delivery_phone',
    label: '手機',
    align: 'left',
    field: 'delivery_phone',
    style: 'font-size: 18px;'
  },
  {
    name: 'delivery_cartype',
    label: '車種',
    align: 'left',
    field: 'delivery_cartype',
    format: (val) => {
      const cartype = delivery.transport.find(
        (cartype) => cartype.value === val
      )
      return cartype ? cartype.label : val
    },
    style: 'font-size: 18px;'
  }
]

// --------------------------------
// 取資料和整合數量
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
      rowMorning.value = []
      rowAfternoon.value = []
      // 分上下午
      response.data.data.forEach((order) => {
        // 假设每个订单都有一个production_ready_time属性，且其格式为HHMM（例如"1300"）
        const readyTime = order.production_ready_time

        // 将字符串转换为数字以便比较
        const readyTimeInt = parseInt(readyTime, 10)
        if (order.status_code !== 'Void') {
          // 检查production_ready_time是否小于1300
          if (readyTimeInt < 1300) {
          // 如果是上午（小于1300），则推送到rowMorning数组
            rowMorning.value.push(order)
          } else {
          // 否则，推送到rowAfternoon数组
            rowAfternoon.value.push(order)
          }
        }
      })
      rowMorningquantity.value = 0
      const morningPromises = rowMorning.value.map(async (val) => {
        const { data } = await apiAuth.get(`sale/order/${val.id}`)
        return data.order_products.reduce(
          (sum, item) => sum + item.quantity,
          0
        )
      })
      console.log(rowMorning)
      Promise.all(morningPromises).then((quantities) => {
        let sum = 0
        sum = quantities.reduce((sum, quantity) => sum + quantity, sum)
        rowMorningquantity.value = sum
        console.log(rowMorningquantity.value)
      })

      // 下午
      rowAfternoonquantity.value = 0
      const afternoonPromises = rowAfternoon.value.map(async (val) => {
        const { data } = await apiAuth.get(`sale/order/${val.id}`)
        return data.order_products.reduce(
          (sum, item) => sum + item.quantity,
          0
        )
      })
      Promise.all(afternoonPromises).then((quantities) => {
        let sum = 0
        sum = quantities.reduce((sum, quantity) => sum + quantity, sum)
        rowAfternoonquantity.value = sum
      })
      // 統計 已出餐/總套數 總潤餅 總出餐潤餅
      /// ////////////////////////////////////////////////////////////
      Morningfinishquantity.value = 0
      Afternoonfinishquantity.value = 0
      rowMorningfinish.value = []
      rowAfternoonfinish.value = []
      Morningburritoquantity.value = 0
      Afternoonburritoquantity.value = 0
      Morningfinishburritoquantity.value = 0
      Afternoonfinishburritoquantity.value = 0
      burritoquantity.value = 0
      const response2 = await apiAuth.get(`sale/order/getBurrito/${filters.filter_delivery_date}`)
      burritoquantity.value = response2.data.burrito_total
      Morningburritoquantity.value = response2.data.burrito_moring
      Afternoonburritoquantity.value = response2.data.burrito_afternoon
      Morningfinishburritoquantity.value = response2.data.burrito_finish_moring
      Afternoonfinishburritoquantity.value = response2.data.burrito_finish_afternoon
      // 上午
      // 已出餐 早上
      rowMorning.value.forEach((order) => {
        if (order.shipping_status === 3) {
          rowMorningfinish.value.push(order)
        }
      })
      const morningFinishPromises = rowMorningfinish.value.map(async (val) => {
        const { data } = await apiAuth.get(`sale/order/${val.id}`)
        return data.order_products.reduce(
          (sum, item) => sum + item.quantity,
          0
        )
      })
      Promise.all(morningFinishPromises).then((quantities) => {
        let sum = 0
        sum = quantities.reduce((sum, quantity) => sum + quantity, sum)
        Morningfinishquantity.value = sum
      })
      // 下午
      rowAfternoon.value.forEach((order) => {
        if (order.shipping_status === 3) {
          rowAfternoonfinish.value.push(order)
        }
      })

      const afternoonFinishPromises = rowAfternoonfinish.value.map(async (val) => {
        const { data } = await apiAuth.get(`sale/order/${val.id}`)
        return data.order_products.reduce(
          (sum, item) => sum + item.quantity,
          0
        )
      })
      Promise.all(afternoonFinishPromises).then((quantities) => {
        let sum = 0
        sum = quantities.reduce((sum, quantity) => sum + quantity, sum)
        Afternoonfinishquantity.value = sum
      })

      // /////////////////////////////////////////////////////////////////
      // Handle the response as needed
      // 首先按 delivery_time_range 排序
      const sortedData = response.data.data.sort((a, b) => {
        const timeA = a.production_ready_time
        const timeB = b.production_ready_time
        return timeA.localeCompare(timeB)
      })
      const filteredItems = sortedData.filter(
        (item) => item.status_code !== 'Void'
      )
      orders.value = await sortOrders(filteredItems)
      orders2.value = await sortOrders2(filteredItems)
      const deliveryDate = await delivery.getDeliveryDate(
        filters.filter_delivery_date
      )
      for (let i = 0; i < orders.value.length; i++) {
        const result = deliveryDate.find(
          (item) => item.order_code === orders.value[i].code
        )
        // console.log(result)
        orders.value[i] = { ...orders.value[i], ...result }
      }
      for (let i = 0; i < orders2.value.length; i++) {
        const result = deliveryDate.find(
          (item) => item.order_code === orders2.value[i].code
        )
        // console.log(result)
        orders2.value[i] = { ...orders2.value[i], ...result }
      }

      pagination.pages = response.data.last_page
    }
  } catch (error) {
    console.error(error)
  }
}

// --------------------------------------
const getDeliveryman = async () => {
  await delivery.getDeliveryman()
  deliveryselect.value = delivery.deliveryman
}
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
        processDelivery(val)
      })
      CalculateStatus(orders2.value)
    } catch (error) {
      console.error('fetchOrderFilter failed:', error)
    }
  }
)
// 排序
async function sortOrders (data) {
  // 將數據分為兩部分
  const loadingRow = data.filter(
    (row) => isOuted(row) === 'blinking-background'
  )
  // const warningRows = data.filter((row) => isOuted(row) === 'bg-warning')
  // const delayRows = data.filter((row) => isOuted(row) === 'bg-red-3')
  const normalRows = data.filter((row) => isOuted(row) === 'bg-white')
  // 將沒有警告的行放在前面，有警告的行放在後面
  return [...loadingRow, ...normalRows]
}
// 排序2
async function sortOrders2 (data) {
  // 將數據分為兩部分

  const warningRows = data.filter((row) => isOuted(row) === 'bg-warning')
  const delayRows = data.filter((row) => isOuted(row) === 'bg-red-3')

  // 將沒有警告的行放在前面，有警告的行放在後面
  return [...delayRows, ...warningRows]
}

// -----------------------------------------------------------------------
// ----------------------------------------------------------------
let interval1
let interval2
const processOrders = async () => {
  console.log('sound is triggered')
  setTimeout(async () => {
    await saytime()
    orders.value.forEach((val) => {
      processDelivery(val)
    })
  }, 3000)
}

const onmount = async () => {
  try {
    await fetchOrderFilter()
    CalculateStatus(orders2.value)
    processOrders()
    interval1 = setInterval(async () => {
      await fetchOrderFilter()
      CalculateStatus(orders2.value)
    }, interval.value)
    interval2 = setInterval(processOrders, interval.value)
  } catch (error) {
    console.error('Error during onmount:', error)
  }
}

onMounted(() => {
  onmount()
  getDeliveryman().catch((error) =>
    console.error('Error getting deliveryman:', error)
  )
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
  console.log(u.text)
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
  production_sort_order_of_the_day: '',
  godelivery_time: ''
})

const clearUpdateForm = () => {
  updateForm.value.code = ''
  updateForm.value.production_start_time = ''
  updateForm.value.production_ready_time = ''
  updateForm.value.production_sort_order_of_the_day = ''
  updateForm.value.godelivery_time = ''
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

const submitStart = async (val) => {
  // eslint-disable-next-line camelcase
  const {
    code,
    // eslint-disable-next-line
    production_start_time,
    // eslint-disable-next-line
    production_ready_time,
    // eslint-disable-next-line
    production_sort_order_of_the_day
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
// 按鈕顏色
const buttonColor = (status) => {
  switch (status) {
    case 0: // 未製餐
      return 'red'
    case 2: // 已製餐
      return 'secondary'
    case 3: // 已出餐
      return 'blue'
    default:
      return 'secondary' // 默認顏色
  }
}

// 送出
const submitFinish = async (val) => {
  // eslint-disable-next-line camelcase
  const { code, production_sort_order_of_the_day, production_ready_time, shipping_status: shippingStatus } = val
  let nextStatus
  let godelivery = ''
  switch (shippingStatus) {
    case 0: // 未製餐 -> 已製餐
      nextStatus = 2
      break
    case 2: // 已製餐 -> 已出餐
      nextStatus = 3
      break
    case 3: // 已出餐 -> 未製餐
      nextStatus = 0
      break
    default:

      nextStatus = 0
  }

  if (nextStatus === 3) {
    godelivery = DateTime.now().toFormat('HH:mm:ss') // 24小时制时间格式
  }
  updateForm.value = {
    code,
    // eslint-disable-next-line
    production_ready_time,
    // eslint-disable-next-line
    production_sort_order_of_the_day,
    production_start_time: DateTime.now().toFormat('HHmm'),
    shipping_status: nextStatus,
    godelivery_time: godelivery
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
const sentForm = ref({
  order_code: '',
  delivery_id: '',
  name: '',
  phone: '',
  cartype: '',
  fee: 0
})
const clearSentForm = () => {
  sentForm.value.order_code = ''
  sentForm.value.id = ''
  sentForm.value.name = ''
  sentForm.value.phone = ''
  sentForm.value.cartype = ''
  sentForm.value.fee = 0
}
const handleselect = async (val, row, scope) => {
  if (scope) {
    scope.set()
  }
  const { data } = await apiShit.get(`/delivery/id/${row.code}`)
  const search = delivery.deliverymanFull.find((item) => item.name === val)
  sentForm.value = {
    order_code: row.code,
    delivery_id: search.id,
    name: search.name,
    phone: search.phone,
    cartype: search.cartype,
    fee: scope?.value || row.delivery_fee ? row.delivery_fee : 0,
    plate: search.plate,
    date: row.delivery_date_ymd
  }
  console.log(sentForm.value)
  if (data.message[0]) {
    try {
      await delivery.updateDelivery(sentForm.value)
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      await delivery.createDelivery(sentForm.value)
    } catch (error) {
      console.log(error)
    }
  }
  await fetchOrderFilter()
  clearSentForm()
}

const saytime = async () => {
  const time = DateTime.now()
  // const minutearray = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
  const minutearray = [0, 15, 30, 45]
  const saying = `現在時刻${time.toFormat('a hh:mm')}`
  if (minutearray.includes(time.minute)) {
    speak(saying)
    const results = await Promise.all(
      orders.value.map((val) => processDelivery(val, 'withTime'))
    )
    results.forEach((result) => {
      if (result.message) {
        speak(result.message)
      }
    })
  }
}

const processDelivery = async (val, mode) => {
  try {
    if (val.delivery_date_ymd !== DateTime.now().toFormat('yyyy-MM-dd')) {
      return { status: 'no' }
    }

    const outtime = val.production_ready_time
    const time = DateTime.fromFormat(outtime, 'HHmm')
    const now = DateTime.now()
    const diff = Math.ceil(time.diff(now, 'minutes').minutes)

    const nameOrCompany = val.payment_company || val.personal_name
    let saying = ''

    if (mode === 'withTime') {
      if (diff > 0 && diff <= alertminute.value) {
        if (diff === 5 && val.shipping_status === 0) {
          saying = `${nameOrCompany},剩5分`
          await speak(saying)
          return { status: 'no', message: saying }
        }
        if (val.shipping_status === 0) {
          saying = `十五分鐘內嬰出餐${nameOrCompany}`
          await speak(saying)
          await submitStart(val)
          return { status: 'yes', message: saying }
        }
        // else if (val.shipping_status === 2) {
        //   saying = `十五分鐘內嬰出餐${nameOrCompany}`
        // }
      }
    } else {
      if (diff <= 0) {
        const lateMinutes = Math.abs(diff)
        if (lateMinutes % 5 === 0 && lateMinutes > 0) {
          if (val.shipping_status === 0) {
            saying = `${nameOrCompany},已經遲到${lateMinutes}分`
          } else if (val.shipping_status === 2) {
            saying = `${nameOrCompany},已經遲到${lateMinutes}分未送出`
          }
          await speak(saying)
          return { status: 'no', message: saying }
        }
      }
    }
    return { status: 'no' }
  } catch (error) {
    console.error(error)
    return { status: 'error' }
  }
}

// const saytime = async () => {
//   const time = DateTime.now()
//   const minutearray = [0, 15, 30, 45]
//   const saying = `現在時刻${time.toFormat('a hh:mm')}`
//   if (minutearray.includes(time.minute)) {
//     speak(saying)
//     const results = await Promise.all(
//       orders.value.map((val) => processDelivery(val, 'withTime'))
//     )
//     const shouldSpeak = results.some((result) => result === 'yes')
//     if (shouldSpeak) {
//       const saying = '十五分鐘內嬰出餐'
//       speak(saying)
//     }
//   }
// }
// // 語音固定// 語音接續

// const processDelivery = async (val, mode) => {
//   try {
//     if (val.delivery_date_ymd !== DateTime.now().toFormat('yyyy-MM-dd')) {
//       console.log('not today')
//       return 'no'
//     }

//     if ((val.shipping_status === 2 || val.shipping_status === 3)) {
//       console.log('already shipped')
//       return 'no'
//     }

//     const outtime = val.production_ready_time
//     const time = DateTime.fromFormat(outtime, 'HHmm')
//     const now = DateTime.now()
//     const diff = Math.ceil(time.diff(now, 'minutes').minutes)
//     console.log(diff, 'diff')

//     const nameOrCompany = val.payment_company || val.personal_name // 使用 payment_company 或 personal_name

//     if (mode === 'withTime') {
//       if (diff > 0 && diff <= alertminute.value) {
//         const saying = nameOrCompany
//         await speak(saying)
//         await submitStart(val)
//         return 'yes'
//       }
//     } else {
//       if (diff > 0 && diff <= alertminute.value) {
//         if (diff === 5) {
//           const saying = `${nameOrCompany},剩5分`
//           await speak(saying)
//           return 'no'
//         }
//       } else if (diff <= 0 && (val.shipping_status !== 2 && val.shipping_status !== 3)) {
//         const lateMinutes = Math.abs(diff)
//         if (lateMinutes % 5 === 0 && lateMinutes > 0) {
//           // 確保 lateMinutes 是 5 的倍數且大於 0
//           const saying = `${nameOrCompany},已經遲到${lateMinutes}分`
//           await speak(saying)
//           return 'no'
//         }
//       }
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }
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

</script>

<style lang="scss" scoped>
@import "../../css/payment.scss";
.w-125 {
  max-width: 125px;
}
.table-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 或你想要的最大高度 */
  width: 100%;
}

.sticky-table {
  max-height: 67vh;
  width: 100%;
  overflow-y: auto; /* 允许内容滚动 */
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
  @media(min-width:1300px){
    max-height: 60vh;

  }
}
.sticky-table2 {
  flex: 1;
  overflow-y: auto; /* 允许内容滚动 */
  min-height: 0; /* 重要：允许缩小到最小高度 */
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
  @media(min-width:1300px){

  }
}
</style>
