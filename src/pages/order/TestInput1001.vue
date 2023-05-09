<template>

  <div>
<h5 style="margin: 0; padding: 0;">{{ bangdongMainName }}</h5>
<div class="row items-center"
>
<q-item  v-for="(bnagdong1Main, index) in bnagdong1Mains" :key="index" class="flex-auto " style="margin: 0; padding: 0;">
<q-input
v-model="bnagdong1Main.quantity" :label="bnagdong1Main.name"
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
    <h5  style="line-height: 0;">招牌便當</h5>
    </div>
    <div class="row">
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="bangdong1TotalQuantity"
label="數量總計"
:rules="[val => !!val || '此欄位為必填']"
readonly
/>
<q-input
outlined
type="number"
:input-style="{ fontSize: '20px' }"
style="width: 130px;"
v-model="bangdong1TotalQuantityPrice"
label="金額總計"
:rules="[val => !!val || '此欄位為必填']"
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
<q-th>商品</q-th>
<q-th>數量</q-th>
<q-th></q-th>
</q-tr>
</template>

<template #body="props">
<q-tr :props="props">
<q-td>{{ props.row.name }}</q-td>
<q-td>{{ props.row.quantity }}</q-td>
<q-td>
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

<q-dialog v-model="showEditDialog">
<q-card>
<q-card-section>
<q-input v-model="editRowData.quantity" label="數量" type="number" />
</q-card-section>
<q-card-actions align="right">
<q-btn label="Cancel" color="negative" @click="showEditDialog = false" />
<q-btn label="Save" color="primary" @click="saveEditRow" />
</q-card-actions>
</q-card>
</q-dialog>

</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { apiAuth } from 'src/boot/axios'

const bnagdong1Mains = reactive([])
const bangdongMainName = ref('')
const price = ref(0)
const tableRows = reactive([])

const loadBangdongMain = async () => {
  try {
    const response = await apiAuth.get('catalog/product/1001')
    const productOptions = response.data.product_options
    const mainMeal = productOptions.main_meal
    const values = mainMeal.product_option_values
    for (const value of values) {
      bnagdong1Mains.push({
        id: value.id,
        name: value.short_name,
        quantity: 0
      })
    }
    bangdongMainName.value = mainMeal.name
    price.value = parseInt(response.data.price)
  } catch (error) {
    console.error(error)
  }
}

loadBangdongMain()
// 計算總數量
const bangdong1TotalQuantity = computed(() => {
  return bnagdong1Mains.reduce((total, current) => {
    return total + parseInt(current.quantity)
  }, 0)
})

// 計算總價格
const bangdong1TotalQuantityPrice = computed(() => {
  return bangdong1TotalQuantity.value * price.value
})
const submitBangdong1 = () => {
  for (const bnagdong1Main of bnagdong1Mains) {
    if (bnagdong1Main.quantity > 0) {
      const row = {
        id: bnagdong1Main.id,
        name: '招牌便當' + bnagdong1Main.name,
        quantity: parseInt(bnagdong1Main.quantity).toString()
      }
      tableRows.push(row)
    }
  }
}

const deleteRow = (id) => {
  const index = tableRows.findIndex((row) => row.id === id)
  if (index >= 0) {
    tableRows.splice(index, 1)
  }
}
const showEditDialog = ref(false)
const editRowData = reactive({
  id: null,
  name: '',
  quantity: 0
})

const editRowDialog = (row) => {
  editRowData.id = row.id
  editRowData.name = row.name
  editRowData.quantity = parseInt(row.quantity)
  showEditDialog.value = true
}
const saveEditRow = () => {
  const index = tableRows.findIndex((row) => row.id === editRowData.id)
  if (index >= 0) {
    tableRows[index].quantity = parseInt(editRowData.quantity).toString()
  }
  editRowData.id = null
  editRowData.name = ''
  editRowData.quantity = 0
  showEditDialog.value = false
}

</script>
