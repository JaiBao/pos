<script setup>
import { ref, watch, onBeforeMount, onMounted, computed } from 'vue'
import { apiAuth } from 'src/boot/axios'
import { UseAddressStore } from 'src/stores/address'
import SmallKeypad from 'src/components/ControlKeypad.vue'
import { useRoute } from 'vue-router'
import { UseMealStore } from 'src/stores/meal'
import { UseRoadStore } from 'src/stores/road'
import { useTagStore } from 'src/stores/tag'

import { DateTime } from 'luxon'
import { useQuasar, Loading } from 'quasar'

const optionsGender = [
  { label: '先生', value: 17 },
  { label: '小姐', value: 18, color: 'green' }
]

const address = UseAddressStore()
const meal = UseMealStore()
const tag = useTagStore()
const road = UseRoadStore()
const $q = useQuasar()
const data = ref({ member: {} })
const route = useRoute()
const datasend = ref({})
const showDatePicker = ref(false)
// const prefix = ref("");
const keypad = ref(false)

// 分解 data.telephone 到新的 ref
const telephoneMain = ref('')
const telephoneExt = ref('')

watch(() => data.value.telephone, (newVal) => {
  // 只有当 newVal 有定義才调用 split
  if (newVal !== undefined) {
    const parts = newVal.split('#')
    telephoneMain.value = parts[0]
    telephoneExt.value = parts[1] || ''
  } else {
    // 如果 newVal 是 undefined，清空
    telephoneMain.value = ''
    telephoneExt.value = ''
  }
}, { immediate: true })

// 離開輸入框，更新 data.telephone
const updateTelephone = () => {
  data.value.telephone = `${telephoneMain.value}${telephoneExt.value ? '#' + telephoneExt.value : ''}`
}

const addressForm = ref({
  lane: '', // 巷
  alley: '', // 弄
  no: '', // 號
  floor: '', // 樓
  at: '', // 之幾
  room: '' // 室
})
// ------------------------------------
address.getstate()
const picks = [
  { label: '外送', value: 'shipping_delivery' },
  { label: '自取', value: 'shipping_pickup' }
]
const addressoptions = address.state
const tinOptions = [
  { label: '需要統編', value: 1 },
  { label: '不要統編', value: 0 }
]
const eventOptions = ref(tag.tag)
// -----------------------------------------------------------------------------------

const getdata = async () => {
  Loading.show()
  if (meal.shouldEdit === true) {
    Loading.hide()

    return
  }
  const result = await apiAuth.get(`/sale/order/${route.params.id}`)
  data.value = result.data
  data.value.member = result.data.member

  // console.log('data拉', data.value.member)
  meal.order = result.data
  meal.salutation_id = result.data.member.salutation_id
  meal.shipping_salutation_id = result.data.member.shipping_salutation_id
  datasend.value = result.data
  await address.getcity(data.value.shipping_state_id)
  road.getRoad(data.value.shipping_state_id, data.value.shipping_city_id)
  meal.id = result.data.code
  meal.status_id = result.data?.status_code
  meal.source = result.data.source
  if (meal.status_id === undefined) {
    meal.status_id = result.data?.status_id
  }
  meal.orderdetails = data.value.order_products
  Loading.hide()
  meal.orderdetails.forEach(async (element) => {
    await meal.insertDataIntoTableRows(element)
  })
  meal.shouldEdit = true
  const addressParts = await address.parseAddress(meal.order.shipping_address1)
  addressForm.value.lane = addressParts.lane
  addressForm.value.alley = addressParts.alley
  addressForm.value.no = addressParts.no
  addressForm.value.floor = addressParts.floor
  addressForm.value.at = addressParts.at
  addressForm.value.room = addressParts.room
  const convertTag = await tag.convertTags(meal.order.order_tags)
  meal.order.order_tags = convertTag
}

onBeforeMount(() => {
  getdata()
})
onMounted(() => {
  tag.getTags()
})
let address2Options = address.city

// -----------------------------------------------

const inputRef = ref(null)
// function run2 (message) {
//   data.value.shipping_address1 += message
//   inputRef.value.focus()
// }

