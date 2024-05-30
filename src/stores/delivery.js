import { defineStore } from 'pinia'
import { apiShit } from 'src/boot/axios'

export const useDeliveryStore = defineStore({
  id: 'delivery',
  persist: true,
  state: () => ({
    deliveryman: [],
    deliverymanFull: [],

    transport: [
      { label: '汽車', value: 'car' },
      { label: '機車', value: 'moto' }
    ],
    soundRate: 0.7
  }),
  getters: {

  },
  actions: {
    async getDeliveryman () {
      this.deliveryman = []
      this.deliverymanFull = []
      const { data } = await apiShit.get('/delivery/man')
      this.deliverymanFull = data.message
      for (let i = 0; i < data.message.length; i++) {
        this.deliveryman.push(data.message[i].name)
      }
    },
    async getDelivery (code) {
      const { data } = await apiShit.get(`/delivery/id/${code}`)
      return {
        delivery_id: data.message[0]?.delivery_id
          ? data.message[0]?.delivery_id
          : '',
        delivery_name: data.message[0]?.name ? data.message[0]?.name : '',
        delivery_fee: data.message[0]?.fee ? data.message[0]?.fee : '',
        delivery_phone: data.message[0]?.phone ? data.message[0]?.phone : '',
        delivery_cartype: data.message[0]?.cartype
          ? data.message[0]?.cartype
          : ''
      }
    },
    async getDeliveryDate (date) {
      const { data } = await apiShit.post('/delivery/date', { date })
      const result = []
      for (let i = 0; i < data.message.length; i++) {
        result.push({
          order_code: data.message[i]?.order_code
            ? data.message[i]?.order_code.toString()
            : '',
          delivery_id: data.message[i]?.delivery_id
            ? data.message[i]?.delivery_id
            : '',
          delivery_name: data.message[i]?.name ? data.message[i]?.name : '',
          delivery_fee: data.message[i]?.fee ? data.message[i]?.fee : '',
          delivery_phone: data.message[i]?.phone ? data.message[i]?.phone : '',
          delivery_cartype: data.message[i]?.cartype
            ? data.message[i]?.cartype
            : '',
          delivery_plate: data.message[i]?.plate ? data.message[i]?.plate : ''
        })
      }
      return result
    },
    async createDelivery (val) {
      try {
        const { data } = await apiShit.post('/delivery/create', val)
        console.log(data.message)
      } catch (error) {
        console.log(error)
      }
    },
    async updateDelivery (val) {
      try {
        const { data } = await apiShit.patch('/delivery/update', val)
        console.log(data.message)
      } catch (error) {
        console.log(error)
      }
    },
    async addDeliveryman (val) {
      try {
        const { data } = await apiShit.post('/delivery/addman', val)
        console.log(data.message)
      } catch (error) {
        console.log(error)
      }
    },
    async deleteDeliveryman (val) {
      try {
        const { data } = await apiShit.post('/delivery/deleteman', val)
        console.log(data.message)
      } catch (error) {
        console.log(error)
      }
    },
    async updateDeliveryman (val) {
      try {
        const { data } = await apiShit.patch('/delivery/updateman', val)
        console.log(data.message)
      } catch (error) {
        console.log(error)
      }
    }
  }
})
