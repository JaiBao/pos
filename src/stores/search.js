import { defineStore } from 'pinia'
// import { LocalStorage } from 'quasar'
import { apiAuth } from 'src/boot/axios'

export const UseSearchStore = defineStore('search', {
  state: () => ({
    cellphone: [],
    telephone: [],
    name: [],
    searchName: '',
    searchPhone: '',
    searchTele: '',
    searchCompany: '',
    shouldSearch: false,
    monthoption: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    orderStatus: [
      { label: '未確認', value: 'Pending' },
      { label: '已確認', value: 'Confirmed' },
      { label: '已確認待配餐', value: 'CCP' },
      { label: '作廢', value: 'Void' }
    ]
  }),
  actions: {
    async searchname (val) {
      try {
        this.name.splice(0, this.name.length)
        const result = await apiAuth.get(`member/member?&page=1&filter_name=${val}`)
        for (let i = 0; i < result.data.data.length; i++) {
          this.name.push({ label: result.data.data[i].name, value: result.data.data[i].name })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async searchphone (val) {
      try {
        if (val.length > 3) {
          this.cellphone.splice(0, this.cellphone.length)
          const { data } = await apiAuth.get(`member/member?&page=1&filter_phone=${val}`)
          console.log(data.data)
          for (let i = 0; i < data.data.length; i++) {
            this.cellphone.push({ label: data.data[i].name + ' ' + data.data[i].mobile, value: data.data[i].mobile })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async searchtelephone (val) {
      try {
        this.telephone.splice(0, this.telephone.length)
        const { data } = await apiAuth.get(`member/member?&page=1&filter_phone=${val}`)
        console.log(data.data)
        for (let i = 0; i < data.data.length; i++) {
          this.telephone.push({ label: data.data[i].telephone, value: data.data[i].telephone })
        }
      } catch (error) {
        console.log(error)
      }
    }

  }
})
