<template>
  <div>
    <div class="row w-100">
    <q-table
    class="w-100"
      :rows="orders"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :rows-per-page-options="[10]"
      :visible-columns="visibleColumns"
      v-model:pagination="paginations"
    >
      <template v-slot:top>
        <div class="col-12 row q-pa-md items-center bg-dark justify-center">
          <q-input
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
          />
          <q-input
            outlined
            v-model="filters.filter_delivery_date"
            label="單日/起始"
            class="q-mx-xs col inputsearch"
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
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            outlined
            v-model="filters.filter_delivery_date2"
            label="結束"
            class="q-mx-xs col inputsearch"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  v-model="datepicker2"
                  style="width: 800px"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filters.filter_delivery_date2"
                    mask="YYYY-MM-DD"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-select
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
            v-model="filters.source"
            label="來源"
            :options="orderSource"
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
          />
          <q-btn
            round flat
            icon="restart_alt"
            @click="reset"
            color="white"
            class="q-mx-xs"
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
          <q-btn
            round flat
            label="區間"
            @click="dialogTime = true"
            color="white"
            class="q-mx-xs"
            :loading="loading"
          />
          <q-btn
            round flat
            label="單日"
            @click="downloadOneday"
            color="white"
            class="q-mx-xs"
            :loading="loading"
          />
          <q-btn
            round flat
            label="收入統計"
            @click="opendialog3()"
            color="white"
            class="q-mx-xs"
          />
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
      <template v-slot:body-cell-id="props">
        <q-td class="text-center w-60px" :props="props">
          <a :href="`#/ordered/${props.row.id}`" target="_blank" class="noLinkStyle">
    <q-btn flat class="fs-20px">{{ props.row.code }}</q-btn>
  </a>
        </q-td>
        </template>
      <template v-slot:body-cell-payment_company="props">
        <q-td class="w-120px" :props="props">
          {{ truncate(props.row.payment_company, 6) }}
        </q-td>
      </template>
      <template v-slot:body-cell-invoice_date="props">
        <q-td class="w-120px" :props="props">
          {{ props.row.invoice_date }}
        </q-td>
      </template>
      <template v-slot:body-cell-invoice_num="props">
        <q-td class="w-120px" :props="props">
          {{ props.row.invoice_num }}
        </q-td>
      </template>
      <template v-slot:body-cell-edit="props">
        <q-td auto-width :props="props">
          <q-btn
            color="pink-5"
            @click="editMoney(props.row.id)"
            size="lg"
            round
            label="修改"
          />
        </q-td>

        <!-- <q-btn
            size="lg"
            color="primary"
            round
            dense
            :href="
              api.defaults.baseURL +
              `backend/zh-Hant/sale/orders/form/${props.row.id}`
            "
            target="_self"
            icon="edit"
          /> -->
      </template>
      <template v-slot:body-cell-invoice="props">
        <q-td auto-width :props="props" >
          <q-btn
            color="pink-5"
            @click="editInvoice(props.row.id)"
            size="lg"
            round
            label="發票"
          />
        </q-td>
      </template>
      <!-- v-if="props.row.name==='門市客'" -->
      <template v-slot:body-cell-meals="props">
        <q-td auto-width :props="props">
          <q-btn
            color="pink-5"
            @click="printMealsWithInvoice(props.row.id,props.row.customer_id)"
            size="lg"
            round
            label="門市客"
          />
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
  <q-dialog full-width v-model="dialog">
    <q-card class="bg-light row w-100">
      <PaymentTable class="bg-white" :order="order" @close="dialog=false"/>
    </q-card>
    <!-- //編輯發票視窗 -->
  </q-dialog>
  <q-dialog full-width v-model="dialog2">
    <q-card class="bg-light row w-100 q-pa-md justify-center">
      <InvoiceCreate class="bg-white" :order="order"  @close="closedialog2"/>
    </q-card>
  </q-dialog>
  <q-dialog  v-model="dialog3" @close="closedialog3">
    <q-card class="w-50 q-pa-md" style="font-size: 1.5em">
      <div style="padding-bottom: 1em">
        <span style="font-size:30px;font-weight: bold;">{{"單日營收"}}</span>
      </div>
      <div>
        <q-input
            outlined
            v-model="revenueDate"
            label="單日"
            class="q-mx-xs col inputsearch"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  v-model="datepicker3"
                  style="width: 800px"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="revenueDate"
                    mask="YYYY-MM-DD"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        <!--  -->
        <!-- <q-input
            outlined
            v-model="revenueDate"
            label="請選擇日期"
            class="q-mx-xs col inputsearch"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  v-model="datepicker3"
                  style="width: 800px"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="revenueDate"
                    mask="YYYY-MM-DD"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input> -->
        <span>{{"總營收:"}} {{ Revenue.total }}</span><span> &nbsp;{{"未付款:"}}{{ Revenue.not_pay }}</span><br>
      <span>{{"現金"}}&nbsp;&nbsp;&nbsp; {{":"}} {{ Revenue.cash }}</span><br>
      <span>{{"月結"}}&nbsp;&nbsp;&nbsp; {{":"}} {{ Revenue.debt }}</span><br>
      <span>{{"匯款"}}&nbsp;&nbsp;&nbsp; {{":"}} {{ Revenue.wire }}</span><br>
      </div>
    </q-card>
  </q-dialog>
  <q-dialog full-width v-model="dialogFunpoint">
    <q-card class="bg-light row w-100">
      <FunpointForm class="bg-white" :order="order"/>
    </q-card>
  </q-dialog>
  <q-dialog  v-model="dialogTime">
    <q-card class="bg-light row w-100">
      <q-linear-progress size="25px" :value="progress1" color="accent">
      <div class="absolute-full flex flex-center">
        <q-badge color="white" text-color="accent" :label="progressLabel1" />
      </div>
    </q-linear-progress>
      <q-input
            outlined
            v-model="datesNeedtoGet.start"
            label="開始"
            class="q-mx-xs col inputsearch"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  v-model="datepickerStart"
                  style="width: 800px"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="datesNeedtoGet.start"
                    mask="YYYY-MM-DD"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            outlined
            v-model="datesNeedtoGet.end"
            label="結束"
            class="q-mx-xs col inputsearch"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  v-model="datepickerEnd"
                  style="width: 800px"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="datesNeedtoGet.end"
                    mask="YYYY-MM-DD"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn @click="download" label="go" color="primary"/>
        </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed, onBeforeMount } from 'vue'
