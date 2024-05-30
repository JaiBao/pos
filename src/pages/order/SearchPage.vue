<template>
  <div class="row w-100">
    <div class="col-12 row items-center bg-dark justify-center q-py-md">
      <div class="col-1 text-h5 text-white">搜尋</div>
      <q-input
        standout="bg-pink-2 text-black"
        v-model="filters.filter_personal_name"
        label="姓名"
        class="q-mx-xs col inputsearch"
      />
      <q-input
        standout="bg-pink-2 text-black"
        v-model="filters.filter_phone"
        label="手機或市話"
        class="q-mx-xs col inputsearch"
      />
      <!-- <q-input
        standout="bg-pink-2 text-black"
        v-model="filters.filter_payment_company"
        label="公司"
        class="q-mx-xs col inputsearch"
      />
      <q-input
        standout="bg-pink-2 text-black"
        v-model="filters.filter_payment_tin"
        label="統編"
        class="q-mx-xs col inputsearch"
      /> -->
      <q-btn
        flat
        size="21px"
        icon="restart_alt"
        color="white"
        class="q-mx-xs col-1 bg-transparent"
        @click="reset"
      />
      <!-- <q-btn
        size="21px"
        label="新會員"
        color="primary"
        class="q-mx-xs col-1"
        @click="newmemberadd"
      /> -->
    </div>
    <div class="col-12 row">
      <div class="col-8">
        <q-table
          :rows="orders"
          :columns="columns"
          row-key="id"
          :rows-per-page-options="[10]"
          class="tableBorder"
        >
          <template v-slot:top>
            <div
              class="row w-100 justify-center items-center q-py-md bg-negative"
            >
              <div class="text-center text-h5 q-mx-md">訂單</div>
              <div class="col-1">
                <q-btn
                  round
                  flat
                  icon="add"
                  class="q-mx-xs"
                  @click="newmemberadd"
                />
              </div>
              <div class="col-2">
                <q-btn
                  outline
                  class="uberBtn q-mx-xs"
                  label="門市客 / uber"
                  @click="uberCustomer()"
                />
              </div>
            </div>
          </template>
          <template v-slot:header>
            <!-- <q-tr>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              :style="{ 'font-size': '14px' }"
            >
              {{ col.label }}
            </q-th>
          </q-tr> -->
          </template>
          <template v-slot:body-cell="props">
            <q-td :props="props" :class="isOuted(props.row)">
              {{ props.value }}
            </q-td>
          </template>
          <template v-slot:body-cell-id="props">
            <q-td auto-width :props="props" :class="isOuted(props.row)">
              {{ props.row.code }}
            </q-td>
          </template>
          <template v-slot:body-cell-personal_name="props">
            <q-td auto-width :props="props" :class="isOuted(props.row)">
              {{ props.row.personal_name }}
            </q-td>
          </template>
          <template v-slot:body-cell-mobile="props">
            <q-td auto-width :props="props" :class="isOuted(props.row)">
              {{ props.row.mobile }}
            </q-td>
          </template>
          <template v-slot:body-cell-payment_company="props">
            <q-td class="w-100" :props="props" :class="isOuted(props.row)">
              {{ truncate(props.row.payment_company, 5) }}
            </q-td>
          </template>
          <template v-slot:body-cell-edit="props">
            <q-td auto-width :props="props" :class="isOuted(props.row)">
              <q-btn

                flat
                color="text-black"
                size="16.3px"
                label="餐點"
                class="q-ml-md"
                @click="preview(props.row.id)"
              />
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
          <template v-slot:body-cell-payed="props">
            <q-td auto-width :props="props" :class="isOuted(props.row)">
              <q-btn
                v-show="!props.row.is_payed_off"
                color="pink-5"
                @click="editMoney(props.row.id)"
                size="16.3px"
              >
                {{ props.row.is_payed_off ? "" : " 未付款 " }}
              </q-btn>
            </q-td>
          </template>
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

          <template v-slot:bottom>
            <div class="row w-100 justify-center">
              <q-pagination
                v-model="orderPagination.page"
                :max="orderPagination.pages"
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
      <div class="col-4">
        <q-table
          :rows="member"
          :columns="columns2"
          row-key="id"
          :rows-per-page-options="[10]"
          class="tableBorder"
        >
          <template v-slot:top>
            <div
              class="row w-100 justify-center items-center q-py-md bg-warning"
            >
              <div class="text-center text-h5 q-mx-md">會員</div>
              <div class="col-1">
                <q-btn flat round class="q-mx-xs col-1" />
                <!--icon="add"  to="/member/create"  -->
              </div>
            </div>
          </template>
          <template v-slot:header>
            <!-- <q-tr>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              :style="{ 'font-size': '12px' }"
            >
              {{ col.label }}
            </q-th>
          </q-tr> -->
          </template>
          <template v-slot:body-cell-payment_company="props">
            <q-td :props="props">
              {{ truncate(props.row.payment_company, 6) }}
            </q-td>
          </template>
          <template v-slot:body-cell-edit="props">
            <q-td :props="props">
              <q-btn flat size="16.3px" color="transparent" />
            </q-td>
          </template>
          <template v-slot:body-cell-comment="props">
            <q-td :props="props">
              <q-btn
                v-show="props.row.comment"
                size="md"
                icon="question_mark"
                round
                :to="`/member/${props.row.id}`"
              >
                <q-tooltip class="bg-purple text-h5" :offset="[10, 10]">
                  <div v-html="props.row.comment"></div>
                </q-tooltip> </q-btn
            ></q-td>
          </template>
          <template v-slot:bottom>
            <div class="row w-100 justify-center">
              <q-pagination
                v-model="memberPagination.page"
                :max="memberPagination.pages"
                :max-pages="3"
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
  </div>
  <!-- dialog -->
  <q-dialog full-width v-model="dialog">
    <q-card class="bg-light row w-100">
      <PaymentTable class="bg-white" :order="order" @close="dialog = false"/>
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
import { watchEffect, reactive, ref, watch } from 'vue'
import { apiAuth } from 'src/boot/axios'
import { UseMemberStore } from 'src/stores/member.js'
import { useRouter } from 'vue-router'
import PaymentTable from 'src/components/PaymentTable.vue'
import { usePaymentStore } from 'src/stores/payment'
import { useTagStore } from 'src/stores/tag'
import { UseMealStore } from 'src/stores/meal'

