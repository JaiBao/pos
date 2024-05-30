<template>
  <div class="row w-100">
    <div class="col-7 q-pa-md">
      <div class="row w-100 items-center q-mb-lg justify-center">
        <q-input
          outlined
          v-model="timeForm.date"
          label="日期選擇"
          class="col-6 q-pr-xs item"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer q-pa-md">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="timeForm.date"
                  color="accent"
                  mask="YYYY-MM-DD"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
              class="col q-mr-xs weekday"
              v-model="week"
              standout="bg-pink-2 text-black"
              label="星期"
              :input-style="{ fontSize: '20px', color: 'black' }"
              readonly
            />
        <div class="col-6 q-pa-md row">
          <div class="text-h5 column col items-center">上午:{{ morningTotal }} <br> 下午:{{ afternoonTotal }}</div>
          <div class="text-h5 column col justify-center">全部:{{daytotal}}</div>
        </div>
      </div>
      <q-btn
              @click="tag.updateOrderQuantity(tag.limit)"
              label="儲存可訂量"
              color="accent"
            >
      </q-btn>
      <q-list bordered separator>
        <q-item
          clickable
          v-ripple
          v-for="(total, time) in timeSlotTotals"
          :key="time"
          @click="timeForm.time = time"
        >
          <!-- <q-item-section avatar>
            <div
              v-if="rowsLimit.some((limitRow) => limitRow.time === time)"
              class="text-h6"
              size="2.5rem"

            >滿</div>
          </q-item-section> -->
          <q-item-section>
            <div class="text-h5 q-py-xs row items-center">
              {{ time }}
              已定:{{ total }} - 剩餘:{{ getLimitOnce(time) - total }} - 可訂量
              <q-input
                class="limitinput"
                v-if="tag.findLimitItem(time)"
                :key="time"
                outlined
                v-model="tag.findLimitItem(time).limit"
                :readonly="readonly"
              />
            </div>
          </q-item-section>

          <q-item-section side>
            <q-btn
              v-if="!rowsLimit.some((limitRow) => limitRow.time === time)"
              @click="lock(time)"
              icon="check"
              color="green"
            >
              <q-tooltip
                v-if="!rowsLimit.some((limitRow) => limitRow.time === time)"
                class="w-50 h-50"
                @before-show="getpreview(time)"
              >
                <q-table
                  class="w-100"
                  :rows="rowspreview"
                  :columns="columns"
                  row-key="order_id"
                  hide-bottom
                  :rows-per-page-options="[0]"
                />
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="rowsLimit.some((limitRow) => limitRow.time === time)"
              icon="do_not_disturb_on"
              @click="unlock(time)"
              color="accent"
            >
            </q-btn>

            <q-tooltip
              v-if="rowsLimit.some((limitRow) => limitRow.time === time)"
              class="w-50 h-50"
              @before-show="getpreview(time)"
            >
            <q-table
                class="w-100"
                :rows="rowspreview"
                :columns="columns"
                row-key="order_id"
                hide-bottom
                :rows-per-page-options="[0]"
              />
            </q-tooltip>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="row w-100 justify-end">
        <div class="col"></div>
        <q-toggle
          v-model="readonly"
          label="鎖定可訂量"
          color="accent"
          class="q-mx-md"
        />
        <q-btn
          label="一鍵全鎖"
          color="dark"
          class="col-2 q-mr-md"
          @click="lockall"
          :loading="loading"
        />
        <q-btn
          label="一鍵全開"
          color="accent"
          class="col-2"
          @click="unlockall"
          :loading="loading"
        />
      </div>
    </div>

    <div class="col-5 q-pa-md">
      <q-table
        class="w-100"
        :rows="rows"
        :columns="columns"
        row-key="order_id"
        hide-bottom
        :rows-per-page-options="[0]"
      >
        <template v-slot:top>
          <div class="row w-100">
            <div class="text-h6 col text-center">
              {{ title }}
            </div>
          </div>
        </template>
        <template v-slot:body-cell-edit="props">
          <q-td auto-width>
            <q-btn @click="edit(props.row)" icon="edit" color="accent" />
          </q-td>
        </template>
        <template v-slot:body-cell-delete="props">
          <q-td auto-width>
            <q-btn
              @click="deleteTime(props.row._id)"
              icon="delete"
              color="dark"
            />
          </q-td>
        </template>
      </q-table>
      <div class="row w-100 items-center">
        <div class="col-6">
          <div v-if="addForm._id === ''" class="text-h6 col-12">新增一筆</div>
          <div v-if="addForm._id !== ''" class="text-h6 col-12">修改一筆</div>
          <div class="col-6">
            <q-input
              outlined
              v-model="addForm.order_id"
              label="訂單編號"
              class="item"
              @focus="setActiveField(addForm, 'order_id')"
            />
            <q-input
              outlined
              v-model="addForm.amount"
              label="數量"
              class="item"
              @focus="setActiveField(addForm, 'amount')"
            />
            <q-input outlined v-model="addForm.road" label="路/區" class="item">
              <template v-slot:append>
                <q-btn-dropdown color="accent" menu-anchor="center start">
                  <q-list>
                    <q-item
                      v-for="address in address.city"
                      :key="address.value"
                      clickable
                      v-close-popup
                      @click="onItemClick(address.label)"
                    >
                      <q-item-section avatar></q-item-section>
                      <q-item-section class="item">
                        {{ address.label }}
                      </q-item-section>
                      <q-item-section avatar></q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </template>
            </q-input>
            <q-input
              outlined
              v-model="addForm.remark"
              label="備註"
              class="item"
              @focus="setActiveField(addForm, 'remark')"
            />
            <q-btn
              v-if="addForm._id === ''"
              @click="add"
              label="新增"
              color="accent"
              class="q-mt-md q-mr-md"
            />
            <q-btn
              v-if="addForm._id !== ''"
              @click="editSubmit"
              label="修改"
              color="dark"
              class="q-mt-md q-mr-md"
            /><q-btn
              @click="clear"
              label="重來"
              color="secondary"
              class="q-mt-md"
            />
          </div>
        </div>
        <div class="col">
          <SmallKeypad @keypadInput="handleKeypadInput" />
        </div>
        <!-- <div class="col-6">
          <div class="col-3">
            <div class="text-h6">{{ title2 }}</div>
            <div v-for="(value, key) in findToday" :key="key">
              <q-input
                type="number"
                outlined
                v-model.number="findToday[key]"
                :label="`${key}`"
                class="q-my-xs"
              >
                <template v-slot:after>
                  <q-btn
                    color="accent"
                    icon="restart_alt"
                    @click="findToday[key] = 0"
                    class="q-ml-sm"
                  />
                </template>
              </q-input>
            </div>

            <q-btn
              @click="submit()"
              label="儲存"
              color="accent"
              class="q-mr-md"
            />
            <q-btn @click="soldOut" label="本日停賣" color="dark" />
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { DateTime } from 'luxon'
import { apiShit, apiOrder } from 'src/boot/axios'
import { useTagStore } from 'src/stores/tag'
import { UseAddressStore } from 'src/stores/address'
import SmallKeypad from 'src/components/ControlKeypad.vue'

