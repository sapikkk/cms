<template>
  <div class="page-renderer">
    <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
    </div>
    
    <div v-else-if="error" class="text-center py-20 text-red-500">
      {{ error }}
    </div>

    <div v-else>
      <div v-for="section in sections" :key="section.id" class="mb-12 last:mb-0">
        <component
          :is="getWidgetComponent(section.type)"
          v-bind="section.props"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, markRaw, watch } from 'vue'
import pageService from '@/api/services/page.service'
import productService from '@/api/services/product.service'

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const sections = ref([])
const loading = ref(true)
const error = ref(null)

// --- Widget Components ---

const HeroBanner = {
  props: ['title', 'subtitle', 'buttonText'],
  template: `
    <section class="relative bg-green-900 overflow-hidden py-20 lg:py-32">
       <div class="absolute inset-0 bg-gradient-to-br from-brand-orange/90 to-green-900/90 mix-blend-multiply"></div>
       <div class="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
      
      <div class="relative container mx-auto px-4 text-center z-10">
        <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          {{ title }}
        </h1>
        <p class="text-xl text-cream-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          {{ subtitle }}
        </p>
        <button class="px-8 py-4 bg-white text-green-900 rounded-full font-bold text-lg hover:bg-cream-200 hover:scale-105 transition-all shadow-xl">
          {{ buttonText }}
        </button>
      </div>
    </section>
  `
}

const ProductGrid = {
  props: ['title', 'limit'],
  setup(props) {
    const products = ref([])
    const loading = ref(true)

    onMounted(async () => {
      try {
        const { data } = await productService.getAll({ limit: props.limit || 3 })
        products.value = data.data
      } catch (err) {
        console.error(err)
      } finally {
        loading.value = false
      }
    })

    const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price)

    return { products, loading, formatPrice }
  },
  template: `
    <section class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-green-800 dark:text-white mb-2">{{ title }}</h2>
        <div class="w-20 h-1 bg-brand-orange mx-auto rounded-full"></div>
      </div>
      
      <div v-if="loading" class="text-center py-10">Loading products...</div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="product in products" :key="product.id" class="group bg-white dark:bg-green-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-green-100 dark:border-green-700">
          <div class="h-64 overflow-hidden relative">
            <img :src="product.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop'" :alt="product.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button class="px-6 py-2 bg-white text-brand-orange rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">Lihat Detail</button>
            </div>
          </div>
          <div class="p-6">
            <div class="text-xs font-bold text-brand-orange mb-2 uppercase tracking-wide">{{ product.category?.name || 'Coffee' }}</div>
            <h3 class="text-xl font-bold text-green-900 dark:text-white mb-2">{{ product.name }}</h3>
            <p class="text-green-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{{ product.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold text-green-900 dark:text-white">Rp {{ formatPrice(product.basePrice) }}</span>
              <button class="w-8 h-8 rounded-full bg-cream-200 dark:bg-green-700 flex items-center justify-center text-green-600 dark:text-gray-400 hover:bg-brand-orange hover:text-white transition-colors">+</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
}

const TextBlock = {
  props: ['title', 'content'],
  template: `
    <section class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto bg-brand-bg/50 dark:bg-green-800/50 rounded-3xl p-8 md:p-12 border border-brand-orange/10">
        <h2 v-if="title" class="text-3xl font-bold text-center text-text-green dark:text-gray-400 mb-8">{{ title }}</h2>
        <div class="prose prose-lg dark:prose-invert mx-auto text-green-700 dark:text-gray-400">
           <!-- Ideally we would use v-html here if content allows HTML, but simple text for now -->
           <p class="whitespace-pre-line text-center">{{ content }}</p>
        </div>
      </div>
    </section>
  `
}

// --- Logic ---

const widgetComponents = {
  HeroBanner: markRaw(HeroBanner),
  ProductGrid: markRaw(ProductGrid),
  TextBlock: markRaw(TextBlock)
}

const getWidgetComponent = (type) => widgetComponents[type] || TextBlock

const fetchPage = async () => {
  loading.value = true
  error.value = null
  try {
    const { data } = await pageService.getBySlug(props.slug)
    const page = data.data
    
    if (typeof page.sections === 'string') {
        sections.value = JSON.parse(page.sections) || []
    } else {
        sections.value = page.sections || []
    }
  } catch (err) {
    console.error('Error fetching page:', err)
    error.value = 'Halaman tidak ditemukan.'
    
    // Fallback Mock for Demo if API fails (so landing page is never empty during demo)
    if (props.slug === 'home') {
       sections.value = [
       { 
         id: '1', 
         type: 'HeroBanner', 
         props: { 
           title: 'Nikmati Kopi Terbaik', 
           subtitle: 'Rasakan sensasi kopi pilihan yang diseduh dengan hati untuk menemani setiap momen berharga Anda.',
           buttonText: 'Jelajahi Menu'
         } 
       },
       {
         id: '2',
         type: 'ProductGrid',
         props: {
           title: 'Menu Favorit',
           limit: 3
         }
       },
       {
         id: '3',
         type: 'TextBlock',
         props: {
           title: 'Filosofi Kami',
           content: 'Kami percaya bahwa setiap cangkir kopi menceritakan sebuah kisah. Dari petani hingga ke tangan Anda, kami menjaga kualitas setiap biji kopi.'
         }
       }
     ]
     error.value = null
    }
  } finally {
    loading.value = false
  }
}

watch(() => props.slug, fetchPage)

onMounted(fetchPage)
</script>
