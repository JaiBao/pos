<template>
  <div class="q-pa-md">
    <q-table
      :rows="orders"
      :columns="columns"
      row-key="id"
      selection="multiple"
      v-model:selected="selected"
      v-model:pagination="pagination"
      :rows-per-page-options="[10, 20, 50]"
      :filter="filter"
      :sort-options="{ multiColumn: false }"
      :rows-per-page-label="$t('Rows per page')"
      :no-data-label="$t('No data available')"
    >
      <template v-slot:top>
        <q-toolbar>
          <q-btn color="primary" icon="add" label="Add" @click="addOrder" />
          <q-space />
          <q-input v-model="filter" label="Search" />
        </q-toolbar>
      </template>
      <template v-slot:body-cell-operation="{ row }">
        <q-btn
        color="warning" icon="print" @click="printOrder(row)" />
        <q-btn
        color="primary" icon="edit" @click="editOrder(row)" />
        <q-btn
        color="red"
        icon="delete" @click="deleteOrder(row)" />
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { apiAuth } from 'src/boot/axios'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const orders = reactive([])
const getOrders = async () => {
  let page = 1
  let hasMoreData = true
  let delayTime = 500 // 初始延迟时间为 500 毫秒

  while (hasMoreData) {
    try {
      const data = await apiAuth.get(`/sale/order?page=${page}`)
      // console.log(data.data.data)

      for (let i = 0; i < data.data.data.length; i++) {
        orders.push({
          id: data.data.data[i].id,
          orderNumber: data.data.data[i].code,
          name: data.data.data[i].personal_name,
          phone: data.data.data[i].mobile,
          deliveryDate: data.data.data[i].delivery_date,
          orderStatus: data.data.data[i].status_txt
        })
      }

      // 使用可选链操作符检查是否还有更多的订单数据
      hasMoreData = data.data.meta?.pagination?.next_page !== null
      // 如果还有更多数据，则将页码加 1
      if (hasMoreData) {
        page++
        // 使用指数退避算法动态调整请求频率
        await new Promise(resolve => setTimeout(resolve, delayTime))
        delayTime = delayTime * 2 // 每次延迟时间加倍
      }
    } catch (error) {
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'cloud_off',
        message: error.message
      })
      // 如果请求出错，退出循环
      hasMoreData = false
    }
  }
}

getOrders()

const columns = ref([
  {
    name: 'id',
    align: 'center',
    label: 'ID',
    field: 'id',
    sortable: true
  },
  {
    name: 'orderNumber',
    align: 'center',
    label: '訂單編號',
    field: 'orderNumber',
    sortable: true
  },
  {
    name: 'name',
    align: 'center',
    label: '姓名',
    field: 'name',
    sortable: true
  },
  {
    name: 'phone',
    align: 'center',
    label: '電話',
    field: 'phone',
    sortable: true
  },
  {
    name: 'deliveryDate',
    align: 'center',
    label: '送達日期',
    field: 'deliveryDate',
    sortable: true
  },
  {
    name: 'orderStatus',
    align: 'center',
    label: '訂單狀態',
    field: 'orderStatus',
    sortable: true
  },
  {
    name: 'operation',
    align: 'center',
    label: '操作',
    field: '',
    sortable: false
  }
])

const selected = ref([])
const pagination = ref({ rowsPerPage: 10 })
const filter = ref('')

function addOrder () {
  const newOrder = {
    id: orders.length + 1,
    orderNumber: `ORD00${orders.length + 1}`,
    name: 'New Customer',
    phone: '',
    deliveryDate: '',
    orderStatus: 'Pending'
  }
  orders.push(newOrder)
  pagination.value.rowsNumber = orders.length
}

