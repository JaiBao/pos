<script setup>
import { watch, ref, onMounted } from 'vue' // watch
import { apiAuth } from 'src/boot/axios'
import { UseAddressStore } from 'src/stores/address'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
// import SmallKeypad from 'src/components/SmallKeypad.vue'

const $q = useQuasar()
const data = ref({})
const route = useRoute()
const router = useRouter()
const datasend = ref({})
const prefix = ref('')
const address = UseAddressStore()
const addressoptions = address.state
const address2Options = ref([])
const salutation = [
  { label: '先生', value: 17 },
  { label: '小姐', value: 18 }
]
const addressForm = ref({
  lane: '', // 巷
  alley: '', // 弄
  no: '', // 號
  floor: '', // 樓
  at: '', // 之幾
  room: '' // 室
})
const generateAddress = async () => {
  console.log(addressForm.value)
  data.value.shipping_address1 = `${addressForm.value.lane !== '' ? addressForm.value.lane + '巷' : ''}` +
    `${addressForm.value.alley !== '' ? addressForm.value.alley + '弄' : ''}` +
    `${addressForm.value.no !== '' ? addressForm.value.no + '號' : ''}` +
    `${addressForm.value.floor !== '' ? addressForm.value.floor + '樓' : ''}` +
    `${addressForm.value.at !== '' ? '之' + addressForm.value.at : ''}` +
    `${addressForm.value.room !== '' ? addressForm.value.room + '室' : ''}`
}
const getdata = async () => {
  const result = await apiAuth.get(`/member/member/${route.params.id}`)
  console.log(result.data)
  data.value = result.data
  prefix.value = data.value.telephone.split('#')[1] ? data.value.telephone.split('#')[1] : ''
  data.value.telephone = data.value.telephone.split('#')[0] ? data.value.telephone.split('#')[0] : ''
  const addressParts = await address.parseAddress(data.value.shipping_address1)
  addressForm.value.lane = addressParts.lane
  addressForm.value.alley = addressParts.alley
  addressForm.value.no = addressParts.no
  addressForm.value.floor = addressParts.floor
  addressForm.value.at = addressParts.at
  addressForm.value.room = addressParts.room
}
onMounted(() => {
  getdata()
  getFindus()
})

