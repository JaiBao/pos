<template>
  <div class="q-pa-xs">
    <div class="text-h6 w-100 orderWho">訂購人資料</div>
    <div class="row w-100 items-center">
      <div class="col-4 row items-center">
        <q-input
                  standout="bg-pink-2 text-black"
                  class="col q-ma-xs statusSelect"
                  label="訂購日期"
                  :input-style="{ fontSize: '18px', color: 'black' }"
                  v-model="personForm.checkDate"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer q-mr-xs">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                        style="width: 800px"
                        v-model="showDatePicker2"
                      >
                        <q-date
                          v-model="personForm.checkDate"
                          @input="$emit('close')"
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
        </q-input>
        <q-select outlined class="col q-ma-xs w-95px" label="取貨方式"  :input-style="{ fontSize: '18px', color: 'black' }"/>
        <q-input outlined class="col q-ma-xs statusSelect" label="訂購人姓名"/>
      </div>

      <div class="col-8 row items-center">
        <q-option-group
          :options="options"
          type="radio"
          dense
          v-model="group"
          class="optionGroup"
        />

        <q-input outlined class="col phoneInput" label="訂購人手機" />
        <div class="text-h6 phoneH6">室內電話</div>
        <q-input outlined class="col q-ml-xs w-100px" label="區碼"/>
        <q-input outlined class="col q-ml-xs statusSelect" label="電話"/>
        <q-input outlined class="col q-ml-xs w-100px" label="分機"/>
      </div>
    </div>
    <div class="row w-100 items-center q-mt-md">
      <div class="col-4 q-pa-xs">
        <q-input outlined class="" label="訂購公司"/>
      </div>
      <div class="col-8 row items-center">
        <div class="text-h6 q-px-md">地址</div>
        <q-input outlined class="col q-ma-xs addressSelect" label="縣市"/>
        <q-input outlined class="col q-ma-xs addressSelect" label="區"/>
        <q-input outlined class="col q-ma-xs road2input" label="路名"/>
        <q-input outlined class="col q-ma-xs road2input" label="門牌號碼"/>
      </div>
    </div>

    <div class="row w-100 items-center q-mt-md">
      <div class="col-4 row">
        <q-input outlined class="col q-pa-xs" label="部門" />
        <q-input outlined class="col q-pa-xs" label="統一編號"/>
      </div>
      <div class="col-2"></div>
      <div class="col-6 row justify-end">
        <q-btn size="xl" class="text-black btnRun2 q-ma-xs" color="warning"
          >巷</q-btn
        >
        <q-btn size="xl" class="text-black btnRun2 q-ma-xs" color="warning"
          >弄</q-btn
        >

        <q-btn size="xl" class="text-black btnRun2 q-ma-xs" color="warning"
          >衖</q-btn
        >
        <q-btn size="xl" class="text-black btnRun2 q-ma-xs" color="warning"
          >房</q-btn
        >

        <q-btn size="xl" class="text-black btnRun2 q-ma-xs" color="warning"
          >室</q-btn
        >
        <q-btn size="xl" class="text-black btnRun2 q-ma-xs" color="warning"
          >棟</q-btn
        >

        <q-btn size="xl" class="text-black btnRun2 q-ma-xs" color="warning"
          >樓</q-btn
        >

        <q-btn size="xl" class="text-black btnRun2 q-ma-xs" color="warning"
          >號</q-btn
        >
      </div>
    </div>
    <div class="text-h6 w-100 orderWho2 q-mt-md">收件人資料</div>
    <div class="row w-100">
      <div class="col-2">
        <q-checkbox label="同訂購人資料" />
      </div>
    </div>
    <div class="row w-100 items-center">
      <div class="row w-100 items-center">
        <div class="col-3 row items-center">
          <q-input outlined class="col q-ma-xs statusSelect" />
          <q-input outlined class="col q-ma-xs statusSelect" />
        </div>
        <div class="col-1 q-mr-xl">
          <q-option-group
            :options="options"
            type="radio"
            v-model="group"
            class="optionGroup"
          />
        </div>
        <div class="col">
          <q-input outlined class="statusSelect" />
        </div>

        <div class="col-6 row items-center">
          <div class="text-h6 q-mx-xs">室內電話</div>
          <q-input outlined class="col q-ml-xs w-100px" />
          <q-input outlined class="col q-ml-xs statusSelect" />
          <q-input outlined class="col q-ml-xs w-100px" />
          <q-input outlined class="col q-ml-xs inputCompany" />
        </div>
      </div>
    </div>
    <div class="row w-100 items-center q-mt-md">
      <div class="col-7 row items-center">
        <q-btn class="col w-150px"/>
        <q-input outlined class="col q-ma-xs addressSelect" />
        <q-input outlined class="col q-ma-xs statusSelect" />
        <q-input outlined class="col q-ma-xs statusSelect" />
        <div class="col">
        <q-option-group
          :options="options"
          type="radio"
          v-model="group"
          class="optionGroup"
        />
      </div>
      </div>
      <div class="col-5 row items-center">

        <q-input outlined class="col q-ma-xs" />
      </div>
    </div>
    <div class="row w-100 justify-end btnSubmit">
      <q-btn outline class="col-1 w-150px"/>
      <q-btn outline class="col-1 w-150px"/>
      <q-btn outline class="col-1 w-150px"/>
      <q-btn outline class="col-1 w-150px"/>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const options = [
  { label: '先生', value: 'bat' },
  { label: '小姐', value: 'friend', color: 'green' }
]
const group = ref(null)

const personForm = reactive({
  checkDate: '',
  formattedDate: '', // 日期抓取
  pick: '', // 取貨方式
  weekday: '', // 星期抓取
  getDate: '', // 送達日期
  week: '', // 星期
  companyClass: '', // 公司類別
  company: '', // 訂購公司
  department: '', // 訂購部門
  compilation: '', // 統編
  name: '', // 訂購人
  tel: '', // 訂購人電話
  prefix: '', // 訂購人區碼
  hometel: '', // 訂購人住家電話
  hometel2: '', // 訂購人分機
  address: '', // 縣市
  address2: '', // 區域
  road: '', // 路名
  road2: '', // 門牌
  recipient: '', // 收件人
  recipientTel: '', // 收件人電話
  gender: '18', // 性別
  sameOrderCustomer: false, // 訂購人與收件人相同
  sameOrderCompany: false, // 訂購公司與收件公司相同
  noCompilation: 1, // 統編勾選
  getCompany: '', // 收件公司
  event: [], // 活動
  remark: '', // 備註
  orderStatu: '請選擇', // 訂單狀態
  memberId: '', // 會員 ID
  locationId: '和平', // 店家代號
  delivery_date_hi: '',
  time: '',
  time1: '',
  time2: '',
  comment: '',
  shipping_road_abbr: ''
})
</script>
<!--
<style lang="scss" scoped>
@import "../../css/order.scss";
</style> -->
