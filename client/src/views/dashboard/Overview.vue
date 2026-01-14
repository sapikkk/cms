<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text-green dark:text-white">Dashboard Overview</h1>
      <p class="text-green-500 dark:text-gray-400 mt-1">Selamat datang kembali, {{ authStore.user?.fullName || authStore.user?.username }}</p>>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Products (Brand Orange) -->
      <div class="bg-white dark:bg-green-900/40 border-l-4 border-orange-500 rounded-r-xl p-6 shadow-sm shadow-orange-100 dark:shadow-none border-y border-r border-green-100 dark:border-green-800 transition-all hover:bg-orange-50 dark:hover:bg-green-800/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">Produk</p>
            <p class="text-3xl font-extrabold mt-1 text-green-900 dark:text-white">{{ stats.products }}</p>
          </div>
          <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <PhCoffee :size="32" weight="duotone" class="text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      <!-- Books (Category Blue - as defined in Brand) -->
      <div class="bg-white dark:bg-green-900/40 border-l-4 border-category-book rounded-r-xl p-6 shadow-sm shadow-blue-100 dark:shadow-none border-y border-r border-green-100 dark:border-green-800 transition-all hover:bg-blue-50 dark:hover:bg-green-800/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">Buku</p>
            <p class="text-3xl font-extrabold mt-1 text-green-900 dark:text-white">{{ stats.books }}</p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <PhBooks :size="32" weight="duotone" class="text-category-book dark:text-blue-400" />
          </div>
        </div>
      </div>

      <!-- Pages (Brand Green) -->
      <div class="bg-white dark:bg-green-900/40 border-l-4 border-green-600 rounded-r-xl p-6 shadow-sm shadow-green-100 dark:shadow-none border-y border-r border-green-100 dark:border-green-800 transition-all hover:bg-green-50 dark:hover:bg-green-800/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">Halaman</p>
            <p class="text-3xl font-extrabold mt-1 text-green-900 dark:text-white">{{ stats.pages }}</p>
          </div>
          <div class="p-3 bg-green-100 dark:bg-green-800/50 rounded-lg">
            <PhFileText :size="32" weight="duotone" class="text-green-700 dark:text-gray-400" />
          </div>
        </div>
      </div>

      <!-- Categories (Neutral/Dark Green) -->
      <div class="bg-white dark:bg-green-900/40 border-l-4 border-green-500 dark:border-green-400 rounded-r-xl p-6 shadow-sm shadow-gray-100 dark:shadow-none border-y border-r border-green-100 dark:border-green-800 transition-all hover:bg-cream-100 dark:hover:bg-green-800/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">Kategori</p>
            <p class="text-3xl font-extrabold mt-1 text-green-900 dark:text-white">{{ stats.categories }}</p>
          </div>
          <div class="p-3 bg-cream-200 dark:bg-green-700/50 rounded-lg">
            <PhTag :size="32" weight="duotone" class="text-green-600 dark:text-gray-400" />
          </div>
        </div>
      </div>

      <!-- Events (Purple) -->
      <div class="bg-white dark:bg-green-900/40 border-l-4 border-purple-500 rounded-r-xl p-6 shadow-sm shadow-purple-100 dark:shadow-none border-y border-r border-green-100 dark:border-green-800 transition-all hover:bg-purple-50 dark:hover:bg-green-800/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">Events</p>
            <p class="text-3xl font-extrabold mt-1 text-green-900 dark:text-white">{{ stats.events }}</p>
          </div>
          <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <PhCalendarBlank :size="32" weight="duotone" class="text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <!-- Merchandise (Pink) -->
      <div class="bg-white dark:bg-green-900/40 border-l-4 border-pink-500 rounded-r-xl p-6 shadow-sm shadow-pink-100 dark:shadow-none border-y border-r border-green-100 dark:border-green-800 transition-all hover:bg-pink-50 dark:hover:bg-green-800/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">Merchandise</p>
            <p class="text-3xl font-extrabold mt-1 text-green-900 dark:text-white">{{ stats.merchandise }}</p>
          </div>
          <div class="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
            <PhTShirt :size="32" weight="duotone" class="text-pink-600 dark:text-pink-400" />
          </div>
        </div>
      </div>

      <!-- Fun Facts (Yellow) -->
      <div class="bg-white dark:bg-green-900/40 border-l-4 border-yellow-500 rounded-r-xl p-6 shadow-sm shadow-yellow-100 dark:shadow-none border-y border-r border-green-100 dark:border-green-800 transition-all hover:bg-yellow-50 dark:hover:bg-green-800/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">Fun Facts</p>
            <p class="text-3xl font-extrabold mt-1 text-green-900 dark:text-white">{{ stats.funFacts }}</p>
          </div>
          <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <PhLightbulb :size="32" weight="duotone" class="text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-green-900/40 rounded-xl p-6 border border-green-200 dark:border-green-800 mb-8 shadow-sm dark:shadow-none">
      <h2 class="text-lg font-bold text-text-green dark:text-white mb-4">Aksi Cepat</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link
          to="/dashboard/products/create"
          class="flex flex-col items-center p-4 bg-cream-100 hover:bg-orange-50 dark:bg-green-900/30 dark:hover:bg-green-800 rounded-xl border border-green-200 dark:border-green-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-200 group"
        >
          <div class="p-3 bg-white dark:bg-green-800 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
            <PhPlusCircle :size="24" class="text-orange-600 dark:text-orange-400" />
          </div>
          <span class="text-sm font-bold text-green-700 dark:text-white group-hover:text-orange-700 dark:group-hover:text-orange-300">Tambah Produk</span>
        </router-link>

        <router-link
          to="/dashboard/library/create"
          class="flex flex-col items-center p-4 bg-cream-100 hover:bg-blue-50 dark:bg-green-900/30 dark:hover:bg-green-800 rounded-xl border border-green-200 dark:border-green-700 hover:border-category-book dark:hover:border-blue-400 transition-all duration-200 group"
        >
          <div class="p-3 bg-white dark:bg-green-800 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
            <PhBookOpen :size="24" class="text-category-book dark:text-blue-400" />
          </div>
          <span class="text-sm font-bold text-green-700 dark:text-white group-hover:text-category-book dark:group-hover:text-blue-300">Tambah Buku</span>
        </router-link>

        <router-link
          to="/dashboard/pages"
          class="flex flex-col items-center p-4 bg-cream-100 hover:bg-green-50 dark:bg-green-900/30 dark:hover:bg-green-800 rounded-xl border border-green-200 dark:border-green-700 hover:border-green-600 dark:hover:border-green-500 transition-all duration-200 group"
        >
          <div class="p-3 bg-white dark:bg-green-800 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
            <PhLayout :size="24" class="text-green-600 dark:text-gray-400" />
          </div>
          <span class="text-sm font-bold text-green-700 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300">Page Builder</span>
        </router-link>

        <router-link
          to="/dashboard/settings/theme"
          class="flex flex-col items-center p-4 bg-cream-100 hover:bg-cream-200 dark:bg-green-900/30 dark:hover:bg-green-800 rounded-xl border border-green-200 dark:border-green-700 hover:border-green-500 dark:hover:border-green-400 transition-all duration-200 group"
        >
          <div class="p-3 bg-white dark:bg-green-800 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
            <PhPalette :size="24" class="text-green-600 dark:text-gray-400" />
          </div>
          <span class="text-sm font-bold text-green-700 dark:text-white group-hover:text-green-800 dark:group-hover:text-green-50">Kustomisasi Tema</span>
        </router-link>

        <router-link
          to="/dashboard/events/create"
          class="flex flex-col items-center p-4 bg-cream-100 hover:bg-purple-50 dark:bg-green-900/30 dark:hover:bg-green-800 rounded-xl border border-green-200 dark:border-green-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-200 group"
        >
          <div class="p-3 bg-white dark:bg-green-800 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
            <PhCalendarBlank :size="24" class="text-purple-600 dark:text-purple-400" />
          </div>
          <span class="text-sm font-bold text-green-700 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300">Tambah Event</span>
        </router-link>

        <router-link
          to="/dashboard/merchandise/create"
          class="flex flex-col items-center p-4 bg-cream-100 hover:bg-pink-50 dark:bg-green-900/30 dark:hover:bg-green-800 rounded-xl border border-green-200 dark:border-green-700 hover:border-pink-500 dark:hover:border-pink-400 transition-all duration-200 group"
        >
          <div class="p-3 bg-white dark:bg-green-800 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
            <PhTShirt :size="24" class="text-pink-600 dark:text-pink-400" />
          </div>
          <span class="text-sm font-bold text-green-700 dark:text-white group-hover:text-pink-700 dark:group-hover:text-pink-300">Tambah Merch</span>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-green-900/40 rounded-xl p-6 border border-green-200 dark:border-green-800 shadow-sm dark:shadow-none">
      <h2 class="text-lg font-bold text-text-green dark:text-white mb-4">Aktivitas Terbaru</h2>
      <div class="space-y-4">
        <div v-if="recentLogs.length === 0" class="text-center py-8 text-green-400 dark:text-green-800/50">
          <PhClock :size="32" class="mx-auto mb-2 opacity-50" />
          Belum ada aktivitas terbaru
        </div>
        <div
          v-for="log in recentLogs"
          :key="log.id"
          class="flex items-center gap-4 p-3 bg-cream-100 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800/50 hover:bg-white dark:hover:bg-green-800/40 transition-colors"
        >
          <div class="flex-shrink-0 w-10 h-10 bg-white dark:bg-green-800 rounded-full border border-green-200 dark:border-green-700 flex items-center justify-center">
            <component :is="getActionIcon(log.action)" :size="20" class="text-green-600 dark:text-gray-300" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-bold text-green-800 dark:text-white">{{ log.action }} - {{ log.entity }}</p>
            <p class="text-xs text-green-500 dark:text-gray-400">{{ formatDate(log.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import dayjs from 'dayjs'
import { 
  PhCoffee, 
  PhBooks, 
  PhFileText, 
  PhTag, 
  PhPlusCircle, 
  PhBookOpen, 
  PhLayout, 
  PhPalette, 
  PhClock,
  PhPencilSimple, 
  PhTrash, 
  PhKey, 
  PhDownloadSimple,
  PhCalendarBlank,
  PhTShirt,
  PhLightbulb
} from '@phosphor-icons/vue'

// Import API Services
import eventService from '@/api/services/event.service'
import merchandiseService from '@/api/services/merchandise.service'
import funFactService from '@/api/services/funfact.service'
import productService from '@/api/services/product.service'
import bookService from '@/api/services/book.service'
import pageService from '@/api/services/page.service'
import masterService from '@/api/services/master.service'

const authStore = useAuthStore()

const stats = ref({
  products: 0,
  books: 0,
  pages: 0,
  categories: 0,
  events: 0,
  merchandise: 0,
  funFacts: 0
})

const recentLogs = ref([])

const getActionIcon = (action) => {
  const icons = {
    'CREATE': PhPlusCircle,
    'UPDATE': PhPencilSimple,
    'DELETE': PhTrash,
    'LOGIN': PhKey,
    'EXPORT': PhDownloadSimple
  }
  return icons[action] || PhFileText
}

const formatDate = (date) => {
  return dayjs(date).format('DD MMM YYYY, HH:mm')
}

onMounted(async () => {
  try {
    // Fetch real stats from API
    const [productsRes, booksRes, pagesRes, eventsRes, merchandiseRes, funFactsRes] = await Promise.all([
      productService.getAll(),
      bookService.getAll(),
      pageService.getAll(),
      eventService.getAll(),
      merchandiseService.getAll(),
      funFactService.getAll()
    ])

    // Try calculating unique categories from products & books roughly
    const uniqueCategories = new Set([
      ...(productsRes.data?.data?.map(p => p.category?.name) || []),
      ...(booksRes.data?.data?.map(b => b.category?.name) || [])
    ])

    stats.value = {
      products: productsRes.data?.data?.length || 0,
      books: booksRes.data?.data?.length || 0,
      pages: pagesRes.data?.data?.length || 0,
      events: eventsRes.data?.data?.length || 0,
      merchandise: merchandiseRes.data?.data?.length || 0,
      funFacts: funFactsRes.data?.data?.length || 0,
      categories: uniqueCategories.size || 0
    }

    // Fetch recent activity logs (Latest 5)
    try {
      const logsRes = await masterService.getActivityLogs({ limit: 5 })
      if (logsRes.data?.data) {
        recentLogs.value = logsRes.data.data
      }
    } catch (logError) {
      console.warn('Could not fetch activity logs:', logError)
      // Fallback to empty array if activity logs fail
      recentLogs.value = []
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    // Keep default/zero values on error
  }
})
</script>
