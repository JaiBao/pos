<template>

  <div>
<h5 style="margin: 0; padding: 0;">{{ bangdong1MainName }}</h5>
<div class="row items-center"
>
<q-item  v-for="(bangdong1Main, index) in bangdong1Mains" :key="index" class="flex-auto " style="margin: 0; padding: 0;">
<q-input
v-model="bangdong1Main.quantity" :label="bangdong1Main.name"
outlined
type="number"
  :input-style="{ fontSize: '20px', margin: '0' }"
  :label-style="{ fontSize: '20px' }"
  style="width: 130px;"
  />
</q-item>
</div>
</div>
<div style="width:100%;padding: 0;margin: 0;height: 30px;">
    <h5  style="line-height: 0;">{{bangdong1Name}}</h5>
    </div>
    <div class="row">
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="bangdong1TotalQuantity"
label="數量總計"
readonly
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="bangdong1TotalQuantityPrice"
label="金額總計"
readonly
/>
</div>
<div class="row justify-end" style="width: 100%;">
<q-btn
color="primary"
label="送出"
type="submit"
class="q-mt-md"
@click="submitBangdong1"
/>
<q-btn
color="red"
label="取消"
@click="showbangdong1 = false"
class="q-mt-md"
/>

</div >
<q-table :rows="tableRows">
<template #header>
<q-tr>
<q-th style="font-size:20px">商品</q-th>
<q-th style="font-size:20px">搭配</q-th>
<q-th style="font-size:20px">飲料</q-th>
<q-th style="font-size:20px">操作</q-th>
</q-tr>
</template>

<template #body="props">
<q-tr :props="props">
<q-td style="text-align: center;font-size:20px">{{ props.row.name }}</q-td>
<q-td style="text-align: center;font-size:20px">{{ props.row.quantity }}</q-td>
<q-td style="text-align: center;font-size:20px">{{ props.row.quantity }}</q-td>
<q-td style="text-align: center">
<q-btn icon="delete"
color="red"
fab-mini
unelevated
size="sm"
@click="deleteRow(props.row.id)" />
<q-btn icon="edit"
fab-mini
unelevated size="sm"
color="info"
@click="editRowDialog(props.row)"/>

</q-td>
</q-tr>
</template>
</q-table>
<q-dialog v-model="editDialog" persistent>
    <q-card>
      <q-card-section>

        <div>
  <h5 style="margin: 0; padding: 0;">{{ bangdong1MainName }}</h5>
  <div class="row items-center"></div>
  <q-item v-for="(bangdong1EditMain, index) in bangdong1EditMains" :key="index" class="flex-auto "
    style="margin: 0; padding: 0;">
    <q-input v-model="bangdong1EditMain.quantity" :label="bangdong1EditMain.name" outlined type="number"
      :input-style="{ fontSize: '20px', margin: '0' }" :label-style="{ fontSize: '20px' }" style="width: 130px;" />
  </q-item>
</div>

<div style="width:100%;padding: 0;margin: 0;height: 30px;">
  <h5 style="line-height: 0;">招牌便當</h5>
</div>
<div class="row">
  <q-input outlined type="number" :input-style="{ fontSize: '20px' }" style="width: 130px;"
    v-model="bangdong1EditTotalQuantity" label="數量總計" readonly />
  <q-input outlined type="number" :input-style="{ fontSize: '20px' }" style="width: 130px;"
    v-model="bangdong1EditTotalQuantityPrice" label="金額總計" readonly />
</div>

      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="取消" color="red" @click="closeEditDialog" />
        <q-btn label="儲存" color="primary" @click="saveEditDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { apiAuth } from 'src/boot/axios'

const bangdong1Mains = reactive([])
const bangdong1MainName = ref('')
const bangdong1Name = ref('')
const price = ref(0)
const tableRows = reactive([])
const editDialog = ref(false)
// 抓取招牌便當主餐形成input
const loadBangdongMain = async () => {
  try {
    const response = await apiAuth.get('catalog/product/1001')
    const productOptions = response.data.product_options
    // 主餐
    const mainMeal = productOptions.main_meal
    const mainMealValues = mainMeal.product_option_values

    for (const mainMealValue of mainMealValues) {
      bangdong1Mains.push({
        id: mainMealValue.id,
        name: mainMealValue.short_name,
        quantity: 0
      })
    }
    bangdong1Name.value = response.data.name
    bangdong1MainName.value = mainMeal.name
    price.value = parseInt(response.data.price)
  } catch (error) {
    console.error(error)
  }
}

