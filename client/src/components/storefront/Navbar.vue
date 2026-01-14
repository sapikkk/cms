<template>
  <nav class="sticky top-0 z-50 bg-white/90 dark:bg-green-900/90 backdrop-blur-md border-b border-orange-200 dark:border-green-800 transition-colors">
    <div class="container mx-auto px-4 h-20 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group">
        <img 
          :src="navbarContent.logo || '/Antitesa.svg'" 
          :alt="navbarContent.logoText || 'ANTITESA'" 
          class="h-10 w-auto group-hover:scale-105 transition-transform" 
        />
        <span class="font-bold text-2xl text-green-600 dark:text-white">
          {{ navbarContent.logoText || 'ANTITESA' }}
        </span>
      </router-link>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center gap-8">
        <router-link 
          v-for="item in activeMenuItems" 
          :key="item.link"
          :to="item.link" 
          class="text-green-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-300 font-medium transition-colors"
        >
          {{ item.label }}
        </router-link>
      </div>

      <!-- Auth Button -->
      <div class="flex items-center gap-4">
        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-green-800 text-green-500 dark:text-gray-300 transition-colors"
          title="Toggle Dark Mode"
        >
          <PhSun v-if="isDark" :size="24" weight="fill" class="text-orange-400" />
          <PhMoon v-else :size="24" weight="fill" class="text-green-600 dark:text-gray-300" />
        </button>

        <router-link 
          v-if="navbarContent.showLoginButton"
          to="/login"
          class="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-full font-bold transition-all shadow-lg shadow-orange-200 dark:shadow-orange-900/30 transform hover:-translate-y-0.5"
        >
          {{ navbarContent.loginButtonText || 'Login' }}
        </router-link>
        
        <!-- Mobile menu toggle -->
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 text-green-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-green-800 rounded-lg"
        >
          <PhList v-if="!mobileMenuOpen" :size="24" />
          <PhX v-else :size="24" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div 
      v-if="mobileMenuOpen"
      class="md:hidden bg-white dark:bg-green-900 border-t border-orange-200 dark:border-green-800 py-4"
    >
      <div class="container mx-auto px-4 flex flex-col gap-4">
        <router-link 
          v-for="item in activeMenuItems" 
          :key="item.link"
          :to="item.link" 
          @click="mobileMenuOpen = false"
          class="text-green-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-300 font-medium py-2"
        >
          {{ item.label }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PhList, PhX, PhSun, PhMoon } from '@phosphor-icons/vue'
import siteContentService from '@/api/services/siteContent.service'
import pageService from '@/api/services/page.service'

const mobileMenuOpen = ref(false)
const isDark = ref(false)
const navbarContent = ref({
  logo: '/Antitesa.svg',
  logoText: 'Antitesa',
  menuItems: [], // Will be populated dynamically
  showLoginButton: true,
  loginButtonText: 'Login'
})

// Dynamic Menu Items from Pages
const activeMenuItems = computed(() => {
  // Use dynamically fetched menu items
  return navbarContent.value.menuItems || []
})

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

const loadNavbarContent = async () => {
  try {
    // 1. Load basic config (Logo, basic settings)
    try {
      const configRes = await siteContentService.getNavbar()
      if (configRes.data.success && configRes.data.data) {
        navbarContent.value.logo = configRes.data.data.logo
        navbarContent.value.logoText = configRes.data.data.logoText
        navbarContent.value.showLoginButton = configRes.data.data.showLoginButton
        navbarContent.value.loginButtonText = configRes.data.data.loginButtonText
      }
    } catch (err) {
      console.log('[Navbar] Using default logo/settings')
    }

    // 2. Load Dynamic Pages for Menu (pages with inNavbar=true)
    const pagesRes = await pageService.getAll({ inNavbar: true, published: true })
    if (pagesRes.data.success && pagesRes.data.data) {
      // Transform Pages to Menu Items
      const dynamicLinks = pagesRes.data.data
        .filter(page => page.inNavbar && page.isPublished) // Double-check filtering
        .map(page => ({
          label: page.title,
          link: page.slug === 'index' ? '/' : `/${page.slug}`, // 'index' maps to /
          isActive: true,
          navOrder: page.navOrder || 0
        }))
        .sort((a, b) => a.navOrder - b.navOrder)
      
      navbarContent.value.menuItems = dynamicLinks
      console.log(`[Navbar] Loaded ${dynamicLinks.length} menu items from database`)
    }
  } catch (error) {
    console.error('[Navbar] Error loading content:', error)
    // Fallback default menu
    if (navbarContent.value.menuItems.length === 0) {
      navbarContent.value.menuItems = [
        { label: 'Beranda', link: '/' },
        { label: 'Menu', link: '/menu' },
        { label: 'Tentang', link: '/about' }
      ]
    }
  }
}

onMounted(() => {
  // Load theme
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
  
  // Load navbar content
  loadNavbarContent()
})
</script>
