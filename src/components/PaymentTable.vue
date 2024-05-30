<template>
  <div class="row w-100 justify-end q-mt-md">
      <div class="col-1">
        <q-btn
        round
        icon="close"
        @click="emitClose"
        color="primary"
        class="text-white q-mr-md"
        />
      </div>
    </div>
  <div class="q-pa-xs column justify-center w-100 items-center q-mt-md">
    <div
      class="col w-50 text-center row items-center border bg-666 q-py-md q-pl-md"
    >
      <div class="text-h4 text-white">訂單編號 : {{ props.order?.code }}</div>
      <div class="col"></div>
      <!-- <q-btn
        label="一鍵付清"
        outline
        class="q-mx-lg btn-payed"
        size="20px"
        color="warning"
        @click="allisPayed()"
      /> -->
    </div>

    <div class="col w-50 text-center row items-center border">
      <div class="col-2"><div class="text-h6 text-white">付款狀態</div></div>
      <div class="col-10">
        <q-radio
          v-model="moneyForm.payed_off"
          val="1"
          label="已付清"
          class="radio-option"
        />
        <q-radio
          v-model="moneyForm.payed_off"
          val="0"
          label="未付清"
          class="radio-option"
        />
      </div>
    </div>
    <div class="col w-50 text-center row items-center border">
      <div class="col-2 text-white"><div class="text-h6">收款方式</div></div>
      <div class="col-10">
        <q-option-group
          v-model="moneyForm.method"
          :options="payment.options"
          color="primary"
          class="radio-option"
          inline
        />
      </div>
    </div>
    <div class="col w-50 text-center row items-center border">
      <div class="col-6 row items-center">
        <div class="col-4"><div class="text-h6 text-white">總金額</div></div>
        <div class="col-8">
          <q-input
          disable
            filled
            v-model="moneyForm.total"
            :input-style="{ 'font-size': '24px' }"
          />
        </div>
      </div>
      <div class="col-6 row items-center">
        <div class="col-4"><div class="text-h6 text-white">發票號碼</div></div>
        <div class="col-8">
          <q-input
            filled
            v-model="moneyForm.invoice_num"
            :input-style="{ 'font-size': '24px' }"
          />
        </div>
      </div>
    </div>
    <div class="col w-50 text-center row items-center justify-center border">
      <div class="col-6 row items-center">
        <div class="col-4"><div class="text-h6 text-white">當次付款</div></div>
        <div class="col-8">
          <q-input
            filled
            type="number"
            v-model="moneyForm.paid"
            :input-style="{ 'font-size': '24px' }"
          />
        </div>
      </div>
      <div class="col-6 row items-center">
  <div class="col-4">
    <div class="text-h6 text-white">未付金額</div>
  </div>
  <div class="col-8">

    <!-- 超過未付金額的警告文本 -->
    <div v-if="moneyForm.sbunpaid < 0" class="text-red">
      已超過未付金額
    </div>
    <q-input
    v-else
      disable
      filled
      v-model="moneyForm.sbunpaid"
      :input-style="{ 'font-size': '24px' }"
    />
  </div>
