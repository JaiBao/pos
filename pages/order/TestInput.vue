<template>
  <q-page>
    <div>
    <div v-for="product in products" :key="product.id">
      <q-input v-model="product.quantity" :label="product.name" type="number"></q-input>
    </div>
  </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { apiAuth } from 'src/boot/axios'

const products = ref([])

const fetchProducts = async () => {
  const response = await apiAuth.get('catalog/product')
  products.value = response.data.data.map(product => ({
    id: product.id,
    name: product.translation.name,
    quantity: 0
  }))
}
fetchProducts()

</script>
