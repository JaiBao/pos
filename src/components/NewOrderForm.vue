<template>
  <q-card class="items-start word-break q-pa-none q-ma-none" id="bangdongcard">
    <div class="color2 bangdongdialog row items-center text-white">
      <div class="text-h5 col-1">{{ bangdongName }}</div>
      <div class="text-h5 q-ml-md col-3 row items-center">

        <q-input
          filled
          type="number"
          class="col-9 q-ml-lg"
          :input-style="{ fontSize: '20px' }"
          v-model.number="bangdongTotalQuantity"
          :bg-color="getInputColor(bangdongTotalQuantity)"
          label="數量總計"
          min="0"
        >
        <template v-slot:append>
              <q-btn
                dense
                flat
                round
                icon="add"
                @click="bangdongTotalQuantity ++"
              />
              <q-btn
                dense
                flat
                round
                icon="remove"
                @click="bangdongTotalQuantity --"
                :disable="bangdongTotalQuantity <= 0"
              />
            </template>
        </q-input>
      </div>
      <div class="col"></div>
      <q-input
        filled
        type="number"
        label-color="white"
        class="q-ma-xs w-110px text-white"
        :input-style="{ fontSize: '20px', color: 'white' }"
        v-model.number="bangdongArbitrarily"
        label="任意搭配"
        min="0"
      />
      <q-input
        min="0"
        filled
        label-color="white"
        class="q-ma-xs w-110px text-white"
        :input-style="{ fontSize: '20px', color: 'white' }"
        v-model.number="bangdongPrice"
        label="商品單價"
        readonly
      />
      <q-input
        filled
        label-color="white"
        class="q-ma-xs w-150px text-white"
        :input-style="{ fontSize: '20px', color: 'white' }"
        v-model.number="bangdongTotalQuantityPrice"
        label="餐點總計"
        readonly
        min="0"
      />
      <q-input
        filled
        label-color="white"
        class="q-ma-xs w-150px text-white"
        :input-style="{ fontSize: '20px', color: 'white' }"
        v-model.number="bangdongoptionPrice"
        label="選項總計"
        readonly
        min="0"
      />
      <q-input
        filled
        label-color="white"
        class="q-ma-xs w-150px text-white"
        :input-style="{ fontSize: '20px', color: 'white' }"
        v-model.number="bangdongfinalTotal"
        label="總計"
        readonly
        min="0"
      />
    </div>
    <div class="color1 bangdongdialog">
      <h5 style="margin: 0; padding: 0">{{ bangdongMainName }}</h5>
      <div class="row items-center">
        <q-item
          v-for="(bangdongMain, index) in bangdongMains"
          :key="index"
          class="flex-auto q-ma-none q-pa-none"

        >
          <q-input
            v-model.number="bangdongMain.quantity"
            :label="bangdongMain.shortname"
            :bg-color="getInputColor(bangdongMain.quantity)"
            class="q-ma-xs col"
            filled
            type="number"
            :input-style="{
              fontSize: '20px',
              margin: '0',
              color: 'black',
            }"
            :label-style="{ fontSize: '20px' }"
            min="0"
          >
            <template v-slot:append>
              <q-btn
                dense
                flat
                round
                icon="add"
                @click="bangdongMain.quantity ++"
              />
              <q-btn
                dense
                flat
                round
                icon="remove"
                @click="bangdongMain.quantity --"
                :disable="bangdongMain.quantity <= 0"
              />
            </template>
          </q-input>
        </q-item>
      </div>
    </div>
    <!-- 飲料 -->
    <div v-if="bangdongTotalQuantity > 0" class="color1 bangdongdialog">
      <h5 style="margin: 0; padding: 0">{{ bangdongDrinkName }}</h5>
      <div class="row items-center" style="height: 100%">
        <q-item
          v-for="(bangdongDrink, index) in bangdongDrinks"
          :key="index"
          class="flex-auto"
          style="margin: 0; padding: 0"

        >
          <q-input
            v-model.number="bangdongDrink.quantity"
            :label="bangdongDrink.name"
            :bg-color="getInputColor(bangdongDrink.quantity)"
            class="q-ma-xs col"
            filled
            type="number"
            :input-style="{ fontSize: '20px', margin: '0' }"
            :label-style="{ fontSize: '20px' }"
            min="0"
          >
          <template v-slot:append>
              <q-btn
                dense
                flat
                round
                icon="add"
                @click="bangdongDrink.quantity ++"
              />
              <q-btn
                dense
                flat
                round
                icon="remove"
                @click="bangdongDrink.quantity --"
                :disable="bangdongDrink.quantity <= 0"
              />
            </template>
            </q-input>
        </q-item>
      </div>
    </div>
    <!-- 配菜 -->
    <div class="color1 bangdongdialog hidden">
      <h5 style="margin: 0; padding: 0">{{ bangdongSideDishName }}</h5>
      <div class="row items-center">
        <q-item
          v-for="(bangdongSideDish, index) in bangdongSideDishes"
          :key="index"
          class="flex-auto"
          style="margin: 0; padding: 0"
        >
          <q-input
            v-model.number="bangdongSideDish.quantity"
            :label="bangdongSideDish.name"
            :bg-color="getInputColor(bangdongSideDish.quantity)"
            filled
            type="number"
            class="q-ma-xs col"
            :input-style="{ fontSize: '20px', margin: '0' }"
            :label-style="{ fontSize: '20px' }"
            min="0"
          />
        </q-item>
      </div>
    </div>
    <!-- 總計 -->

    <!-- 備註 -->
    <div class="color1 w-100 q-pa-xs q-mx-lg q-mt-xl">
      <div class="row w-100 justify-between">
        <q-input
          :bg-color="inputColor"
          outlined
          v-model="bangdongComment"
          label="商品備註"
          class="col-8"
        />

        <q-btn
          color="dark"
          label="取消"
          size="25px"
          @click="Resetbangdong"
          class="q-mx-xs btnSubmitCancel"
        />
        <q-btn
          color="primary"
          label="送出"
          type="submit"
          size="25px"
          class="q-mx-xs btnSubmitCancel"
          @click="submitBangdong"
        />
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, watch, reactive, computed, onMounted } from 'vue'
import { apiAuth } from 'src/boot/axios'
const bangdongMains = reactive([])
const bangdongMainName = ref('')
const bangdongDrinks = reactive([])
const bangdongDrinkName = ref('')
const bangdongSideDishes = reactive([])
const bangdongSideDishName = ref('')
const bangdongName = ref('')
const bangdongPrice = ref(0)
const bangdongProductId = ref('')
const bangdongMainMealId = ref('')
const bangdongDrinkId = ref('')
const bangdongSideDishId = ref('')
const bangdongArbitrarily = ref(0)
const bangdongTotalQuantity = ref(0)
const tableRows = ref([])
const bangdongComment = ref('')

