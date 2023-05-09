<template>
  <div>
    <div v-for="(optionValue, index) in optionValues" :key="index">
      <q-input v-model="optionValue.quantity" :label="optionValue.name" />
    </div>
    <div>{{ productName }}</div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { apiAuth } from 'src/boot/axios'

const optionValues = reactive([])
const productName = ref('')

const loadProduct = async () => {
  try {
    const response = await apiAuth.get('catalog/product/1001')
    const productOptions = response.data.product_options
    const mainMeal = productOptions.main_meal
    const values = mainMeal.product_option_values
    for (const value of values) {
      optionValues.push({
        id: value.id,
        name: value.name,
        quantity: 0
      })
    }
    productName.value = mainMeal.name
  } catch (error) {
    console.error(error)
  }
}

loadProduct()

</script>
