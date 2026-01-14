<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-text-green dark:text-gray-400 mb-2">Simulasi & Kalkulasi Produk</h1>
      <p class="text-green-500 dark:text-gray-400">Hitung HPP dan estimasi profit margin untuk resep baru Anda.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Calculator Component -->
      <div class="lg:col-span-2">
        <IngredientCalculator />
      </div>

      <!-- Info / Guide -->
      <div class="space-y-6">
        <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
          <h3 class="font-bold text-blue-800 dark:text-blue-300 mb-2">Panduan Pricing</h3>
          <ul class="list-disc list-inside text-sm text-blue-700 dark:text-blue-200 space-y-2">
            <li><strong>Low Tier (Margin 30-40%)</strong>: Produk promo atau loss leader untuk menarik traffic.</li>
            <li><strong>Standard (Margin 50-60%)</strong>: Menu reguler harian.</li>
            <li><strong>Premium (Margin 70%+)</strong>: Signature drink atau seasonal menu.</li>
          </ul>
        </div>

        <div class="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-100 dark:border-orange-800">
          <h3 class="font-bold text-orange-800 dark:text-orange-300 mb-2">Tips Efisiensi</h3>
           <p class="text-sm text-orange-700 dark:text-orange-200 mb-3">
             Gunakan bahan yang sama untuk berbagai menu (cross-utilization) untuk mengurangi waste.
           </p>
           <button class="text-sm font-bold text-orange-600 hover:text-orange-800 underline">Lihat Laporan Waste -></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IngredientCalculator from '@/components/calculator/IngredientCalculator.vue'
</script>
