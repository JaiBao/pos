import { defineStore } from 'pinia'
// import { LocalStorage } from 'quasar'
import { apiAuth } from 'src/boot/axios'

export const UseAddressStore = defineStore('address', {
  state: () => ({
    state: [],
    city: [],
    cityselect: [],
    addressForm: {
      lane: '',
      alley: '',
      no: '',
      floor: '',
      at: '',
      room: ''
    }
  }),
  actions: {
    async getstate () {
      try {
        this.state.splice(0, this.state.length)
        const result = await apiAuth.get('localization/division/state')
        for (let i = 0; i < result.data.length; i++) {
          this.state.push({
            label: result.data[i].name,
            value: result.data[i].id
          })
        }
      } catch (error) {
        console.error('Failed to get state:', error)
        // 在這裡處理錯誤，例如通過顯示一個錯誤消息給用戶
      }
    },
    async getcity (id) {
      this.city.splice(0, this.city.length)
      const result = await apiAuth.get(
        `localization/division/city?equal_parent_id=${id}`
      )
      for (let i = 0; i < result.data.length; i++) {
        this.city.push({
          label: result.data[i].name,
          value: result.data[i].city_id
        })
      }
    },
    async getcitySelect (id) {
      const result = await apiAuth.get(
        `localization/division/city?equal_parent_id=${id}`
      )
      for (let i = 0; i < result.data.length; i++) {
        this.city.push({
          label: result.data[i].name,
          value: result.data[i].city_id
        })
      }
      this.city.push({
        label: '其他',
        value: 87
      })
    },
    async parseAddress (val) {
      if (val === null) {
        return
      }
      this.cleanaddressForm()
      const laneMatch = val.match(/(\d+)巷/)
      const alleyMatch = val.match(/(\d+)弄/)
      const noMatch = val.match(/(\d+)號/)
      const floorMatch = val.match(/(\d+)樓/)
      const atMatch = val.match(/之(\d+)/)
      const roomMatch = val.match(/(\d+)室/)

      if (laneMatch) this.addressForm.lane = laneMatch[1]
      if (alleyMatch) this.addressForm.alley = alleyMatch[1]
      if (noMatch) this.addressForm.no = noMatch[1]
      if (floorMatch) this.addressForm.floor = floorMatch[1]
      if (atMatch) this.addressForm.at = atMatch[1]
      if (roomMatch) this.addressForm.room = roomMatch[1]

      return this.addressForm
    },
    cleanaddressForm () {
      this.addressForm.lane = ''
      this.addressForm.alley = ''
      this.addressForm.no = ''
      this.addressForm.floor = ''
      this.addressForm.at = ''
      this.addressForm.room = ''
    }
  }
})