function printOrder (row) {
  // 取得被選取的訂單
  const selectedOrder = orders.find(order => order.id === row.id)

  // 使用 window.print() 印出訂單
  // 請注意，為了能夠正常運作，你可能需要調整訂單的 HTML 樣式
  // 或是使用第三方套件，例如 jsPDF
  const orderHTML = `
    <div>

      <table class="border-none" style="margin: 0px;padding: 0px; width: 100%;">
  <tbody>
    <tr>
      <td>

        <table class="border-none contact" style="width: 100%;">
          <tbody><tr style="height: 70px;">
            <td class="col-sm-1"><img width="60" src="http://ods.dtstw.com/image/logo.png" alt="Chinabing" title="Chinabing"></td>
            <td class="text-center"><span style="font-size: 1.5em;">外送訂購單</span></td>
            <td style="width: 28%;">訂單編號  ${selectedOrder.orderNumber}<br></td>
          </tr>
          <tr>
            <td colspan="3">
              <span class="fw-bold">送達日：</span><span>${selectedOrder.deliveryDate}</span>&nbsp;&nbsp;
              <span class="fw-bold">星期：</span><span>四</span>&nbsp;&nbsp;
              <span class="fw-bold">時間：</span><span></span>&nbsp;&nbsp;
              <span class="fw-bold">訂購人：</span><span> ${selectedOrder.name}</span>&nbsp;&nbsp;
              <span class="fw-bold">手機：</span><span>${selectedOrder.phone}</span>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <span class="fw-bold">市內電話：</span><span></span>&nbsp;&nbsp;
              <span class="fw-bold">訂餐公司：</span><span></span>&nbsp;&nbsp;
              <span class="fw-bold">部門：</span><span></span>&nbsp;&nbsp;
              <span class="fw-bold">統編：</span><span></span>
            </td>
          </tr>


            <tr>
              <td colspan="3">
              <span class="fw-bold">送達地址：</span>
                              &nbsp;&nbsp;
                                &nbsp;&nbsp;<br>
                <span class="fw-bold">送達聯絡人：</span><span>test</span>&nbsp;&nbsp;
                <span class="fw-bold">聯絡電話：</span><span>12-3456</span>
                            </td>
            </tr>
        </tbody></table>
      </td>
    </tr>
    <tr>
      <td>


        <div class="bootstrap-table bootstrap5">
      <div class="fixed-table-toolbar"></div>

      <div class="fixed-table-container">
      <div class="fixed-table-header"><table></table></div>
      <div class="fixed-table-body">
      <div class="fixed-table-loading table table-bordered table-hover">
      <span class="loading-wrap">
      <span class="loading-text">Loading, please wait</span>
      <span class="animation-wrap"><span class="animation-dot"></span></span>
      </span>

      </div>
      <table data-toggle="table" class="table table-bordered border border-dark" border="1">
            <tbody>
              <tr style="height: 60px;">
                <td class="col " style="height: 60px;width: 30%;">
                  <div class="row justify-between">
                    客戶備註：一樓電聯。發票分兩張，一張2900元，其餘另一張。
                  </div>
                  <div class="row justify-end">外送五步驟：清檢放統備 &nbsp;&nbsp;簽名：_______________</div>
                </td>
              </tr>
            </tbody>
          </table>

          <table data-toggle="table" class="table table-bordered border border-dark"
            style="margin-top:3px;margin-bottom:0px;width: 100%;" border="1">
            <tbody>
              <tr>
                <td></td>
                <td style="width:65px;">數量</td>
                <td class="wMainMeal fw-bold">全素薯</td>
                <td class="wMainMeal fw-bold">蛋素薯</td>
                <td class="wMainMeal fw-bold">薯泥</td>
                <td class="wMainMeal fw-bold">炸蝦</td>
                <td class="wMainMeal fw-bold">炒雞</td>
                <td class="wMainMeal fw-bold">酥魚</td>
                <td class="wMainMeal fw-bold">培根</td>
                <td class="wMainMeal fw-bold">滷肉</td>
              </tr>
              <tr>
                <td rowspan="3">雞胸便當</td>
                <td rowspan="3">14</td>
                <td>
                </td>
                <td>
                </td>
                <td>
                </td>
                <td>

                  14
                </td>
                <td>
                </td>
                <td>
                </td>
                <td>
                </td>
                <td>
                </td>
              </tr>
              <tr>
                <td colspan="8">
                  濃湯*14,
                </td>
              </tr>
              <tr style="height:3px">
                <td colspan="8">
                </td>
              </tr>
            </tbody>
          </table>

          <table data-toggle="table" class="table table-bordered border border-dark rounded-3"
            style="margin-top:3px;margin-bottom:0px;width: 100%;" border="1">
            <tbody>

              <tr>
                <td></td>
                <td style="width:65px;">數量</td>
                <td class="wMainMeal fw-bold">全素薯</td>
                <td class="wMainMeal fw-bold">蛋素薯</td>
                <td class="wMainMeal fw-bold">薯泥</td>
                <td class="wMainMeal fw-bold">炸蝦</td>
                <td class="wMainMeal fw-bold">炒雞</td>
                <td class="wMainMeal fw-bold">酥魚</td>
                <td class="wMainMeal fw-bold">培根</td>
                <td class="wMainMeal fw-bold">滷肉</td>
              </tr>
              <tr>
                <td rowspan="3">貴賓盒餐</td>
                <td rowspan="3">15</td>
                <td>
                </td>
                <td>
                </td>
                <td>
                </td>
                <td>

                  15
                </td>
                <td>
                </td>
                <td>
                </td>
                <td>
                </td>
                <td>
                </td>
              </tr>
              <tr>
                <td>
                </td>
                <td>
                </td>
                <td>
                </td>
                <td>
                </td>
                <td>
                </td>
                <td>
                </td>
                <td>
                </td>
                <td>
                </td>
              </tr>
              <tr style="height:3px">
                <td colspan="8">
                </td>
              </tr>
            </tbody>
          </table>

          <table data-toggle="table" class="table table-bordered border border-dark"
            style="margin-top:3px;margin-bottom:0px;">
            <tbody>
              <tr>
                <td colspan="8" style="height:3px">
                </td>
              </tr>
            </tbody>
          </table>

          <table data-toggle="table" class="table table-bordered border border-dark"
            style="margin-top:3px;margin-bottom:0px;">
            <tbody>
            </tbody>
          </table>

          <table data-toggle="table" class="table table-bordered border border-dark"
            style="margin-top:3px;margin-bottom:0px;width: 100%;" border="1">
            <tbody>
              <tr>
                <td class="row justify-start" style="height: 50px;">餐點備註：</td>
              </tr>
            </tbody>
          </table>

          <table data-toggle="table" class="table table-bordered border border-dark" border="1"
            style="margin-top:3px;margin-bottom:0px; width: 100%;">
            <tbody>

              <tr>
                <td  style="width: 205.21px;">統計主餐</td>
                <td style="width:65px;">29</td>
                <td class="wMainMeal"></td>
                <td class="wMainMeal"></td>
                <td class="wMainMeal"></td>
                <td class="wMainMeal">29</td>
                <td class="wMainMeal"></td>
                <td class="wMainMeal"></td>
                <td class="wMainMeal"></td>
                <td class="wMainMeal"></td>
              </tr>
              <tr>
                <td>統計其它</td>
                <td colspan="9">
                  飲料：
                  濃湯*14,
                </td>
              </tr>
            </tbody>
          </table>

          <table data-toggle="table" class="table table-bordered border border-dark" border="1"
            style="margin-top:3px;margin-bottom:0px; width: 100%;">
            <tr>
              <td class="align-top">
                客戶簽收&#58;_______________ 日期&#58;<br>
                外送人員&#58;_______________ 出發時間&#58;_______________<br>
                租借外送機車車號&#58;_______________ &nbsp;&nbsp;&nbsp;

                <input type="checkbox" id="input-chk001">
                <label for="input-chk001">膠台</label>

                <input type="checkbox" id="input-chk002">
                <label for="input-chk002">推車</label>

                <input type="checkbox" id="input-chk003">
                <label for="input-chk003">拉繩</label><br>
                運費代收人：_______________ 代收金額：______<br>
                貨款代收人：_______________ 代收金額：______

              </td>
              <td class="col-sm-3 align-top" style="padding: 0px;">
                <table data-toggle="table" class="table  border no-border" border="1" style="width: 100%;">
                  <tr class="boderBottom">
                    <td class="text-end">商品合計: </td>
                    <td class="text-end">3,765</td>
                  </tr>
                  <tr class="boderBottom">
                    <td class="text-end">優惠折扣: </td>
                    <td class="text-end">0</td>
                  </tr>
                  <tr class="boderBottom">
                    <td class="text-end">運費: </td>
                    <td class="text-end">0</td>
                  </tr>
                  <tr class="boderBottom">
                    <td class="text-end">總計: </td>
                    <td class="text-end">3,765</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </tbody>
  </table>



    </div>
  `
  const printWindow = window.open('', '', 'height=500,width=500')
  printWindow.document.write(orderHTML)
  printWindow.print()
  printWindow.close()
}

function deleteOrder (row) {
  // 取得被選取的訂單的索引值
  const index = orders.findIndex(order => order.id === row.id)

  // 刪除訂單
  orders.splice(index, 1)

  // 更新分頁資訊
  pagination.value.rowsNumber = orders.length
}

function editOrder (row) {
  // Add logic to edit the selected order
}
</script>