const loadBangdong = async (val) => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get(`catalog/product/${val}`)
    const productOptions = response.data.product_options
    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    for (const mainMealValue of mainMealValues) {
      bangdongMains.push({
        id: mainMealValue.id,
        name: mainMealValue.name,
        shortname: mainMealValue.short_name,
        quantity: 0
      })
    }
    // 飲料
    const Drink = productOptions.drink
    const DrinkValues = Drink.product_option_values

    for (const DrinkValue of DrinkValues) {
      bangdongDrinks.push({
        id: DrinkValue.id,
        name: DrinkValue.name,
        quantity: 0,
        price: DrinkValue.price
      })
    }
    // 配菜
    const sideDish = productOptions.side_dish
    const sideDishValues = sideDish.product_option_values

    for (const sideDishValue of sideDishValues) {
      bangdongSideDishes.push({
        id: sideDishValue.id,
        name: sideDishValue.name,
        quantity: 0,
        is_default: sideDishValue.is_default,
        price: sideDishValue.price
      })
    }
    // 監聽主餐的數量變化

    bangdongName.value = response.data.name
    bangdongMainName.value = mainMeal.name
    bangdongDrinkName.value = Drink.name
    bangdongSideDishName.value = sideDish.name
    bangdongPrice.value = parseInt(response.data.price)
    bangdongProductId.value = response.data.id
    bangdongMainMealId.value = mainMeal.id
    bangdongDrinkId.value = Drink.id
    bangdongSideDishId.value = sideDish.id
    bangdongMains.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
          if (newVal !== oldVal) {
            // 配菜的數量跟著主餐的數量變化
            bangdongSideDishes.forEach((sideDish) => {
              const diff = Number(newVal) - Number(oldVal)
              console.log(diff)
              if (sideDish.is_default === 1) {
                const newQuantity = Number(sideDish.quantity) + diff
                sideDish.quantity = newQuantity > 0 ? newQuantity : 0
              }
            })
          }
        }
      )
    })
    bangdongDrinks.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
    bangdongSideDishes.forEach((main) => {
      watch(
        () => main.quantity,
        (newVal, oldVal) => {
          if (newVal === '') {
            main.quantity = 0
          }
        }
      )
    })
  } catch (error) {
    console.error(error)
  }
}
watch(bangdongMains, (newMains) => {
  const mainQuantityTotal = newMains.reduce((total, current) => {
    return total + parseInt(current.quantity || 0)
  }, 0)
  console.log(newMains)
  bangdongArbitrarily.value = Math.max(
    0,
    parseInt(bangdongTotalQuantity.value || 0) - mainQuantityTotal
  )
})
// 計算總價格
const bangdongTotalQuantityPrice = computed(() => {
  const totalPrice = bangdongTotalQuantity.value * bangdongPrice.value
  return totalPrice
})
// 選項總計
const bangdongoptionPrice = computed(() => {
  let totalPrice = 0
  bangdongDrinks.forEach((drink) => {
    totalPrice += drink.quantity * drink.price
  })
  bangdongSideDishes.forEach((sideDish) => {
    totalPrice += sideDish.quantity * sideDish.price
  })
  return totalPrice
})
// 全部總計
const bangdongfinalTotal = computed(() => {
  const totalPrice =
    bangdongoptionPrice.value + bangdongTotalQuantityPrice.value
  return totalPrice
})
// 將資料推進 tableRows
const submitBangdong = () => {
  if (bangdongTotalQuantity.value === 0) {
    alert('忘記填總套數了喔！！！')
    return
  }
  // 檢查總數量是否匹配
  const calculatedTotalQuantity = bangdongMains.reduce(
    (acc, main) => acc + (main.quantity || 0),
    0
  )
  console.log(calculatedTotalQuantity, bangdongTotalQuantity.value)
  if (calculatedTotalQuantity !== parseInt(bangdongTotalQuantity.value, 10)) {
    alert('主餐總數量與輸入的總數量不搭！')
    return
  }
  const nextId =
   1

  const row = {
    bentoType: 1,
    id: nextId,
    name: '',
    Main: '',
    drinks: '',
    sideDishes: '',
    sideDishDefault: '',
    quantity: '',
    price: bangdongfinalTotal.value,
    optionPrice: bangdongoptionPrice.value,
    totalPrice: bangdongTotalQuantityPrice.value,
    inputs: [],
    productInputs: [],
    comment: bangdongComment.value
  }
  row.quantity = bangdongTotalQuantity.value

  const totalQuantity = bangdongTotalQuantity.value
  for (const bangdongMain of bangdongMains) {
    if (bangdongMain.quantity > 0) {
      // 保留 主餐名稱、主餐 ID
      const productInput = {
        productTypeId: bangdongMainMealId.value,
        productTypeName: bangdongMainName.value,
        productType: 'options_with_qty',
        type: 1
      }
      row.productInputs.push(productInput)
      row.Main +=
        bangdongMain.name +
        ' x ' +
        parseInt(bangdongMain.quantity).toString() +
        '<br>'

      const input = {
        id: bangdongMain.id,
        name: bangdongMain.name,
        value: parseInt(bangdongMain.quantity),
        type: 1
      }

      row.inputs.push(input)
      bangdongMain.quantity = 0
    }
  }
  for (const bangdongDrink of bangdongDrinks) {
    if (bangdongDrink.quantity > 0) {
      row.drinks +=
        bangdongDrink.name +
        '  x  ' +
        parseInt(bangdongDrink.quantity).toString() +
        '<br>'
      // 保留飲料名稱、飲料 ID
      const productInput = {
        productTypeName: bangdongDrinkName.value,
        productTypeId: bangdongDrinkId.value,
        productType: 'options_with_qty',
        type: 2
      }
      row.productInputs.push(productInput)
      const input = {
        id: bangdongDrink.id,
        name: bangdongDrink.name,
        value: parseInt(bangdongDrink.quantity),
        type: 2
      }
      row.inputs.push(input)
      bangdongDrink.quantity = 0
    }
  }

  for (const bangdongSideDish of bangdongSideDishes) {
    if (bangdongSideDish.quantity > 0) {
      if (row.sideDishes !== '') {
        row.sideDishes += ','
      }
      row.sideDishes +=
        bangdongSideDish.name +
        'x' +
        parseInt(bangdongSideDish.quantity).toString() +
        '<br>'
      // 保留配菜名稱、配菜 ID
      const productInput = {
        productTypeName: bangdongSideDishName.value,
        productTypeId: bangdongSideDishId.value,
        productType: 'options_with_qty',
        type: 3
      }
      row.productInputs.push(productInput)
      row.sideDishDefault += bangdongSideDish.is_default + ' '
      const input = {
        id: bangdongSideDish.id,
        name: bangdongSideDish.name,
        value: parseInt(bangdongSideDish.quantity),
        is_default: bangdongSideDish.is_default,
        type: 3
      }
      row.inputs.push(input)
      bangdongSideDish.quantity = 0
    }
  }
  // 保留 招牌便當、1001、數量
  const productInput = {
    id: bangdongProductId.value,
    name: bangdongName.value,
    value: parseInt(totalQuantity),
    price: bangdongPrice.value,
    optionPrice: row.optionPrice,
    totalPrice: row.totalPrice,
    finaltotalPrice: row.price,
    comment: bangdongComment.value
  }
  console.log(productInput)
  row.productInputs.push(productInput)
  // 保留任搭數量
  if (bangdongArbitrarily.value > 0) {
    row.Main +=
      '任意搭配' + 'x' + parseInt(bangdongArbitrarily.value).toString()
    const input = {
      id: 'bangdongArbitrarily',
      value: bangdongArbitrarily.value,
      name: '任意搭配'
    }
    row.inputs.push(input)
  }
  row.name = bangdongName.value + totalQuantity + '份'
  checkVegetable(row)
  // 將這個 row 推進 tableRows 中
  tableRows.value.push(row)
  console.log(row)
  bangdongArbitrarily.value = 0
}
const checkVegetable = (row) => {
  for (let i = 0; i < row.inputs.length; i++) {
    if (row.inputs[i].name.includes('素')) {
      row.name += '(含素)'
      break
    }
  }
}
const Resetbangdong = () => {
  bangdongMains.forEach((bangdongMain) => {
    bangdongMain.quantity = 0
  })
  bangdongDrinks.forEach((bangdongDrink) => {
    bangdongDrink.quantity = 0
  })
  bangdongSideDishes.forEach((bangdongSideDish) => {
    bangdongSideDish.quantity = 0
  })
  bangdongTotalQuantity.value = 0
  bangdongArbitrarily.value = 0
  bangdongComment.value = ''
}
function getInputColor (quantity) {
  return quantity === 0 ? inputColor : 'orange-3'
}
const inputColor = 'grey-4'

onMounted(async () => {
  await loadBangdong(1001)
})
</script>

<style lang="scss" scoped>
@import "../css/order.scss";
</style>