const tag = useTagStore()
const address = UseAddressStore()
const today = ref(DateTime.now().toFormat('yyyy-MM-dd'))

const month = ref(DateTime.now().toFormat('yyyy-MM'))

const findToday = ref('')
const timeForm = ref({
  date: today,
  time: '09:00-10:00'

})

const week = computed(() => {
  const date = DateTime.fromISO(timeForm.value.date)
  return date.weekdayLong
})

const timeFormPreview = ref({
  date: today,
  time: '09:00-10:00'
})
const total = ref(0)
const daytotal = ref(0)
const morningTotal = ref(0)
const afternoonTotal = ref(0)
const title = computed(
  () =>
    `${timeForm.value.time} 總套數 ${total.value} 套 -  官網設定套數 : ${
      timeslot.value[timeForm.value.time]
    }`
)
// const title2 = ref(today.value + '的剩餘數量')
const dataget = ref([])
const columns = [
  { name: 'order_id', label: '訂單號', field: 'order_id' },
  { name: 'amount', label: '數量', field: 'amount' },
  { name: 'road', label: '路/區', field: 'road' },
  { name: 'remark', label: '備註', field: 'remark' },
  // { name: 'id', label: 'id', field: '_id' },
  { name: 'edit', label: '編輯', field: 'edit' },
  { name: 'delete', label: '刪除', field: 'delete' }
]
const options = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
  '17:00-18:00'
]
const timeslot = ref([])
const rows = ref([])
const rowspreview = ref([])
const rowsallday = ref([])
const rowsLimit = ref([])
const loading = ref(false)
const initialized = ref(false)
const timeSlotTotals = computed(() => {
  const totals = {}
  for (const [time, orders] of Object.entries(rowsallday.value)) {
    totals[time] = orders.reduce((sum, order) => sum + order.amount, 0)
  }
  return totals
})
watch(timeSlotTotals, (newVal) => {
  for (const [time, total] of Object.entries(newVal)) {
    if (getLimitOnce(time) - total < 0) {
      lock(time)
    } else if (getLimitOnce(time) - total > 0) {
      // unlock(time)
    }
  }
})
watchEffect(() => {
  daytotal.value = Object.values(timeSlotTotals.value).reduce(
    (sum, amount) => sum + amount,
    0
  )
  morningTotal.value = Object.values(timeSlotTotals.value).slice(0, 4).reduce((sum, amount) => sum + amount, 0)
  afternoonTotal.value = Object.values(timeSlotTotals.value).slice(4, 9).reduce((sum, amount) => sum + amount, 0)
})
// limit editing
const readonly = ref(true)
const getLimitOnce = (time) => {
  const limitObj = tag.limit.find((l) => l.time === time)
  return limitObj ? limitObj.limit : 'N/A'
}
// ----------------------------------------------------------------
function categorizeDataByTime (data, timeSlots) {
  const categorizedData = {}

  // Initialize categories for each time slot
  timeSlots.forEach((slot) => {
    categorizedData[slot] = []
  })

  // Categorize each data item into the corresponding time slot
  data.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(categorizedData, item.time)) {
      categorizedData[item.time].push(item)
    }
  })

  return categorizedData
}
const getpreview = async (val) => {
  timeFormPreview.value.time = val
  console.log(val)
  const { data } = await apiShit.post('/time/find', timeFormPreview.value)
  console.log(data.data)
  rowspreview.value = data.data
}
const get = async () => {
  const { data } = await apiShit.post('/time/find', timeForm.value)
  console.log(data.data)
  rows.value = data.data
  total.value = 0
  rows.value.forEach((item) => {
    total.value += item.amount
  })
}
const get2officalsite = async () => {
  try {
    const { data } = await apiOrder.get('/get-special')
    dataget.value = data
    const find = dataget.value[month.value]
    const todayData = find[today.value]
    findToday.value = todayData
    title.value = today.value + '的剩餘數量'
  } catch (error) {
    console.log(error)
  }
}
// allday
const getFor = async () => {
  try {
    const { data } = await apiShit.post('/time/findday', timeForm.value)
    rowsallday.value = categorizeDataByTime(data.data, options)
    console.log(rowsallday.value)
    // console.log(data)
  } catch (error) {
    console.log(error)
  }
}
// getlimit
const getLimit = async () => {
  try {
    const { data } = await apiShit.post('/timelimit/get', {
      date: timeForm.value.date
    })
    rowsLimit.value = data.data
  } catch (error) {
    console.log(error)
  }
}
// 預設套數
const getTimeslot = async () => {
  try {
    const { data } = await apiOrder.get('/get-timeslot')
    timeslot.value = data
    console.log(timeslot.value)
  } catch (error) {
    console.log(error)
  }
}
const lock = async (val) => {
  console.log(timeForm.value.date, val)
  try {
    const { data } = await apiShit.post('/timelimit/create', {
      date: timeForm.value.date,
      time: val
    })
    console.log(data)
    await getLimit()
  } catch (error) {
    console.log(error)
  }
}
const lockall = async (val) => {
  loading.value = true
  for (let i = 0; i < options.length; i++) {
    val = options[i]
    try {
      const { data } = await apiShit.post('/timelimit/create', {
        date: timeForm.value.date,
        time: val
      })
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  await getLimit()
  loading.value = false
}
const unlock = async (val) => {
  console.log(timeForm.value.date, val)
  try {
    const { data } = await apiShit.post('/timelimit/delete', {
      date: timeForm.value.date,
      time: val
    })
    console.log(data)
    await getLimit()
  } catch (error) {
    console.log(error)
  }
}
const unlockall = async (val) => {
  loading.value = true
  for (let i = 0; i < options.length; i++) {
    val = options[i]
    try {
      await apiShit.post('/timelimit/delete', {
        date: timeForm.value.date,
        time: val
      })
    } catch (error) {
      console.log(error)
    }
  }
  await getLimit()
  loading.value = false
}
const onItemClick = (val) => {
  addForm.value.road = val
}
const add = async () => {
  addForm.value.date = timeForm.value.date
  addForm.value.time = timeForm.value.time
  try {
    await apiShit.post('/time/create', addForm.value)
    await get()
    await getFor()
    clear()
  } catch (error) {
    console.log(error)
  }
}
const edit = (val) => {
  console.log(val)
  addForm.value._id = val._id
  addForm.value.order_id = val.order_id
  addForm.value.amount = val.amount
  addForm.value.road = val.road
  addForm.value.remark = val.remark
}

const clear = () => {
  addForm.value._id = ''
  addForm.value.order_id = ''
  addForm.value.amount = ''
  addForm.value.road = ''
  addForm.value.remark = ''
}
const editSubmit = async () => {
  addForm.value.date = timeForm.value.date
  addForm.value.time = timeForm.value.time
  try {
    const { data } = await apiShit.post(
      `/time/edit/${addForm.value._id}`,
      addForm.value
    )
    console.log(data)
    await get()
    await getFor()
    clear()
  } catch (error) {}
}
const deleteTime = async (val) => {
  try {
    const { data } = await apiShit.delete(`/time/delete/${val}`)
    console.log(data)
    await get()
    await getFor()
  } catch (error) {
    console.log(error)
  }
}
const addForm = ref({
  _id: '',
  order_id: '',
  amount: 0,
  road: '',
  remark: ''
})
watch(
  timeForm.value,
  () => {
    getFor()
    get()
    getLimit()
  },
  { immediate: true }
)
const handleKeypadInput = (input) => {
  if (activeObject.value && activeKey.value) {
    const key = activeKey.value
    let currentVal = activeObject.value[key]
    // 檢查可能為 undefined, null 或其他非字符串的情況
    currentVal =
      currentVal !== undefined && currentVal !== null ? String(currentVal) : ''
    if (input === 'backspace') {
      // 刪除最後一個字符
      activeObject.value[key] = currentVal.slice(0, -1)
    } else if (['*', '=', '+', ':', '-'].includes(input)) {
      activeObject.value[key] = currentVal + input
    } else {
      // 其他數字和字符
      activeObject.value[key] = currentVal + input
    }
  }
}
const activeObject = ref('')
const activeKey = ref('')

const setActiveField = (obj, key) => {
  activeObject.value = obj
  activeKey.value = key
}

onMounted(async () => {
  tag.getOrderQuantity()
  getFor()
  getLimit()
  await address.getcitySelect(2)
  await address.getcitySelect(3)
  get2officalsite()
  getTimeslot()
  initialized.value = true
})
</script>

<style lang="scss" scoped>
.item {
  font-size: 22px;
}
.limitinput {
  max-width: 100px;
  font-size: 30px;
}
.h-50 {
  height: 50vh;
}
</style>