</div>

    </div>
    <div class="col w-50 text-center row items-center justify-center border">
      <div class="col-6 row items-center">
        <div class="col-4">
          <div
            v-show="
              moneyForm.method === 'debt' ||
              moneyForm.method === 'wire' ||
              moneyForm.method === 'credit' ||
              moneyForm.method === 'uber'
            "
            class="text-h6 text-white"
          >
            預計付款日
          </div>
        </div>
        <div class="col-8">
          <q-input
            v-show="
              moneyForm.method === 'debt' ||
              moneyForm.method === 'wire' ||
              moneyForm.method === 'credit' ||
              moneyForm.method === 'uber'
            "
            v-model="moneyForm.scheduled_payment_date"
            filled
            :input-style="{ fontSize: '20px' }"
          >
            <template v-slot:append>
              <q-icon
                name="calendar_today"
                class="cursor-pointer"
                style="width: 10px"
              >
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="date1"
                >
                  <q-date
                    v-model="moneyForm.scheduled_payment_date"
                    today-btn
                    style="width: 800px"
                    mask="YYYY-MM-DD"
                  >
                    <div class="row items-center justify-end">
                      <q-btn label="取消" color="red" v-close-popup />
                      <q-btn v-close-popup label="確定" color="primary" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="col-6 row items-center">
        <div class="col-4">
          <div class="text-h6 text-white">付款日期</div>
        </div>
        <div class="col-8">
          <q-input

            v-model="moneyForm.payment_date"
            filled
            :input-style="{ fontSize: '20px' }"
          >
            <template v-slot:append>
              <q-icon
                name="calendar_today"
                class="cursor-pointer"
                style="width: 10px"
              >
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="date2"
                >
                  <q-date
                    v-model="moneyForm.payment_date"
                    today-btn
                    style="width: 800px"
                    mask="YYYY-MM-DD"
                  >
                    <div class="row items-center justify-center">
                      <q-btn label="取消" color="red" v-close-popup />
                      <q-btn v-close-popup label="確定" color="primary" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

    </div>
    <div class="col w-50 text-center row items-center justify-center border">
      <div class="col-12 row items-center">
        <div class="col-2">
          <div
            class="text-h6 text-white"
          >
            備註
          </div>
        </div>
        <div class="col-10">
          <q-input filled v-model="moneyForm.payment_comment"/>
        </div>
      </div>
    </div>
    </div>

  <!--  -->

  <div class="col-12 row justify-center q-my-md">
    <q-btn
      label="儲存"
      class="q-mx-lg text-white btn-payed"
      size="20px"
      color="accent"
      @click="save"
    />
  </div>
  <div class="col-12 row justify-center q-my-md">
    <q-table
      title="付款紀錄"
      class="w-75"
      :rows="paymentHistory"
      :columns="columns"
      row-key="desc"
    >
    <template v-slot:top-right>
      <div class="col-4"><div class="text-h6 text-white">已付金額</div></div>
        <div class="col-8">
          <q-input
            filled
            disable
            v-model="moneyForm.paided"
            :input-style="{ 'font-size': '24px' }"
          />
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted, onMounted } from 'vue'
import { DateTime } from 'luxon'
import { apiShit } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { usePaymentStore } from 'src/stores/payment'

const emit = defineEmits(['close'])
const emitClose = () => {
  emit('close')
}
const payment = usePaymentStore()
const paymentHistory = ref([])
const $q = useQuasar()
// const today = DateTime.now().toFormat('yyyy-MM-dd')
// const getMoneyDate = ref(today)
// const paymentMethod = ref('')
const props = defineProps(['order'])
const date1 = ref(false)
const date2 = ref(false)
console.log(props.order)
// payment
const moneyForm = ref({
  code: '',
  total: 0,
  paid: 0,
  paided: 0,
  sbunpaid: 0,
  unpaid: 0,
  method: 'cash',
  payment_date: '',
  scheduled_payment_date: '',
  payed_off: '',
  invoice_num: '',
  payment_comment: ''
})

const paymentForm = ref({
  order_id: '',
  payment_type_code: '',
  amount: '',
  payment_date: '',
  scheduled_payment_date: '',
  status_code: ''
})

watch(() => moneyForm.value.payed_off, (newVal) => {
  if (newVal === '1' && moneyForm.value.sbunpaid !== 0) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      position: 'center',
      message: '未付金額為0，才可選擇已付清'
    })
    moneyForm.value.payed_off = 0
  }
})
// 顆顆顆
watch(() => {
  moneyForm.value.sbunpaid = moneyForm.value.unpaid - moneyForm.value.paid
})
// 87去0
watch(() => moneyForm.value.paid, (newValue, oldValue) => {
  if (typeof newValue === 'string' && newValue.startsWith('0')) {
    const numericValue = parseInt(newValue, 10)
    if (!isNaN(numericValue)) {
      moneyForm.value.paid = numericValue
    }
  }
}, { deep: true })

