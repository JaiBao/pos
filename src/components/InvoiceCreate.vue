<template>
   <div class="row w-100 justify-end">
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
  <div>
    <div class="row w-100 q-mb-md col-3">
      <q-input
        outlined
        v-model="invoice.searchInvoice.code"
        label="訂單編號"
        class="col-1"
        readonly
      />
      <!-- <q-input
        outlined
        v-model="invoice.invoiceForm.RelateNumber"
        label="發票編號(不可重複)"
        class="col-2"
      /> -->
      <q-input
        outlined
        v-model="invoice.invoiceForm.CustomerID"
        label="客戶編號"
        class="col-2"
      />
      <q-input
        outlined
        v-model="invoice.form.paymentNumber"
        label="客戶統編"
        class="col-3"
        :readonly="invoice.form.is_payment_tin !== 1"
      >
      <template v-slot:append>
        <q-checkbox
        v-model="invoice.form.is_payment_tin"
        dense
        color="secondary"
        label="需要"
        :true-value="1"
          :false-value="0"    />
      </template>
    </q-input>
      <!-- <q-checkbox v-model="right" label="要統編" class="col"/> -->
      <q-input
        outlined
        v-model="invoice.invoiceForm.CustomerName"
        label="客戶公司(若無為姓名)"
        class="col-6"
      />
    </div>
    <div class="row w-100 q-mb-md">
      <q-input
        outlined
        v-model="invoice.invoiceForm.CustomerAddr"
        label="客戶住址"
        class="col-3"
      />
      <q-input
        outlined
        v-model="invoice.invoiceForm.CustomerPhone"
        label="客戶手機"
        class="col-2"
      />
      <q-input
        outlined
        v-model="invoice.form2.totalFee"
        label="總價"
        class="col-1"
      />
      <q-input
        outlined
        v-model="invoice.invoiceForm.CarrierNum"
        label="載具"
        :readonly="invoice.invoiceForm.CarrierType !== '3'"
        ref="CarrierNum"
        class="col-2"
      >
      <template v-slot:append>
        <q-checkbox
        v-model="invoice.invoiceForm.CarrierType"
        dense
        color="secondary"
        label="需要"
        true-value='3'
        false-value=''     />
      </template></q-input>
      <q-input
      v-if="invoice.searchInvoice.invoice_num===''"
        outlined
        v-model="invoice.invoiceForm.InvoiceRemark"
        label="發票備註"
        class="col-4"
      />
      <q-input
      v-else
        outlined
        v-model="reason"
        label="作廢原因"
        class="col-4"
      />
    </div>
    <!-- 如果開立電子發票則隱藏手開發票 -->
    <!-- <q-btn @click="getMenualstatus=true"></q-btn> -->
    <q-btn v-if="invoice.searchInvoice.invoice_num==='' && getMenualstatus===false" @click="openMenualInvoice()" label="新增手開發票" color="primary" class="q-mx-md" />

    <!-- 明細列印 -->
    <!-- <q-btn v-if="invoice.invoiceForm.CustomerName==='門市客'" @click="openPrintDialog = true" label="列印明細" color="primary" class="q-mx-md" />

    <q-dialog v-model="openPrintDialog" full-width>
      <q-card>
        <q-card-section>
          <invoice-print />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup />
          <q-btn flat label="列印" color="primary" @click="printInvoice" />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <q-btn v-if="updateMenualInvoice &&getMenualstatus===false" @click="addInvoice" label="增加發票" />
    <q-btn v-if="updateMenualInvoice &&getMenualstatus===false" @click="openMenualdialog()" label="儲存" color="primary" class="q-mx-md" />
    <div v-if="updateMenualInvoice &&getMenualstatus===false " >
      <div class="row w-100 q-mb-md" v-for="(invoice, index) in invoices" :key="index">
        <q-input
        outlined
        v-model="invoice.MenualInvoiceNumber"
        :label="'手開發票號碼' + (index + 1)"
        :error="hasError(invoice.MenualInvoiceNumber, invoice.MenualInvoicePrice)"
        error-message="必須填寫金額"
      />
      <q-input
        outlined
        v-model="invoice.MenualInvoicePaymentTin"
        :label="'手開發票統編' + (index + 1)"
      />
      <q-input
        outlined
        v-model.number="invoice.MenualInvoicePrice"
        :label="'手開發票' + (index + 1) + '金額'"
        :error="hasError(invoice.MenualInvoiceNumber, invoice.MenualInvoicePrice)"
        error-message="必須填寫金額"
      />
      </div>
      <!-- <q-input
      outlined
      v-model="MenualInvoice1Number"
      label="手開發票號碼一"
      :error="hasError('MenualInvoice1Number', 'MenualInvoice1Price')"
      error-message="必須填寫金額"
    />
    <q-input
      outlined
      v-model.number="MenualInvoice1Price"
      label="手開發票一金額"
      :error="hasError('MenualInvoice1Number', 'MenualInvoice1Price')"
      error-message="必須填寫金額"
    />
    <q-input
      outlined
      v-model="MenualInvoice2Number"
      label="手開發票二"
      :error="hasError('MenualInvoice2Number', 'MenualInvoice2Price')"
      error-message="必須填寫金額"
    />
    <q-input
      outlined
      v-model.number="MenualInvoice2Price"
      label="手開發票二金額"
      :error="hasError('MenualInvoice2Number', 'MenualInvoice2Price')"
      error-message="必須填寫金額"
    />
    <q-input
      outlined
      v-model="MenualInvoice3Number"
      label="手開發票三"
      :error="hasError('MenualInvoice3Number', 'MenualInvoice3Price')"
      error-message="必須填寫金額"
    />
    <q-input
      outlined
      v-model.number="MenualInvoice3Price"
      label="手開發票三金額"
      :error="hasError('MenualInvoice3Number', 'MenualInvoice3Price')"
      error-message="必須填寫金額"
    /> -->
    </div>
    <div v-else-if="getMenualstatus===true">
      <div class="row w-100 q-mb-md" v-for="(invoice, index) in getMenualData" :key="index">
        <q-input
        outlined
        readonly
        v-model="invoice.invoice_num"
        :label="'手開發票號碼' + (index + 1)"
      />
      <q-input
        outlined
        readonly
        v-model.number="invoice.payment_tin"
        :label="'手開發票' + (index + 1) + '統編'"
      />
      <q-input
        outlined
        readonly
        v-model.number="invoice.amount"
        :label="'手開發票' + (index + 1) + '金額'"
      />
      </div>
    </div>
    <q-table
      flat
      bordered
      :rows="invoice.form2.items"
      :columns="columns"
      row-key="name"
      binary-state-sort
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <q-option-group
          v-model="invoice.type"
          :options="options"
          color="primary"
          inline
        />
        <q-btn @click="add()" label="新增品項" color="primary" class="q-mx-md" />

      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <!-- <q-td key="ItemSeq" > {{ props.row.ItemSeq }}</q-td> -->
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="number" :props="props">
            {{ props.row.number }}
            <q-popup-edit v-model="props.row.number" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td><q-td key="ItemWord" :props="props">
            {{ props.row.ItemWord }}

          </q-td><q-td key="money" :props="props">
            {{ props.row.money }}
            <q-popup-edit v-model="props.row.money" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td><q-td key="ItemTaxType" :props="props">
            {{ props.row.ItemTaxType }}

          </q-td><q-td key="totalPrice" :props="props">
            {{  props.row.number * props.row.money }}
            <q-popup-edit v-model="props.row.totalPrice" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="ItemRemark" :props="props">
            {{ props.row.ItemRemark }}
            <q-popup-edit v-model="props.row.ItemRemark" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              flat
              dense
              round
              icon="delete"
              @click="invoice.removeItem(props.rowIndex)"
              class="q-ml-sm"
            />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:pagination>
        <div class="row w-100 justify-end text-h6">

          <div class="col q-mx-md">累計 :{{ totalPriceCal }}</div>
          <q-btn v-if="invoice.searchInvoice.invoice_num==='' &&getMenualstatus===false" @click="createInvoice()" label="開立"/>
          <div v-else class="text-h6">已開立 : {{ invoice.searchInvoice.invoice_num }} {{ invoice.InvoiceDate }}</div>
          <q-btn v-if="invoice.searchInvoice.invoice_num!==''" @click="getInvoiceDetail()" label="查看發票" color="primary" class="q-mx-md" />
          <q-btn v-if="invoice.searchInvoice.invoice_num!==''" @click="InvalidInvoice()" label="作廢" color="primary" class="q-mx-md" />
        </div>
        </template>
    </q-table>
    <q-table
      flat
      bordered
      :rows="invoice.allInvoice"
      :columns="columns2"
      row-key="name"
      binary-state-sort
      :rows-per-page-options="[0]"
    >
    <template v-slot:pagination>
      <div class="col q-mx-md">開立次數 : {{ invoiceTimes }}</div>
    </template>
    </q-table>

  </div>
  <q-dialog v-model="openUpdateMenualDialog" persistent>
    <q-card>
      <q-card-section class="row items-center w-100 justify-center">
        <div class="q-ma-md q-pa-md text-h4" v-if="checkMenualInvoice==true">確定填寫正確？？送出後無法修改</div>
        <div class="q-ma-md q-pa-md text-h4" v-if="checkMenualInvoice==false">{{ updateMenualErrMsg }}</div>

      </q-card-section>
      <div class="row w-100 justify-center">
        <q-btn
          label="取消"
          color="dark"
          v-close-popup
          size="20px"
          class="col q-ma-md"
        />
        <q-btn
          v-if="checkMenualInvoice==true"
          label="我確定"
          color="accent"
          size="20px"
          class="col q-ma-md"
          v-close-popup
          @click="updateManualInvoice()"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { watch, onMounted, ref, computed } from 'vue'
