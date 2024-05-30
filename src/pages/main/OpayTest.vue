<template>
   <q-input v-model="payform.MerchantTradeNo" label="訂單編號"/>
    <!-- <q-btn @click="createInvoice(invoiceForm.RelateNumber)" label="go"/>
    <InvoiceCreate/> -->
    <q-btn @click="sent" label="sent"/>
    <FunpointForm/>

    <!-- <div v-html="html"></div> -->
</template>

<script setup>
import { ref } from 'vue'
import { UseMealStore } from 'src/stores/meal'
// import { apiOpay } from 'src/boot/axios'
// import { useInvoiceStore } from 'src/stores/invoice'
// import InvoiceCreate from 'src/components/InvoiceCreate.vue'
import FunpointForm from 'src/components/FunpointForm.vue'
import { apiShit } from 'src/boot/axios'
import SHA256 from 'crypto-js/sha256'
// const invoice = useInvoiceStore()
const meal = UseMealStore()
meal.expandMealsOffical({ id: 1001 })
// const dataadd = ref({ UnifiedBusinessNo: '', BarCode: '' })
// const datafind = ref('')
// const getResult = async () => {
//   form.value.Data.UnifiedBusinessNo = dataadd.value.UnifiedBusinessNo
//   try {
//     const { data } = await apiOpay.post(
//       '/B2CInvoice/GetCompanyNameByTaxID',
//       form.value
//     )
//     console.log(data)
//     datafind.value = data.Data.CompanyName
//   } catch (error) {}
// }
// const getBarResult = async () => {
//   form.value.Data.BarCode = dataadd.value.BarCode
//   try {
//     const { data } = await apiOpay.post(
//       '/B2CInvoice/CheckBarcode',
//       form.value
//     )
//     console.log(data)
//     datafind.value = data.Data.RtnMsg
//   } catch (error) {
//     console.log(error)
//   }
// }
// const form = ref({
//   MerchantID: 2000132,
//   RqHeader: { Timestamp: new Date().getTime() },
//   Data: { MerchantID: 2000132 }
// })

// https://einvoice-stage.opay.tw/B2CInvoice/CheckBarcode

// const invoiceForm = ref({
//   MerchantID: '',
//   RelateNumber: '', // code
//   CustomerID: '',
//   CustomerIdentifier: '', // 統編
//   CustomerName: '',
//   CustomerAddr: '',
//   CustomerPhone: '',
//   CustomerEmail: '', // phone email擇一
//   ClearanceMark: '1',
//   Print: '1',
//   Donation: '0',
//   LoveCode: '',
//   CarrierType: '', // 載具 1 opay 2自然人 3條碼
//   CarrierNum: '',
//   TaxType: '1',
//   SalesAmount: 0, // 發票總金額
//   InvoiceRemark: '',
//   InvType: '07',
//   vat: '1',
//   Items: []
// })

const payform = ref({
  MerchantID: '1000031',
  MerchantTradeNo: 'DSADDSAD213',
  MerchantTradeDate: '2024/01/16 11:09:12',
  PaymentType: 'aio',
  TotalAmount: 1223,
  TradeDesc: '中華四餅',
  ItemName: '餐點一批',
  ReturnURL: 'https://www.chinabing.net/tods/pay/updatepayment',
  ChoosePayment: 'ALL',
  EncryptType: 1,
  ClientBackURL: 'https://www.chinabing.net/'
})
const html = ref('')
// const iframeSrc = ref('')
const sent = async () => {
  try {
    const CheckMacValue = generateCheckValue(payform.value)
    console.log(CheckMacValue)
    const sentForm = { ...payform.value, CheckMacValue }
    console.log(sentForm)
    const { data } = await apiShit.post('/pay/createfunpoint', sentForm)
    console.log(data.data)
    html.value = data.data
    // const newWindow = window.open()
    // if (newWindow) {
    //   // 向新窗口写入 HTML 内容
    //   newWindow.document.write(data)
    //   // newWindow.document.close() // 关闭文档流
    // }
  } catch (error) {
    console.log(error)
  }
}
// function encodeFormData (data) {
//   return Object.keys(data)
//     .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
//     .join('&')
// }
function generateCheckValue (params) {
  console.log(params)
  // 將 params 從 Object 換成 Array
  const entries = Object.entries(params)

  // 第一步，將 params 按照 key 值得字母順序排列
  entries.sort((a, b) => {
    return a[0].localeCompare(b[0])
  })

  // 第二步，用 key1=value1&key2=value2... 這樣的 pattern 將所有 params 串聯成字串
  // 並前後加上 HashKey & HashIV 的 value
  let result =
    `HashKey=${process.env.HashKey}&` +
    entries.map((x) => `${x[0]}=${x[1]}`).join('&') +
    `&HashIV=${process.env.HashIV}`

  // 第三步，encode URL 並轉換成小寫
  result = encodeURIComponent(result).toLowerCase()

  // 第四步 URL encode 是 follow RFC 1866
  // 使用 js 的encodeURIComponent() 還需要處理一下
  result = result
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%20/g, '+')

  // 第五步，轉成 SHA256
  result = SHA256(result).toString()
  // 最後，轉成大寫
  return result.toUpperCase()
}

// const createInvoice = async (val) => {
//   await invoice.createInvoice(val)
// }
</script>