import { apiAuth } from 'src/boot/axios' //, api
// import { apiAuth, apiFuck } from 'src/boot/axios'
import { useQuasar } from 'quasar' // exportFile
import { UseMealStore } from 'src/stores/meal.js'
import { useInvoiceStore } from 'src/stores/invoice'
import { DateTime } from 'luxon'
import PaymentTable from 'src/components/PaymentTable.vue'
import InvoiceCreate from 'src/components/InvoiceCreate.vue'
import FunpointForm from 'src/components/FunpointForm.vue'
import { usePaymentStore } from 'src/stores/payment'
import * as XLSX from 'xlsx'
// import { saveAs } from 'file-saver'

const invoice = useInvoiceStore()
const payment = usePaymentStore()
const meal = UseMealStore()
const today = DateTime.now().toFormat('yyyy-MM-dd')
console.log(today)
// const route = useRoute()
const $q = useQuasar()
const orders = ref([])
const rowExcel = ref([])
const loading = ref(false)
const dialog = ref(false)
const dialog2 = ref(false)
const dialog3 = ref(false)
const dialogTime = ref(false)
const dialogFunpoint = ref(false)
const order = ref({})
const Revenue = ref({})
const revenueDate = ref(null)
const visibleColumns = ref([
  'id',
  'personal_name',
  'mobile',

  'invoice_date',
  'invoice_num',
  'invoicetimes',
  'payment_company',
  'shipping_road',
  'payment_total',
  'payed',
  'payment_unpaid',
  'scheduled_payment_date',
  'payment_method'
  // 'status_name',
])
const datesNeedtoGet = ref({
  start: '',
  end: ''
})
// ---------------------------------------
const editMoney = async (val) => {
  try {
    const response = await apiAuth.get(`sale/order/${val}`)
    order.value = response.data
  } catch (error) {
    console.error('Error fetching order:', error)
  }
  dialog.value = true
}

