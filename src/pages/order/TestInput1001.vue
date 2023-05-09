<template>
  <q-page>
    <q-card class="q-gutter-md row items-start  word-break " >

      <div style="width:100%;padding: 0;margin: 10px;height: 30px;">
            <h5  style="line-height: 0;">主餐</h5>
            </div>
      <div v-for="product in products" :key="product.id" class="row">
        <q-input
          v-model="product.quantity"
          :label="product.name"
          type="number"
          outlined
          :input-style="{ fontSize: '20px' }"
          style="width: 130px;"
        ></q-input>
      </div>
  </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { apiAuth } from 'src/boot/axios'

const products = ref([])

const fetchProducts = async () => {
  try {
    const response = await apiAuth.get('catalog/product/1001')
    products.value = response.data.product_options.main_mealproduct_option_values[0].map(product => ({
      id: product.id,
      name: product.short_name,
      quantity: 0
    }))
  } catch (error) {
    console.error(error)
  }
}

fetchProducts()

</script>