const getHistory = async () => {
  const { data } = await apiShit.get(`/pay/get/${props.order.code}`)
  paymentHistory.value = data.result
  console.log(data.result)
  // 檢查歷史
  let totalPaid = 0
  if (data.result && data.result.length > 0) {
    // 累計
    data.result.forEach(payment => {
      totalPaid += parseFloat(payment.amount)
    })

    // 获取最后一笔支付记录
    const lastPayment = data.result[data.result.length - 1]

    // 根据最后一笔支付记录的状态码设置 payed_off
    if (lastPayment.status_code === 'C') {
      moneyForm.value.payed_off = '1'
    } else if (lastPayment.status_code === 'P') {
      moneyForm.value.payed_off = '0'
    }
  }
  // 将计算出的总支付额赋值给 moneyForm.value.paided
  moneyForm.value.paided = totalPaid.toString()
  moneyForm.value.unpaid = moneyForm.value.total - moneyForm.value.paided
}
const convertTo = async () => {
  paymentForm.value.order_id = moneyForm.value.code
  paymentForm.value.payment_type_code = moneyForm.value.method
  paymentForm.value.amount = moneyForm.value.paid
  paymentForm.value.payment_date = moneyForm.value.payment_date
  paymentForm.value.scheduled_payment_date =
    moneyForm.value.scheduled_payment_date
  if (moneyForm.value.payed_off === '1') {
    paymentForm.value.status_code = 'C'
  } else if (moneyForm.value.payed_off === '0') {
    paymentForm.value.status_code = 'P'
  }
}
const save = async () => {
  await convertTo()
  try {
    if (moneyForm.value.payment_date === '') {
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'error',
        position: 'center',
        message: '請選擇異動日期'
      })
      return
    }
    if (moneyForm.value.payed_off === '') {
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'error',
        position: 'center',
        message: '請選擇付款狀態'
      })
      return
    }
    console.log(`Paid: ${moneyForm.value.paid}, Total: ${moneyForm.value.total}`)
    console.log(`Types - Paid: ${typeof moneyForm.value.paid}, Total: ${typeof moneyForm.value.total}`)

    // 數字
    const paidAmount = parseFloat(moneyForm.value.paid)
    const totalAmount = parseFloat(moneyForm.value.total) - parseFloat(moneyForm.value.paided)

    if (paidAmount > totalAmount) {
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'error',
        position: 'center',
        message: '該筆付款不得大於未付金額'
      })
      return
    }

    // 如果支付金额与总金额相等，则标记为全部支付完成
    if (totalAmount - paidAmount === 0) {
      moneyForm.value.payed_off = '1'
    }

    const { data } = await apiShit.post('/payment', moneyForm.value)
    const result = await apiShit.post('/pay/create', paymentForm.value)
    console.log(moneyForm.value)
    console.log(result)
    $q.notify({
      message:
        '成功！' +
        data.message.changedRows +
        ',' +
        result.data.message.changedRows,
      icon: 'announcement',
      color: 'green-4'
    })
    payment.sented = true
  } catch (error) {
    $q.notify({
      message: error,
      icon: 'announcement',
      color: 'red-4'
    })
  }
}

// const allisPayed = () => {
//   if (moneyForm.value.total === '0') {
//     moneyForm.value.total = moneyForm.value.unpaid
//     moneyForm.value.paid = moneyForm.value.total
//   } else {
//     moneyForm.value.paid = moneyForm.value.unpaid
//   }

//   moneyForm.value.payed_off = '1'
// }
watch(
  () => [moneyForm.value.total, moneyForm.value.paid]

)
watch(
  () => [moneyForm.value.payment_date, moneyForm.value.scheduled_payment_date],
  () => {
    date1.value = false
    date2.value = false
  }
)
onMounted(async () => {
  moneyForm.value.code = props.order.code
  moneyForm.value.method = props.order.payment_method
  moneyForm.value.total = parseInt(props.order.payment_total) // .replace(/.0000/g, '')
  // moneyForm.value.paided = props.order.payment_paid.replace(/.0000/g, '')
  // moneyForm.value.unpaid = props.order.payment_unpaid.replace(/.0000/g, '')
  moneyForm.value.scheduled_payment_date = props.order.scheduled_payment_date
  // moneyForm.value.payment_date = today
  moneyForm.value.invoice_num = props.order.invoice_num
  moneyForm.value.payment_comment = props.order.payment_comment
  await getHistory()
})

onUnmounted(() => {
  moneyForm.value.total = 0
  moneyForm.value.paid = 0
  moneyForm.value.unpaid = 0
})

const columns = [
  {
    name: 'desc',
    align: 'center',
    label: '編號',
    field: 'order_id',
    sortable: true
  },
  {
    name: 'payment_type_code',
    label: '付款方式',
    field: 'payment_type_code',
    sortable: true,
    format: (val, row) => {
      const foundOption = payment.options.find(
        (option) => option.value === val
      )
      return foundOption ? foundOption.label : ''
    }
  },
  {
    name: 'payment_date',
    label: '付款日期',
    field: 'payment_date',
    format: (val, row) => {
      const paymentDate = DateTime.fromISO(val, { zone: 'utc' })
      const paymentDateInTz8 = paymentDate.setZone('Asia/Taipei')
      const formattedDate = paymentDateInTz8.toFormat('yyyy-MM-dd')
      return formattedDate
    }
  },
  { name: 'amount', label: '金額', field: 'amount' }
]
</script>

<style lang="scss" scoped>
.border {
  border: 1px solid #666;
  // padding: 1px;
  // margin:1px;
  // background: #666;
}
.h-100 {
  max-height: 100% !important;
}

.text-h6 {
  height: 55px;
  background: #666;
  line-height: 3rem !important;
}
.bg-666 {
  background: #666;
}
.btn-payed {
  width: 200px;
  height: 60px;
}
</style>
