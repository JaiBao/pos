<template>
  <div class="row w-100 bg-dark text-white">
      <q-btn class="col" :class="{ 'bg-warning': tab === 'member', 'text-black': tab === 'member'}" size="30px" label="客戶資料" @click="tab='member'" />
      <q-btn class="col"  :class="{ 'bg-warning': tab === 'ordered', 'text-black': tab === 'ordered'}" size="30px" label="餐點資料" @click="tab='ordered'"/>
  </div>
    <div>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="member" >
        <OrderedTable @change="handleChange" />
        <!-- <PaymentTable /> -->
      </q-tab-panel>
      <q-tab-panel name="ordered">
        <OrderPage />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onUnmounted } from 'vue'
// import { apiAuth } from 'src/boot/axios'
// import { useRoute } from 'vue-router'
import OrderedTable from 'src/components/OrderedTable.vue'
// import PaymentTable from 'src/components/PaymentTable.vue'
import OrderPage from 'src/pages/order/OrderPage.vue'
import { UseMealStore } from 'src/stores/meal'

const handleChange = () => {
  tab.value = 'ordered'
}
// const data = ref({})
const tab = ref('member')
// const route = useRoute()
const meal = UseMealStore()

// const getdata = async () => {
//   await meal.getorder(route.params.id)
//   meal.orderdetails.forEach((element) => {
//     meal.insertDataIntoTableRows(element)
//   })
//   meal.shouldEdit = true
// }
onBeforeMount(() => {
  // getdata()
})

onUnmounted(() => {
  meal.clear()
})

</script>

<style lang="scss" scoped>
.q-tab-panel {
height: 100%;
padding: 0px;
}
.tab{
  font-size: 30px;
}
</style>