import { useInvoiceStore } from 'src/stores/invoice'
import { useQuasar } from 'quasar'
import { apiShit, apiAuth } from 'src/boot/axios' // apiOpay
import { DateTime } from 'luxon'
// import InvoicePrint from 'src/components/superNoob.vue'

// const openPrintDialog = ref(false)

// const printInvoice = () => {
//   const printContent = document.querySelector('.invoice-print').innerHTML
//   const originalContent = document.body.innerHTML

//   document.body.innerHTML = printContent
//   window.print()
//   document.body.innerHTML = originalContent

//   window.location.reload()
// }
const emit = defineEmits(['close'])
const emitClose = () => {
  emit('close')
}
const $q = useQuasar()
const invoice = useInvoiceStore()
const CarrierNum = ref(null)
const invoiceUrl = ref('')
const invoiceTimes = ref(0)
const reason = ref('')
const updateMenualInvoice = ref(false)
const openUpdateMenualDialog = ref(false)
const checkMenualInvoice = ref(false)
const updateMenualErrMsg = ref('')
const invoices = ref([
  { MenualInvoiceNumber: '', MenualInvoicePaymentTin: '', MenualInvoicePrice: null }
])
const getMenualData = ref({})
const getMenualstatus = ref(true)
// const paymentNumber = ref('')
// const right = ref(true)
// watch(
//   () => right.value,
//   (val) => {
//     if (!val) {
//       invoice.invoiceForm.CustomerIdentifier = ''
//     }
//   }
// )
console.log('要不要統編拉', invoice.searchInvoice.is_payment_tin)
const totalPriceCal = computed(() => {
  let total = 0
  invoice.form2.items.forEach((item) => {
    total += item.number * item.money
  })
  return total
})

