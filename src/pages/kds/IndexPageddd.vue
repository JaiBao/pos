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
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered>
            <q-card-section class="q-pa-xs">
              <div class="row items-center justify-center">
                <div class="col text-center">
                  <!-- ---------------------------------------- -->
                  <q-btn v-if="status['status' + props.row.sort][0] === 2" color="green" class="q-pa-xs" @click="status.increment(0, 'status' + props.row.sort)">廚房區<q-icon
                    name="done"
                    color="white"
                    size="1.5rem"
                    class="q-mx-xs"
                  /></q-btn>
                  <q-btn v-if="status['status' + props.row.sort][0] === 1" color="orange" class="q-pa-xs" @click="status.increment(0, 'status' + props.row.sort)">
                    廚房區<q-spinner
                    color="white"
                    size="1.5rem"
                    class="q-mx-xs"
                  />
                  </q-btn>
                  <q-btn v-if="status['status' + props.row.sort][0] === 0"  color="orange" class="q-pa-xs"   @click="status.increment(0, 'status' + props.row.sort)">
                    廚房區<q-icon
                    name="close"
                    color="orange"
                    size="1.5rem"
                    class="q-mx-xs"
                  />
                  </q-btn>
                </div>
                <!-- --------------------------------------- -->
                <div class="col text-center">
                  <!-- ---------------------------------------- -->
                  <q-btn v-if="status['status' + props.row.sort][1] === 2" color="green" class="q-pa-xs" @click="status.increment(1, 'status' + props.row.sort)">潤餅區<q-icon
                    name="done"
                    color="white"
                    size="1.5rem"
                    class="q-mx-xs"
                  /></q-btn>
                  <q-btn v-if="status['status' + props.row.sort][1] === 1" color="orange" class="q-pa-xs" @click="status.increment(1, 'status' + props.row.sort)">
                    潤餅區<q-spinner
                    color="white"
                    size="1.5rem"
                    class="q-mx-xs"
                  />
                  </q-btn>
                  <q-btn v-if="status['status' + props.row.sort][1] === 0"  color="orange" class="q-pa-xs"   @click="status.increment(1, 'status' + props.row.sort)">
                    潤餅區<q-icon
                    name="close"
                    color="orange"
                    size="1.5rem"
                    class="q-mx-xs"
                  />
                  </q-btn>
                </div>
                <div class="col text-center">
                  <!-- ---------------------------------------- -->
                  <q-btn v-if="status['status' + props.row.sort][2] === 2" color="green" class="q-pa-xs" @click="status.increment(2, 'status' + props.row.sort)">包裝區<q-icon
                    name="done"
                    color="white"
                    size="1.5rem"
                    class="q-mx-xs"
                  /></q-btn>
                  <q-btn v-if="status['status' + props.row.sort][2] === 1" color="orange" class="q-pa-xs" @click="status.increment(2, 'status' + props.row.sort)">
                    包裝區<q-spinner
                    color="white"
                    size="1.5rem"
                    class="q-mx-xs"
                  />
                  </q-btn>
                  <q-btn v-if="status['status' + props.row.sort][2] === 0"  color="orange" class="q-pa-xs"   @click="status.increment(2, 'status' + props.row.sort)">
                    包裝區<q-icon
                    name="close"
                    color="orange"
                    size="1.5rem"
                    class="q-mx-xs"
                  />
                  </q-btn>
                </div>
                <div class="col text-center">
                  <!-- ---------------------------------------- -->
                  <q-btn v-if="status['status' + props.row.sort][3] === 2" color="green" class="q-pa-xs" @click="status.increment(3, 'status' + props.row.sort)">外送區<q-icon
                    name="done"
                    color="white"
                    size="1.5rem"
                    class="q-mx-xs"
                  /></q-btn>
                  <q-btn v-if="status['status' + props.row.sort][3] === 1" color="orange" class="q-pa-xs" @click="status.increment(3, 'status' + props.row.sort)">
                    外送區<q-spinner
                    color="white"
                    size="1.5rem"
                    class="q-mx-xs"
                  />
                  </q-btn>
                  <q-btn v-if="status['status' + props.row.sort][3] === 0"  color="orange" class="q-pa-xs"   @click="status.increment(3, 'status' + props.row.sort)">
                    外送區<q-icon
                    name="close"
                    color="orange"
                    size="1.5rem"
                    class="q-mx-xs"
                  />
                  </q-btn>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="text-center ">
              <div class="text-h4">{{ props.row.name }}</div>
            </q-card-section>
            <q-card-section class="text-center">
              <div class="text-h4"> 出貨時間：{{ props.row.time }}</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="column flex-center">

              <div v-html="props.row.calories" class="text-h4 q-my-lg"></div>
              <div v-html="props.row.fat" class="text-h4 q-my-lg"></div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
// import { ref } from 'vue'
import { useStatusStore } from 'src/stores/status'
const status = useStatusStore()
setInterval(() => {
  status.startFetchingPersistedState()
}, 2000)

const columns = [
  {
    name: 'sort',
    required: true,
    label: 'sort',
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
    sort: 1,
    name: '1535',
    time: '10:00',
    time2: '10:30',
    calories:
      '梅汁番茄＊12 <div class="br-container"><br></div> 香菇油飯＊12  <div class="br-container"><br></div>鹽水煮蛋＊12<div class="br-container"><br></div>蒜香時蔬＊12',
    fat: '滷牛腱＊12 <div class="br-container"><br></div>嫩雞胸＊12',
    carbs: '清蒸嫩雞胸＊5'
  },
  {
    sort: 2,
    name: '1536',
    time: '10:00',
    time2: '10:30',
    calories:
      '梅汁番茄＊12 <div class="br-container"><br></div> 香菇油飯＊12  <div class="br-container"><br></div>鹽水煮蛋＊12<div class="br-container"><br></div>蒜香時蔬＊12',
    fat: '滷牛腱＊12 <div class="br-container"><br></div>嫩雞胸＊12',
    carbs: '清蒸嫩雞胸＊5'
  },
  {
    sort: 3,
    name: '1537',
    time: '10:00',
    time2: '10:30',
    calories:
      '梅汁番茄＊12 <div class="br-container"><br></div> 香菇油飯＊12  <div class="br-container"><br></div>鹽水煮蛋＊12<div class="br-container"><br></div>蒜香時蔬＊12',
    fat: '滷牛腱＊12 <div class="br-container"><br></div>嫩雞胸＊12',
    carbs: '清蒸嫩雞胸＊5'
  }
]
</script>

<style lang="scss" scoped>
.br-container {
  margin-top: 0.5rem;
}
</style>
