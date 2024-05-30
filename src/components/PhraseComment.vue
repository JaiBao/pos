<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { apiAuth } from 'src/boot/axios'

const ITEMS_PER_PAGE = 10
const $q = useQuasar()
const options = ref([])
const searchTerm = ref('')
const currentPage = ref(1)
const totalPages = computed(() =>
  Math.ceil(options.value.length / ITEMS_PER_PAGE)
)

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
      options.value.push(extraComments[i].translation.name)
    }
  } catch (error) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'cloud_off',
      message: error.message
    })
  }
}
getExtraComments()
</script>
<template>
    <q-card>
      <q-card-section>
        <q-input
          v-model="searchTerm"
          placeholder="搜尋..."
          dense
          class="q-mb-md"
        />
        <q-item
          v-for="option in filteredOptions"
          :key="option"
          clickable
          @click="selectOption2(option)"
        >
          <q-item-section>
            <q-item-label>{{ option }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-pagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :min="1"
          :max="totalPages"
          :input="true"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="取消" color="primary" @click="closeDialog" />
      </q-card-actions>
    </q-card>
</template>
