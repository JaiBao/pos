import { defineStore } from 'pinia'
// import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { apiAuth, apiShit } from 'src/boot/axios' // apiOpay
import { DateTime } from 'luxon'
export const $q = useQuasar()
export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    form: {
      MerchantID: process.env.MerchantIDecpay,
      RqHeader: { Timestamp: new Date().getTime() },
      Data: {}
    },
    searchInvoice: {},
    InvoiceDate: '',
    invoiceForm: {
      MerchantID: 2000132,
      RelateNumber: '', // code
      CustomerID: '',
      CustomerIdentifier: '', // 統v編
      CustomerName: '',
      CustomerAddr: '',
      CustomerPhone: '',
      CustomerEmail: '', // phone email擇一
      ClearanceMark: '1',
      Print: '1',
      Donation: '0',
      LoveCode: '',
      CarrierType: '', // 載具 1 opay 2自然人 3條碼
      CarrierNum: '',
      TaxType: '1',
      SalesAmount: 0, // 發票總金額
      InvoiceRemark: '',
      InvType: '07',
      vat: '0',
      Items: []
    },
    type: 'byTotal',
    updateInvoice: {
      invoice_num: '',
      code: '',
      date: '',
      status: 1
    },
    allInvoice: []
  }

  ),
  getters: {

  },
  actions: {
    // 開立發票
    async createInvoice (val) {
      try {
        this.invoiceForm.Items.splice(0, this.invoiceForm.Items.length)
        this.searchInvoice = {}
        const { data } = await apiAuth.get(`/sale/order/${val}`)
        this.searchInvoice = data
        this.invoiceForm.RelateNumber = this.searchInvoice.code
        this.invoiceForm.CustomerID = this.searchInvoice.customer_id
        if (this.searchInvoice.is_payment_tin === 1) {
          this.invoiceForm.CustomerIdentifier = this.searchInvoice.payment_tin
        } else {
          this.invoiceForm.CustomerIdentifier = ''
        }
        this.invoiceForm.CustomerName = this.searchInvoice.payment_company || this.searchInvoice.personal_name
        this.invoiceForm.CustomerAddr = this.searchInvoice.shipping_road + this.searchInvoice.shipping_address1
        this.invoiceForm.CustomerPhone = this.searchInvoice.mobile.replace(/-/g, '')
        this.invoiceForm.SalesAmount = Math.floor(this.searchInvoice.totals[3].value)
        this.invoiceForm.InvoiceRemark = this.searchInvoice.comments
        if (this.type === 'byTotal') { await this.byTotal() } else if (this.type === 'byMeals') { await this.byMeals() }
      } catch (error) {
        console.log(error)
      }
    },
    async sentInvoice () {
      const $q = useQuasar()
      try {
        this.form.Data = this.invoiceForm
        const result = await apiShit.post('/pay/createecpay', this.form)
        if (result.data.Data.InvoiceNo) {
          this.updateInvoice.code = this.searchInvoice.code
          this.updateInvoice.invoice_num = result.data.Data.InvoiceNo

          const { data } = apiShit.post('/pay/update', this.updateInvoice)
          console.log(data)
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'error',
            position: 'center',
            message: '成功,已加入訂單!'
          })
        } else {
          console.log(result.data.Data.RtnMsg)
          alert(result.data.Data.RtnMsg)
        }
      } catch (error) {
        console.log(error)
      }
    },
    getDatesArray (start, end) {
      const dates = []
      let startDate = DateTime.fromFormat(start, 'yyyy-MM-dd')
      const endDate = DateTime.fromFormat(end, 'yyyy-MM-dd')

      while (startDate <= endDate) {
        dates.push(startDate.toISODate())
        startDate = startDate.plus({ days: 1 })
      }

      return dates
    },
    // 明細為餐點選項
    async byMeals () {
      let itemSeqCounter = 1 // 初始化
      this.invoiceForm.Items.splice(0, this.invoiceForm.Items.length)
      this.searchInvoice.order_products.forEach((product, index) => {
        this.invoiceForm.Items.push({
          ItemSeq: itemSeqCounter++,
          ItemName: product.name,
          ItemCount: product.quantity,
          ItemWord: '份',
          ItemPrice: product.price * 0.95,
          ItemTaxType: '1',
          ItemAmount: product.total,
          ItemRemark: product.comments,
          vat: 0
        })
        if (product.main_category_code === 'bento') {
          product.order_product_options.forEach((option) => {
            if (option.name === '飲料') {
              this.invoiceForm.Items.push({
                ItemSeq: itemSeqCounter++,
                ItemName: option.value,
                ItemCount: option.quantity,
                ItemWord: '份',
                ItemPrice: 15,
                ItemTaxType: '1',
                ItemAmount: option.quantity * 15,
                ItemRemark: ''
              })
            }
          })
        }
      })
    },

    async byTotal () {
      this.invoiceForm.Items.splice(0, this.invoiceForm.Items.length)
      this.invoiceForm.Items.push({
        ItemSeq: 1,
        ItemName: '餐飲費用',
        ItemCount: 1,
        ItemWord: '份',
        ItemPrice: this.searchInvoice.totals[3].value,
        ItemTaxType: '1',
        ItemAmount: this.searchInvoice.totals[3].value,
        ItemRemark: ''
      })
    },
    removeItem (index) {
      this.invoiceForm.Items.splice(index, 1)
      this.invoiceForm.Items.forEach((item, idx) => {
        item.ItemSeq = idx + 1
      })
    },
    async getInvoiceByCode (code, date) {
      async function printURL (url) {
        const printWindow = window.open(url, '_blank')
        // 使用 onload 事件确保页面完全加载
        printWindow.onload = function () {
          // 将焦点移至新窗口
          printWindow.focus()
          // 延迟执行打印，以确保页面渲染完成
          setTimeout(() => printWindow.print(), 500)
        }
      }

      this.form.Data = {
        MerchantID: process.env.MerchantIDecpay,
        InvoiceNo: code,
        InvoiceDate: date,
        PrintStyle: '3',
        IsShowingDetail: '1'
      }

      try {
        const result = await apiShit.post('/pay/printecpay', this.form)
        const invoiceUrl = result.data.Data.InvoiceHtml // 获取URL
        await printURL(invoiceUrl)
        return invoiceUrl
      } catch (error) {
        console.error('Failed to get the invoice URL:', error)
      }
    },
    async searchInvoiceDate (val) {
      this.InvoiceDate = ''
      function convertDate (dateString) {
        // 使用 Luxon 的 DateTime 從 ISO 字符串創建日期
        const date = DateTime.fromISO(dateString)
        // 將日期格式化為 'yyyy-MM-dd' 格式
        return date.toFormat('yyyy-MM-dd')
      }
      try {
        const { data } = await apiShit.get(`/pay/findinvoice/${val}`)
        console.log(data)
        this.allInvoice.splice(0, this.allInvoice.length)
        this.InvoiceDate = ''
        if (data.length === 0) {
          return 0
        }

        let i = 0
        for (i = 0; i < data.length; i++) {
          this.allInvoice.push(data[i])
          this.InvoiceDate = convertDate(data[i]?.date)
        }
        return i
      } catch (error) {
        console.log(error)
      }
    },
    async searchInvoiceALL (val) {
      this.InvoiceDate = ''
      function convertDate (dateString) {
        // 使用 Luxon 的 DateTime 從 ISO 字符串創建日期
        const date = DateTime.fromISO(dateString)
        // 將日期格式化為 'yyyy-MM-dd' 格式
        return date.toFormat('yyyy-MM-dd')
      }
      try {
        const { data } = await apiShit.get(`/pay/findinvoice/${val}`)
        console.log(data)
        if (data.length === 0) {
          return ''
        }
        this.InvoiceDate = convertDate(data[0]?.date)
      } catch (error) {
        console.log(error)
      }
    },
    async InvalidInvoiceEcpay (code, date, reason) {
      this.form.Data = {
        MerchantID: process.env.MerchantIDecpay,
        InvoiceNo: code,
        InvoiceDate: date,
        Reason: reason
      }
      try {
        const result = await apiShit.post('/pay/invalidecpay', this.form)
        if (result.data.Data.RtnCode === 0) {
          alert(result.data.Data.RtnMsg)
        } else {
          this.updateInvoice.code = this.searchInvoice.code
          this.updateInvoice.invoice_num = ''
          this.updateInvoice.date = date
          const { data } = apiShit.post('/pay/update', this.updateInvoice)
          console.log(data)
        }
      } catch (error) {
        console.error('Failed to get the invoice URL:', error)
      }
    }
  }

})