loadBangdongMain()
// 計算總數量
const bangdong1TotalQuantity = computed(() => {
  return bangdong1Mains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)
})

// 計算總價格
const bangdong1TotalQuantityPrice = computed(() => {
  return bangdong1TotalQuantity.value * price.value
})
// 將資料推進tableRows
const submitBangdong1 = () => {
  const row = {
    id: tableRows.length + 1,
    name: '',
    quantity: '',
    hidenquantity: []
  }

  const totalQuantity = bangdong1TotalQuantity.value // 計算總數量

  for (const bangdong1Main of bangdong1Mains) {
    if (bangdong1Main.quantity > 0) {
      row.name = bangdong1Name.value + totalQuantity // 使用總數量
      row.quantity += bangdong1Main.name + '' + parseInt(bangdong1Main.quantity).toString() + ' '
      row.hidenquantity.push(parseInt(bangdong1Main.quantity))
      bangdong1Main.quantity = 0 // 清空數量
    }
    console.log(row.hidenquantity)
  }

  // 將這個 row 推進 tableRows 中
  tableRows.push(row)
}
// 刪除該行
const deleteRow = (id) => {
  const index = tableRows.findIndex((row) => row.id === id)
  if (index >= 0) {
    tableRows.splice(index, 1)
  }
}
// edit導入修正欄位
const bangdong1EditMains = reactive([])
const loadBangdongEditMain = async () => {
  try {
    const response = await apiAuth.get('catalog/product/1001')
    const productOptions = response.data.product_options
    const mainMeal = productOptions.main_meal
    const values = mainMeal.product_option_values
    for (const value of values) {
      bangdong1EditMains.push({
        id: value.id,
        name: value.short_name,
        quantity: 0
      })
    }
    bangdong1MainName.value = mainMeal.name
    price.value = parseInt(response.data.price)
  } catch (error) {
    console.error(error)
  }
}

loadBangdongEditMain()

// 計算修正欄位總數量

const bangdong1EditTotalQuantity = computed(() => {
  return bangdong1EditMains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)
})

// 計算修正欄位總價格
const bangdong1EditTotalQuantityPrice = computed(() => {
  return bangdong1EditTotalQuantity.value * price.value
})

// 將table資料拆解放回修正欄位
let editingRow = null

function editRowDialog (row) {
  for (const bangdong1EditMain of bangdong1EditMains) {
    bangdong1EditMain.quantity = 0
  }
  const quantitys = row.quantity.split(' ')
  for (const quantity of quantitys) {
    const name = quantity.substring(0, 2)
    const value = quantity.substring(2, quantity.length)
    const index = bangdong1EditMains.findIndex(
      (bangdong1EditMain) => bangdong1EditMain.name === name
    )
    if (index >= 0) {
      bangdong1EditMains[index].quantity = parseInt(value)
    }
  }
  editingRow = row // 記錄正在編輯的 row 物件
  editDialog.value = true
}

// 關閉修正欄位
function closeEditDialog () {
  editDialog.value = false
}
// 完成後儲存並且將資料推進tableRows刪除原本的資料
function saveEditDialog () {
  const row = {
    id: tableRows.length + 1,
    name: '',
    quantity: ''
  }
  const totalEditQuantity = bangdong1EditTotalQuantity.value// 計算總數量
  for (const bangdong1EditMain of bangdong1EditMains) {
    if (bangdong1EditMain.quantity > 0) {
      row.name = bangdong1Name.value + totalEditQuantity // 使用總數量
      row.quantity += bangdong1EditMain.name + '' + parseInt(bangdong1EditMain.quantity).toString() + ' '

      bangdong1EditMain.quantity = 0 // 清空數量
    }
  }

  // 將這個 row 推進 tableRows 中
  const rowIndex = tableRows.findIndex(r => r === editingRow)
  if (rowIndex !== -1) {
    tableRows.splice(rowIndex, 1)
    tableRows.push(row)
  }
  editDialog.value = false
}
</script>
