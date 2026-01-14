<template>
  <section class="py-20 px-4 bg-cream-500 dark:bg-green-950 transition-colors duration-300">
    <div class="max-w-7xl mx-auto">
      <div v-if="title || subtitle" class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 mb-6">
          <span class="text-xs font-bold tracking-widest uppercase text-orange-700 dark:text-orange-400">Merchandise</span>
        </div>
        <h2 v-if="title" class="text-4xl md:text-5xl font-bold text-green-900 dark:text-white mb-4" v-html="title"></h2>
        <p v-if="subtitle" class="text-lg text-green-700 dark:text-cream-200" v-html="subtitle"></p>
      </div>

       <!-- Loading State -->
       <div v-if="loading" class="grid md:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="items.length === 0" class="text-center py-12">
        <p class="text-green-600 dark:text-cream-200 text-lg">Merchandise belum tersedia saat ini.</p>
        <p class="text-green-500 dark:text-cream-300">Check back later!</p>
      </div>

      <div v-else class="grid md:grid-cols-3 gap-8">
        <div v-for="item in items" :key="item.id" class="bg-cream-50 dark:bg-green-900 rounded-2xl overflow-hidden border border-green-200 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all hover:-translate-y-2 group">
          <!-- Image or Placeholder -->
          <div class="aspect-square bg-cream-200 dark:bg-green-800 flex items-center justify-center overflow-hidden">
            <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <svg v-else class="w-24 h-24 text-green-400 dark:text-green-700 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </div>
          
          <div class="p-6">
            <h3 class="text-lg font-bold text-green-900 dark:text-white mb-2 line-clamp-1">{{ item.name }}</h3>
            <p class="text-sm text-green-700 dark:text-cream-300 mb-4 line-clamp-2 h-10">{{ item.description }}</p>
            <div class="flex items-center justify-between mt-auto">
              <span class="text-2xl font-bold text-orange-500">{{ formatCurrency(item.price) }}</span>
              <button class="px-4 py-2 bg-green-800 dark:bg-cream-100 text-white dark:text-green-900 font-bold rounded-lg text-sm hover:scale-105 transition shadow-sm">
                Lihat
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="showLink" class="text-center mt-12">
        <router-link to="/merchandise" class="px-8 py-4 bg-transparent border-2 border-green-300 dark:border-green-700 text-green-900 dark:text-cream-100 font-bold rounded-xl hover:bg-green-100 dark:hover:bg-green-800 transition-all inline-block">
          Lihat Katalog Lengkap →
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import merchandiseService from '@/api/services/merchandise.service'

const props = defineProps({
  title: { type: String, default: 'Bawa Pulang <span class="text-orange-500">Vibe</span>-nya' },
  subtitle: { type: String, default: 'Official merch buat lu yang pengen piece of Antitesa at home' },
  limit: { type: [Number, String], default: 3 },
  showLink: { type: Boolean, default: true }
})

const items = ref([])
const loading = ref(true)

const formatCurrency = (value) => {
  if (!value) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

onMounted(async () => {
  try {
    const response = await merchandiseService.getAll({ 
      limit: parseInt(props.limit)
    })
    
    if (response.data && response.data.data) {
      items.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch merchandise:', error)
  } finally {
    loading.value = false
  }
})
</script>