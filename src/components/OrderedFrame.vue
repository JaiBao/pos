<template>
  <q-btn size="50px" label="copy" @click="edit" color="accent" />
  <q-btn size="50px" label="寬版"
  :href="href" color="accent" />
  <OrderOneMeal />
</template>

<script setup>
import { api } from 'src/boot/axios'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
// import OrderTable from 'src/components/OrderTable.vue'
import OrderOneMeal from 'src/components/OrderOneMeal.vue'
import { UseMealStore } from 'src/stores/meal'

const meal = UseMealStore()
const route = useRoute()
const router = useRouter()
meal.getorder(route.params.id)
const href = ref(api.defaults.baseURL + 'backend/zh-Hant/sale/orders/form/' + route.params.id)

const edit = async () => {
  await meal.getorder(route.params.id)
  meal.shouldEdit = true
  setTimeout(() => {
    router.push('/Order')
  }, 800)
}
edit()
</script>
