<template>
  <div class="q-pa-md">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey bg-purple"
      align="justify"
      narrow-indicator
    >
      <q-tab name="member" label="客戶資料" />
      <q-tab name="ordered" label="點餐資料" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="member">
        <OrderedTable />
      </q-tab-panel>
      <q-tab-panel name="ordered">
        <MemberFrame />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { apiAuth } from 'src/boot/axios'
import { useRoute } from 'vue-router'
import OrderedTable from 'src/components/OrderedTable.vue'
// import OrderOneMeal from 'src/components/OrderOneMeal.vue'
import MemberFrame from 'src/components/OrderedFrame.vue'

const data = ref({})
const tab = ref('member')
const route = useRoute()

const getdata = async () => {
  const result = await apiAuth.get(`/sale/order/${route.params.id}`)
  data.value = result.data
  console.log(result)
}
onBeforeMount(() => {
  getdata()
})

</script>
