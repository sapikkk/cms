<template>
  <section class="py-20 px-4 bg-cream-100 dark:bg-green-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="order-2 lg:order-1">
          <div v-if="badge" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-950 border border-green-200 dark:border-green-800 mb-6">
            <span class="text-xs font-bold tracking-widest uppercase text-green-700 dark:text-green-300">{{ badge }}</span>
          </div>
          
          <h2 class="text-3xl md:text-4xl font-bold text-green-900 dark:text-white mb-6 leading-tight" v-html="title"></h2>
          
          <p v-if="description" class="text-lg text-green-700 dark:text-cream-200 mb-6 leading-relaxed" v-html="description">
          </p>
          
          <p v-if="content" class="text-green-700 dark:text-cream-300 mb-8 leading-relaxed" v-html="content">
          </p>

          <ul v-if="items && items.length > 0" class="space-y-3 mb-8">
            <li v-for="(item, index) in items" :key="index" class="flex items-center gap-3">
              <div class="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span class="text-green-700 dark:text-cream-300">{{ item.text || item }}</span>
            </li>
          </ul>

          <button v-if="buttonText" class="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            {{ buttonText }}
          </button>
        </div>

        <div class="relative rounded-3xl overflow-hidden bg-orange-100 dark:bg-green-900 aspect-[4/3] order-1 lg:order-2">
          <div v-if="imageUrl" class="absolute inset-0">
            <img :src="imageUrl" alt="Content Image" class="w-full h-full object-cover"/>
          </div>
          <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-cream-100 dark:from-green-900 dark:to-green-950">
            <svg class="w-32 h-32 text-orange-300 dark:text-orange-900/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  badge: { type: String, default: 'Philosophy' },
  title: { type: String, default: '<span class="text-orange-500">Slow Down,</span> <br/>Think Deep' },
  description: { type: String, default: 'Di dunia yang serba cepat, kita tawarkan sesuatu yang berbeda: ruang untuk melambat, berpikir, dan berkembang.' },
  content: { type: String, default: 'Setiap detail di Antitesa dirancang untuk mendukung deep work dan meaningful conversation. Dari pemilihan kursi, pencahayaan, hingga playlist yang diputar—semua calculated.' },
  items: {
    type: Array,
    default: () => [
      { text: 'Noise level terkontrol' },
      { text: 'Ergonomic furniture' },
      { text: 'Natural lighting balance' }
    ]
  },
  buttonText: { type: String, default: 'Experience It Yourself' },
  imageUrl: { type: String, default: '' }
})
</script>