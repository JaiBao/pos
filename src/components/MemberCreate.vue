<script setup>
import { watch, ref, onMounted, onUnmounted } from 'vue'
import { apiAuth } from 'src/boot/axios'
import { UseAddressStore } from 'src/stores/address'
// import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
// import SmallKeypad from 'src/components/SmallKeypad.vue'
import { UseRoadStore } from 'src/stores/road'
const $q = useQuasar()
// const data = ref({})
// const route = useRoute()
const road = UseRoadStore()
const datasend = ref({})
const address = UseAddressStore()

// const addressoptions = address.state
const inputRef = ref(null)
const address2Options = ref([])
const prefix = ref('')
const menuState = ref(false)
const data = ref({
  id: '',
  payment_tin: '',
  payment_company: '',
  payment_department: '',
  mobile: '',
  name: '',
  salutation_id: '',
  telephone_prefix: '',
  telephone: '',
  shipping_state_id: '',
  shipping_city_id: '',
  shipping_road: '',
  shipping_address1: ''
})

const outTime = 5000
const invoiceIDfinding = ref(false)
watch(
  () => data.value.payment_tin,
  async (newVal) => {
    if (newVal && newVal.length === 8) {
      invoiceIDfinding.value = true

      const apiCall = apiAuth.get(`localization/tax_id_num/${newVal}`)
      const timeout = new Promise((resolve, reject) =>
        setTimeout(() => reject(new Error('Timeout')), outTime)
      )
      try {
        const res = await Promise.race([apiCall, timeout])
        if (res.data.tax_id_num) {
          // Set the company name
          data.value.payment_company = res.data.name
          invoiceIDfinding.value = false
          $q.notify({
            color: 'primary',
            textColor: 'white',
            icon: 'cloud',
            position: 'center',
            message: '統編找到公司'
          })
        } else if (res.data.error) {
          invoiceIDfinding.value = false
          $q.notify({
            color: 'red-4',
            textColor: 'white',
            icon: 'cloud_off',
            position: 'center',
            message: '統編找不到公司或超時'
          })
        }
      } catch (error) {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_off',
          position: 'center',
          message: '統編找不到公司或超時'
        })
        invoiceIDfinding.value = false
      }
    }
  }
)
const onItemClick = (val, val2) => {
  console.log('Clicked on an Item')
  data.value.shipping_road = val
  // data.value.shipping_city_id = val2.split('_')[0]
  menuState.value = false
}

watch(
  () => data.value.shipping_road,
  (newValue) => {
    if (newValue > 1) {
      menuState.value = true
    }
  }
)
// watch(data.value.shipping_road)

const back = () => {
  data.value.payment_tin = ''
  data.value.payment_company = ''
  data.value.payment_department = ''
  data.value.mobile = ''
  data.value.name = ''
  data.value.salutation_id = ''
  data.value.telephone_prefix = ''
  data.value.telephone = ''
  data.value.shipping_state_id = ''
  data.value.shipping_city_id = ''
  data.value.shipping_road = ''
  data.value.shipping_address1 = ''
  prefix.value = ''
}
const submit = async () => {
  datasend.value = data.value
  datasend.value.telephone = data.value.telephone + '#' + prefix.value
  // datasend.value.member_id = data.value.id
  // const stateObject = await apiAuth
  //   .get('localization/division/state')
  //   .then((response) =>
  //     response.data.find(
  //       (item) => item.name === datasend.value.shipping_state_id
  //     )
  //   )

  // data.value.shipping_state_id = stateObject.id
  // // 導入舊資料區域
  // const cities = await apiAuth
  //   .get(`localization/division/city?filter_parent_id=${stateObject.id}`)
  //   .then((response) =>
  //     response.data.find((item) => item.name === data.value.shipping_city_id)
  //   )

  // data.value.shipping_city_id = cities.city_id
  try {
    const result = await apiAuth.post('/member/member/save', datasend.value)
    console.log(result)
    $q.notify({
      color: 'primary',
      textColor: 'white',
      position: 'center',
      icon: 'cloud',
      message: result.data.success
    })
    if (result.data.error) {
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        position: 'center',
        icon: 'cloud',
        message: result.data.error.mobile
      })
    }
    back()
    inputRef.value.focus()
  } catch (error) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      position: 'center',
      icon: 'cloud_off',
      message: '錯誤' + error.warning
    })
  }
}
// function run2 (message) {
//   data.value.shipping_address1 += message
// }
watch(
  () => data.value.shipping_state_id,
  (newValue) => {
    address.getcity(newValue)
    address2Options.value = address.city
  },
  { immediate: true }
)

