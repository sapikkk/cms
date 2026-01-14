<template>
  <section class="py-16 px-4 bg-orange-500 dark:bg-orange-600 relative overflow-hidden transition-colors duration-300">
    <!-- Background Decoration -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-green-900 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <!-- Title -->
      <div class="text-center mb-12">
        <h3 class="text-3xl md:text-4xl font-bold text-white mb-2" v-html="title || 'Antitesa in Numbers'">
        </h3>
        <p class="text-orange-100">Real data, real impact</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="(stat, index) in statsList" 
          :key="index" 
          class="text-center group"
        >
          <!-- Number -->
          <div class="text-5xl md:text-6xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">
            {{ stat.number }}
          </div>
          
          <!-- Label -->
          <p class="text-lg font-semibold text-orange-100 mb-1">
            {{ stat.label }}
          </p>
          
          <!-- Sub Label (optional) -->
          <p v-if="stat.subLabel" class="text-sm text-orange-200">
            {{ stat.subLabel }}
          </p>
        </div>
      </div>

      <!-- Optional Bottom Text -->
      <div v-if="subtitle" class="text-center mt-12">
        <p class="text-white text-lg italic max-w-2xl mx-auto" v-html="subtitle">
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  subtitle: String,
  stats: Array
})

const statsList = computed(() => props.stats || [
  { 
    number: '500+', 
    label: 'Koleksi Buku',
    subLabel: 'Carefully curated'
  },
  { 
    number: '5K+', 
    label: 'Happy Customers',
    subLabel: 'And counting'
  },
  { 
    number: '4.9', 
    label: 'Average Rating',
    subLabel: 'From 300+ reviews'
  }
])
</script>

<style scoped>
/* Additional animations if needed */
</style>