const props = defineProps(['order'])
const options = [
  { label: '品項', value: 'byMeals' },
  { label: '總金額', value: 'byTotal' }
]

const createInvoice = async () => {
  try {
    // console.log('開立累計', totalPriceCal.value)
    // console.log('總價', invoice.form2.totalFee)
    if (parseInt(totalPriceCal.value) !== parseInt(invoice.form2.totalFee)) {
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'error',
        position: 'center',
        message: '總金額與明細金額不相等'
      })
      return
    }
    if (invoice.form.is_payment_tin === 1 && invoice.form.paymentNumber === '') {
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'error',
        position: 'center',
        message: '勾選需要統編請務必填入統編'
      })
      return
    }

    // if (invoice.invoiceForm.CarrierType === '3') {
    //   $q.notify({
    //     color: 'red-4',
    //     textColor: 'white',
    //     icon: 'error',
    //     position: 'center',
    //     message: '有統編不可使用載具'
    //   })
    //   return
    // }
    await invoice.sentInvoice()
    // $q.notify({
    //   color: 'green-4',
    //   textColor: 'white',
    //   icon: 'error',
    //   position: 'center',
    //   message: '已開立發票'
    // })
    await invoice.createInvoice(props.order.id)
    await invoice.searchInvoiceDate(props.order.code)
  } catch (error) {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'error',
      position: 'center',
      message: error
    })
    await invoice.createInvoice(props.order.id)
    await invoice.searchInvoiceDate(props.order.code)
  }
}
watch(
  () => invoice.invoiceForm.CarrierType,
  (newval) => {
    if (newval === '3') {
      CarrierNum.value.focus()
    }
  })

const getInvoiceDetail = async () => {
  try {
    const invoiceNum = invoice.searchInvoice.invoice_num
    const response = await apiShit.get(`/pay/print/${invoiceNum}`)
    const data = response.data

    // 直接在新标签页打开该URL
    const newWindow = window.open(data.url, '_blank')
    if (newWindow) {
      setTimeout(() => {
        newWindow.print()
      }, 1000) // 等待1秒后尝试打印，确保页面已加载
    }
  } catch (error) {
    console.error(error)
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'error',
      position: 'center',
      message: error.message
    })
  }
}