watch(
  () => data.value.delivery_date_ymd,
  async (newVal, oldVal) => {
    const date = DateTime.fromFormat(newVal, 'yyyy-MM-dd').setZone(
      'Asia/Taipei'
    )
    data.value.delivery_weekday = date.weekdayLong
  }
)
watch(
  () => data.value.shipping_state_id,
  async (newVal, oldVal) => {
    console.log(newVal)
    address.getcity(newVal)
    address2Options = address.city
    address2Options.push({ label: '-', value: '' })
  }
)

// sb備註

const dropdownOpenRemark = ref(false)
const dropdownOpenMeal = ref(false)
const optionsRemark = ref([])
const optionsMeal = ref([])

async function fetchAllPages (apiUrl, params) {
  let currentPage = 1
  let fetchedData = []
  let totalPages = 1

  try {
    while (currentPage <= totalPages) {
      const response = await apiAuth.get(apiUrl, { params: { ...params, page: currentPage } })
      fetchedData = fetchedData.concat(response.data.data)
      totalPages = response.data.last_page
      currentPage++
    }
  } catch (error) {
    console.error('Error fetching paginated data:', error)
  }

  return fetchedData
}

onMounted(async () => {
  const fetchedRemarkOptions = await fetchAllPages('/sale/order/phrases/phrase_order_comment', {})
  optionsRemark.value = fetchedRemarkOptions.map(option => option.name)

  const fetchedMealOptions = await fetchAllPages('/sale/order/phrases/phrase_order_extra_comment', {})
  optionsMeal.value = fetchedMealOptions.map(option => option.name)

  // 備註導入再watch新數值
  watch(() => data.value.comment, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      dropdownOpenRemark.value = true
    }
  })

  watch(() => data.value.extra_comment, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      dropdownOpenMeal.value = true
    }
  })
})

const filteredRemarkOptions = computed(() => optionsRemark.value.filter(option => option.toLowerCase().includes(data.value.comment.toLowerCase())))
const filteredMealOptions = computed(() => optionsMeal.value.filter(option => option.toLowerCase().includes(data.value.extra_comment.toLowerCase())))

function selectRemarkOption (option) {
  data.value.comment = option
  dropdownOpenRemark.value = false
}

function selectMealOption (option) {
  data.value.extra_comment = option
  dropdownOpenMeal.value = false
}

// -------------------
// 客戶備註 --------------------------------------------------------
function showDialog2 () {
  currentPage2.value = 1
  dialogVisible2.value = true
}
const dialogVisible2 = ref(false)
const option2s = ref([])
let totalPage2s
const getExtraComments2 = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get(
      '/sale/order/phrases/phrase_order_comment',
      {
        params: {
          page: currentPage2.value
        }
      }
    )
    const extraComments = response.data.data
    totalPage2s = response.data.last_page
    option2s.value = []
    for (let i = 0; i < extraComments.length; i++) {
      option2s.value.push(extraComments[i].name)
    }
  } catch (error) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'cloud_off',
      message: error.message
    })
  }
}

getExtraComments2()

// const ITEMS_PER_PAGE2 = 10
const currentPage2 = ref(1)

watch(
  () => data.value.comment,
  (newVal) => {
    if (newVal.includes(',,')) {
      showDialog2()
    }
  }
)
function selectOption2 (option2) {
  if (data.value.comment === '.,,') {
    data.value.comment = ' '
    data.value.comment = option2
  } else {
    data.value.comment += ' ' + option2
  }

  data.value.comment = data.value.comment.replace(',,', '')
  closeDialog2()
}
function closeDialog2 () {
  dialogVisible2.value = false
}
watch(currentPage2, async (newPage, oldPage) => {
  if (newPage !== oldPage) {
    currentPage2.value = newPage // 使用 .value 來更新 ref 的值
    await getExtraComments2() // 重新獲取數據
  }
})
// --------------------------------------------------------
function showDialog () {
  // searchTerm.value = ''
  currentPage.value = 1
  dialogVisible.value = true
}
const dialogVisible = ref(false)
const option2 = ref([])
const currentPage = ref(1)
let totalPage2
const getExtraComments = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get(
      '/sale/order/phrases/phrase_order_extra_comment',
      {
        params: {
          page: currentPage.value
        }
      }
    )
    const extraComments = response.data.data
    totalPage2 = response.data.last_page
    option2.value = []
    for (let i = 0; i < extraComments.length; i++) {
      option2.value.push(extraComments[i].name)
    }
  } catch (error) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      position: 'center',
      icon: 'cloud_off',
      message: error.message
    })
  }
}

