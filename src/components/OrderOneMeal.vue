<template>
  <div v-for="(item, index) in order" :key="index">
    <q-input v-model="item.name" label="品名" />
    <q-input v-model="item.quantity" label="數量" />
    <q-input v-model="item.price" label="單價" />
    <q-input v-model="item.total" label="金額" />
    <q-input v-model="item.options_total" label="選項金額" />
    <q-input v-model="item.final_total" label="總金額" />
    <q-input v-model="item.comment" label="飲料" />
  </div>
</template>

<script setup>
import { onBeforeMount, ref, onMounted } from 'vue'
import { UseMealStore } from 'src/stores/meal'
import { useRoute } from 'vue-router'
import { apiAuth } from 'src/boot/axios'
const route = useRoute()
const data = ref({})
const order = ref({})
const meal = UseMealStore()

const getdata = async () => {
  const result = await apiAuth.get(`/sale/order/${route.params.id}`)
  data.value = result.data
  order.value = data.value.order_products
  console.log(order.value)
  meal.orderdetails.splice(0, meal.orderdetails.length)
  for (let i = 0; i < order.value.length; i++) {
    meal.orderdetails.push(order.value[i])
  }
  console.log(meal.orderdetails)
  meal.getorder(route.params.id)
  for (let i = 0; i < order.value.length; i++) {
    meal.insertDataIntoTableRows(meal.orderdetails[i])
    // await sleep(300)
  }
}
// 延遲
// function sleep (ms) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }
onBeforeMount(() => {
  getdata()
})
onMounted(() => {

})

</script>
