<template>
  <div>
    <q-table
      :rows="orders"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :rows-per-page-options="[10]"
      :visible-columns="visibleColumns"
      selection="multiple"
  v-model:selected="selected"
  class="custom-header "
    >
      <template v-slot:top>
        <div class="q-pb-lg toolbar row w-100 items-center">
          <!-- <q-btn
            label="查會員"
            @click="searchMember()"
            color="green"
            class="q-mx-xs"
          /> -->
          <div class="col w-40px text-white q-mx-md q-ml-xl">搜尋</div>
          <q-input
            outlined
            v-model="filters.filter_shipping_road"
            label="送達路"
            class="q-mx-xs col inputradius"
          />
          <q-input
            outlined
            v-model="filters.filter_personal_name"
            label="姓名"
            class="q-mx-xs col inputradius"
          />
          <q-input
            outlined
            v-model="filters.filter_phone"
            label="手機或市話"
            class="q-mx-xs col inputradius"
          />
          <q-input
            outlined
            v-model="filters.filter_payment_tin"
            label="統編"
            class="q-mx-xs col inputradius"
          />
          <q-btn color="accent" class="printDocumentsBtn" label="多筆列印" @click="printDocuments"></q-btn>

          <div class="col"></div>
          <div class="col w-40px text-white q-mx-xs">篩選</div>
          <q-input
            outlined
            v-model="filters.filter_delivery_date"
            label="單日/起始"
            class="q-mx-md col inputradius"
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
  class="q-mx-md col inputradius"
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
            v-model="filters.filter_status_code"
            label="訂單狀態"
            :options="orderStatus"
            emit-value
            map-options
            class="q-mx-xs col inputradius"
          />
          <q-select
            outlined
            v-model="filters.source"
            label="來源"
            :options="orderSource"
            emit-value
            map-options
            class="q-mx-xs col inputradius"
          />
          <q-btn
            round
            flat
            color="white bg-transparent"
            icon="restart_alt"
            @click="reset"
            size="lg"
            class="q-mx-md"
          />
          <!-- <q-select
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
            class="col q-mx-xs"
          /> -->
        </div>
      </template>
           <template v-slot:body-selection="scope">
        <q-checkbox :model-value="scope.selected" @update:model-value="(val, evt) => { Object.getOwnPropertyDescriptor(scope, 'selected').set(val, evt) }" />
      </template>
           <template v-slot:header-selection="scope">
        <q-checkbox :model-value="scope.selected" @update:model-value="(val, evt) => { Object.getOwnPropertyDescriptor(scope, 'selected').set(val, evt) }" />
      </template>

      <!-- <template v-slot:header="props">
        <q-tr>
          <q-th></q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :style="{ 'font-size': '16px' }"
          >

            {{ col.label }}
          </q-th>
        </q-tr>
      </template> -->

      <template v-slot:body-cell-payment_company="props">
        <q-td class="w-120px" :props="props">
          {{ truncate(props.row.payment_company, 6) }}
        </q-td>
      </template>
      <template v-slot:body-cell-status_name="props">
        <q-td class="w-120px" :props="props">
          <q-btn
                :color="NoMeal(props.row)"
                :to="`/ordered/${props.row.id}`"
                style="min-width: 80.88px;"
                size="16.3px"
              >
              {{ truncate2(props.row.status_name, 3) }}
              </q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-preview="props">
        <q-td class="w-120px" :props="props">
          <q-btn
            color="warning text-black"
            rounded
            size="lg"
            label="餐點"
            @click="preview(props.row.id)"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-edit="props">
        <q-td auto-width :props="props">
          <q-fab
            color="warning"
            text-color="black"
            icon="keyboard_arrow_left"
            direction="left"
          >
            <q-btn-group rounded class="bg-warning">
              <q-btn
                color="warning text-black"
                rounded
                size="lg"
                label="再訂一次"
                @click="reorder(props.row.id)"
              />
              <q-btn
                color="warning text-pink-5 text-bold"
                rounded
                :to="`/ordered/${props.row.id}`"
                size="lg"
                label="修改"
              />
              <q-btn
                color="warning text-black"
                rounded
                size="lg"
                target="_blank"
                @click="printDocument(props)"
                label="列印"
              />
            </q-btn-group>
          </q-fab>
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
  <!-- 再訂一次 -->
  <q-dialog v-model="reorderdialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section class="q-mt-lg">
        <q-input
          v-model="meal.reOrderTime"
          filled
          label="送達時間範圍"
          style="font-size: 20px"
          mask="#### - ####"
          class="q-pa-xs w-100max"
          autofocus
          :input-style="{ fontSize: '20px' }"
        />
      </q-card-section>
      <q-card-section v-if="meal.reOrderTime">
        <q-btn
          color="primary"
          class="q-mb-xs w-100max"
          style="height: 60px; font-size: 20px"
        >
          <q-popup-proxy
            cover
            v-model="showDatePicker"
            transition-show="scale"
            transition-hide="scale"
            style="width: 800px"
          >
            <q-date
              v-model="meal.reOrderDate"
              @update:model-value="next()"
              mask="YYYY-MM-DD"
            >
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="取消" color="black" v-close-popup />
                <q-btn label="確認" color="primary" v-close-popup />
              </div>
            </q-date>
          </q-popup-proxy>
          <p class="q-ma-none">送達日 :</p>
          <p class="q-ma-none">{{ meal.reOrderDate }}</p>
        </q-btn>
        <q-badge
          color="white row justify-center "
          style="width: 170px; height: 50px; font-size: 20px; color: #000"
          class="q-mt-md w-100max"
        >
        </q-badge>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat color="black" label="Cancel" v-close-popup />
        <q-btn
          v-if="meal.reOrderDate && meal.reOrderTime"
          flat
          label="送出"
          @click="meal.reOrder(id)"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="previewDialog" full-width>
      <PreviewTable :order="previewOrder" />

        <div class="row w-100 justify-end">
      <q-btn
        round
        color="black"
        icon="close"
        @click="previewDialog = false"
        class="q-ma-none"
      />
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import PreviewTable from 'src/components/PreviewTable.vue'
// import { fileURLToPath } from 'url'
// import { dirname } from 'path'

