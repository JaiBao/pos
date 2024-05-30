import { defineStore } from 'pinia'

export const useStatusStore = defineStore('status', {
  persist: true,
  key: 'status',
  state: () => ({
    status1: [0, 0, 0, 0],
    status2: [0, 0, 0, 0],
    status3: [0, 0, 0, 0],
    status4: [0, 0, 0, 0]
  }),

  actions: {
    increment (index, statusKey) {
      if (this[statusKey][index] < 2) {
        this[statusKey][index]++
      } else {
        this[statusKey][index] = 0
      }
    },
    startFetchingPersistedState () {
      setInterval(() => {
        console.log('aaa')
        const persistedData = localStorage.getItem('status') // 使用你為 Pinia persist 插件設定的 key
        if (persistedData) {
          const parsedData = JSON.parse(persistedData)
          this.$patch(parsedData)
        }
      }, 2000)
    }
  }
})