// const getInvoiceDetail = async () => {
//   try {
//     const result = await invoice.printInvoicePicture(invoice.searchInvoice.invoice_num)
//     const blob = new Blob([result.data], { type: 'image/png' })
//     const imageUrl = URL.createObjectURL(blob)

//     // 打開新分頁預覽圖片
//     window.open(imageUrl, '_blank')

//     await invoice.createInvoice(props.order.id)
//     await invoice.searchInvoiceDate(props.order.code)
//   } catch (error) {
//     $q.notify({
//       color: 'green-4',
//       textColor: 'white',
//       icon: 'error',
//       position: 'center',
//       message: error
//     })
//   }
// }

// const getInvoiceDetail = () => {
//   try {
//     const invoiceNum = invoice.searchInvoice.invoice_num
//     const url = `https://www.giveme.com.tw/invoice.do?action=invoicePrint&code=${invoiceNum}&uncode=53418005`

//     const newWindow = window.open(url, '_blank')

//     // 等待新窗口完全加載後，觸發列印
//     newWindow.onload = () => {
//       newWindow.print()
//     }
//   } catch (error) {
//     $q.notify({
//       color: 'green-4',
//       textColor: 'white',
//       icon: 'error',
//       position: 'center',
//       message: error.message
//     })
//   }
// }

// const getInvoiceDetail = async () => {
//   try {
//     const result = await invoice.getInvoiceByCode(invoice.searchInvoice.invoice_num, invoice.InvoiceDate)
//     invoiceUrl.value = result
//   } catch (error) {
//     $q.notify({
//       color: 'green-4',
//       textColor: 'white',
//       icon: 'error',
//       position: 'center',
//       message: error
//     })
//   }
// }
const InvalidInvoice = async () => {
  try {
    const result = await invoice.InvalidInvoiceEcpay(invoice.searchInvoice.invoice_num, reason.value)
    invoiceUrl.value = result
    await invoice.createInvoice(props.order.id)
    await invoice.searchInvoiceDate(props.order.code)
  } catch (error) {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'error',
      position: 'center',
      message: error
    })
  }
}
// add new details
const add = () => {
  invoice.invoiceForm.Items.push({
    ItemSeq: invoice.invoiceForm.Items.length + 1,
    ItemName: '',
    ItemCount: '',
    ItemWord: '份',
    ItemPrice: 0,
    ItemTaxType: 1,
    ItemAmount: '',
    ItemRemark: ''
  })
  invoice.form2.items.push({
    // ItemSeq: invoice.form2.items.length + 1,
    name: '',
    number: '',
    money: ''
  })
}
const hasError = (numberRef, priceRef) => {
  return numberRef.value && !priceRef.value
}
const openMenualInvoice = () => {
  updateMenualInvoice.value = true
}
// 確認手開發票視窗
const openMenualdialog = () => {
  // if (hasError(MenualInvoice1Number, MenualInvoice1Price) ||
  //     hasError(MenualInvoice2Number, MenualInvoice2Price) ||
  //     hasError(MenualInvoice3Number, MenualInvoice3Price)) {
  //   checkMenualInvoice.value = false
  //   updateMenualErrMsg.value = '手開金額未填寫!!'
  // }
  const total = ref(0)
  invoices.value.forEach(element => {
    if (element.MenualInvoiceNumber === '' || element.MenualInvoicePrice === null) {
      checkMenualInvoice.value = false
      updateMenualErrMsg.value = '未填寫完整!!'
      openUpdateMenualDialog.value = true
      console.log(12322)
    } else if (!element.MenualInvoiceNumber && element.MenualInvoicePrice) {
      checkMenualInvoice.value = false
      updateMenualErrMsg.value = '手開發票號碼未填寫!!'
      openUpdateMenualDialog.value = true
      console.log(1234)
    } else {
      checkMenualInvoice.value = true
    }
    total.value = total.value + element.MenualInvoicePrice
  })
  if (checkMenualInvoice.value !== false) {
    console.log(total.value, invoice.form2.totalFee)
    if (total.value !== invoice.form2.totalFee) {
      console.log('金額錯')
      checkMenualInvoice.value = false
      updateMenualErrMsg.value = '手開發票金額不正確!!'
      openUpdateMenualDialog.value = true
    } else {
      console.log(123)
      checkMenualInvoice.value = true
      openUpdateMenualDialog.value = true
    }
  }
  console.log(checkMenualInvoice)
  // if (total.value !== invoice.form2.totalFee) {
  //   checkMenualInvoice.value = false
  //   updateMenualErrMsg.value = '手開發票金額不正確!!'
  // } else {
  // }
}
const updateManualInvoice = () => {
  const payload = {
    order_code: invoice.searchInvoice.code,
    date: DateTime.now().toFormat('yyyy-MM-dd'),
    data: []
  }
  const key = ref(0)
  invoices.value.forEach(element => {
    if (element.MenualInvoiceNumber && element.MenualInvoicePrice) {
      payload.data[key.value] = ({
        number: element.MenualInvoiceNumber,
        invoice_tin: element.MenualInvoicePaymentTin,
        amount: element.MenualInvoicePrice
      })
      key.value = key.value + 1
    }
  })
  console.log(payload)
  // if (MenualInvoice1Price.value && MenualInvoice1Number) {
  //   payload.data[0] = ({
  //     amount: MenualInvoice1Price.value,
  //     number: MenualInvoice1Number.value
  //   })
  // }
  // if (MenualInvoice2Price.value && MenualInvoice2Number) {
  //   payload.data[1] = ({
  //     amount: MenualInvoice2Price.value,
  //     number: MenualInvoice2Number.value
  //   })
  // }
  // if (MenualInvoice3Price.value && MenualInvoice3Number) {
  //   payload.data[2] = ({
  //     amount: MenualInvoice3Price.value,
  //     number: MenualInvoice3Number.value
  //   })
  // }
  try {
    const response = apiAuth.post('sale/order/update_manual_invoice', payload)
    console.log(response)
    setTimeout(() => {
      getMenualInvoice()
      getMenualstatus.value = true
    }, 1000) // 1000 毫秒等於 1 秒
  } catch (error) {
    console.error('Error fetching order:', error)
  }
}
const addInvoice = () => {
  invoices.value.push({ MenualInvoiceNumber: '', MenualInvoicePaymentTin: '', MenualInvoicePrice: null })
}
const getMenualInvoice = async () => {
  const response = await apiAuth.get(`sale/order/get_manual_invoice/${invoice.searchInvoice.code}`)
  getMenualData.value = response.data.data
  console.log(getMenualData.value.length)
  if (getMenualData.value.length > 0) {
    getMenualstatus.value = true
  } else {
    getMenualstatus.value = false
  }
}
watch(
  () => invoice.type,
  async () => {
    if (invoice.type === 'byTotal') {
      await invoice.byTotal()
    } else if (invoice.type === 'byMeals') {
      await invoice.byMeals()
    }
  }
)

