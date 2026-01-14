<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-text-green dark:text-white">Manajemen Event</h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">Kelola event dan workshop bisnis</p>
      </div>
      <router-link
        to="/dashboard/events/create"
        class="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium"
      >
        <PhPlus :size="20" weight="bold" />
        <span>Tambah Event</span>
      </router-link>
    </div>

    <!-- Filter -->
    <div class="bg-white dark:bg-green-900/40 rounded-lg p-4 border border-green-200 dark:border-green-800 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <PhMagnifyingGlass :size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari event..."
            class="w-full pl-10 pr-4 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-900/60 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
          />
        </div>
        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-900/60 text-green-900 dark:text-white"
        >
          <option value="">Semua Status</option>
          <option value="upcoming">Akan Datang</option>
          <option value="past">Telah Lewat</option>
          <option value="published">Dipublikasi</option>
        </select>
      </div>
    </div>

    <!-- Events Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="event in filteredEvents"
        :key="event.id"
        class="bg-white dark:bg-green-900/40 rounded-lg overflow-hidden border border-green-200 dark:border-green-800 hover:border-brand-orange dark:hover:border-brand-orange transition-all"
      >
        <div class="h-48 bg-brand-bg dark:bg-green-800/50 flex items-center justify-center relative">
          <img
            v-if="event.coverImage"
            :src="event.coverImage"
            :alt="event.title"
            class="w-full h-full object-cover"
          />
          <PhCalendar v-else :size="64" weight="duotone" class="text-brand-orange opacity-50" />
          <div v-if="event.isFeatured" class="absolute top-2 right-2 px-2 py-1 bg-brand-orange text-white text-xs rounded-lg font-bold">
            FEATURED
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-green-500 dark:text-gray-400">
              {{ formatDate(event.eventDate) }}
            </span>
            <span
              :class="[
                'px-2 py-1 text-xs rounded-lg font-medium',
                event.isPublished
                  ? 'bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              ]"
            >
              {{ event.isPublished ? 'Published' : 'Draft' }}
            </span>
          </div>
          <h3 class="font-bold text-green-800 dark:text-white mb-1 text-lg">{{ event.title }}</h3>
          <p class="text-sm text-green-500 dark:text-gray-400 mb-2 line-clamp-2">{{ event.description }}</p>
          <div class="flex items-center gap-2 mb-3 text-sm text-green-600 dark:text-gray-400">
            <PhMapPin :size="16" />
            <span>{{ event.location || 'Online' }}</span>
          </div>
          <div class="flex items-center gap-2 mb-4 text-sm text-green-600 dark:text-gray-400">
            <PhUsers :size="16" />
            <span>{{ event.currentParticipants }} / {{ event.maxParticipants || '∞' }}</span>
          </div>
          <div class="flex gap-2">
            <router-link
              :to="`/dashboard/events/${event.id}/edit`"
              class="flex-1 py-2 flex items-center justify-center gap-2 bg-cream-100 hover:bg-cream-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-white rounded-lg text-sm transition-colors font-medium"
            >
              <PhPencilSimple :size="16" />
              Edit
            </router-link>
            <button
              @click="deleteEvent(event.id)"
              class="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-sm transition-colors"
            >
              <PhTrash :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredEvents.length === 0" class="text-center py-16">
      <PhCalendar :size="64" weight="duotone" class="mx-auto text-green-200 dark:text-green-800/50 mb-4" />
      <p class="text-green-500 dark:text-gray-400 font-medium">Belum ada event. Buat event pertama Anda!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PhPlus, PhMagnifyingGlass, PhCalendar, PhPencilSimple, PhTrash, PhCalendarBlank } from '@phosphor-icons/vue'
import eventService from '@/api/services/event.service'
import { useConfirm } from '@/composables/useConfirm'
import { showToast } from '@/utils/toast'
import dayjs from 'dayjs'

const events = ref([])
const searchQuery = ref('')
const filterStatus = ref('')
const loading = ref(false)
const { confirm } = useConfirm()

const fetchEvents = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterStatus.value === 'upcoming') params.upcoming = 'true'
    if (filterStatus.value === 'published') params.published = 'true'
    
    const response = await eventService.getAll(params)
    events.value = response.data.data || []
  } catch (err) {
    console.error('Error fetching events:', err)
  } finally {
    loading.value = false
  }
}

const filteredEvents = computed(() => {
  let filtered = events.value

  if (searchQuery.value) {
    filtered = filtered.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filterStatus.value === 'past') {
    filtered = filtered.filter((event) => new Date(event.eventDate) < new Date())
  }

  return filtered
})

const formatDate = (date) => {
  return dayjs(date).format('DD MMM YYYY, HH:mm')
}

const deleteEvent = async (id) => {
  const confirmed = await confirm({
    title: 'Hapus Event?',
    message: 'Event dan semua pendaftarannya akan dihapus permanen',
    variant: 'danger',
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal'
  })
  
  if (!confirmed) return
  
  const loadingToast = showToast.loading('Menghapus event...')
  
  try {
    await eventService.delete(id)
    events.value = events.value.filter(e => e.id !== id)
    showToast.success('Berhasil!', 'Event telah dihapus')
  } catch (err) {
    showToast.error('Gagal!', 'Tidak dapat menghapus event')
    console.error('Error deleting event:', err)
  }
}

onMounted(() => {
  fetchEvents()
})
</script>
