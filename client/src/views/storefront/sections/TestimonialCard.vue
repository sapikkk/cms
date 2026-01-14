<template>
  <div class="group bg-cream-50 dark:bg-green-900 rounded-2xl p-8 border border-green-200 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative">
    <!-- Quote Icon -->
    <div class="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
      <svg class="w-16 h-16 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
      </svg>
    </div>

    <!-- Rating Stars -->
    <div class="flex gap-1 mb-6">
      <svg 
        v-for="i in 5" 
        :key="i" 
        class="w-5 h-5 transition-colors"
        :class="i <= stars ? 'text-orange-500' : 'text-green-200 dark:text-green-800'"
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    </div>

    <!-- Quote Text -->
    <blockquote class="text-lg text-green-700 dark:text-cream-200 italic mb-6 leading-relaxed relative z-10">
      <span v-html="quote || 'Tempat favorit gue buat kerja dan baca. Kopinya enak, bukunya banyak, WiFinya kenceng. What else do you need?'"></span>
    </blockquote>

    <!-- Author Info -->
    <div class="flex items-center gap-4 pt-6 border-t border-green-200 dark:border-green-800">
      <!-- Avatar -->
      <div class="relative">
        <img 
          v-if="avatar" 
          :src="avatar" 
          :alt="name"
          class="w-14 h-14 rounded-full object-cover border-2 border-green-200 dark:border-green-700"
        />
        <div 
          v-else 
          class="w-14 h-14 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center border-2 border-green-200 dark:border-green-700"
        >
          <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        
        <!-- Verified Badge (optional) -->
        <div 
          v-if="verified" 
          class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-orange-500 border-2 border-cream-50 dark:border-green-900 flex items-center justify-center"
        >
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>

      <!-- Name & Role -->
      <div class="flex-1">
        <h4 class="font-bold text-green-900 dark:text-white mb-0.5">
          {{ name || 'Customer Name' }}
        </h4>
        <p class="text-sm text-green-600 dark:text-green-400">
          {{ role || 'Regular Member' }}
        </p>
        
        <!-- Optional date -->
        <p v-if="date" class="text-xs text-green-500 dark:text-green-500 mt-1">
          {{ date }}
        </p>
      </div>

      <!-- Platform badge (optional) -->
      <div v-if="platform" class="text-xs font-semibold text-green-600 dark:text-green-400 px-2 py-1 rounded bg-green-100 dark:bg-green-800">
        {{ platform }}
      </div>
    </div>

    <!-- Optional location tag -->
    <div v-if="location" class="mt-4 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      <span>{{ location }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: String,
  role: String,
  quote: String,
  rating: [Number, String],
  avatar: String,
  verified: {
    type: Boolean,
    default: false
  },
  date: String,
  platform: String,
  location: String
})

const stars = computed(() => parseInt(props.rating) || 5)
</script>