// import { useRouter } from 'vue-router' // useRoute
import { apiAuth, apiFuck } from 'src/boot/axios' //, api
import { useQuasar } from 'quasar'
// import { UseSearchStore } from 'src/stores/search'
import { UseMealStore } from 'src/stores/meal.js'

const meal = UseMealStore()
// const router = useRouter()
// const route = useRoute()
const previewDialog = ref(false)
const previewOrder = ref([])
const id = ref('')
// const search = UseSearchStore()
const reorderdialog = ref(false)
const $q = useQuasar()
const orders = ref([])
const showDatePicker = ref(false)
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
const visibleColumns = ref([
  'id',
  'source',
  'status_name',
  'telephone',
  'personal_name',
  'mobile',
  'created_at',
  'payment_company',
  'shipping_road',
  'delivery_date'
])
const reorder = (val) => {
  reorderdialog.value = true
  id.value = val
}
// ---------------------------------------
const next = () => {
  showDatePicker.value = false
}
const orderStatus = [
  { label: '未確認', value: 'Pending' },
  { label: '已確認', value: 'Confirmed' },
  { label: '已確待配', value: 'CCP' },
  { label: '作廢', value: 'Void' }
]
const orderSource = [
  { label: '預購', value: '預購' },
  { label: 'pos', value: 'pos' }

]
const filters = reactive({
  filter_shipping_road: '',
  filter_personal_name: '',
  filter_phone: '',
  filter_payment_tin: '',
  filter_delivery_date: '',
  filter_delivery_date2: '',
  filter_status_code: '',
  sorce: ''
})
const pagination = reactive({
  page: 1,
  rowsPerPage: 10, // change this to control how many rows you want to display per page
  pages: 10
})
const filter = ref('')
const columns = [

  {
    name: 'id',
    label: '訂單編號',
    align: 'left',
    field: 'code',
    style: 'font-size: 16px;padding-left: 2px; padding-right: 2px;'
  }, {
    name: 'source',
    label: '來源',
    align: 'left',
    field: 'source',
    style: 'font-size: 16px;padding-left: 2px; padding-right: 2px;'
  },
  {
    name: 'personal_name',
    label: '姓名',
    align: 'left',
    field: 'personal_name',
    style: 'font-size: 22px;padding-left: 2px;  '
  },
  {
    name: 'mobile',
    label: '手機',
    align: 'left',
    field: 'mobile',
    style: 'font-size: 22px;padding-left: 0px; padding-right: 0px;'
  },
  {
    name: 'telephone',
    label: '市話',
    align: 'left',
    field: 'telephone',
    style: 'font-size: 18px;'
  },
  {
    name: 'payment_company',
    label: '公司',
    align: 'left',
    field: 'payment_company',
    style: 'font-size: 22px;'
  },
  {
    name: 'shipping_road',
    label: '送達路',
    align: 'left',
    field: 'shipping_road',
    style: 'font-size: 22px;'
  },
  {
    name: 'delivery_date_ymd',
    label: '送達日',
    align: 'left',
    required: true,
    sortable: true,
    field: 'delivery_date_ymd',
    style: 'font-size: 18px;'
  },
  {
    name: 'status_name',
    label: '狀態',
    align: 'left',
    field: 'status_name',
    style: 'font-size: 18px;'
  },
  {
    name: 'preview',
    label: '預覽',
    required: true,
    align: 'left',
    field: 'preview',
    sortable: false,
    style: 'font-size: 22px;'
  },
  {
    name: 'edit',
    label: '功能',
    required: true,
    align: 'left',
    field: 'id',
    sortable: false,
    style: 'font-size: 22px;'
  }
]
async function fetchorder () {
  try {
    const response = await apiAuth.get('sale/order', {
      params: {
        page: pagination.page
      }
    })
    orders.value = response.data.data
    pagination.pages = response.data.last_page
  } catch (error) {
    console.error(error)
  }
}
// --------------------------------
async function fetchOrderFilter () {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100))

    let filterDeliveryDateParam

    // 檢查結束
    if (filters.filter_delivery_date && filters.filter_delivery_date2) {
      // 都有範圍
      filterDeliveryDateParam = `${filters.filter_delivery_date}-${filters.filter_delivery_date2}`
    } else {
      // 或開始
      filterDeliveryDateParam = filters.filter_delivery_date
    }

    const response = await apiAuth.get('sale/order', {
      params: {
        ...filters,
        filter_delivery_date: filterDeliveryDateParam, // 使用上面构造的日期参数
        filter_delivery_date2: undefined, // 确保不发送这个字段
        page: pagination.page
      }
    })

    // Handle the response as needed
    orders.value = response.data.data
    pagination.pages = response.data.last_page
  } catch (error) {
    console.error(error)
  }
}

