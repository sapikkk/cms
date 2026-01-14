<template>
  <section class="py-20 px-4 bg-cream-100 dark:bg-green-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto">
      <div v-if="title || subtitle" class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 mb-6">
          <span class="text-xs font-bold tracking-widest uppercase text-orange-700 dark:text-orange-400">Upcoming Events</span>
        </div>
        <h2 v-if="title" class="text-4xl md:text-5xl font-bold text-green-900 dark:text-white mb-4" v-html="title"></h2>
        <p v-if="subtitle" class="text-lg text-green-700 dark:text-cream-200" v-html="subtitle"></p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid md:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="events.length === 0" class="text-center py-12">
        <p class="text-green-600 dark:text-cream-200 text-lg">Belum ada event yang akan datang.</p>
        <p class="text-green-500 dark:text-cream-300">Stay tuned for updates!</p>
      </div>

      <!-- Events Grid -->
      <div v-else class="grid md:grid-cols-3 gap-8">
        <div v-for="event in events" :key="event.id" class="flex flex-col bg-cream-50 dark:bg-green-950 rounded-2xl overflow-hidden border border-green-200 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all hover:-translate-y-2 hover:shadow-xl group h-full">
          <!-- Image if available -->
          <div v-if="event.imageUrl" class="h-48 overflow-hidden">
            <img :src="event.imageUrl" :alt="event.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          
          <div class="p-6 flex-1 flex flex-col">
            <div class="flex items-center gap-3 mb-4">
              <div class="px-3 py-1 rounded-lg bg-orange-500 text-white text-center">
                <div class="text-xs font-bold uppercase">{{ getMonth(event.date) }}</div>
                <div class="text-lg font-bold leading-none">{{ getDay(event.date) }}</div>
              </div>
              <span class="text-xs text-green-600 dark:text-green-400 font-semibold text-center leading-tight">
                {{ getTime(event.date) }}
                <br>
                <span class="font-normal opacity-75">WIB</span>
              </span>
            </div>

            <h3 class="text-xl font-bold text-green-900 dark:text-white mb-3 line-clamp-2">{{ event.title }}</h3>
            <p class="text-sm text-green-700 dark:text-cream-300 mb-4 line-clamp-3">{{ event.description }}</p>

            <div class="mt-auto flex items-center justify-between pt-4 border-t border-green-200 dark:border-green-800">
              <span v-if="event.spots" class="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                {{ event.spots }} spots left
              </span>
              <span v-else class="text-xs text-green-600 dark:text-green-400">Open for all</span>
              
              <button class="px-4 py-2 bg-green-800 dark:bg-cream-100 text-white dark:text-green-900 font-bold rounded-lg text-sm hover:scale-105 transition shadow-sm">
                Detail
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showLink" class="text-center mt-12">
        <router-link to="/events" class="px-8 py-4 bg-transparent border-2 border-green-300 dark:border-green-700 text-green-900 dark:text-cream-100 font-bold rounded-xl hover:bg-green-100 dark:hover:bg-green-800 transition-all inline-block">
          Lihat Semua Events →
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import eventService from '@/api/services/event.service'

const props = defineProps({
  title: { type: String, default: 'Lebih dari Sekedar <span class="text-orange-500">Ngopi</span>' },
  subtitle: { type: String, default: 'Workshop, book club, dan networking events setiap bulan' },
  limit: { type: [Number, String], default: 3 },
  showLink: { type: Boolean, default: true }
})

const events = ref([])
const loading = ref(true)

const getMonth = (date) => dayjs(date).format('MMM')
const getDay = (date) => dayjs(date).format('DD')
const getTime = (date) => dayjs(date).format('HH:mm')

onMounted(async () => {
  try {
    const response = await eventService.getAll({ 
      limit: parseInt(props.limit),
      sort: 'date:asc',
      // Filter future events only usually, but for now show all
    })
    
    if (response.data && response.data.data) {
      events.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch events:', error)
  } finally {
    loading.value = false
  }
})
</script>