getExtraComments()

// const ITEMS_PER_PAGE = 10
// const searchTerm = ref('')

watch(
  () => data.value.extra_comment,
  (newVal) => {
    if (newVal.includes(',,')) {
      showDialog()
    }
  }
)
function selectOption (option) {
  if (data.value.extra_comment === ',,') {
    data.value.extra_comment = option
  } else {
    data.value.extra_comment += ' ' + option
  }
  data.value.extra_comment = data.value.extra_comment.replace(',,', '')
  closeDialog()
}
function closeDialog () {
  dialogVisible.value = false
}
watch(currentPage, async (newPage, oldPage) => {
  if (newPage !== oldPage) {
    currentPage.value = newPage // 使用 .value 來更新 ref 的值
    await getExtraComments() // 重新獲取數據
  }
})
// -----------------------------------------------------
const generateAddress = async () => {
  console.log(addressForm.value)
  data.value.shipping_address1 = `${addressForm.value.lane !== '' ? addressForm.value.lane + '巷' : ''}` +
    `${addressForm.value.alley !== '' ? addressForm.value.alley + '弄' : ''}` +
    `${addressForm.value.no !== '' ? addressForm.value.no + '號' : ''}` +
    `${addressForm.value.floor !== '' ? addressForm.value.floor + '樓' : ''}` +
    `${addressForm.value.at !== '' ? '之' + addressForm.value.at : ''}` +
    `${addressForm.value.room !== '' ? addressForm.value.room + '室' : ''}`
}
watch(addressForm.value, async (newVal, oldVal) => {
  await generateAddress()
  console.log(data.value.shipping_address1)
})

// -----------------------------------------------road

// const onItemClick = (val, val2) => {
//   console.log('Clicked on an Item')
//   data.value.shipping_city_id = val2.split('_')[0]
//   data.value.shipping_road = val
// }
watch(
  () => data.value.shipping_road,
  async (newVal, old) => {
    await road.getRoadFull(
      data.value.shipping_state_id,
      data.value.shipping_city_id,
      newVal
    )
    await road.getRoadSelectFilter(
      data.value.shipping_state_id,
      data.value.shipping_city_id,
      newVal
    )
    data.value.shipping_road_abbr = newVal
  }
)
watch(
  () => [data.value.shipping_city_id, data.value.shipping_state_id],
  async () => {
    await road.getRoad(
      data.value.shipping_state_id,
      data.value.shipping_city_id
    )
    await road.getRoadSelect(
      data.value.shipping_state_id,
      data.value.shipping_city_id
    ) //
  }
)
// ---------------------------------------
const activeObject = ref('')
const activeKey = ref('')
const setActiveField = (obj, key) => {
  activeObject.value = obj
  activeKey.value = key
}
const handleKeypadInput = (input) => {
  console.log('Received value:', input)
  // 處理非數字和特殊字符
  if (
    typeof input === 'string' &&
    isNaN(Number(input)) &&
    !['backspace', '*', '=', '+', ':', '-'].includes(input)
  ) {
    return
  }
  if (activeObject.value && activeKey.value) {
    const key = activeKey.value
    if (input === 'backspace') {
      // 刪除最後一個字符
      activeObject.value[key] = activeObject.value[key].slice(0, -1)
    } else if (['*', '=', '+', ':', '-'].includes(input)) {
      activeObject.value[key] += input
    } else {
      // 其他數字和字符
      activeObject.value[key] += input
    }
  }
}
// 手機號碼規則
const validatePhoneNumber = number => {
  const phoneRegex = /^09\d{8}$/
  return phoneRegex.test(number)
}
const emit = defineEmits(['change'])
const gotoNext = () => {
  const cleanPhoneNumber = data.value.mobile.replace(/-/g, '')
  if (!validatePhoneNumber(cleanPhoneNumber)) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      position: 'center',
      message: '請填寫有效的訂購人手機號碼'
    })
    return
  }
  emit('change')
}

