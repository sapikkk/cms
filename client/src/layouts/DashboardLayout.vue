<template>
  <div class="min-h-screen flex bg-brand-bg dark:bg-green-950 transition-colors duration-300">
    <!-- Sidebar -->
    <aside 
      :class="[
        'bg-white dark:bg-green-900 border-r border-green-200 dark:border-green-800 transition-all duration-300 flex flex-col',
        sidebarOpen ? 'w-64' : 'w-20'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-green-200 dark:border-green-800">
        <router-link to="/dashboard" class="flex items-center gap-3">
          <img src="/Antitesa.svg" alt="Antitesa" class="h-8 w-auto" />
          <span v-if="sidebarOpen" class="font-bold text-text-green text-xl dark:text-white">ANTITESA</span>
        </router-link> 
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <div v-for="menu in filteredMenus" :key="menu.to">
          <router-link
            :to="menu.to"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium',
              isActive(menu.to)
                ? 'bg-brand-orange text-white shadow-md shadow-orange-200 dark:shadow-none'
                : 'text-green-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-green-800 hover:text-brand-orange dark:hover:text-white'
            ]"
          >
            <component :is="menu.icon" :size="24" :weight="isActive(menu.to) ? 'fill' : 'regular'" />
            <span v-if="sidebarOpen">{{ menu.label }}</span>
          </router-link>
        </div>
      </nav>

      <!-- Toggle Button -->
      <div class="p-4 border-t border-green-200 dark:border-green-800">
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="w-full flex items-center justify-center p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-green-800 text-green-500 dark:text-gray-400 transition-colors"
        >
          <PhCaretLeft v-if="sidebarOpen" :size="20" />
          <PhCaretRight v-else :size="20" />
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen overflow-hidden">
      <!-- Top Bar -->
      <header class="h-16 bg-white dark:bg-green-900 border-b border-green-200 dark:border-green-800 flex items-center justify-between px-6">
        <div class="flex items-center gap-4">
          <h2 class="text-xl font-bold text-text-green dark:text-white">Dashboard</h2>
        </div>

        <div class="flex items-center gap-4">
          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-green-800 text-green-500 dark:text-gray-400 transition-colors"
            title="Toggle Dark Mode"
          >
            <PhSun v-if="isDark" :size="20" weight="fill" class="text-amber-400" />
            <PhMoon v-else :size="20" weight="fill" class="text-text-green" />
          </button>

          <!-- User Dropdown -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="userMenuOpen = !userMenuOpen"
              class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-green-800 border border-transparent hover:border-orange-200 dark:hover:border-green-700 transition-all"
            >
              <div class="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                {{ authStore.user?.username?.charAt(0).toUpperCase() || '?' }}
              </div>
              <div class="text-left hidden md:block">
                <p class="text-sm font-bold text-green-800 dark:text-white">{{ authStore.user?.username }}</p>
                <p class="text-xs text-text-green dark:text-gray-400">{{ getRoleLabel(authStore.user?.role) }}</p>
              </div>
              <PhCaretDown :size="16" class="text-green-500 dark:text-gray-400" />
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="userMenuOpen"
              class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-800 py-2 z-50 shadow-lg dark:shadow-green-900/50"
            >
              <div class="px-4 py-2 border-b border-green-100 dark:border-green-800 mb-2">
                <p class="text-sm font-medium text-green-500 dark:text-gray-400">Signed in as</p>
                <p class="text-sm font-bold text-green-800 dark:text-white truncate">{{ authStore.user?.username }}</p>
              </div>
              
              <router-link
                to="/dashboard/settings/theme"
                class="flex items-center gap-2 px-4 py-2 text-green-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-green-800 hover:text-brand-orange transition-colors"
                @click="userMenuOpen = false"
              >
                <PhPalette :size="18" />
                Settings
              </router-link>
              
              <div class="border-t border-green-100 dark:border-green-800 my-2"></div>
              
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-2 text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <PhSignOut :size="18" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6 bg-brand-bg dark:bg-green-950 text-green-800 dark:text-white scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-800">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { 
  PhCoffee, 
  PhChartBar, 
  PhBooks, 
  PhFileText, 
  PhChartLine, 
  PhPalette, 
  PhScroll, 
  PhLockKey,
  PhCaretLeft,
  PhCaretRight,
  PhCaretDown,
  PhSignOut,
  PhSun,
  PhMoon,
  PhNewspaper,
  PhCalendarBlank,
  PhLightbulb,
  PhTShirt,
  PhBell
} from '@phosphor-icons/vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarOpen = ref(true)
const userMenuOpen = ref(false)
const userMenuRef = ref(null)

// Dark mode state
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Initialize theme
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

const menus = [
  { to: '/dashboard', label: 'Dashboard', icon: PhChartBar, roles: ['ALL'] },
  { to: '/dashboard/products', label: 'Products', icon: PhCoffee, roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'] },
  { to: '/dashboard/library', label: 'Library', icon: PhBooks, roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'] },
  { to: '/dashboard/pages', label: 'Pages', icon: PhFileText, roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'] },
  { to: '/dashboard/content', label: 'Content', icon: PhNewspaper, roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'] },
  { to: '/dashboard/events', label: 'Events', icon: PhCalendarBlank, roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'] },
  { to: '/dashboard/funfacts', label: 'Fun Facts', icon: PhLightbulb, roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'] },
  { to: '/dashboard/merchandise', label: 'Merchandise', icon: PhTShirt, roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'] },
  { to: '/dashboard/notifications', label: 'Notifications', icon: PhBell, roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'] },
  { to: '/dashboard/reports', label: 'Reports', icon: PhChartLine, roles: ['MASTER_ADMIN', 'ADMIN_OWNER'] },
  { to: '/dashboard/settings/theme', label: 'Theme', icon: PhPalette, roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF'] },
  { to: '/dashboard/audit-logs', label: 'Audit Logs', icon: PhScroll, roles: ['MASTER_ADMIN'] },
  { to: '/dashboard/system-access', label: 'Access Control', icon: PhLockKey, roles: ['MASTER_ADMIN'] }
]

const filteredMenus = computed(() => {
  const userRole = authStore.user?.role
  return menus.filter(menu => 
    menu.roles.includes('ALL') || menu.roles.includes(userRole)
  )
})

const isActive = (path) => {
  if (path === '/dashboard' && route.path === '/dashboard') return true
  if (path !== '/dashboard' && route.path.startsWith(path)) return true
  return false
}

const getRoleLabel = (role) => {
  const labels = {
    MASTER_ADMIN: 'Master Admin',
    ADMIN_OWNER: 'Admin/Owner',
    MEDIA_STAFF: 'Media Staff'
  }
  return labels[role] || role
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
