<template>
  <section class="py-20 px-4 bg-orange-500 relative overflow-hidden transition-colors duration-300">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div v-if="title || subtitle" class="text-center mb-16">
        <h2 v-if="title" class="text-4xl md:text-5xl font-bold text-white mb-4" v-html="title"></h2>
        <p v-if="subtitle" class="text-lg text-orange-100" v-html="subtitle"></p>
      </div>

       <!-- Loading State -->
       <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="i in 4" :key="i" class="h-32 bg-orange-400/50 rounded-xl animate-pulse"></div>
      </div>

      <!-- Empty State / Fallback -->
      <div v-else-if="facts.length === 0" class="text-center py-8">
         <p class="text-orange-200">No fun facts yet :)</p>
      </div>

      <!-- Facts Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="fact in facts" :key="fact.id" class="text-center group">
          <div class="text-5xl md:text-6xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
            {{ fact.value }}
          </div>
          <div class="text-orange-100 font-semibold mb-1 text-lg">{{ fact.label }}</div>
          <p v-if="fact.description" class="text-sm text-orange-200">{{ fact.description }}</p>
        </div>
      </div>

      <!-- Optional Bottom Quote -->
      <div v-if="bottomQuote" class="mt-16 text-center">
        <p class="text-white text-lg italic max-w-2xl mx-auto">
          "{{ bottomQuote }}"
        </p>
        <p v-if="quoteAuthor" class="text-orange-200 mt-4 font-semibold">— {{ quoteAuthor }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import funFactService from '@/api/services/funfact.service'

const props = defineProps({
  title: { type: String, default: 'Antitesa in Numbers' },
  subtitle: { type: String, default: 'Data speaks louder than promises' },
  limit: { type: [Number, String], default: 4 },
  bottomQuote: { type: String, default: 'Tempat favorit gue buat kerja dan baca. Kopinya enak, bukunya banyak, WiFinya kenceng.' },
  quoteAuthor: { type: String, default: 'Happy Member' }
})

const facts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await funFactService.getAll({ 
      limit: parseInt(props.limit)
    })
    
    if (response.data && response.data.data) {
      facts.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch fun facts:', error)
  } finally {
    loading.value = false
  }
})
</script>