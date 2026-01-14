<template>
  <section class="py-20 px-4 bg-white dark:bg-green-950 transition-colors duration-300">
    <div class="max-w-7xl mx-auto">
      <div v-if="title || subtitle" class="text-center mb-12">
        <h2 v-if="title" class="text-3xl md:text-4xl font-bold text-green-900 dark:text-white mb-4" v-html="title"></h2>
        <div v-if="subtitle" class="text-lg text-green-600 dark:text-cream-200" v-html="subtitle"></div>
      </div>

      <!-- Category Tabs -->
      <div v-if="categories.length > 0" class="flex flex-wrap justify-center gap-4 mb-12">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="activeCategory = cat"
          class="px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border"
          :class="activeCategory === cat 
            ? 'bg-orange-500 text-white border-orange-500 shadow-lg scale-105' 
            : 'bg-transparent text-green-600 dark:text-cream-200 border-green-200 dark:border-green-800 hover:border-orange-500 hover:text-orange-500'"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="space-y-4">
          <div class="aspect-[4/5] bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProducts.length === 0" class="text-center py-12 bg-cream-50 dark:bg-green-900 rounded-2xl border border-dashed border-green-300 dark:border-green-700">
        <p class="text-green-600 dark:text-cream-200 text-lg">Produk belum tersedia.</p>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div v-for="product in filteredProducts" :key="product.id" class="group relative">
          <!-- Image -->
          <div class="aspect-[4/5] bg-cream-100 dark:bg-green-900 rounded-2xl overflow-hidden mb-4 relative">
            <img 
              v-if="product.image || product.imageUrl" 
              :src="product.image || product.imageUrl" 
              :alt="product.name" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-cream-200 dark:bg-green-800">
               <svg class="w-12 h-12 text-green-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
            </div>
            
            <!-- Quick Add Overlay (Optional) -->
            <div class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                 <button class="w-full py-3 bg-white dark:bg-green-800 text-green-900 dark:text-white font-bold rounded-xl shadow-lg hover:bg-orange-500 hover:text-white transition-colors">
                  Lihat Detail
                 </button>
            </div>

            <!-- Badge -->
            <div v-if="product.isRecommend" class="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
              Recommended
            </div>
            <div v-else-if="product.isNew" class="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
              New Arrival
            </div>
          </div>

          <!-- Info -->
          <div>
            <p v-if="product.category" class="text-xs text-orange-500 font-bold uppercase tracking-wider mb-1">
              {{ product.category.name || product.category }}
            </p>
            <h3 class="text-lg font-bold text-green-900 dark:text-white mb-2 leading-tight group-hover:text-orange-500 transition-colors">
              {{ product.name }}
            </h3>
            <p class="text-green-700 dark:text-cream-300 font-medium">
              {{ formatCurrency(product.basePrice || product.price) }}
            </p>
          </div>
        </div>
      </div>
      
      <div v-if="showLink" class="text-center mt-12">
        <router-link to="/products" class="inline-flex items-center gap-2 text-green-800 dark:text-cream-100 font-bold hover:text-orange-500 dark:hover:text-orange-400 transition-colors border-b-2 border-transparent hover:border-orange-500">
          <span>Lihat Semua Produk</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import productService from '@/api/services/product.service'

const props = defineProps({
  title: { type: String, default: 'Koleksi <span class="text-orange-500">Terbaik</span> Kami' },
  subtitle: { type: String, default: 'Dipilih khusus untuk menemani waktu produktif anda' },
  limit: { type: [Number, String], default: 8 },
  showLink: { type: Boolean, default: true }
})

const products = ref([])
const loading = ref(true)
const activeCategory = ref('All')

// Extract unique categories from products
const categories = computed(() => {
  const cats = new Set(products.value.map(p => p.category?.name || 'Uncategorized').filter(Boolean))
  return ['All', ...Array.from(cats)]
})

const filteredProducts = computed(() => {
  let result = products.value
  if (activeCategory.value !== 'All') {
    result = result.filter(p => (p.category?.name || 'Uncategorized') === activeCategory.value)
  }
  return result.slice(0, parseInt(props.limit))
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

onMounted(async () => {
  try {
    const response = await productService.getAll()
    if (response.data && response.data.data) {
      products.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    loading.value = false
  }
})
</script>