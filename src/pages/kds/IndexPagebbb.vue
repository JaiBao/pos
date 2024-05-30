<template>
  <div class="row w-100 justify-center">
    <q-table
      :rows="rows"
      grid
      :columns="columns"
      class="w-100"
      title="餐點區"
      row-key="id"
      virtual-scroll
      v-model:pagination="pagination"
      rows-per-page-options="3"
      id="sliderTable"
      no-data-label="目前沒有餐點"
      v-model:expanded="expanded"
    >
      <template v-slot:item="props">
        <div class="q-pa-xs col-12">
          <q-card class="my-card" flat bordered>
            <q-card-section horizontal class="row items-center q-pa-xs">
           <div class="text-h4 col">
            訂單編號:{{ props.row.name }}
           </div>
           <div class="text-h4 q-ml-lg col">
            出餐時間:{{ props.row.time }}
            <div class="br-container"><br></div>
            送達時間:{{ props.row.time2 }}
           </div>
           <div v-html="props.row.calories" class="text-h4 q-ml-lg col ">
           </div>
           <div v-html="props.row.fat" class="text-h4 q-ml-lg col ">
           </div>
             </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
// import { ref } from 'vue'

const columns = [
  {
    name: 'desc',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    sortable: true
  },
  {
    name: 'calories',
    align: 'center',
    label: 'Calories',
    field: 'calories',
    sortable: true
  },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' }
]

const rows = [
  {
    name: '1535',
    time: '10:00',
    time2: '10:30',
    calories:
      '梅汁番茄＊12 <div class="br-container"><br></div> 香菇油飯＊12  <div class="br-container"><br></div>鹽水煮蛋＊12<div class="br-container"><br></div>蒜香時蔬＊12',
    fat: '滷牛腱＊12 <div class="br-container"><br></div>嫩雞胸＊12',
    carbs: '清蒸嫩雞胸＊5'
  },
  {
    name: '1536',
    time: '10:00',
    time2: '10:30',
    calories:
      '梅汁番茄＊12 <div class="br-container"><br></div> 香菇油飯＊12  <div class="br-container"><br></div>鹽水煮蛋＊12<div class="br-container"><br></div>蒜香時蔬＊12',
    fat: '滷牛腱＊12 <div class="br-container"><br></div>嫩雞胸＊12',
    carbs: '清蒸嫩雞胸＊5'
  },
  {
    name: '1537',
    time: '10:00',
    time2: '10:30',
    calories:
      '梅汁番茄＊12 <div class="br-container"><br></div> 香菇油飯＊12  <div class="br-container"><br></div>鹽水煮蛋＊12<div class="br-container"><br></div>蒜香時蔬＊12',
    fat: '滷牛腱＊12 <div class="br-container"><br></div>嫩雞胸＊12',
    carbs: '清蒸嫩雞胸＊5'
  },
  {
    name: '訂單編號:1535',
    calories: '炸蝦潤餅＊5',
    fat: '紅茶＊5',
    carbs: 67
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: '紅茶＊5',
    carbs: 49
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: '紅茶＊5',
    carbs: 94
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65
  }
]
</script>

<style lang="scss" scoped>
.br-container {
  margin: 10px;
}
</style>
