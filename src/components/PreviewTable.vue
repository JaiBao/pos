<template>
  <div class="q-pa-xs">
    <q-table
      :rows="tableRows"
      row-key="id"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      id="sliderTable"
      no-data-label="目前沒有餐點"
      v-model:expanded="expanded"
    >
      <template #header>
        <q-tr>
          <q-th class="w-300px"> 順序 </q-th>
          <q-th class="w-300px"> 商品 </q-th>
          <q-th class="w-300px"> 潤餅 </q-th>
          <q-th class="w-300px"> 飲料 </q-th>
          <q-th class="w-300px"> 副主餐 </q-th>
          <q-th class="w-100px"> 金額 </q-th>
          <q-th class="w-130px">  </q-th>
          <q-th class=""> 備註 </q-th>
        </q-tr>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td class="tdId">{{ props.row.id }}</q-td>
          <q-td class="tdname">
            <div v-html="props.row.name"></div>
            <div
              v-for="(input, index) in props.row.inputs"
              :key="index"
              class="tdname"
            >
              <input type="hidden" :name="input.name" v-model="input.value" />
            </div>
          </q-td>
          <!-- 如果 drinks 存在，顯示 Main 的欄位 -->
          <q-td v-if="props.row.drinks" class="tdmain">
            <div v-html="props.row.Main"></div>
          </q-td>
          <!-- 如果 drinks 存在，顯示 drinks 的欄位 -->
          <q-td v-if="props.row.drinks" class="tdmain">
            <div v-html="props.row.drinks"></div>
          </q-td>
          <!-- 如果 drinks 不存在，那麼 Main 的欄位擴展為 2 列 -->
          <q-td v-else colspan="2" class="tdmain2x">
            <div v-html="props.row.Main"></div>
          </q-td>
          <q-td class="tdmain"><div v-html="props.row.bentoMains"></div></q-td>
          <q-td class="tdmain"
            >{{ props.row.price }}
            <div
              v-for="(productInput, index) in props.row.productInputs"
              :key="index"
              class="tdname"
            >
              <input
                type="hidden"
                :name="productInput.name"
                v-model="productInput.value"
              />
            </div>
          </q-td>
          <q-td class="tdedit"> </q-td>
          <q-td auto-width>
            <q-toggle
              color="accent"
              v-model="props.expand"
              checked-icon="add"
              unchecked-icon="remove"
            />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              <q-input readonly v-model="props.row.comment"></q-input>
            </div>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:no-data="{ message }">
        <div class="full-width row flex-center text-blue-grey-7 q-gutter-sm">
          <q-icon size="2em" name="restaurant"></q-icon>
          <span style="font-size: 22px">
            {{ message }}
          </span>
        </div>
      </template>
      <template v-slot:pagination>
        <q-td class="fs-30">
        餐點金額:{{ total }}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const props = defineProps(['order'])
const total = ref(0)
onMounted(() => {
  console.log(props.order)
  props.order.forEach((item) => {
    total.value += item.price
  })
})
const tableRows = ref(props.order)
console.log(tableRows)
</script>

<style lang="scss" scoped>

@import'../css/order.scss';
.fs-30{
  font-size: 30px;
}
</style>