// 相愛相殺統編載具`
watch(() => invoice.invoiceForm.CarrierType, (newVal) => {
  if (newVal === '3') { // 当載具被勾选
    invoice.form.is_payment_tin = 0 // 取消客戶統編的勾选
    invoice.form.paymentNumber = '' // 清除客戶統編
  }
})

watch(() => invoice.form.is_payment_tin, (newVal) => {
  if (newVal === 1 && invoice.invoiceForm.CarrierType === '3') {
    alert('載具不可與統編同時使用')
    invoice.form.is_payment_tin = 0 // 取消勾选客戶統編
  }
  if (newVal === 0) {
    invoice.form.paymentNumber = '' // 清除客戶統編
  }
})
onMounted(async () => {
  await invoice.createInvoice(props.order.id)
  const result = await invoice.searchInvoiceDate(props.order.code)
  invoiceTimes.value = result
  getMenualInvoice()
  // invoice.invoiceForm.RelateNumber += '-' + (invoiceTimes.value + 1)
})
const columns = [
  // {
  //   name: 'ItemSeq',
  //   required: true,
  //   label: '順序',
  //   align: 'left',
  //   field: 'ItemSeq'
  // },
  {
    name: 'name',
    align: 'center',
    label: '品名',
    field: 'name',
    sortable: true
  },
  {
    name: 'number',
    label: '數量',
    field: 'number',
    sortable: true,
    style: 'width: 10px'
  },
  // { name: 'ItemWord', label: '單位', field: 'ItemWord' },
  { name: 'money', label: '單價', field: 'money' },
  // { name: 'ItemTaxType', label: 'ItemTaxType(不用動)', field: 'ItemTaxType' },
  {
    name: 'totalPrice',
    label: '總價',
    field: row => row.number * row.money, // 在這裡計算總價
    sortable: true
  },
  // { name: 'ItemRemark', label: '備註', field: 'ItemRemark' },
  { name: 'actions', label: '動作', field: 'actions' }
]
const columns2 = [

  { name: 'order_code', label: '編號', field: 'order_code' },

  { name: 'invoice_num', label: '發票號碼', field: 'invoice_num' },
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
</script>
