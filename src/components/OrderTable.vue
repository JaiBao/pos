<script setup>
import { ref } from 'vue'
import { apiAuth } from 'src/boot/axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const orderProducts = ref([])
const getdata = async () => {
  const result = await apiAuth.get(`/sale/order/${route.params.id}`)
  orderProducts.value = result.data.order_products
}
getdata()
console.log(orderProducts.value)
</script>

<template>
  <!-- 遍历每个产品 -->
  <div v-for="product in orderProducts" :key="product.id">
      <h5>{{ product.name }}</h5>

      <!-- 遍历产品的选项 -->
      <div v-for="option in product.order_product_options" :key="option.id">
          <p>{{ option.name }}: {{ option.value }}</p>
      </div>
  </div>
  </template>
