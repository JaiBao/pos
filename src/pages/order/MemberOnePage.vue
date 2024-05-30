<template>
    <MemberTable />
</template>

<script setup>
// import { ref } from 'vue' // watchEffect ,reactive, watch
// import { useRoute } from 'vue-router'
// import { apiAuth } from 'src/boot/axios'
// import { useQuasar } from 'quasar'
import { UseAddressStore } from 'src/stores/address'
import MemberTable from 'src/components/MemberTable.vue'

const address = UseAddressStore()
// const $q = useQuasar()
// const route = useRoute()
// const data = ref({})
// const datasend = ref({})
address.getstate()

// const stateoptions = address.state
// -------------------------------------------------------------------------------------------

// const getdata = async () => {
//   const result = await apiAuth.get(`/member/member/${route.params.id}`)
//   data.value = result.data[0]
//   datasend.value = result.data[0]
//   console.log(data.value)
//   await address.getcity(data.value.shipping__id)
// }

// getdata()

// 性別處理 -------------------------------------------------------------------------------------------
// const optionsSalutation = [
//   { label: '先生', value: 17 },
//   { label: '小姐', value: 18 }
// ]
// -------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------
// const districtoptions = reactive([])
// const getdistrict = async () => {
//   districtoptions.splice(0, districtoptions.length)
//   const result = await apiAuth.get(
//     `localization/division/city?filter_parent_id=${data.value.shipping_state_id}`
//   )
//   for (let i = 0; i < result.data.length; i++) {
//     districtoptions.push({
//       label: result.data[i].name,
//       value: result.data[i].city_id
//     })
//   }
// }
// --------------------------------------------------------------------------------------------
// // Listen for changes to state id
// watch(
//   () => data.value.shipping_state_id,
//   () => {
//     getdistrict()
//   }
// )
// // Listen for changes to city id
// watch(
//   () => districtoptions.length,
//   () => {
//     console.log(data.value.shipping_city_id)
//     const district = districtoptions.find(
//       (district) => district.value === data.value.shipping_city_id
//     )
//     console.log(district)
//     if (district) {
//       data.value.shipping_city_id = district.label
//       console.log(data.value.shipping_city_id)
//     }
//   }
// )
// --------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------
// const submit = async () => {
//   datasend.value = data.value
//   datasend.value.member_id = data.value.id
//   try {
//     const result = await apiAuth.post('/member/member/save', datasend.value)
//     console.log(result)
//     $q.notify({
//       color: 'green-4',
//       textColor: 'white',
//       icon: 'cloud',
//       message: result.data.success
//     })
//   } catch (error) {
//     $q.notify({
//       color: 'red-4',
//       textColor: 'white',
//       icon: 'cloud_off',
//       message: '錯誤' + error.warning
//     })
//   }
// }
</script>

<style lang="scss" scoped></style>
