<template>
  <section class="py-12 px-4 bg-white dark:bg-green-950/50">
    <div class="max-w-4xl mx-auto">
      <div v-if="title" class="text-center mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-green-900 dark:text-white">{{ title }}</h2>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 2" :key="i" class="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="notifications.length === 0" class="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
        <p class="text-gray-500 dark:text-gray-400">Tidak ada pengumuman baru.</p>
      </div>

      <!-- Notifications List -->
      <div v-else class="space-y-6">
        <div 
          v-for="note in notifications" 
          :key="note.id" 
          class="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border transition-all hover:shadow-lg"
          :class="[
            note.type === 'URGENT' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' :
            note.type === 'INFO' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' :
            'bg-cream-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          ]"
        >
          <!-- Optional Image -->
          <div v-if="note.imageUrl" class="w-full md:w-48 h-32 flex-shrink-0">
            <img :src="note.imageUrl" :alt="note.title" class="w-full h-full object-cover rounded-xl" />
          </div>

          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span 
                class="px-2 py-1 text-xs font-bold rounded-lg uppercase tracking-wider"
                :class="[
                  note.type === 'URGENT' ? 'bg-red-500 text-white' :
                  note.type === 'INFO' ? 'bg-blue-500 text-white' :
                  'bg-green-500 text-white'
                ]"
              >
                {{ note.type || 'NEWS' }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(note.createdAt) }}
              </span>
            </div>

            <h3 class="text-xl font-bold text-green-900 dark:text-white mb-2">{{ note.title }}</h3>
            <p class="text-green-800 dark:text-cream-200 text-sm leading-relaxed mb-4">
              {{ note.message || note.content }}
            </p>

            <a 
              v-if="note.link" 
              :href="note.link" 
              target="_blank"
              class="inline-flex items-center gap-1 text-sm font-bold hover:underline"
              :class="[
                note.type === 'URGENT' ? 'text-red-600 dark:text-red-400' :
                note.type === 'INFO' ? 'text-blue-600 dark:text-blue-400' :
                'text-green-600 dark:text-green-400'
              ]"
            >
              Lihat Detail →
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import notificationService from '@/api/services/notification.service'

const props = defineProps({
  title: { type: String, default: 'Pengumuman Terbaru' },
  limit: { type: [Number, String], default: 5 }
})

const notifications = ref([])
const loading = ref(true)

const formatDate = (date) => dayjs(date).format('DD MMM YYYY')

onMounted(async () => {
  try {
    const response = await notificationService.getActive()
    if (response.data && response.data.data) {
      notifications.value = response.data.data.slice(0, parseInt(props.limit))
    }
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
  } finally {
    loading.value = false
  }
})
</script>