const submit = async () => {
  datasend.value = data.value
  datasend.value.member_id = data.value.id
  datasend.value.telephone = data.value.telephone + '#' + prefix.value
  try {
    const result = await apiAuth.post('/member/member/save', datasend.value)
    console.log(result)
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      position: 'center',
      icon: 'cloud',
      message: result.data.success
    })
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
  async (newValue) => {
    await address.getcity(newValue)
    address2Options.value = address.city
  },
  { immediate: true }
)
watch(
  () => addressForm.value, async () => {
    await generateAddress()
    console.log(data.value.shipping_address1)
  }, { deep: true }
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
const onItemClick = (val) => {
  data.value.salutation_id = val.value
}
const onItemClick2 = (val) => {
  data.value.shipping_salutation_id =
 val.value
}
const back = () => {
  router.push('/member')
}
const findUsOptions = ref([])
const getFindus = async () => {
  const { data } = await apiAuth.get(
    '/common/term?filter_taxonomy_code=member_how_to_find_us'
  )
  const findus = await data.data.filter(
    (res) => res.taxonomy_code === 'member_how_to_find_us'
  )
  console.log(findus)
  for (let i = 0; i < findus.length; i++) {
    findUsOptions.value.push(findus[i])
  }
}
// ---------------------------------------
</script>

<template>
  <div class="row w-100 bg-dark q-pa-lg items-center justify-end text-white">
    <div class="col-3"><div class="text-h4">修改會員資料</div></div>
    <div class="col-3"></div>
    <div class="col-6 text-h6 text-right">
      會員編號 : {{ data.id }} 建立時間 : {{ data.created_at }}
    </div>
  </div>
  <div class="row w-100 q-pa-md items-center ">
    <span class="q-mx-md">會員名稱</span>
    <q-input
      filled
      v-model="data.name"
      class="nameInput q-mx-md "
      :input-style="{ fontSize: '20px' }"
      label="訂購人名字"
    >
      <template v-slot:append>
        <q-btn-dropdown color="accent" size="10px" round>
          <q-list>
            <q-item
              clickable
              v-close-popup
              v-for="(item, index) in salutation"
              :key="index"
              @click="onItemClick(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>
    </q-input>
    <span class="q-mx-md text-h6">
      {{
        data.salutation_id === 17 ? "先生" : data.salutation_id === 18 ? "小姐" : ""
      }}
    </span>
    <span class="q-mx-md">連絡電話</span>
    <q-input
      filled
      v-model="data.mobile"
      label="連絡電話"
      class="nameInput"
      @focus="setActiveField(data, 'mobile')"
      :input-style="{ fontSize: '20px' }"
      :loading="loading"
    />
    <span class="q-mx-md">室內電話</span>
    <q-input
      style="width: 100px"
      filled
      v-model="data.telephone_prefix"
      type="text"
      class="q-mx-xs"
      @focus="setActiveField(data, 'telephone_prefix')"
      label="區碼"
      :input-style="{ fontSize: '20px' }"
    />
    <q-input
      filled
      v-model="data.telephone"
      label="市內電話"
      class="q-mx-xs telInput"
      @focus="setActiveField(data, 'telephone')"
      :input-style="{ fontSize: '20px' }"
    />
    <q-input
      style="width: 100px"
      filled
      v-model="prefix"
      type="text"
      class="q-mx-xs"
      @focus="setActiveField(data, 'telephone_prefix')"
      label="分機"
      :input-style="{ fontSize: '20px' }"
    />
  </div>
  <div class="row w-100 q-pa-md items-center">
    <span class="q-mx-md">公司資訊</span>
    <q-input
      filled
      v-model="data.payment_company"
      @focus="setActiveField(data, 'payment_company')"
      label="訂購公司"
      class="companyInput q-mr-xs q-ml-xs"
      :input-style="{ fontSize: '20px' }"
    />
    <q-input
      filled
      v-model="data.payment_department"
      @focus="setActiveField(data, 'payment_department')"
      label="部門"
      class="departInput q-mr-xs q-ml-xs"
      :input-style="{ fontSize: '20px' }"
    />
    <q-input
      filled
      v-model="data.payment_tin"
      @focus="setActiveField(data, 'payment_tin')"
      type="number"
      label="統編"
      class="departInput q-mr-xs q-ml-xs"
      :input-style="{ fontSize: '20px' }"
    />
  </div>
  <div class="row w-100 q-pa-md items-center ">
    <span class="q-mx-md">聯絡地址</span>
    <q-select
      filled
      v-model="data.shipping_state_id"
      map-options
      emit-value
      label="縣市"
      class="stateSelect q-mx-md"
      :options="addressoptions"
    />
    <q-select
      filled
      v-model="data.shipping_city_id"
      label="區"
      map-options
      emit-value
      class="stateSelect"
      :options="address2Options"
    />
    <q-input
      filled
      v-model="data.shipping_road"
      class="roadSelect q-mr-xs q-ml-md"
      label="路名"
      :options="roadOptions"
      use-input
      @filter="filterRoadOptions"
      @input="selectRoadOptions"
      :loading="loading"
    />
    <div class="row col items-center text-center">
      <q-input
      class="col q-ml-md fs-20px"
      standout="bg-pink-2"
      v-model="addressForm.lane"
      label=""
      ref="inputRef"
      :input-style="{ fontSize: '20px' }"
    />
    <div class="text-h6 col">巷</div>
    <q-input
      class="col fs-20px"
      standout="bg-pink-2"
      v-model="addressForm.alley"
      label=""
      ref="inputRef"
      :input-style="{ fontSize: '20px' }"
    />
    <div class="text-h6 col">弄</div>

    <q-input
      class="col fs-20px"
      standout="bg-pink-2"
      v-model="addressForm.no"
      label=""
      ref="inputRef"
      :input-style="{ fontSize: '20px' }"
    />
    <div class="text-h6 col">號</div>

    <q-input
      class="col fs-20px"
      standout="bg-pink-2"
      v-model="addressForm.floor"
      label=""
      ref="inputRef"
      :input-style="{ fontSize: '20px' }"
    />
    <div class="text-h6 col">樓</div>
    <div class="text-h6 col">之</div>
    <q-input
      class="col fs-20px"
      standout="bg-pink-2"
      v-model="addressForm.at"
      label=""
      ref="inputRef"
      :input-style="{ fontSize: '20px' }"
    />

    <q-input
      class="col fs-20px"
      standout="bg-pink-2"
      v-model="addressForm.room"
      label=""
      ref="inputRef"
      :input-style="{ fontSize: '20px' }"
    />
    <div class="text-h6 col">室</div>
    </div>

    <!-- <q-input
      filled
      class="road2Select q-mr-xs q-ml-md"
      v-model="data.shipping_address1"
      @focus="setActiveField(data, 'shipping_address1')"
      type="text"
      label="門牌號碼"
      :input-style="{ fontSize: '20px' }"
    /> -->
  </div>
  <div class="row w-100 q-px-md q-py-xs items-center justify-end">
    <div class="col-10 text-right">
      <!-- <q-btn
            color="warning"
            @click="run2('巷')"
            class="q-mt-md run2btnMember text-black"
            label="巷"
          />
          <q-btn
            color="warning"
            @click="run2('弄')"
            class="q-mt-md run2btnMember text-black"
            label="弄"
          />
          <q-btn
            color="warning"
            @click="run2('街')"
            class="q-mt-md run2btnMember text-black"
            label="街"
          />
          <q-btn
            color="warning"
            @click="run2('號')"
            class="q-mt-md run2btnMember text-black"
            label="號"
          />
          <q-btn
            color="warning"
            @click="run2('棟')"
            class="q-mt-md run2btnMember text-black"
            label="棟"
          />
          <q-btn
            color="warning"
            @click="run2('樓')"
            class="q-mt-md run2btnMember text-black"
            label="樓"
          />
          <q-btn
            color="warning"
            @click="run2('大樓')"
            class="q-mt-md run2btnMember text-black"
            label="大樓"
          />
          <q-btn
            color="warning"
            @click="run2('房')"
            class="q-mt-md run2btnMember text-black"
            label="房"
          />
          <q-btn
            color="warning"
            @click="run2('室')"
            class="q-mt-md run2btnMember text-black"
            label="室"
          /> -->
    </div>
  </div>
  <div class="row w-100 q-pa-md items-center">
    <span class="q-mx-md">收件名稱</span>
    <q-input
      filled
      v-model="data.shipping_personal_name"
      class="nameInput  q-mx-md"
      :input-style="{ fontSize: '20px' }"
      label="收件人名字"
    >

    <template v-slot:append>
        <q-btn-dropdown color="accent" size="10px" round>
          <q-list>
            <q-item
              clickable
              v-close-popup
              v-for="(item, index) in salutation"
              :key="index"
              @click="onItemClick2(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>
    </q-input>
    <span class="q-mx-md text-h6">
      {{
        data.shipping_salutation_id
 === 17 ? "先生" : data.shipping_salutation_id
 === 18 ? "小姐" : ""
      }}
    </span>
    <span class="q-mx-md text-h6">
      <!-- {{
        data.salutation_id === 17 ? "先生" : data.salutation_id === 18 ? "小姐" : ""
      }} -->
    </span>
    <span class="q-mx-md">連絡電話</span>
    <q-input
      filled
      v-model="data.shipping_phone"
      class="nameInput"
      label="收件人電話"
      @focus="setActiveField(data, 'shipping_phone')"
      :input-style="{ fontSize: '20px' }"
    />
    <span class="q-mx-md">如何知道</span>
    <q-select
      standout="bg-pink-2 text-black"
      v-model="data.find_us"
      label="哪裡得知"
      :options="findUsOptions"
      emit-value
      map-options
      option-value="code"
      option-label="name"
      class="col"
    />
    <!-- <span class="q-mx-md">室內電話</span>
    <q-input
      style="width: 100px"
      filled
      v-model="data.telephone_prefix"
      type="text"
      class="q-mx-xs"
      @focus="setActiveField(data, 'telephone_prefix')"
      label="區碼"
      :input-style="{ fontSize: '20px' }"
    />
    <q-input
      filled
      v-model="data.telephone"
      label="市內電話"
      class="q-mx-xs telInput"
      @focus="setActiveField(data, 'telephone')"
      :input-style="{ fontSize: '20px' }"
    />
    <q-input
      style="width: 100px"
      filled
      v-model="data.telephone_prefix"
      type="text"
      class="q-mx-xs"
      @focus="setActiveField(data, 'telephone_prefix')"
      label="分機"
      :input-style="{ fontSize: '20px' }"
    /> -->
  </div>
  <div class="row w-100 items-center q-pa-md">
    <!-- <span class="q-mx-md">送達公司</span> -->
    <!-- <q-input
      filled
      v-model="data.shipping_company"
      type="text"
      class="q-ml-md q-my-xs col-5"
      label="送達公司"
      :input-style="{ fontSize: '20px' }"
    /> -->

  </div>
  <div class="row w-100 q-pa-lg items-center">
    <q-editor
      min-height="6rem"
      v-model="data.comment"
      label="客戶備註"
      class="col-12"
    />
  </div>
  <div class="row w-100 q-pa-lg items-center justify-end">
    <q-btn
      label="返回"
      class="btnEdit"
      size="25px"
      color="dark q-mx-md"
      @click="back()"
    />
    <q-btn
      label="儲存"
      class="btnEdit"
      size="25px"
      color="accent"
      @click="submit()"
    />
  </div>
  <!-- <div class="q-pa-md w-100">
    <SmallKeypad @keypadInput="handleKeypadInput" style="display: none" />
  </div> -->
</template>

<style lang="scss" scoped>
@import "src/css/ordered.scss";
</style>
