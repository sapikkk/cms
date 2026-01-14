<template>
  <div class="bg-cream-50 dark:bg-green-900 rounded-3xl p-8 border-2 border-green-200 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative">
    <div v-if="featured" class="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
      MOST POPULAR
    </div>

    <div class="text-center mb-8">
      <h3 class="text-2xl font-bold text-green-900 dark:text-white mb-2">{{ title }}</h3>
      <p class="text-sm text-green-600 dark:text-green-400">{{ subtitle }}</p>
    </div>

    <div class="text-center mb-8">
      <div class="flex items-baseline justify-center gap-2 mb-2">
        <span class="text-5xl font-bold text-green-900 dark:text-white">{{ price }}</span>
        <span class="text-green-600 dark:text-green-400">{{ period }}</span>
      </div>
      <p v-if="savings" class="text-xs text-orange-500 font-semibold">{{ savings }}</p>
    </div>

    <ul class="space-y-4 mb-8">
      <li v-for="(feature, index) in features" :key="index" class="flex items-start gap-3">
        <svg class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="text-sm text-green-700 dark:text-cream-300">{{ feature }}</span>
      </li>
    </ul>

    <button :class="[
      'w-full py-4 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1',
      featured 
        ? 'bg-orange-500 hover:bg-orange-600 text-white' 
        : 'bg-green-800 hover:bg-green-900 dark:bg-cream-100 dark:hover:bg-cream-200 text-white dark:text-green-900'
    ]">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  price: String,
  period: String,
  savings: String,
  features: Array,
  buttonText: { type: String, default: 'Pilih Paket' },
  featured: Boolean
})
</script>