// keypad
const activeObject = ref(null)
const activeKey = ref('')

const setActiveField = (obj, key) => {
  activeObject.value = obj
  activeKey.value = key
}
// const handleKeypadInput = (input) => {
//   if (activeObject.value && activeKey.value) {
//     if (input === 'backspace') {
//       activeObject.value[activeKey.value] = activeObject.value[
//         activeKey.value
//       ].slice(0, -1)
//     } else {
//       activeObject.value[activeKey.value] += input
//     }
//   }
// }
watch(
  () => [data.value.shipping_state_id, data.value.shipping_city_id],
  async () => {
    // 在这里执行 road.getroadselect
    await road.getRoadSelect(
      data.value.shipping_state_id,
      data.value.shipping_city_id
    )
    // await road.getRoad(personForm.address, personForm.address2)
  }
)
const loading = ref(false)
watch(
  // 監聽personForm.tel的變化
  () => data.value.mobile,
  (newVal, oldVal) => {
    // 如果tel為空，清空表單中的其他資料

    if (newVal.length > 9) {
      loading.value = true
      setTimeout(async () => {
        try {
          // 延遲請求的時間（以毫秒為單位）
          const delay = 100

          // 延遲指定的時間
          await new Promise((resolve) => setTimeout(resolve, delay))
          // 發送API請求獲取資料
          const { data } = await apiAuth.get(
            `/member/member?filter_phone=${newVal}`
          )
          if (data.data.length > 0 && data.data.length < 2) {
            $q.notify({
              color: 'red-4',
              textColor: 'white',
              position: 'center',
              icon: 'cloud_off',
              message: '此手機已有紀錄'
            })
            loading.value = false
          } else {
            $q.notify({
              color: 'primary',
              textColor: 'white',
              position: 'center',
              icon: 'cloud',
              message: '沒有紀錄'
            })
            loading.value = false
          }
        } catch (error) {
          // 處理錯誤
          console.error(error)
        }
      }, 100)
    }
  }
)
// --------------

const keydownHandler = (event) => {
  console.log(event)
  if (event.key === 's' && event.ctrlKey) {
    event.preventDefault()
    submit()
  }
  if (event.key === 's' && event.altKey) {
    submit()
  }
}

onMounted(() => {
  document.addEventListener('keydown', keydownHandler)
})

onUnmounted(() => {
  document.removeEventListener('keydown', keydownHandler)
})
</script>