// -----------------------------------------------------------

</script>

<template>
  <div class="row" style="height: 100%">
    <div class="row w-100 text-h6 q-pa-md">訂購人資訊</div>
    <div class="q-gutter-md row items-start justify-center">
      <table
        cellpadding="2"
        style="width: 100%; table-layout: fixed; word-break: break-all"
      >
        <tr>
          <td colspan="2">
            <q-input
              standout="bg-pink-2"
              label="建立於"
              v-model="data.order_date"
              style="padding: 0; font-size: 20px"
            />
          </td>
          <td colspan="2">
            <q-input
              standout="bg-pink-2"
              label="訂單編號"
              v-model="data.code"
              :input-style="{ fontSize: '20px' }"
            />
          </td>
          <td colspan="2">
            <q-input
              standout="bg-pink-2"
              v-model="data.personal_name"
              :input-style="{ fontSize: '20px' }"
              :loading="loading"
              label="訂購人名字"
            />

          </td>
          <td colspan="1">

            <q-option-group
              :options="optionsGender"
              type="radio"
              v-model="data.member.salutation_id"
              dense
              class="optionGroup"
            />
          </td>
          <td colspan="2">
            <q-input
              standout="bg-pink-2"
              v-model="data.mobile"
              label="訂購人手機"
              :input-style="{ fontSize: '19px' }"
              :loading="loading"
              @focus="setActiveField(data, 'mobile')"
            />
          </td>
        </tr>
        <tr>

          <td>
            <q-btn
              color="accent"
              style="width: 100px; height: 55px"
              class="q-mb-xs q-pa-none"
            >
              {{ data.delivery_date_ymd }}
              <q-popup-proxy
                @before-show="updateProxy"
                cover
                v-model="showDatePicker"
                transition-show="scale"
                transition-hide="scale"
                style="width: 800px"
              >
                <q-date
                  v-model="data.delivery_date_ymd"
                  @input="$emit('close')"
                  mask="YYYY-MM-DD"
                >
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="取消" color="red" v-close-popup />
                    <q-btn
                      label="確認"
                      color="primary"
                      @click="save"
                      v-close-popup
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
          </td>
          <td>
            <q-input
              standout="bg-pink-2"
              v-model="data.delivery_weekday"
              label="星期"
              :input-style="{ fontSize: '20px' }"
              readonly
            />
          </td>
          <td colspan="2">
            <q-input
              v-model="data.delivery_time_range"
              standout="bg-pink-2"
              label="送達時間範圍"
              @focus="setActiveField(data, 'delivery_time_range')"
              mask="####-####"
              style="font-size: 15px"
              :input-style="{ fontSize: '20px' }"
            />
          </td>
          <td colspan="4">
            <div class="row w-100 items-center">
              <div class="text-h6 q-mx-xs">市內電話</div>
              <q-input
                style="width: 80px"
                standout="bg-pink-2 q-ml-sm"
                v-model="data.telephone_prefix"
                label="區碼"
                :input-style="{ fontSize: '20px' }"
                @focus="setActiveField(data, 'telephone_prefix')"
              />
              <!-- <q-input
                standout="bg-pink-2"
                v-model="data.telephone"
                label="市內電話"
                class="col"
                :input-style="{ fontSize: '20px' }"
                @focus="setActiveField(data, 'telephone')"
              /> -->

               <!-- 市話输入框 -->
  <q-input
    standout="bg-pink-2 q-ml-sm"
    style="margin:0 2px"
    v-model="telephoneMain"
    label="市內電話"
    class="col"
    :input-style="{ fontSize: '20px' }"
    @blur="updateTelephone"
  />

  <!-- 分機输入框 -->
  <q-input
    standout="bg-pink-2 q-ml-sm"
    style="margin:0 2px"
    v-model="telephoneExt"
    label="分機"
    class="col"
    :input-style="{ fontSize: '20px' }"
    @blur="updateTelephone"
  />
              <!-- <q-input
                standout="bg-pink-2"
                label="分機"
                v-model="prefix"
                class="col"
                :input-style="{ fontSize: '20px' }"
                @focus="setActiveField('', 'prefix')"
              /> -->
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <div class="text-h6 q-ma-xs">收件人資訊</div>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <q-select
              standout="bg-pink-2"
              v-model="data.shipping_method"
              label="取貨方式"
              :options="picks"
              emit-value
              map-options
              :rules="[(val) => !!val || ' 請選擇取貨方式 ']"
              style="padding: 0; font-size: 20px"
            />
          </td>
          <td>
            <q-input
              standout="bg-pink-2"
              v-model="data.delivery_date_hi"
              label="出餐時間"
              @focus="setActiveField(data, 'delivery_date_hi')"
              @input="showDialog2"
              :input-style="{ fontSize: '20px' }"
            />
          </td>
          <td>
            <q-option-group
              v-model="data.is_payment_tin"
              :options="tinOptions"
              size="2rem"
              inline
              class="col"
            />
          </td>

          <td colspan="2">
            <q-input
              standout="bg-pink-2"
              v-model="data.payment_tin"
              type="number"
              label="統編"
              style="padding: 0"
              @focus="setActiveField(data, 'payment_tin')"
              :input-style="{ fontSize: '20px' }"
            />
          </td>
          <td colspan="4">
            <q-input
              standout="bg-pink-2"
              v-model="data.payment_company"
              type="text"
              label="訂購公司"
              :input-style="{ fontSize: '20px' }"
              style="padding: 0"
            />
          </td>
          <td colspan="2">
            <q-input
              standout="bg-pink-2"
              v-model="data.payment_department"
              type="text"
              label="部門"
              :input-style="{ fontSize: '20px' }"
              style="padding: 0"
            />
          </td>
        </tr>
        <tr>
          <td colspan="1">
            <q-input
              standout="bg-pink-2"
              v-model="data.shipping_personal_name"
              type="text"
              label="收件人"
              :input-style="{ fontSize: '20px' }"
            />
            <!-- <q-option-group
              :options="optionsGender"
              type="radio"
              v-model="data.gender2"
              dense
              class="optionGroup"
            /> -->
          </td>
          <td colspan="1">

