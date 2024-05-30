<template>
  <div class="invoice-print">
    <h3 class="title">餐點明細</h3>
    <q-table
      flat
      bordered
      :rows="invoiceItems"
      :columns="columns"
      row-key="name"
      binary-state-sort
      hide-bottom
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useInvoiceStore } from 'src/stores/invoice'

const invoice = useInvoiceStore()

const invoiceItems = computed(() => invoice.form2.items)

const columns = [
  { name: 'name', label: '品項名稱', align: 'left', field: row => row.name },
  { name: 'number', label: '數量', align: 'right', field: row => row.number },
  { name: 'money', label: '單價', align: 'right', field: row => row.money },
  { name: 'totalPrice', label: '總價', align: 'right', field: row => row.number * row.money }
]
</script>

<style lang="scss"  scoped>
@keyframes neon {
  0%, 100% {
    text-shadow: 0 0 5px #fff,
                 0 0 10px #fff,
                 0 0 20px #fff,
                 0 0 40px #0ff,
                 0 0 80px #0ff,
                 0 0 90px #0ff,
                 0 0 100px #0ff,
                 0 0 150px #0ff;
    color: #fff;
  }
  50% {
    text-shadow: 0 0 2px #fff,
                 0 0 4px #fff,
                 0 0 8px #fff,
                 0 0 16px #0ff,
                 0 0 32px #0ff,
                 0 0 48px #0ff,
                 0 0 64px #0ff,
                 0 0 96px #0ff;
    color: #0ff;
  }
}

.invoice-print {
  border: 1px solid #000;
  padding: 10px;
  box-sizing: border-box;
  background:#000
}

.title {
  text-align: center;
  font-size: 14px;
  margin-bottom: 10px;
  animation: neon 1.5s ease-in-out infinite alternate;
}
</style>
