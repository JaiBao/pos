<script setup>
function showDialog () {
  searchTerm.value = ''
  currentPage.value = 1
  dialogVisible.value = true
}
const dialogVisible = ref(false)
const option2 = ref([])
const getExtraComments = async () => {
  try {
    // 延遲請求的時間（以毫秒為單位）
    const delay = 100

    // 延遲指定的時間
    await new Promise((resolve) => setTimeout(resolve, delay))
    const response = await apiAuth.get(
      '/sale/order/getOrderPhrases/phrase_order_extra_comment'
    )
    const extraComments = response.data
    for (let i = 0; i < extraComments.length; i++) {
      option2.value.push(extraComments[i].translation.name)
    }
  } catch (error) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      position: 'center',
      icon: 'cloud_off',
      message: error.message
    })
  }
}

getExtraComments()

const ITEMS_PER_PAGE = 10
const searchTerm = ref('')
const currentPage = ref(1)
const filteredOption2 = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return option2.value
    .filter((option) => option.includes(searchTerm.value))
    .slice(start, end)
})
const totalPage2 = computed(() =>
  Math.ceil(option2.value.length / ITEMS_PER_PAGE)
)
watch(
  () => data.value.extra_comment,
  (newVal) => {
    if (newVal.includes(',,')) {
      showDialog()
    }
  }
)
function selectOption (option) {
  if (data.value.extra_comment === ',,') {
    data.value.extra_comment = ' '
    data.value.extra_comment = option
  } else {
    data.value.extra_comment += ' ' + option
  }

  data.value.comment = data.value.comment.replace(',,', '')
  closeDialog()
}
function closeDialog () {
  dialogVisible.value = false
}</script>

<template>
    <q-dialog v-model="mealDialog">
    <q-card>
      <q-card-section>
        <q-input
          v-model="searchTermMeal"
          placeholder="搜尋..."
          dense
          class="q-mb-md"
        />
        <q-item
          v-for="filteredMeal in filteredMeals"
          :key="filteredMeal"
          clickable
          @click="selectOption(filteredMeal)"
        >
          <q-item-section>
            <q-item-label>{{ filteredMeal }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-pagination
          v-if="totalPagesMeal > 0"
          v-model="currentPagemeal"
          :min="1"
          :max="totalPagesMeal"
          :input="true"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="取消" color="primary" @click="closeDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