<q-option-group
  :options="optionsGender"
  type="radio"
  v-model="data.member.shipping_salutation_id"
  dense
  class="optionGroup"
/>
</td>
          <td colspan="2">
            <q-input
              standout="bg-pink-2"
              v-model="data.shipping_phone"
              type="tel"
              label="收件人電話"
              :input-style="{ fontSize: '20px' }"
            />
          </td>
          <td colspan="8">
            <div class="row w-100">
              <div class="row w-100 items-center">
                <div class="row w-100">
                  <q-select
                    type="text"
                    class="col-3 fs-20px q-mx-xs"
                    standout="bg-pink-2"
                    v-model="data.shipping_state_id"
                    label="縣市"
                    emit-value
                    map-options
                    :options="addressoptions"
                  >
                    <template v-if="data.shipping_state_id" v-slot:prepend>
                      <q-icon
                        name="cancel"
                        @click.stop.prevent="data.shipping_state_id = ''"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-select>
                  <q-select
                    standout="bg-pink-2"
                    v-model="data.shipping_city_id"
                    label="區"
                    class="col-3 fs-20px q-mx-xs"
                    map-options
                    emit-value
                    :options="address2Options"
                  >
                    <template v-if="data.shipping_city_id" v-slot:prepend>
                      <q-icon
                        name="cancel"
                        @click.stop.prevent="data.shipping_city_id = ''"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-select>
                  <q-input
                    standout="bg-pink-2"
                    v-model="data.shipping_road"
                    type="text"
                    class="fs-20px col"
                    label="路名"
                  >
                    <template v-if="data.shipping_road" v-slot:prepend>
                      <q-icon
                        name="cancel"
                        @click.stop.prevent="data.shipping_road = ''"
                        class="cursor-pointer"
                      />
                    </template>
                    <!-- <template v-slot:append>
                      <q-btn-dropdown color="accent" class="q-ml-lg">
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
                    </template> -->
                  </q-input>
                  <!-- <template v-slot:append>
                      <q-btn
                        round
                        dense
                        flat
                        icon="add"
                        @click="opendialogRoad(data.shipping_state_id,data.shipping_city_id)"
                      />
                    </template> -->
                </div>

              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <q-select
              standout="bg-pink-2"
              class="w-100"
              v-model="data.order_tags"
              multiple
              use-chips
              :options="eventOptions"
              stack-label
              label="訂單分類"
              use-input
              map-options
              emit-value
              />
          </td>
          <td colspan="2">
            <q-input
              standout="bg-pink-2"
              label="送達路段"
              v-model="data.shipping_road_abbr"
              :input-style="{ fontSize: '20px' }"
              class="col"
            />
          </td>
          <td colspan="8">
            <div class="col row justify-end items-center text-center">
              <!-- <q-input
              v-if="personForm.memberId!== '' "
              class="col q-ma-xs road2input"
              label="門牌號碼"
              standout="bg-pink-2 text-black"
              v-model="data.shipping_address1"
              type="text"
              ref="inputRef"
              @focus="setActiveField(personForm, 'road2')"
              :input-style="{ fontSize: '20px', color: 'black' }"
            /> -->
              <div class="col row justify-end items-end text-center">
                <q-input
                  class="col"
                  standout="bg-pink-2"
                  v-model="addressForm.lane"
                  label=""
                  ref="inputRef"
                  :input-style="{ fontSize: '20px' }"
                />
                <div class="text-h6 col">巷</div>
                <q-input
                  class="col"
                  standout="bg-pink-2"
                  v-model="addressForm.alley"
                  label=""
                  ref="inputRef"
                  :input-style="{ fontSize: '20px' }"
                />
                <div class="text-h6 col">弄</div>
                <q-input
                  class="col"
                  standout="bg-pink-2"
                  v-model="addressForm.no"
                  label=""
                  ref="inputRef"
                  :input-style="{ fontSize: '20px' }"
                />
                <div class="text-h6 col">號</div>
                <q-input
                  class="col"
                  standout="bg-pink-2"
                  v-model="addressForm.floor"
                  label=""
                  ref="inputRef"
                  :input-style="{ fontSize: '20px' }"
                />
                <div class="text-h6 col">樓</div>
                <div class="text-h6 col">之</div>
                <q-input
                  class="col"
                  standout="bg-pink-2"
                  v-model="addressForm.at"
                  label=""
                  ref="inputRef"
                  :input-style="{ fontSize: '20px' }"
                />
                <q-input
                  class="col"
                  standout="bg-pink-2"
                  v-model="addressForm.room"
                  label=""
                  ref="inputRef"
                  :input-style="{ fontSize: '20px' }"
                />
                <div class="text-h6 col">室</div>
                <td colspan="2">
            <q-input
              standout="bg-pink-2"
              v-model="data.shipping_comment"
              type="text"
              label="送達公司"
              :input-style="{ fontSize: '20px' }"
              style="padding: 0"
            />
          </td>
              </div>
              <!-- <div class="row w-100 items-center text-center">
              <q-input
                class="col"
                standout="bg-pink-2"
                v-model:number="addressForm.lane"
                label="巷"
                ref="inputRef"
                :input-style="{ fontSize: '20px' }"
              />
              <div class="text-h6 col">巷</div>

              <q-input
                class="col"
                standout="bg-pink-2"
                v-model:number="addressForm.alley"
                label="弄"
                ref="inputRef"
                :input-style="{ fontSize: '20px' }"
              />
              <div class="text-h6 col">弄</div>

              <q-input
                class="col"
                standout="bg-pink-2"
                v-model:number="addressForm.no"
                label="號"
                ref="inputRef"
                :input-style="{ fontSize: '20px' }"
              />
              <div class="text-h6 col">號</div>

              <q-input
                class="col"
                standout="bg-pink-2"
                v-model:number="addressForm.floor"
                label="樓"
                ref="inputRef"
                :input-style="{ fontSize: '20px' }"
              />
              <div class="text-h6 col">樓</div>

              <q-input
                class="col"
                standout="bg-pink-2"
                v-model:number="addressForm.at"
                label="之"
                ref="inputRef"
                :input-style="{ fontSize: '20px' }"
              />
              <div class="text-h6 col">之</div>

              <q-input
                class="col"
                standout="bg-pink-2"
                v-model:number="addressForm.room"
                label="室"
                ref="inputRef"
                :input-style="{ fontSize: '20px' }"
              />
              <div class="text-h6 col">室</div>
            </div> -->

              <!-- <div class="row w-100">
      <q-btn
        color="warning"
        @click="run2(' 巷 ')"
        text-color="black"
        class="q-mt-md run2btn"
        label="巷"
      />
      <q-btn
        color="warning"
        @click="run2(' 弄 ')"
        text-color="black"
        class="q-mt-md run2btn"
        label="弄"
      />
      <q-btn
        color="warning"
        @click="run2(' 衖 ')"
        text-color="black"
        class="q-mt-md run2btn"
        label="衖"
      />
      <q-btn
        color="warning"
        @click="run2(' 號 ')"
        text-color="black"
        class="q-mt-md run2btn"
        label="號"
      />
      <q-btn
        color="warning"
        @click="run2(' 棟 ')"
        text-color="black"
        class="q-mt-md run2btn"
        label="棟"
      />
      <q-btn
        color="warning"
        @click="run2(' 樓 ')"
        text-color="black"
        class="q-mt-md run2btn"
        label="樓"
      />
      <q-btn
        color="warning"
        @click="run2(' 大樓 ')"
        text-color="black"
        class="q-mt-md run2btn"
        label="大樓"
      />
      <q-btn
        color="warning"
        @click="run2(' 房 ')"
        text-color="black"
        class="q-mt-md run2btn"
        label="房"
      />
      <q-btn
        color="warning"
        @click="run2(' 室 ')"
        text-color="black"
        class="q-mt-md run2btn"
        label="室"
      />-->
            </div>
          </td>
        </tr>
        <!-- <tr>
        </tr> -->
        <tr>
          <td colspan="1">
                    <q-input
                      standout="bg-pink-2"
                      v-model="data.shipping_personal_name2"
                      type="text"
                      label="收件人二"
                      :input-style="{ fontSize: '20px' }"
                    />
                  </td>
                  <td colspan="2">
                    <q-input
                      standout="bg-pink-2"
                      v-model="data.shipping_phone2"
                      type="tel"
                      label="收件人二電話"
                      :input-style="{ fontSize: '20px' }"
                    />
                  </td>
          <td colspan="2">
            <q-input
              standout="bg-pink-2"
              label="控單表"
              @focus="setActiveField(data, 'delivery_date_hi')"
              @input="showDialog2"
              :input-style="{ fontSize: '20px' }"
            />
          </td>
          <td colspan="5">
            <!-- <q-input
              standout="bg-pink-2"
              v-model="data.comment"
              label="訂單備註"
              @input="showDialog2"
              :input-style="{ fontSize: '20px' }"
            /> -->
            <q-input
  standout="bg-pink-2 text-black"
  v-model="data.comment"
  label="訂單備註"
  :input-style="{ fontSize: '20px', color: 'black' }"
  class="col q-mx-xs"
  @focus="dropdownOpenRemark = true"