// 曾開過發票
const editInvoice = async (val) => {
  try {
    const response = await apiAuth.get(`sale/order/${val}`)
    order.value = response.data
  } catch (error) {
    console.error('Error fetching order:', error)
  }
  dialog2.value = true
}
const closedialog2 = async () => {
  dialog2.value = false
  await fetchOrderFilter()
}
const getRevenue = async () => {
  console.log(revenueDate.value)
  if (revenueDate.value) {
    try {
      const response = await apiAuth.get(`sale/order/getRevenue/${revenueDate.value}`)
      Revenue.value = response.data
    } catch (error) {
      console.error('Error fetching order:', error)
    }
  }
}
const closedialog3 = async () => {
  dialog3.value = false
}
const opendialog3 = async () => {
  dialog3.value = true
}
const orderStatus = [
  { label: '已付款', value: 1 },
  { label: '未付款', value: 0 },
  { label: '全部', value: '' }
]
const orderSource = [
  { label: '預購', value: '預購' },
  { label: 'pos', value: 'pos' }

]
const paymentMethod = [
  { label: '全部', value: '' },
  { label: '現金', value: 'cash' },
  { label: '預付款', value: 'credit' },
  { label: '轉帳', value: 'wire' },
  { label: '月結', value: 'debt' },
  { label: 'uber', value: 'uber' }
]
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
  filter_delivery_date: '',
  filter_delivery_date2: '',
  filter_is_payed_off: 0,
  filter_payment_method: '',
  source: ''
})
const pagination = reactive({
  page: 1,
  rowsPerPage: 10, // change this to control how many rows you want to display per page
  pages: 10
  // sortBy: 'payed'
})
const paginations = reactive({

  sortBy: 'payed'
})
const filter = ref('')

const columns = [
  {
    name: 'id',
    label: '編號',
    align: 'left',
    field: 'code',
    sortable: true,
    style: 'font-size: 16px;'
  },
  {
    name: 'edit',
    label: '功能',
    required: true,
    align: 'left',
    field: 'id',
    sortable: false,
    style: 'font-size: 18px;',
    skip: true
  },
  {
    name: 'invoice',
    label: '發票',
    required: true,
    align: 'left',
    field: 'invoice',
    sortable: false,
    style: 'font-size: 18px;',
    skip: true
  },
  // {
  //   name: 'meals',
  //   label: '門市客專用',
  //   required: true,
  //   align: 'left',
  //   field: 'invoice',
  //   sortable: false,
  //   style: 'font-size: 10px;',
  //   skip: true
  // },
  {
    name: 'personal_name',
    label: '姓名',
    align: 'left',
    field: 'personal_name',
    style: 'font-size: 22px;'
  },
  {
    name: 'mobile',
    label: '手機',
    align: 'left',
    field: 'mobile',
    style: 'font-size: 22px;'
  },
  {
    name: 'telephone',
    label: '市話',
    align: 'left',
    field: row => `${row.telephone_prefix}${row.telephone}`,
    style: 'font-size: 22px;'
  },
  {
    name: 'invoice_date',
    label: '發票日期',
    align: 'left',
    field: 'invoice_date',
    style: 'font-size: 22px;'
  },
  {
    name: 'invoice_num',
    label: '發票號碼',
    align: 'left',
    field: 'invoice_num',
    style: 'font-size: 22px;'
  },
  {
    name: 'invoicetimes',
    label: '發票次數',
    align: 'left',
    field: 'invoicetimes',
    style: 'font-size: 22px;'
  },
  {
    name: 'payment_total',
    label: '總金額',
    align: 'left',
    field: 'payment_total',
    format: (val) => parseInt(val),
    sortable: true,
    style: 'font-size: 22px;'
  },
  {
    name: 'payment_paid',
    label: '已付金額',
    align: 'left',
    field: 'payment_paid',
    format: (val) => parseInt(val),
    style: 'font-size: 22px;'
  },
  {
    name: 'payment_unpaid',
    label: '未付金額',
    align: 'left',
    field: 'payment_unpaid',
    format: (val) => parseInt(val),
    style: 'font-size: 22px;'
  },
  {
    name: 'status_name',
    label: '餐點狀態',
    align: 'left',
    sortable: true,
    field: 'status_name',
    style: 'font-size: 22px;'
  },
  {
    name: 'delivery_date_ymd',
    label: '送達日',
    align: 'left',
    sortable: true,
    field: 'delivery_date_ymd',
    style: 'font-size: 22px;'
  },
  {
    name: 'scheduled_payment_date',
    label: '預計付款日',
    align: 'left',
    sortable: true,
    field: 'scheduled_payment_date',
    style: 'font-size: 22px;'
  },
  {
    name: 'payment_method',
    label: '方式',
    align: 'left',
    sortable: true,
    field: 'payment_method',
    format: (val) => {
      const method = paymentMethod.find(method => method.value === val)
      return method ? method.label : val
    },
    style: 'font-size: 22px;'
  },
  {
    name: 'payed',
    label: '狀態',
    align: 'left',
    field: 'is_payed_off',
    sortable: true,
    format: (val) => val === true ? '已付款' : '未付款', // 根據值來決定顯示文字
    style: 'font-size: 22px;'
  },
  {
    name: 'payment_company',
    label: '公司',
    align: 'left',
    field: 'payment_company',
    style: 'font-size: 22px;'
  },
  {
    name: 'manual_invoice',
    label: '手開發票',
    align: 'left',
    field: 'manual_invoice',
    style: 'font-size: 22px;'
  }

]
// fetch excel data
const fetchorder = async () => {
  loading.value = true
  try {
    // 先獲取總頁數
    const initialResponse = await apiAuth.get('sale/order', {
      params: {
        per_page: 100,
        ...filters,
        limit: 1000
      }
    })
    const totalPages = initialResponse.data.last_page

    // 準備所有分頁請求的 promise 陣列
    const pageRequests = []
    for (let page = 1; page <= totalPages; page++) {
      pageRequests.push(
        apiAuth.get('sale/order', {
          params: {
            ...filters,
            limit: 1000,
            page
            // 同樣使用合理的 per_page 值
          }
        })
      )
    }

    // 同時發送所有分頁請求
    const pageResponses = await Promise.all(pageRequests)

    // 處理所有響應
    pageResponses.forEach(response => {
      rowExcel.value = rowExcel.value.concat(response.data.data)
    })
    loading.value = false
  } catch (error) {
    console.error(error)
  }
}

