import { defineStore } from 'pinia'
// import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { apiAuth, apiShit } from 'src/boot/axios' // apiOpay
import { DateTime } from 'luxon'
import md5 from 'js-md5'

export const $q = useQuasar()
export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    form2: {

      timeStamp: new Date().getTime(),
      uncode: '53418005',
      idno: 'F200000008',
      // password: 'G263Dfg',
      sign: '',
      datetime: DateTime.now().toFormat('yyyy-MM-dd'),
      state: '0',
      companyCode: '',
      taxState: '1',
      amount: 0, // 稅金
      sales: 0, // 未稅價
      totalFee: 0, // 總金額
      content: '',
      customerName: '',
      phone: '',
      orderCode: '',
      items: []
    },
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
    updateInvoice2: {
      invoice_num: '',
      order_code: '',
      date: ''

    },
    allInvoice: []
  }

  ),
  getters: {

  },
  actions: {
    // 開立發票
    async createInvoice (val) {
      this.form2 = {
        timeStamp: new Date().getTime(),
        uncode: '53418005',
        idno: 'F200000008',
        // password: 'G263Dfg',
        sign: '',
        datetime: DateTime.now().toFormat('yyyy-MM-dd'),
        state: '0',
        companyCode: '',
        taxState: '1',
        amount: 0, // 稅金
        sales: 0, // 未稅價
        totalFee: 0, // 總金額
        content: '',
        customerName: '',
        phone: '',
        items: []
      }
      try {
        this.form2.timeStamp = new Date().getTime()
        this.invoiceForm.Items.splice(0, this.invoiceForm.Items.length)
        this.searchInvoice = {}
        this.form2.items = []
        const { timeStamp, idno } = this.form2
        const signString = `${timeStamp}${idno}G263Dfg`
        const { data } = await apiAuth.get(`/sale/order/${val}`)
        this.searchInvoice = data
        console.log(data)
        this.form2.sign = md5(signString).toUpperCase()
        this.invoiceForm.RelateNumber = this.searchInvoice.code
        this.invoiceForm.CustomerID = this.searchInvoice.customer_id
        if (this.searchInvoice.is_payment_tin === 1) {
          this.form2.phone = this.searchInvoice.payment_tin
        } else {
          this.form2.phone = ''
        }

        this.invoiceForm.CustomerName = this.searchInvoice.payment_company || this.searchInvoice.personal_name
        this.invoiceForm.CustomerAddr = this.searchInvoice.shipping_road + this.searchInvoice.shipping_address1
        this.invoiceForm.CustomerPhone = this.searchInvoice.mobile.replace(/-/g, '')
        // 從searchInvoice對象的totals陣列的第四個元素（索引為3）獲取總金額
        const totalAmount = Math.floor(this.searchInvoice.totals[3].value)
        // 將計算出的數值設定到發票表單對象中
        this.form2.totalFee = totalAmount

        this.invoiceForm.InvoiceRemark = this.searchInvoice.comments
        // this.form2.content = this.searchInvoice.comments
        if (this.type === 'byTotal') { await this.byTotal() } else if (this.type === 'byMeals') { await this.byMeals() }
      } catch (error) {
        console.log(error)
      }
    },
    async sentInvoice () {
      const $q = useQuasar()
      try {
        this.form.Data = this.invoiceForm
        // 計算金額，總金額的95%
        this.form2.sales = Math.floor(this.form2.totalFee * 0.95)

        // 計算稅額，總金額的5%
        this.form2.amount = this.form2.totalFee - Math.floor(this.form2.totalFee * 0.95)
        if (this.invoiceForm.CarrierType === '3') {
          this.form2.phone = this.invoiceForm.CarrierNum
        } else {
          if (this.searchInvoice.is_payment_tin === 1) {
            this.form2.phone = this.searchInvoice.payment_tin
          } else {
            this.form2.phone = ''
          }
        }
        let url = ''
        if (this.invoiceForm.CarrierType === '3') { url = '/pay/b2c-invoice' } else {
          if (this.form2.phone === '') {
            url = '/pay/b2c-invoice'
          } else {
            url = '/pay/b2b-invoice'
          }
        }

        const result = await apiShit.post(url, this.form2)
        if (result.data.code) {
          this.updateInvoice.code = this.searchInvoice.code
          this.updateInvoice.invoice_num = result.data.code
          this.updateInvoice.date = this.form2.datetime

          this.updateInvoice2.order_code = this.invoiceForm.RelateNumber
          this.updateInvoice2.invoice_num = result.data.code
          this.updateInvoice2.date = this.form2.datetime

          const { data } = apiShit.post('/pay/update', this.updateInvoice)
          const { data2 } = apiShit.post('/pay/saveInvoice', this.updateInvoice2)
          console.log(data)
          console.log(data2)
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'error',
            position: 'center',
            message: '成功,已加入訂單!'
          })
          // 清空 form2 物件，以避免 items 累計
          this.form2 = {
            timeStamp: new Date().getTime(),
            uncode: '53418005',
            idno: 'F200000008',
            sign: '',
            datetime: DateTime.now().toFormat('yyyy-MM-dd'),
            state: '0',
            companyCode: '',
            taxState: '1',
            amount: 0,
            sales: 0,
            totalFee: 0,
            content: '',
            customerName: '',
            phone: '',
            items: []
          }
        } else {
          // console.log(result.data.RtnMsg)
          alert(result.data.msg)
          // 清空 form2 物件，以避免 items 累計
          this.form2 = {
            timeStamp: new Date().getTime(),
            uncode: '53418005',
            idno: 'F200000008',
            sign: '',
            datetime: DateTime.now().toFormat('yyyy-MM-dd'),
            state: '0',
            companyCode: '',
            taxState: '1',
            amount: 0,
            sales: 0,
            totalFee: 0,
            content: '',
            customerName: '',
            phone: '',
            items: []
          }
        }
      } catch (error) {
        console.log(error)
        // 清空 form2 物件，以避免 items 累計
        this.form2 = {
          timeStamp: new Date().getTime(),
          uncode: '53418005',
          idno: 'F200000008',
          sign: '',
          datetime: DateTime.now().toFormat('yyyy-MM-dd'),
          state: '0',
          companyCode: '',
          taxState: '1',
          amount: 0,
          sales: 0,
          totalFee: 0,
          content: '',
          customerName: '',
          phone: '',
          items: []
        }
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
      this.form2.items.splice(0, this.form2.items.length)
      this.searchInvoice.order_products.forEach((product, index) => {
        this.form2.items.push({
          name: product.name,
          number: product.quantity,

          money: product.price
        })
        this.invoiceForm.Items.push({
          ItemSeq: itemSeqCounter++,
          ItemName: product.name,
          ItemCount: product.quantity,
          ItemWord: '份',
          ItemPrice: product.price,
          ItemTaxType: '1',
          ItemAmount: product.total,
          ItemRemark: product.comments,
          vat: 0
        })
        if (product.main_category_code === 'bento') {
          product.order_product_options.forEach((option) => {
            if (option.name === '飲料') {
              this.form2.items.push({
                name: option.value,
                number: option.quantity,
                money: 15
              })
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
      if (this.searchInvoice.totals[1].value !== '0') {
        this.form2.items.push({
          name: '折扣',
          number: 1,
          money: -this.searchInvoice.totals[1].value
        })
      }
      if (this.searchInvoice.totals[2].value !== '0') {
        this.form2.items.push({
          name: '運費',
          number: 1,
          money: this.searchInvoice.totals[2].value
        })
      }
    },

    async byTotal () {
      this.invoiceForm.Items.splice(0, this.invoiceForm.Items.length)
      this.form2.items.splice(0, this.form2.items.length)
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
      this.form2.items.push({
        name: '餐飲費用',
        number: 1,
        money: this.searchInvoice.totals[0].value
      })
      if (this.searchInvoice.totals[1].value !== '0') {
        this.form2.items.push({
          name: '折扣',
          number: 1,
          money: -this.searchInvoice.totals[1].value
        })
      }
      if (this.searchInvoice.totals[2].value !== '0') {
        this.form2.items.push({
          name: '運費',
          number: 1,
          money: this.searchInvoice.totals[2].value
        })
      }
    },
    removeItem (index) {
      this.form2.items.splice(index, 1)
      // this.form2.items.forEach((item, idx) => {
      //   item.ItemSeq = idx + 1
      // })
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
    async printInvoicePicture (code) {
      this.form2 = {
        timeStamp: new Date().getTime(),
        uncode: '53418005',
        idno: 'F200000008',
        code,
        sign: '',
        type: '1'
      }
      try {
        this.form2.timeStamp = new Date().getTime()
        const { timeStamp, idno } = this.form2
        const signString = `${timeStamp}${idno}G263Dfg`
        this.form2.sign = md5(signString).toUpperCase()
        const result = await apiShit.post('/pay/printInvoicePicture', this.form2)

        alert(result.data.msg)
      } catch (error) {
        console.error('Failed to get the invoice URL:', error)
      }
    },
    async InvalidInvoiceEcpay (code, reason) {
      this.form2 = {
        timeStamp: new Date().getTime(),
        uncode: '53418005',
        idno: 'F200000008',
        code,
        sign: '',
        remark: reason
      }
      try {
        this.form2.timeStamp = new Date().getTime()
        const { timeStamp, idno } = this.form2
        const signString = `${timeStamp}${idno}G263Dfg`
        this.form2.sign = md5(signString).toUpperCase()
        const result = await apiShit.post('/pay/cancleInvoice', this.form2)

        alert(result.data.msg)
        if (result.data.code) {
          this.updateInvoice.code = this.searchInvoice.code
          this.updateInvoice.invoice_num = ''
          this.updateInvoice.date = DateTime.now().toFormat('yyyy-MM-dd')
          this.updateInvoice.status = 0

          const num = { invoice_num: result.data.code }

          const { data } = apiShit.post('/pay/update', this.updateInvoice)
          const { data2 } = apiShit.post('/pay/deactivateInvoice', num)
          console.log(data)
          console.log(data2)
        }
      } catch (error) {
        console.error('Failed to get the invoice URL:', error)
      }
    }
    // async InvalidInvoiceEcpay (code, date, reason) {
    //   this.form.Data = {
    //     MerchantID: process.env.MerchantIDecpay,
    //     InvoiceNo: code,
    //     InvoiceDate: date,
    //     Reason: reason
    //   }
    //   try {
    //     const result = await apiShit.post('/pay/invalidecpay', this.form)
    //     if (result.data.Data.RtnCode === 0) {
    //       alert(result.data.Data.RtnMsg)
    //     } else {
    //       this.updateInvoice.code = this.searchInvoice.code
    //       this.updateInvoice.invoice_num = ''
    //       this.updateInvoice.date = date
    //       const { data } = apiShit.post('/pay/update', this.updateInvoice)
    //       console.log(data)
    //     }
    //   } catch (error) {
    //     console.error('Failed to get the invoice URL:', error)
    //   }
    // }
  }

})
