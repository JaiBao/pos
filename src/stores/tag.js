import { defineStore } from 'pinia'
import { apiAuth } from 'src/boot/axios'
export const useTagStore = defineStore('tag', {
//
  state: () => ({
    tag: [],
    tagGeted: false,
    uberCustomer: false,
    limit: [
      { time: '09:00-10:00', limit: 0 },
      { time: '10:00-11:00', limit: 0 },
      { time: '11:00-12:00', limit: 0 },
      { time: '12:00-13:00', limit: 0 },
      { time: '13:00-14:00', limit: 0 },
      { time: '14:00-15:00', limit: 0 },
      { time: '15:00-16:00', limit: 0 },
      { time: '16:00-17:00', limit: 0 },
      { time: '17:00-18:00', limit: 0 }

    ]
  }),
  actions: {
    async getTags () {
      if (this.tagGeted) {
        console.log('tag geted!!!')
      } else {
        const { data } = await apiAuth.get('sale/order/phrases/order_tag')
        console.log(data.data)
        data.data.forEach(element => {
          this.tag.push({ label: element.name, value: element.id })
        })
        // this.tagGeted = true
      }
    },
    async getOrderQuantity () {
      try {
        const { data } = await apiAuth.get('/analysis/getTimeQuantity')
        console.log(data)
        // 更新 limit 数据
        this.limit = data.data.map(item => ({
          time: item.TimeSlot,
          limit: item.quantity
        }))
      } catch (error) {
        console.error('Failed to fetch limit data:', error)
      }
    },
    async updateOrderQuantity (newData) {
      try {
        const payload = {
          data: []
        }
        payload.data = newData
        const { data } = await apiAuth.post('/analysis/updateTimeQuantity', payload)
        console.log(data)
      } catch (error) {
        console.error('Failed to fetch limit data:', error)
      }
    },
    findLimitItem (time) {
      return this.limit.find(item => item.time === time)
    },
    async convertTags (val) {
      const newTags = []
      val.forEach(element => {
        newTags.push(element.term_id)
      })
      return newTags
    }
  }
})