// --------------------------------
async function fetchOrderFilter () {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const requestParams = {
      ...filters,
      page: pagination.page
    }

    // 範圍調整
    if (filters.filter_delivery_date) {
      if (filters.filter_delivery_date2) {
        // 兩個都選便範圍
        requestParams.filter_delivery_date = `${filters.filter_delivery_date}-${filters.filter_delivery_date2}`
      } else {
        // 開始就只有開始
        requestParams.filter_delivery_date = filters.filter_delivery_date
      }
    }

    delete requestParams.filter_delivery_date2

    const response = await apiAuth.get('sale/order', {
      params: requestParams
    })

    const filteredItems = response.data.data.filter(item => item.status_code !== 'Void')

    for (let i = 0; i < filteredItems.length; i++) {
      const result = await invoice.searchInvoiceDate(filteredItems[i].code)
      console.log('這是result', result)
      filteredItems[i].invoicetimes = result
    }

    orders.value = filteredItems
    pagination.pages = response.data.last_page
  } catch (error) {
    console.error(error)
  }
}
// 門市客列印明細
// const printMealsWithInvoice = async (val1, val2) => {
//   // 非門市客不能使用
//   if (val2 !== 8642) {
//     $q.notify({
//       color: 'red',
//       textColor: 'white',
//       icon: 'error',
//       position: 'center',
//       message: '該訂單不是門市客!'
//     })
//     return false
//   }
//   const url = `${apiFuck.defaults.baseURL}zh-Hant/sale/orders/printMealsWithInvoice/${val1}`

//   const printWindow = window.open(url, '_blank')

//   if (printWindow) {
//     printWindow.onload = function () {
//       setTimeout(() => {
//         printWindow.print()
//         printWindow.close()
//       }, 500)
//     }
//   } else {
//     console.error('無法打開新窗口')
//   }
// }

// watch([() => pagination.page, filters], async (newValues, oldValues) => {
//   // newValues是一個數組，包含了pagination.page和filters的最新值
//   // oldValues是一個數組，包含了pagination.page和filters的舊值
//   console.log('watch is triggered', newValues)

//   await fetchOrderFilter()
// }, {
//   deep: true
// })

// filter監聽
watch(() => ({ ...filters }), async () => {
  // filter改變回到1page
  pagination.page = 1
  console.log('Filters changed, fetching data for page 1')
  await fetchOrderFilter()
}, {
  deep: true
})

// 分頁監聽
watch(() => pagination.page, async (newPage, oldPage) => {
  console.log(`Page changed from ${oldPage} to ${newPage}, fetching data.`)
  await fetchOrderFilter()
})
watch(() => filters.filter_delivery_date, async (newDate) => {
  revenueDate.value = newDate
  await getRevenue()
})

watch(revenueDate, async (newDate, oldDate) => {
  console.log('revenueDate changed from', oldDate, 'to', newDate)
  await getRevenue()
})

