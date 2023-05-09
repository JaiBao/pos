import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
// import { useQuasar } from 'quasar'
import { apiAuth } from 'src/boot/axios'
export const useUserStore = defineStore(
  'bangdong',
  () => {
    const bnagdong1Mains = reactive([])
    const bangdongMainName = ref('')
    const price = ref(0)

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
        console.log(bnagdong1Mains)
      } catch (error) {
        console.error(error)
      }
    }
    const bangdong1TotalQuantity = computed(() => {
      return bnagdong1Mains.reduce((total, current) => {
        return total + parseInt(current.quantity)
      }, 0)
    })

    // 計算總價格
    const bangdong1TotalQuantityPrice = computed(() => {
      for (let i = 0; i < bnagdong1Mains.length; i++) {
        console.log(bnagdong1Mains[i].quantity)
      }
      return bangdong1TotalQuantity.value * price.value
    })
    // const $q = useQuasar()

    return {
      bnagdong1Mains,
      bangdongMainName,
      price,
      loadBangdongMain,
      bangdong1TotalQuantityPrice,
      bangdong1TotalQuantity
    }
  },
  {
    persist: {
      key: '2023-bangdong',
      paths: ['']
    }
  },
  {}
)