// fiter換頁調整區
async function fetchDataAndResetPage (resetPage = false) {
  if (resetPage) {
    pagination.page = 1
  }

  await fetchOrderFilter()
}

// filter監聽
watch(() => ({ ...filters }), async () => {
  // console.log('Filters changed, fetching data for page 1')
  await fetchDataAndResetPage(true)
}, {
  deep: true
})

// 分頁監聽
watch(() => pagination.page, async (newPage, oldPage) => {
  if (newPage !== oldPage) {
    await fetchDataAndResetPage()
  }
})

// --------------------------------------

const NoMeal = (val) => {
  if (val.status_code === 'Pending') {
    return 'black'
  } else {
    return 'accent'
  }
}
const truncate2 = (string, value) => {
  // 首先检查字符串是否包含特定的子字符串 "確認待配餐"
  if (string && string.includes('確認待配餐')) {
    // 如果包含，再检查长度是否超出给定值
    return string.length > value ? ' 待配餐 ' : string
  } else {
    // 如果不包含 "確認待配餐"，直接返回原始字符串
    return string
  }
}
const selected = ref([])

// eslint-disable-next-line
// 多筆
const printDocuments = () => {
  const ids = selected.value.map(row => row.id).join(',')
  const url = `${apiFuck.defaults.baseURL}zh-Hant/sale/orders/printReceiveFormA4/${ids}`

  const printWindow = window.open(url, '_blank')

  if (printWindow) {
    printWindow.onload = function () {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  } else {
    console.error('無法打開新窗口')
  }
}
// 單筆
const printDocument = (val) => {
  console.log(apiFuck.defaults.baseURL)
  const url = `${apiFuck.defaults.baseURL}zh-Hant/sale/orders/printReceiveFormA4/${val.row.id}`
  console.log(url)

  // 打開新窗口
  const printWindow = window.open(url, '_blank')

  // 確保窗口成功打開
  if (printWindow) {
    // 等待窗口加載完成
    printWindow.onload = function () {
      // 延遲以確保所有內容都加載完成
      setTimeout(() => {
        printWindow.print() // 觸發打印
        printWindow.close() // 打印後關閉窗口
      }, 500)
    }
  } else {
    console.error('無法打開新窗口')
  }
}

// --------------------------------------
onMounted(() => {
  fetchorder()
})
// ----------------------------------------------------------------
watch(
  () => meal.reorderSuccess,
  (newValue) => {
    if (newValue === true) {
      $q.notify({
        color: 'primary',
        textColor: 'white',
        icon: 'error',
        position: 'center',
        message: '成功,已加入訂單!'
      })
      meal.reorderSuccess = false
      fetchorder()
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
  filters.filter_status_code = ''
  filters.source = ''
  fetchorder()
}

const truncate = (string, value) => {
  return string.length > value ? string.substring(0, value) + '...' : string
}
const datepicker = ref(false)
const datepicker2 = ref(false)
watch(
  () => filters.filter_delivery_date,
  () => {
    datepicker.value = false
  }
)
watch(() => filters.filter_delivery_date2, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    datepicker2.value = false
  }
})
watch(
  () => [pagination.page, filters],
  async ([newPage, newFilters]) => {
    // 檢查 filters 物件的所有屬性是否都是空字符串
    const allEmpty = Object.values(newFilters).every((value) => value === '')
    if (allEmpty) {
      // 如果所有屬性都是空字符串，則執行 fetchorder()
      await fetchorder()
    } else {
      // 否則執行 fetchOrderFilter()
      await fetchOrderFilter()
    }
  },
  { deep: true } // 深度觀察
)

const preview = async (val) => {
  meal.tableRows = []
  const { data } = await apiAuth.get(`sale/order/${val}`)
  data.order_products.forEach(async (item) => {
    await meal.insertDataIntoTableRows(item)
  })
  previewOrder.value = meal.tableRows
  console.log(previewOrder.value)
  previewDialog.value = true
}
// filters.filter_delivery_date
// ----------------------------------------
// const { ipcRenderer } = require('electron')
// // eslint-disable-next-line
// const printContent = (props) => {
//   const url = `${apiFuck.defaults.baseURL}zh-Hant/sale/orders/printReceiveForm/${props.row.id}`
//   console.log(url)
//   ipcRenderer.send('print', url)
// }
</script>
<style lang="scss" scoped>
.q-input {
  width: 150px;
}
.q-date {
  width: 800px;
}
.w-120px {
  max-width: 200px;
}

.w-100max {
  width: 100% !important;
}
.inputradius {
  background-color: #fff;
  border-radius: 6px;
  max-width: 150px !important;
}
.printDocumentsBtn{
  min-width: 80.88px;
                font-size:20.3px
}

</style>