// --------------------------------------

// ----------------------------------------------------------------
watch(
  () => meal.reorderSuccess,
  (newValue) => {
    if (newValue === true) {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'error',
        position: 'center',
        message: '成功,已加入訂單!'
      })
      meal.reorderSuccess = false
      // fetchorder()
    }
  }
)
// ----------------------------------------------------------------
const reset = () => {
  filters.filter_shipping_road = ''
  filters.filter_personal_name = ''
  filters.filter_phone = ''
  filters.filter_payment_company = ''
  filters.filter_telephone = ''
  filters.filter_delivery_date = ''
  filters.filter_delivery_date2 = ''
  filters.filter_status_id = ''
  filters.source = ''
  fetchOrderFilter()
}

const truncate = (string, value) => {
  return string.length > value ? string.substring(0, value) + '...' : string
}
const datepicker = ref(false)
const datepicker2 = ref(false)
const datepicker3 = ref(false)
const datepickerStart = ref(false)
const datepickerEnd = ref(false)
watch(
  () => [filters.filter_delivery_date, filters.filter_delivery_date2, datesNeedtoGet.value.start, datesNeedtoGet.value.end],
  () => {
    datepicker.value = false
    datepicker2.value = false
    datepickerStart.value = false
    datepickerEnd.value = false
  }
)
watch(
  () => payment.sented,
  async (newValue, oldValue) => {
    console.log(`payment.sented changed from ${oldValue} to ${newValue}`)
    dialog.value = false
    try {
      await fetchOrderFilter()
      payment.sented = false
    } catch (error) {
      console.error('fetchOrderFilter failed:', error)
    }
  }
)
// -----------------------------------------------------------------------
function getDatesArray (start, end) {
  const dates = []
  let startDate = DateTime.fromFormat(start, 'yyyy-MM-dd')
  const endDate = DateTime.fromFormat(end, 'yyyy-MM-dd')

  while (startDate <= endDate) {
    dates.push(startDate.toISODate())
    startDate = startDate.plus({ days: 1 })
  }

  return dates
}
// ----------------------------------------------------------------
const downloadOneday = async () => {
  rowExcel.value = []
  await fetchorder()
  for (const item of rowExcel.value) {
    const invoicetimes = await invoice.searchInvoiceDate(item.code)
    item.invoicetimes = invoicetimes // 更新 invoicetimes
  }
  // console.log('發票次數', rowExcel.value)
  // console.log('發票次數2:', rowExcel.value.map(row => row.invoicetimes))

  await exportTable()
}

const exportTable = async () => {
  // 標題
  const headerRow = columns
    .filter((col) => !col.skip)
    .map((col) => col.label)

  // 數據
  const dataRows = rowExcel.value.map((row) =>
    columns
      .filter((col) => !col.skip)
      .map((col) => {
      // 獲取字段
        const rawValue = typeof col.field === 'function'
          ? col.field(row)
          : row[col.field === undefined ? col.name : col.field]

        // 有格式使用格式
        return col.format ? col.format(rawValue) : rawValue
      })
  )
  console.log(dataRows, '11111')
  // console.log('发票次数 for Excel:', dataRows) // 确保数据行中包含发票次数
  const content = [headerRow, ...dataRows]
  // console.log(' Excel 的完整内容:', content) // 检查 Excel 的完整内容
  // create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(content)

  // create worksheet
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')

  // export xlsx
  XLSX.writeFile(workbook, `ordersExport${filters?.filter_delivery_date}.xlsx`)
}
// 區間
const progress1 = ref(0)
const progressLabel1 = computed(() => (progress1.value * 100).toFixed(2) + '%')
const download = async () => {
  rowExcel.value = []
  const dates = getDatesArray(datesNeedtoGet.value.start, datesNeedtoGet.value.end)
  for (let i = 0; i < dates.length; i++) {
    filters.filter_delivery_date = dates[i]
    progress1.value = (i + 1) / dates.length
    await fetchorder()
  }
  for (const item of rowExcel.value) {
    const invoicetimes = await invoice.searchInvoiceDate(item.code)
    item.invoicetimes = invoicetimes // 更新 invoicetimes
  }
  await exportTable()
  progress1.value = 0
}

onBeforeMount(() => {
  fetchOrderFilter()
})

</script>
<style lang="scss" scoped>
@import '../../css/payment.scss';
.fs-20px{
  font-size: 20px !important;
  padding-left: 0;
  padding-right: 0;
}
</style>
