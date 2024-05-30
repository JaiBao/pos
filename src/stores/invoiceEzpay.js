import { defineStore } from 'pinia'
// import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { apiAuth, apiShit } from 'src/boot/axios' // apiOpay
import { DateTime } from 'luxon'
export const $q = useQuasar()
export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    form: {
      MerchantID_: process.env.MerchantIDecpay,
      // RqHeader: { Timestamp: new Date().getTime() },
      PostData_: {}
    },
    searchInvoice: {},
    InvoiceDate: '',
    invoiceForm: {
      RespondType: 'JSON', // 回傳格式
      Version: '1.5', // 串接版本
      Timestamp: new Date().getTime(),
      MerchantOrderNo: '', // code
      Status: '1',
      Category: '',
      BuyerUBN: '', // 統v編
      BuyerName: '',
      BuyerAddress: '',
      PrintFlag: 'Y',
      TaxType: '1',
      TaxRate: 5,
      Amt: 0, // 銷售額未稅
      TaxAmt: 0, // 發票稅額
      TotalAmt: 0, // 發票總額含稅
      ItemName: '', // 商品名稱
      ItemCount: '', // 商品數量
      ItemUnit: '', // 商品單位
      ItemPrice: '', // 商品單價
      ItemAmt: '', // 商品小計
      ItemTaxType: '', // 商品課稅別
      // CustomerPhone: '',
      CustomerEmail: '', // phone email擇一
      CustomsClearance: '1',
      Donation: '0',
      LoveCode: '',
      CarrierType: '', // 載具 1 opay 2自然人 3條碼
      CarrierNum: '',
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
        this.invoiceForm.MerchantOrderNo = this.searchInvoice.code

        if (this.searchInvoice.is_payment_tin === 1) {
          this.invoiceForm.BuyerUBN = this.searchInvoice.payment_tin
          this.invoiceForm.Category = 'B2B'
        } else {
          this.invoiceForm.BuyerUBN = ''
          this.invoiceForm.Category = 'B2C'
        }
        this.invoiceForm.BuyerName = this.searchInvoice.payment_company || this.searchInvoice.personal_name

        this.invoiceForm.BuyerAddress = this.searchInvoice.shipping_road + this.searchInvoice.shipping_address1
        // this.invoiceForm.CustomerPhone = this.searchInvoice.mobile.replace(/-/g, '')
        // 從searchInvoice對象的totals陣列的第四個元素（索引為3）獲取總金額
        const totalAmount = Math.floor(this.searchInvoice.totals[3].value)

        // 計算金額，總金額的95%
        const amount = Math.floor(totalAmount * 0.95)

        // 計算稅額，總金額的5%
        const taxAmount = Math.floor(totalAmount * 0.05)

        // 將計算出的數值設定到發票表單對象中
        this.invoiceForm.TotalAmt = totalAmount
        this.invoiceForm.Amt = amount
        this.invoiceForm.TaxAmt = taxAmount

        this.invoiceForm.InvoiceRemark = this.searchInvoice.comments
        if (this.type === 'byTotal') { await this.byTotal() } else if (this.type === 'byMeals') { await this.byMeals() }
      } catch (error) {
        console.log(error)
      }
    },
    async sentInvoice () {
      const $q = useQuasar()
      try {
        // 創建一個新的物件來存儲需要POST的數據，同時去除Items屬性
        const postDataWithoutItems = { ...this.invoiceForm } // 使用展開運算符複製invoiceForm
        delete postDataWithoutItems.Items // 刪除Items屬性

        // 使用新的postDataWithoutItems物件進行POST操作
        this.form.PostData_ = postDataWithoutItems

        const result = await apiShit.post('/pay/createecpay', this.form)
        if (result.data.Data.InvoiceNumber) {
          this.updateInvoice.code = this.searchInvoice.code
          this.updateInvoice.invoice_num = result.data.Data.InvoiceNumber

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
          ItemPrice: product.price,
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
      // 將Items數組中的數據格式化為字符串並賦值給相應的屬性
      this.invoiceForm.ItemName = this.invoiceForm.Items.map(item => item.ItemName).join(' | ')
      this.invoiceForm.ItemCount = this.invoiceForm.Items.map(item => item.ItemCount).join('|')
      this.invoiceForm.ItemUnit = this.invoiceForm.Items.map(item => item.ItemWord).join('|')
      this.invoiceForm.ItemPrice = this.invoiceForm.Items.map(item => item.ItemPrice).join('|')
      this.invoiceForm.ItemAmt = this.invoiceForm.Items.map(item => item.ItemAmount).join('|')
      this.invoiceForm.ItemTaxType = this.invoiceForm.Items.map(item => item.ItemTaxType).join('|')
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