>
  <template v-slot:append>
    <q-icon name="arrow_drop_down" class="cursor-pointer" @click="dropdownOpenRemark = !dropdownOpenRemark" />
  </template>
  <q-menu   v-model="dropdownOpenRemark" fit no-focus>
    <q-list class="custom-menu-position">
      <q-item v-for="option in filteredRemarkOptions" :key="option" clickable @click="selectRemarkOption(option)">
        <q-item-section>{{ option }}</q-item-section>
      </q-item>
      <q-item v-if="filteredRemarkOptions.length === 0">
        <q-item-section class="text-h6 text-center">無此備註</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</q-input>
          </td>
        </tr>
        <td colspan="5">
            <!-- <q-input
              standout="bg-pink-2"
              v-model="data.extra_comment"
              label="餐點備註"
              :input-style="{ fontSize: '20px' }"
            /> -->
            <q-input
  standout="bg-pink-2 text-black"
  class="col q-mx-xs"
  v-model="data.extra_comment"
  label="餐點備註"
  @focus="dropdownOpenMeal = true"
>
  <template v-slot:append>
    <q-icon name="arrow_drop_down" class="cursor-pointer" @click="dropdownOpenMeal = !dropdownOpenMeal" />
  </template>
  <q-menu v-model="dropdownOpenMeal" fit no-focus>
    <q-list class="custom-menu-position">
      <q-item v-for="option in filteredMealOptions" :key="option" clickable @click="selectMealOption(option)">
        <q-item-section>{{ option }}</q-item-section>
      </q-item>
      <q-item v-if="filteredMealOptions.length === 0">
        <q-item-section class="text-h6 text-center">無此備註</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</q-input>

          </td>
        <td colspan="5">
            <q-input
              standout="bg-pink-2"
              v-model="data.internal_comment"
              type="text"
              label="內部備註"
              :input-style="{ fontSize: '20px' }"
              style="padding: 0"
            />
          </td>
        <tr>
          <td colspan="7"></td>
          <td colspan="5" class="income">
            <div class="row w-100 q-pa-md">
              <q-input
                filled
                v-model="data.payment_total"
                label="總金額"
                class="col q-mx-md"
              />
              <q-input
                filled
                v-model="data.payment_paid"
                label="已付"
                class="col q-mx-md"
              />
              <q-input
                filled
                v-model="data.payment_unpaid"
                label="未付"
                class="col q-mx-md"
              />
            </div>
          </td>
        </tr>

        <tr>
          <td colspan="">
            <div class="row w-100 justify-center items-center"></div>
          </td>
        </tr>
      </table>
    </div>
    <div class="row w-100 q-pa-xl">
      <div class="col-1">
        <q-btn icon="keyboard" @click="keypad = !keypad" round size="xl" />
      </div>
      <SmallKeypad v-if="keypad" @keypadInput="handleKeypadInput" />
      <div class="col"></div>
      <q-btn label="下一步" color="primary" class="col-3" @click="gotoNext" />
    </div>
  </div>
  <!-- 客戶備註 -->
  <q-dialog v-model="dialogVisible2" persistent>
    <q-card>
      <q-card-section>
        <q-item
          v-for="option2 in option2s"
          :key="option2"
          clickable
          @click="selectOption2(option2)"
        >
          <q-item-section>
            <q-item-label>{{ option2 }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-pagination
          v-if="totalPage2s > 1"
          v-model="currentPage2"
          :min="1"
          :max="totalPage2s"
          :input="true"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="取消" color="primary" @click="closeDialog2" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- ------------------------------- -->
  <!-- <q-dialog v-model="dialogRoad" persistent>
    <q-card>
      <q-card-section>
        <q-input
          v-model="searchTerm"
          placeholder="搜尋..."
          dense
          class="q-mb-md"
        />
        <q-item
          v-for="road in roads"
          :key="road"
          clickable
          @click="
            UseRoadStore().getRoadFull(
              data.shipping_state_id,
              data.shipping_city_id,
              road
            )
          "
        >
          <q-item-section>
            <q-item-label>{{ road }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-for="road in road.roadsFull"
          :key="road"
          clickable
          @click="copyroad(road)"
        >
          <q-item-section>
            <q-item-label>{{ road }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-pagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :min="1"
          :max="totalPages"
          :input="true"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="取消" color="primary" @click="resetdialogroad" />
      </q-card-actions>
    </q-card>
  </q-dialog> -->
  <q-dialog v-model="dialogVisible" persistent>
    <q-card>
      <q-card-section>
        <q-item
          v-for="option2 in option2"
          :key="option2"
          clickable
          @click="selectOption(option2)"
        >
          <q-item-section>
            <q-item-label>{{ option2 }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-pagination
          v-if="totalPage2 > 1"
          v-model="currentPage"
          :min="1"
          :max="totalPage2"
          :input="true"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="取消" color="primary" @click="closeDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
@import "src/css/ordered.scss";
</style>