import { DateTime } from 'luxon'
import PreviewTable from 'src/components/PreviewTable.vue'
const payment = usePaymentStore()
const dialog = ref(false)
const members = UseMemberStore()
const meal = UseMealStore()
const tag = useTagStore()
// const today = DateTime.now().toFormat('yyyy-MM-dd')
// const nowMoment = ref(DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'))
const order = ref({})
const router = useRouter()
const orders = ref([])
const member = ref([])
const previewDialog = ref(false)
const previewOrder = ref([])
const filters = reactive({
  filter_personal_name: '',
  filter_phone: '',
  filter_payment_tin: '',
  filter_payment_company: '',
  filter_name: ''
})
const orderPagination = reactive({
  page: 1,
  rowsPerPage: 10, // 控制每页显示多少行
  pages: 10 // 总页数
})

const memberPagination = reactive({
  page: 1,
  rowsPerPage: 10, // 控制每页显示多少行
  pages: 10 // 总页数
})

async function fetchOrderFilter () {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const response = await apiAuth.get('sale/order', {
      params: {
        ...filters,
        page: orderPagination.page
      }
    })
    // Handle the response as needed
    orders.value = response.data.data
    orderPagination.pages = response.data.last_page
  } catch (error) {
    console.error(error)
  }
}

const isOuted = (val) => {
  const format = 'yyyy-MM-dd HH:mm:ss'

  // 檢查 val.delivery_date 是否為 null 或 undefined
  if (!val.delivery_date) {
    // 處理無效的輸入，例如返回預設值
    return 'bg-warning' // 或者是其他適當的處理方式
  }

  const d1 = DateTime.fromFormat(val.delivery_date, format)
  const d2 = DateTime.now() // 直接使用 DateTime.now() 獲取當前時間

  // 檢查 d1 是否有效
  if (!d1.isValid) {
    // 處理無效的日期解析
    return 'bg-white' // 或者是其他適當的處理方式
  }
  // 比較日期
  if (d1 >= d2) {
    return 'bg-white'
  } else {
    return 'bg-warning'
  }
}

const NoMeal = (val) => {
  if (val.status_code === 'Pending') {
    return 'black'
  } else {
    return 'accent'
  }
}
const editMoney = async (val) => {
  try {
    const response = await apiAuth.get(`sale/order/${val}`)
    order.value = response.data
  } catch (error) {
    console.error('Error fetching order:', error)
  }
  dialog.value = true
}
const truncate = (string, value) => {
  return (string || '').length > value
    ? string.substring(0, value) + '...'
    : string
}
const truncate2 = (string, value) => {
  return (string || '').length > value ? ' 待配餐 ' : string
}
watch(() => filters.filter_personal_name, async () => {
  filters.filter_name = filters.filter_personal_name
})
async function fetchmember () {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const response = await apiAuth.get('member/member', {
      params: {
        ...filters,
        page: memberPagination.page
      }
    })
    member.value = response.data.data
    memberPagination.pages = response.data.last_page
  } catch (error) {
    console.error(error)
  }
}

watchEffect(fetchOrderFilter)
watchEffect(fetchmember)

