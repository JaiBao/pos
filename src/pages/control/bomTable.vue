<template>
  <div class="bomArea">
    <div class="cardTitle">
      <div class="select">
   <q-select class="select" outlined v-model="model" :options="options" label="類型" />
 <q-select class="select" outlined  v-model="model2" :options="options2" label="品項" /></div>
<p class="total">總成本:{{total}}</p>
</div>
 <q-card class="bomCard">
  <!-- 主餐 -->
  <div class="mainMealArea">
    <p class="title">主餐</p>
    <div class="mainMealAreaSelect">
 <q-select class="areaSelect2" outlined  v-model="model3" :options="options3"  label="主餐"  bottom-slots >   <template  v-slot:hint>
  <div class="money">
          成本:{{money1}}</div>
        </template>
      </q-select></div></div>
      <!-- 副主餐 -->
  <div class="mainMealArea">
    <p class="title">副主餐</p>
    <div class="mainMealAreaSelect">
 <q-select class="areaSelect2" outlined  v-model="model0" :options="options6"  label="副主餐"  bottom-slots >   <template  v-slot:hint>
  <div class="money">
          成本:{{money8}}</div>
        </template>
      </q-select></div></div>
      <!-- 配菜 -->
      <div class="slideArea">
        <p class="title">配菜</p>
        <div class="slideAreaSelect">
 <q-select class="mg-1 areaSelect"  outlined  v-model="model4" :options="options4" label="配菜"  bottom-slots >   <template v-slot:hint>
  <div class="money">
          成本:{{money2}}</div>
        </template>
      </q-select>
 <q-select class="mg-1 areaSelect" outlined  v-model="model5" :options="options4" label="配菜"  bottom-slots >   <template v-slot:hint>
  <div class="money">
          成本:{{money3}}</div>
        </template>
      </q-select>
 <q-select class="mg-1 areaSelect" outlined  v-model="model6" :options="options4" label="配菜"  bottom-slots >   <template v-slot:hint>
  <div class="money">
          成本:{{money4}}</div>
        </template>
      </q-select>
 <q-select class="mg-1 areaSelect" outlined  v-model="model7" :options="options4" label="配菜"  bottom-slots >   <template v-slot:hint>
  <div class="money">
          成本:{{money5}}</div>
        </template>
      </q-select>
 <q-select class="mg-1 areaSelect" outlined  v-model="model8" :options="options4" label="配菜"  bottom-slots >   <template v-slot:hint>
  <div class="money">
          成本:{{money6}}</div>
        </template>
      </q-select>
    </div>
    </div>
    <div class="drinkArea">
    <p class="title">飲料</p>
    <div class="drinkAreaSelect">
 <q-select class="areaSelect2" outlined  v-model="model9" :options="options5"  label="飲料"  bottom-slots >   <template  v-slot:hint>
  <div class="money">
          成本:{{money7}}</div>
        </template>
      </q-select></div></div>
      <div class="cardBtn">
      <q-btn class="col-2" label="保存" @click="saveChanges" /></div></q-card>
    </div>
</template>
<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import axios from 'axios'

const model = ref('請選擇')
const model2 = ref('請選擇')
const model3 = ref('請選擇')
const model4 = ref('請選擇')
const model5 = ref('請選擇')
const model6 = ref('請選擇')
const model7 = ref('請選擇')
const model8 = ref('請選擇')
const model9 = ref('請選擇')
const model0 = ref('請選擇')
const money1 = ref(0)
const money2 = ref(0)
const money3 = ref(0)
const money4 = ref(0)
const money5 = ref(0)
const money6 = ref(0)
const money7 = ref(0)
const money8 = ref(0)

const options = ref([
  { label: '請選擇', value: null },
  { label: '便當', value: '便當' },
  { label: '盒餐', value: '盒餐' }
])
const options2 = ref([{ label: '請選擇', value: null }])

const updateOptions2 = (selectedType) => {
  if (selectedType === '便當') {
    options2.value = [
      { label: '請選擇', value: null },
      { label: '招牌便當', value: '招牌便當' },
      { label: '雞腿便當', value: '雞腿便當' },
      { label: '雞胸便當', value: '雞胸便當' }
    ]
  } else if (selectedType === '盒餐') {
    options2.value = [
      { label: '請選擇', value: null },
      { label: '會議盒餐', value: '會議盒餐' },
      { label: '貴賓盒餐', value: '貴賓盒餐' }
    ]
  } else {
    options2.value = [{ label: '請選擇', value: null }]
  }
}
watch(model, (newValue) => {
  updateOptions2(newValue.value)
})
const options3 = ref([]) // 主餐
const options4 = ref([]) // 配菜
const options5 = ref([]) // 飲料
const options6 = ref([]) // 飲料

