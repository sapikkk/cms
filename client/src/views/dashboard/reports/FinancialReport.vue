<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-text-green dark:text-gray-400">Laporan Keuangan</h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">Analisis performa bisnis</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="exportToPDF"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors font-medium border border-transparent shadow-none"
        >
          <PhFilePdf :size="20" />
          Export PDF
        </button>
        <button
          @click="exportToExcel"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors font-medium border border-transparent shadow-none"
        >
          <PhFileXls :size="20" />
          Export Excel
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-green-900/40 rounded-lg p-4 border border-green-200 dark:border-green-800 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-green-700 dark:text-gray-300 mb-1">Dari Tanggal</label>>
          <input
            v-model="filters.startDate"
            type="date"
            class="w-full px-4 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-green-700 dark:text-gray-300 mb-1">Sampai Tanggal</label>>
          <input
            v-model="filters.endDate"
            type="date"
            class="w-full px-4 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-green-700 dark:text-gray-300 mb-1">Kategori</label>>
          <select 
            v-model="filters.category" 
            class="w-full px-4 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          >
            <option value="">Semua</option>
            <option value="product">Penjualan Produk</option>
            <option value="book">Penjualan Buku</option>
          </select>
        </div>
        <button
          @click="applyFilters"
          class="px-6 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-700 self-end font-medium transition-colors"
        >
          Terapkan
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-green-900/40 border-l-4 border-green-500 rounded-r-lg p-6 shadow-none border-t border-b border-r border-green-200 dark:border-green-800">
        <p class="text-green-500 dark:text-gray-400 text-sm font-medium">Total Pendapatan</p>>
        <p class="text-2xl font-bold mt-1 text-green-900 dark:text-white">Rp {{ formatPrice(summary.revenue) }}</p>>
      </div>
      <div class="bg-white dark:bg-green-900/40 border-l-4 border-red-500 rounded-r-lg p-6 shadow-none border-t border-b border-r border-green-200 dark:border-green-800">
        <p class="text-green-500 dark:text-gray-400 text-sm font-medium">Total HPP</p>>
        <p class="text-2xl font-bold mt-1 text-green-900 dark:text-white">Rp {{ formatPrice(summary.cogs) }}</p>>
      </div>
      <div class="bg-white dark:bg-green-900/40 border-l-4 border-blue-500 rounded-r-lg p-6 shadow-none border-t border-b border-r border-green-200 dark:border-green-800">
        <p class="text-green-500 dark:text-gray-400 text-sm font-medium">Laba Kotor</p>>
        <p class="text-2xl font-bold mt-1 text-green-900 dark:text-white">Rp {{ formatPrice(summary.profit) }}</p>>
      </div>
      <div class="bg-white dark:bg-green-900/40 border-l-4 border-purple-500 rounded-r-lg p-6 shadow-none border-t border-b border-r border-green-200 dark:border-green-800">
        <p class="text-green-500 dark:text-gray-400 text-sm font-medium">Margin</p>>
        <p class="text-2xl font-bold mt-1 text-green-900 dark:text-white">{{ summary.margin }}%</p>>
      </div>
    </div>

    <!-- Sales Table -->
    <div class="bg-white dark:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-800 overflow-hidden">
      <div class="p-4 border-b border-green-200 dark:border-green-800">
        <h2 class="text-lg font-bold text-text-green dark:text-gray-400">Detail Penjualan</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-cream-100 dark:bg-green-900/60">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-bold text-green-700 dark:text-gray-400">Tanggal</th>
              <th class="px-6 py-3 text-left text-sm font-bold text-green-700 dark:text-gray-400">Produk</th>
              <th class="px-6 py-3 text-center text-sm font-bold text-green-700 dark:text-gray-400">Qty</th>
              <th class="px-6 py-3 text-right text-sm font-bold text-green-700 dark:text-gray-400">Harga</th>
              <th class="px-6 py-3 text-right text-sm font-bold text-green-700 dark:text-gray-400">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-green-800">
            <tr v-for="sale in salesData" :key="sale.id" class="hover:bg-cream-100 dark:hover:bg-green-800/20 transition-colors">
              <td class="px-6 py-4 text-green-600 dark:text-gray-400">{{ sale.date }}</td>
              <td class="px-6 py-4 font-medium text-green-800 dark:text-white">{{ sale.product }}</td>
              <td class="px-6 py-4 text-center text-green-600 dark:text-gray-400">{{ sale.qty }}</td>
              <td class="px-6 py-4 text-right text-green-600 dark:text-gray-400">Rp {{ formatPrice(sale.price) }}</td>
              <td class="px-6 py-4 text-right font-semibold text-green-800 dark:text-white">Rp {{ formatPrice(sale.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { PhFilePdf, PhFileXls } from '@phosphor-icons/vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const filters = reactive({
  startDate: '',
  endDate: '',
  category: ''
})

const summary = ref({
  revenue: 15500000,
  cogs: 6200000,
  profit: 9300000,
  margin: 60
})

const salesData = ref([])

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const applyFilters = () => {
  console.log('Apply filters:', filters)
  // TODO: Fetch filtered data logic would go here
}

const exportToPDF = () => {
  const doc = new jsPDF()
  doc.text('Laporan Keuangan - Antitesa', 14, 15)
  
  const tableColumn = ["Tanggal", "Produk", "Qty", "Harga", "Total"]
  const tableRows = []

  salesData.value.forEach(sale => {
    const saleData = [
      sale.date,
      sale.product,
      sale.qty,
      `Rp ${formatPrice(sale.price)}`,
      `Rp ${formatPrice(sale.total)}`
    ]
    tableRows.push(saleData)
  })

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20
  })

  doc.save(`Laporan_Keuangan_${new Date().toISOString().slice(0, 10)}.pdf`)
}

const exportToExcel = () => {
  const workSheet = XLSX.utils.json_to_sheet(salesData.value)
  const workBook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workBook, workSheet, "Penjualan")
  XLSX.writeFile(workBook, `Laporan_Keuangan_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

onMounted(async () => {
  salesData.value = [
    { id: 1, date: '2026-01-10', product: 'Cappuccino', qty: 25, price: 35000, total: 875000 },
    { id: 2, date: '2026-01-10', product: 'Espresso', qty: 30, price: 25000, total: 750000 },
    { id: 3, date: '2026-01-11', product: 'Matcha Latte', qty: 18, price: 38000, total: 684000 }
  ]
})
</script>
