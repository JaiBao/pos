import { defineStore } from 'pinia'
// import { computed } from 'vue'
// import { LocalStorage } from 'quasar'
// import { apiAuth } from 'src/boot/axios'
// import { DateTime } from 'luxon'

export const usePaymentStore = defineStore('payment', {
  state: () => ({

    sented: false,
    options: [
      { label: '現金', value: 'cash' },
      { label: '轉帳', value: 'wire' },
      { label: '預收款', value: 'credit' },
      { label: '月結', value: 'debt' },
      { label: 'uber', value: 'uber' }
    ]
  }),
  getters: {},
  actions: {}
})