const fetchBomItems = async () => {
  try {
    const response = await axios.get('http://dods.dtstw.com/api/analysis/bom_items')
    if (response.data.status === 'OK') {
      // 先清空现有的选项并添加“請選擇”选项
      options3.value = [{ label: '無', value: '' }]
      options4.value = [{ label: '無', value: '' }]
      options5.value = [{ label: '無', value: '' }]
      options6.value = [{ label: '無', value: '' }]

      response.data.data.forEach(item => {
        if (item.option_name === '配菜') {
          options4.value.push({
            label: item.name,
            value: item.name,
            cost: parseFloat(item.total)
          })
        } else if (item.option_name === '6吋潤餅') {
          const newName = item.name.replace('6吋', '3吋') // 替换6吋为3吋
          const newCost = parseFloat(item.total) / 2 // 成本除以2
          options3.value.push({
            label: newName,
            value: newName,
            cost: newCost
          })
        } else if (item.option_name === '飲料') {
          options5.value.push({
            label: item.name,
            value: item.name,
            cost: parseFloat(item.total)
          })
        } else if (item.option_name === '副主餐') {
          options6.value.push({
            label: item.name,
            value: item.name,
            cost: parseFloat(item.total)
          })
        }
      })
    }
  } catch (error) {
    console.error('Error fetching BOM items:', error)
  }
}

// console.log(options3.value)
// console.log(options4.value)
const total = computed(() => {
  return (money1.value + money2.value + money3.value + money4.value + money5.value + money6.value + money7.value + money8.value).toFixed(3)
})

// 抓總成
const fetchDetailByName = async (type, name) => {
  try {
    const response = await axios.get(`http://localhost:8080/test2/${type}/${name}`)
    console.log('Response Data:', response.data)
    if (response.data) {
      const mainMealOption = options3.value.find(option => option.value === response.data.mainMeal)
      // console.log('Matched Main Meal Option:', mainMealOption)
      model3.value = mainMealOption
      const mainMeal2Option = options6.value.find(option => option.value === response.data.mainMeal2) || { label: '無', value: '' }
      model0.value = mainMeal2Option

      const slideOption = options4.value.find(option => option.value === response.data.slide)
      // console.log('Matched Side Dish Option:', slideOption)
      model4.value = slideOption

      const slide2Option = options4.value.find(option => option.value === response.data.slide2)
      // console.log('Matched Slide2 Option:', slide2Option)
      model5.value = slide2Option // Set slide2 from fetched details

      const slide3Option = options4.value.find(option => option.value === response.data.slide3)
      // console.log('Matched Slide3 Option:', slide3Option)
      model6.value = slide3Option // Set slide3 from fetched details

      const slide4Option = options4.value.find(option => option.value === response.data.slide4)
      // console.log('Matched Slide4 Option:', slide4Option)
      model7.value = slide4Option // Set slide4 from fetched details

      const slide5Option = options4.value.find(option => option.value === response.data.slide5)
      // console.log('Matched Slide5 Option:', slide5Option)
      model8.value = slide5Option // Set slide5 from fetched details
      const drinkOption = options5.value.find(option => option.value === response.data.drink)
      // console.log('Matched Side Dish Option:', slideOption)
      model9.value = drinkOption
    }
  } catch (error) {
    console.error('Failed to fetch details:', error)
  }
}

// 更新成本的watcher
watch(model3, newVal => {
  const valueToUse = newVal.value || newVal
  const selectedOption = options3.value.find(option => option.value === valueToUse)
  money1.value = selectedOption ? selectedOption.cost : 0
})