// 监控 filters 和相应的分页状态
watch(
  [() => filters, () => orderPagination.page],
  async () => {
    await fetchOrderFilter()
  },
  { deep: true }
)

watch(
  [() => filters, () => memberPagination.page],
  async () => {
    await fetchmember()
  },
  { deep: true }
)

// const copymember = async (val) => {
//   console.log(val)
//   await members.getmemberdetail(val)
//   members.shouldAddPerson = true
//   router.push('/Order')
// }
// const copydetail = async (val) => {
//   console.log(val)
//   members.shouldCopyPerson = true
//   members.justcopy(
//     val.telephone,
//     val.payment_tin,
//     val.shipping_road,
//     val.payment_company,
//     val.shipping_address1,
//     val.shipping_city_id,
//     val.shipping_state_id
//   )
//   await router.push('/Order')
// }
const newmemberadd = async () => {
  members.addpersontel(
    filters.filter_phone,
    filters.filter_payment_tin,
    filters.filter_personal_name
  )
  members.shouldAddPerson = true
  await router.push('/Order')
}

const reset = () => {
  filters.filter_personal_name = ''
  filters.filter_phone = ''
  filters.filter_payment_tin = ''
}
const columns = [
  {
    name: 'id',
    label: ' 訂單編號 ',
    align: 'left',
    field: 'code',
    style: 'font-size: 18px;'
  }, {
    name: 'source',
    label: ' 訂單編號 ',
    align: 'left',
    field: 'source',
    style: 'font-size: 18px;'
  },
  {
    name: 'personal_name',
    label: ' 姓名 ',
    align: 'left',
    field: 'personal_name',
    style: 'font-size: 18px;'
  },
  {
    name: 'mobile',
    label: ' 手機 ',
    align: 'left',
    field: 'mobile',
    style: 'font-size: 18px;'
  },
  {
    name: 'payment_company',
    label: ' 公司 ',
    align: 'left',
    field: 'payment_company',
    style: 'font-size: 18px;'
  },
  {
    name: 'delivery_date_ymd',
    label: ' 送達日 ',
    align: 'left',
    sortable: true,
    field: 'delivery_date_ymd',
    style: 'font-size: 18px;'
  },
  {
    name: 'edit',
    label: ' 功能 ',
    required: true,
    align: 'center',
    field: 'id',
    sortable: false,
    style: 'font-size: 18px;'
  },
  // {
  //   name: 'status_name',
  //   label: ' 狀態 ',
  //   align: 'left',
  //   field: 'status_name',
  //   style: 'font-size: 18px;'
  // },
  {
    name: 'payed',
    label: ' 狀態 ',
    align: 'left',
    field: 'is_payed_off',
    sortable: true,
    format: (val) => (val === true ? ' ' : ' 未付款 '), // 根據值來決定顯示文字
    style: 'font-size: 18px;'
  }
]
const columns2 = [
  {
    name: 'id',
    label: ' 會員編號 ',
    align: 'left',
    field: 'id',
    style: 'font-size: 18px;'
  },
  {
    name: 'name',
    required: true,
    label: ' 姓名 ',
    align: 'left',
    field: 'name',
    style: 'font-size: 18px;'
  },
  // {
  //   name: 'payment_company',
  //   label: ' 公司 ',
  //   align: 'left',
  //   field: 'payment_company',
  //   style: 'font-size: 18px;'
  // },
  {
    name: 'mobile',
    label: ' 手機 ',
    align: 'left',
    field: 'mobile',
    style: 'font-size: 18px;'
  },
  {
    name: 'comment',
    label: ' 備註 ',
    align: 'left',
    field: 'comment',
    style: 'font-size: 18px;'
  },
  {
    name: 'edit',
    label: ' 新訂單 ',
    required: true,
    align: 'left',
    field: 'id',
    sortable: false,
    style: 'font-size: 18px;'
  }
]
// 防抖
function debounce (func, wait) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}
const debouncedFetch = debounce(async () => {
  await fetchmember()
  await fetchOrderFilter()
}, 300)

watch(
  () => payment.sented,
  async (newValue, oldValue) => {
    console.log(`payment.sented changed from ${oldValue} to ${newValue}`)
    dialog.value = false
    try {
      await debouncedFetch()
      payment.sented = false
    } catch (error) {
      console.error('fetchOrderFilter failed:', error)
    }
  }
)
const uberCustomer = () => {
  tag.uberCustomer = true
  router.push('/Order')
}
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
</script>

<style lang="scss" scoped>
.tableBorder {
  border: 2px solid #ddd;
}
// .td{
//   width:80px !important;
// }

.q-table td {
  padding: 4px 7px !important;
}
.uberBtn {
  width: 200px;
  height: 30px;
  font-size: 15px;
  padding: 0;
}
</style>
