<template>
  <q-form
    @submit.prevent="onSubmit"
    @reset="onReset"
    action=https://payment-stage.funpoint.com.tw/Cashier/AioCheckOut/V5
    method="POST"
    target="_blank"
    name="payment"
    class="row w-100 q-gutter-md"
  >
    <q-input
      label="shit 1"
      v-model="funpoint.payform.MerchantID"
      class="col-3"
      name="MerchantID"
    />
    <q-input
      label="訂單編號"
      v-model="funpoint.payform.MerchantTradeNo"
      class="col-3"
      name="MerchantTradeNo"
    />
    <q-input
      label="shit 3"
      v-model="funpoint.payform.MerchantTradeDate"
      class="col-3"
      name="MerchantTradeDate"
    />

    <q-input
      label="shit 3"
      readonly
      v-model="funpoint.payform.PaymentType"
      class="col-3"
      name="PaymentType"
    />

    <q-input
      label="價格"
      v-model="funpoint.payform.TotalAmount"
      class="col-3"
      name="TotalAmount"
    />

    <q-input
      label="shit 6"
      v-model="funpoint.payform.TradeDesc"
      class="col-3"
      name="TradeDesc"
    />

    <q-input
      label="shit 7"
      v-model="funpoint.payform.ItemName"
      class="col-3"
      name="ItemName"
    />

    <q-input
      label="shit 8"
      v-model="funpoint.payform.ReturnURL"
      class="col-3"
      name="ReturnURL"
    />

    <q-input
      label="shit 9"
      readonly
      v-model="funpoint.payform.ChoosePayment"
      class="col-3"
      name="ChoosePayment"
    />

    <q-input
      label="shit 10"
      readonly
      v-model="funpoint.payform.EncryptType"
      class="col-3"
      name="EncryptType"
    />
    <q-input
      label="shit 11"
      readonly
      v-model="funpoint.payform.ClientBackURL"
      class="col-3"
      name="ClientBackURL"
    />
    <q-input
      v-model="funpoint.CheckMacValue"
      class="col-3"
      name="CheckMacValue"
    />
    <q-btn @click="calculate" label="calculate" />
    <q-btn label="Submit" type="submit" color="primary" />
  </q-form>
</template>
<script setup>
// import { ref } from 'vue'
import { useFunpointStore } from 'src/stores/funpoint'

const funpoint = useFunpointStore()

const calculate = () => {
  const result = funpoint.generateCheckValue(funpoint.payform)
  funpoint.CheckMacValue = result
}

const onSubmit = (evt) => {
  // Handle form submission
  console.log('@submit - do something here', evt)
  evt.target.submit()
}

const onReset = () => {
  // Handle form reset
}
</script>