<template>
  <div class="row w-100">
    <q-input
      filled
      label="會員快速新增"
      v-model="data.id"
      class="q-ma-md"
      readonly
      :input-style="{ fontSize: '18px' }"
    >
      <template v-slot:after>
        <q-btn
          push
          icon="help_center"
          color="black"
          round
          size="md"
          class="q-ma-md"
        >
          <q-tooltip> 必填欄位:姓名,手機 快速儲存:Ctrl+s </q-tooltip>
        </q-btn>
      </template>
    </q-input>
  </div>
  <div class="row w-100">
    <q-input
      filled
      v-model="data.mobile"
      label="訂購人手機"
      @focus="setActiveField(data, 'mobile')"
      :input-style="{ fontSize: '20px' }"
      :loading="loading"
      ref="inputRef"
      class="q-ma-md"
    />

    <q-input
      filled
      v-model="data.name"
      :input-style="{ fontSize: '20px' }"
      label="訂購人名字"
      class="q-ma-md"
    />
    <div class="row justify-around" style="font-size: 20px">
      <q-radio v-model="data.salutation_id" val="17" label="Mr" />
      <q-radio v-model="data.salutation_id" val="18" label="Ms" />
    </div>
  </div>
  <div class="row w-100">
    <q-input
      filled
      v-model="data.payment_tin"
      @focus="setActiveField(data, 'payment_tin')"
      label="統編"
      style="padding: 0"
      class="q-ma-md"
      :loading="invoiceIDfinding"
      :input-style="{ fontSize: '20px' }"
    />
    <q-input
      filled
      v-model="data.payment_company"
      @focus="setActiveField(data, 'payment_company')"
      type="text"
      label="訂購公司"
      class="q-ma-md"
      :input-style="{ fontSize: '20px' }"
    />
    <q-input
      filled
      v-model="data.payment_department"
      @focus="setActiveField(data, 'payment_department')"
      type="text"
      label="部門"
      class="q-ma-md"
      :input-style="{ fontSize: '20px' }"
      style="padding: 0"
    />
  </div>
  <div class="row w-100">
    <q-input
      style="width: 75px"
      filled
      v-model="data.telephone_prefix"
      type="text"
      @focus="setActiveField(data, 'telephone_prefix')"
      label="區碼"
      class="q-my-md q-ml-md"
      :input-style="{ fontSize: '20px' }"
    />
    <q-input
      filled
      style="width: 220px"
      v-model="data.telephone"
      label="市內電話"
      class="q-my-md q-mr-md"
      @focus="setActiveField(data, 'telephone')"
      :input-style="{ fontSize: '20px' }"
    />
    <q-input
      filled
      v-model="prefix"
      type="text"
      label="分機"
      class="q-ma-md"
      :input-style="{ fontSize: '20px' }"
    />
  </div>
  <!-- <td colspan="2">
             <q-input
              filled
              label="建立於"
              v-model="data.created_at"
              readonly
              style="padding: 0; font-size: 20px"
            /> -->
  <!-- </td> -->
  <!-- <td width="100"></td> -->
  <!-- <td></td> -->

  <div class="row items-center">
    <q-select
      style="padding: 2px; width: 125px; font-size: 20px"
      type="text"
      filled
      v-model="data.shipping_state_id"
      label="縣市"
      emit-value
      map-options
      class="q-ma-md q-mr-lg"
      :options="address.state"
    />

    <q-select
      style="padding: 2px; width: 125px; font-size: 20px"
      filled
      v-model="data.shipping_city_id"
      label="區"
      emit-value
      map-options
      :options="address2Options"
      class="q-ma-md q-ml-lg"
    />
    <q-input
      filled
      style="padding: 2px; width: 300px; font-size: 20px"
      label="路名"
      class="q-ma-md col-3"
      v-model="data.shipping_road"
      clearable
    >
      <template v-slot:append>
            <q-btn-dropdown
              v-if="data.shipping_city_id && data.shipping_state_id"
              v-model="menuState"
              color="primary"
              outlined
              class="q-ml-lg"
            >
              <div class="row w-100 items-start">
                <q-btn
                  v-for="road1 of road.roadselect"
                  :key="road1.id"
                  clickable
                  color="primary"
                  class="q-ma-xs col-1 roadBtn"
                  v-close-popup
                  @click="onItemClick(road1.value, road1.label)"
                >
                  {{ road1.value }}
                </q-btn>
              </div>
            </q-btn-dropdown>
          </template>
    </q-input>
    <!-- <q-select
                     filled
                    v-model="data.shipping_road"
                    type="text"
                    label="路名"
                    style="padding: 2px; width: 220px; font-size: 20px"
                    :options="roadOptions"
                    use-input
                    @filter="filterRoadOptions"
                    @input="selectRoadOptions"
                    :loading="loading"
                  /> -->

    <q-input
      style="padding: 2px; width: 400px"
      filled
      v-model="data.shipping_address1"
      @focus="setActiveField(data, 'shipping_address1')"
      type="text"
      label="門牌號碼"
      class="q-ma-md col-3"
      :input-style="{ fontSize: '20px' }"
    >
    </q-input>

  </div>

  <!-- <q-input
              filled
              v-model="data.shipping_personal_name"
              type="text"
              label="收件人"
              :input-style="{ fontSize: '20px' }"
            /> -->
  <td>
    <!-- <q-input
              filled
              v-model="data.shipping_phone"
              type="tel"
              label="收件人電話"
              @focus="setActiveField(data, 'shipping_phone')"
              :input-style="{ fontSize: '20px' }"
            /> -->
  </td>

      <div class="row q-mt-xl w-100">
        <div class="row  col-11">
          <q-btn
            label="清除"
            type="reset"
            size="30px"
            color="red"
            @click="back()"
            class="q-ma-md"
          />
          <q-btn
            label="儲存"
            type="submit"
            color="primary"
            size="30px"
            @click="submit()"
            class="q-ma-md"
          />
        </div>

      </div>

  <div class="q-pa-md w-100">
    <!-- <SmallKeypad @keypadInput="handleKeypadInput" /> -->
  </div>
</template>

<style lang="scss" scoped>
@import "src/css/order.scss";
</style>