watch(model4, newVal => {
  const valueToUse = newVal.value || newVal
  const selectedOption = options4.value.find(option => option.value === valueToUse)
  money2.value = selectedOption ? selectedOption.cost : 0
})
watch(model5, newVal => {
  const valueToUse = newVal.value || newVal
  const selectedOption = options4.value.find(option => option.value === valueToUse)
  money3.value = selectedOption ? selectedOption.cost : 0
})
watch(model6, newVal => {
  const valueToUse = newVal.value || newVal
  const selectedOption = options4.value.find(option => option.value === valueToUse)
  money4.value = selectedOption ? selectedOption.cost : 0
})
watch(model7, newVal => {
  const valueToUse = newVal.value || newVal
  const selectedOption = options4.value.find(option => option.value === valueToUse)
  money5.value = selectedOption ? selectedOption.cost : 0
})
watch(model8, newVal => {
  const valueToUse = newVal && newVal.value ? newVal.value : null
  const selectedOption = options4.value.find(option => option.value === valueToUse)
  money6.value = selectedOption ? selectedOption.cost : 0
})
watch(model9, newVal => {
  const valueToUse = newVal.value || newVal
  const selectedOption = options5.value.find(option => option.value === valueToUse)
  money7.value = selectedOption ? selectedOption.cost : 0
})
watch(model0, newVal => {
  const valueToUse = newVal.value || newVal
  const selectedOption = options6.value.find(option => option.value === valueToUse)
  money8.value = selectedOption ? selectedOption.cost : 0
})

watch(model2, (newVal) => {
  if (newVal && model.value) {
    const type = model.value.value
    const name = newVal.value || newVal
    fetchDetailByName(type, name)
  } else {
    model3.value = ''
    model4.value = ''
    model5.value = ''
    model6.value = ''
    model7.value = ''
    model8.value = ''
    model9.value = ''
    model0.value = ''
  }
})

watch(model, (newValue) => {
  model2.value = '請選擇'
  updateOptions2(newValue.value)
  model3.value = '請選擇'
  model4.value = '請選擇'
  model5.value = '請選擇'
  model6.value = '請選擇'
  model7.value = '請選擇'
  model8.value = '請選擇'
  model9.value = '請選擇'
  model0.value = '請選擇'
  money1.value = 0
  money2.value = 0
  money3.value = 0
  money4.value = 0
  money5.value = 0
  money6.value = 0
  money7.value = 0
  money8.value = 0
})

const saveChanges = async () => {
  try {
    // console.log('Saving with:', model.value, model2.value, model3.value, model4.value)
    const payload = {
      type: model.value.value,
      name: model2.value.value,
      mainMeal: model3.value.value,
      slide: model4.value.value,
      slide2: model5.value.value,
      slide3: model6.value.value,
      slide4: model7.value.value,
      slide5: model8.value.value,
      drink: model9.value.value,
      mainMeal2: model0.value.value
    }
    const url = 'http://localhost:8080/test2/update'
    await axios.put(url, payload)
    alert('更改成功！')
  } catch (error) {
    console.error('Failed to save changes:', error)
    alert('更改失敗！')
  }
}
onMounted(async () => {
  fetchBomItems()
})

</script>
<style lang="scss" scoped>
.bomArea{
  margin: 3%;
  background: white
}
.cardTitle{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .select{
    display: flex;
  flex-direction: row;
  }
.total{
margin-right: 5%;
font-size: 25px;
}
}
.select{
  width:300px
}
.money{
  font-size:16px;
  color:black;
  font-weight: 800
}
.bomCard{
  display: flex;
  flex-direction: row;
  flex-wrap:wrap;
  .mainMealArea{
    .title{
      width: 100%;
      background:aquamarine;
      font-size: 25px;
    }
    display: flex;
    flex-direction:column;
    width:14%;
    margin: 1%;
    .mainMealAreaSelect{
      display:flex;flex-direction:row;
      flex-wrap:wrap
    }
  }
  .slideArea{
    .title{
      width: 100%;
      background:aquamarine;
      font-size: 25px;
    }
    display: flex;
    flex-direction:column;
    width:46%;
    margin: 1%;
    .slideAreaSelect{
      display:flex;flex-direction:row;
      flex-wrap:wrap

    }
  }
  .drinkArea{
    .title{
      width: 100%;
      background:aquamarine;
      font-size: 25px;
    }
    display: flex;
    flex-direction:column;
    width:14%;
    margin: 1%;
    .drinkAreaSelect{
      display:flex;flex-direction:row;
      flex-wrap:wrap
    }
  }
  .cardBtn{
    display: flex;
    flex-direction:column;
    width:100%;
    justify-content: center;
    align-items: flex-end;
    button{
// color:aquamarine;
width:20%;
background:#F50077;
color:white;
margin: 1%;
    }
  }
}
.mg-1{
margin:1%
}

.areaSelect{
  width:30%
}
.areaSelect2{
  width:100%
}
</style>
