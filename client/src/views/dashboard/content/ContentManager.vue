<template>
  <div class="p-6 space-y-6">
    <!-- Header -->\n    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-green-800 dark:text-green-100">
          Content Management
        </h1>
        <p class="text-green-600 dark:text-green-400 mt-1">
          Kelola pengaturan site-wide (Navbar, Footer, Theme). <strong>Untuk edit konten halaman, gunakan Page Builder.</strong>
        </p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Landing Page Toggle -->
        <div class="flex items-center gap-2 bg-cream-100 dark:bg-green-800 px-4 py-2 rounded-lg">
          <span class="text-sm font-medium text-green-700 dark:text-green-300">
            Landing Page
          </span>
          <button
            @click="toggleLandingPage"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
              isLandingPageActive ? 'bg-green-600' : 'bg-gray-200 dark:bg-green-700'
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                isLandingPageActive ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>
        <button
          @click="saveAllChanges"
          :disabled="!hasChanges || saving"
          class="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 dark:disabled:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <PhFloppyDisk v-if="!saving" :size="20" />
          <PhSpinner v-else :size="20" class="animate-spin" />
          Simpan Perubahan
        </button>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div class="flex gap-3">
        <PhInfo :size="24" class="text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <div class="flex-1">
          <h3 class="font-semibold text-blue-800 dark:text-blue-300 mb-1">
            📌 Apa itu Content Management?
          </h3>
          <p class="text-sm text-blue-700 dark:text-blue-400 mb-2">
            Content Management digunakan untuk mengatur <strong>pengaturan site-wide</strong> seperti:
          </p>
          <ul class="text-sm text-blue-700 dark:text-blue-400 list-disc list-inside space-y-1 mb-3">
            <li><strong>Navbar:</strong> Menu items, logo, links</li>
            <li><strong>Footer:</strong> Copyright text, social links</li>
            <li><strong>Theme:</strong> Warna brand, favicon (upcoming)</li>
          </ul>
          <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-3">
            <p class="text-sm text-amber-800 dark:text-amber-300">
              <strong>⚠️ Penting:</strong> Untuk mengedit <strong>konten halaman</strong> (Hero, Products, Events, dsb), gunakan 
              <router-link to="/dashboard/pages" class="underline font-semibold hover:text-amber-900 dark:hover:text-amber-200">
                Page Builder →
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="flex items-center gap-3 text-green-600 dark:text-green-400">
        <PhSpinner :size="24" class="animate-spin" />
        <span>Memuat konten...</span>
      </div>
    </div>

    <!-- Content Tabs -->
    <div v-else class="space-y-6">
      <!-- Section Tabs -->
      <div class="border-b border-green-200 dark:border-green-700">
        <nav class="flex gap-1 overflow-x-auto pb-px">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              activeTab === tab.key
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200'
            ]"
          >
            <component :is="tab.icon" :size="16" class="inline-block mr-2" />
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="bg-white dark:bg-green-800/40 rounded-xl border border-green-200 dark:border-green-700 p-6">
        <!-- Site Settings -->
        <div v-if="activeTab === 'settings'">
          <SiteSettingsEditor 
            v-model="content.siteSettings"
            @update="markAsChanged"
          />
        </div>

        <!-- Navbar -->
        <div v-else-if="activeTab === 'navbar'">
          <NavbarEditor 
            v-model="content.navbar"
            @update="markAsChanged"
          />
        </div>

        <!-- Hero -->
        <div v-else-if="activeTab === 'hero'">
          <HeroEditor 
            v-model="content.hero"
            @update="markAsChanged"
          />
        </div>

        <!-- Events -->
        <div v-else-if="activeTab === 'events'">
          <SectionEditor 
            v-model="content.events"
            section-key="events"
            title="Event Section"
            @update="markAsChanged"
          />
        </div>

        <!-- Merchandise -->
        <div v-else-if="activeTab === 'merchandise'">
          <SectionEditor 
            v-model="content.merchandise"
            section-key="merchandise"
            title="Merchandise Section"
            @update="markAsChanged"
          />
        </div>

        <!-- Forum -->
        <div v-else-if="activeTab === 'forum'">
          <ForumEditor 
            v-model="content.forum"
            @update="markAsChanged"
          />
        </div>

        <!-- Fun Facts -->
        <div v-else-if="activeTab === 'funfacts'">
          <SectionEditor 
            v-model="content.funfacts"
            section-key="funfacts"
            title="Fun Facts Section"
            @update="markAsChanged"
          />
        </div>

        <!-- Products -->
        <div v-else-if="activeTab === 'products'">
          <SectionEditor 
            v-model="content.products"
            section-key="products"
            title="Products Section"
            @update="markAsChanged"
          />
        </div>

        <!-- Library -->
        <div v-else-if="activeTab === 'library'">
          <SectionEditor 
            v-model="content.library"
            section-key="library"
            title="Library Section"
            @update="markAsChanged"
          />
        </div>

        <!-- Promo -->
        <div v-else-if="activeTab === 'promo'">
          <PromoEditor 
            v-model="content.promo"
            @update="markAsChanged"
          />
        </div>

        <!-- Collaboration -->
        <div v-else-if="activeTab === 'collaboration'">
          <CollaborationEditor 
            v-model="content.collaboration"
            @update="markAsChanged"
          />
        </div>

        <!-- Footer -->
        <div v-else-if="activeTab === 'footer'">
          <FooterEditor 
            v-model="content.footer"
            @update="markAsChanged"
          />
        </div>

        <!-- Section Order -->
        <div v-else-if="activeTab === 'order'">
          <SectionOrderEditor 
            v-model="content.sectionOrder"
            @update="markAsChanged"
          />
        </div>
      </div>
    </div>

    <!-- Preview Button -->
    <div class="fixed bottom-6 right-6">
      <a
        href="/"
        target="_blank"
        class="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all hover:-translate-y-1"
      >
        <PhEye :size="20" />
        <span class="font-medium">Preview</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useNotification } from '../../../composables/useNotification'
import siteContentService from '@/api/services/siteContent.service'
import { 
  PhFloppyDisk, 
  PhSpinner, 
  PhEye,
  PhGear,
  PhInfo,
  PhNavigationArrow,
  PhImage,
  PhCalendar,
  PhShoppingBag,
  PhChats,
  PhLightbulb,
  PhCoffee,
  PhBooks,
  PhTag,
  PhHandshake,
  PhList,
  PhFootprints
} from '@phosphor-icons/vue'

// Sub-components
import SiteSettingsEditor from './content-editors/SiteSettingsEditor.vue'
import NavbarEditor from './content-editors/NavbarEditor.vue'
import HeroEditor from './content-editors/HeroEditor.vue'
import SectionEditor from './content-editors/SectionEditor.vue'
import ForumEditor from './content-editors/ForumEditor.vue'
import PromoEditor from './content-editors/PromoEditor.vue'
import CollaborationEditor from './content-editors/CollaborationEditor.vue'
import FooterEditor from './content-editors/FooterEditor.vue'
import SectionOrderEditor from './content-editors/SectionOrderEditor.vue'

const notification = useNotification()
const showSuccess = notification?.success || ((msg) => console.log('Success:', msg))
const showError = notification?.error || ((msg) => console.error('Error:', msg))


// Tabs configuration
const tabs = [
  { key: 'settings', label: 'Pengaturan', icon: PhGear },
  { key: 'navbar', label: 'Navbar', icon: PhNavigationArrow },
  { key: 'hero', label: 'Hero', icon: PhImage },
  { key: 'events', label: 'Event', icon: PhCalendar },
  { key: 'merchandise', label: 'Merchandise', icon: PhShoppingBag },
  { key: 'forum', label: 'Forum', icon: PhChats },
  { key: 'funfacts', label: 'Fun Facts', icon: PhLightbulb },
  { key: 'products', label: 'Produk', icon: PhCoffee },
  { key: 'library', label: 'Pustaka', icon: PhBooks },
  { key: 'promo', label: 'Promo', icon: PhTag },
  { key: 'collaboration', label: 'Kolaborasi', icon: PhHandshake },
  { key: 'footer', label: 'Footer', icon: PhFootprints },
  { key: 'order', label: 'Urutan', icon: PhList }
]

const activeTab = ref('settings')
const loading = ref(true)
const saving = ref(false)
const hasChanges = ref(false)
const isLandingPageActive = ref(true)

const content = reactive({
  siteSettings: null,
  navbar: null,
  hero: null,
  events: null,
  merchandise: null,
  forum: null,
  funfacts: null,
  products: null,
  library: null,
  promo: null,
  collaboration: null,
  footer: null,
  sectionOrder: null
})

// Load all content
const loadContent = async () => {
  try {
    loading.value = true
    const { data } = await siteContentService.getAll()
    
    if (data.success) {
      content.siteSettings = data.data.siteSettings || data.data.site_settings
      content.navbar = data.data.landing_navbar
      content.hero = data.data.landing_hero
      content.events = data.data.landing_events
      content.merchandise = data.data.landing_merchandise
      content.forum = data.data.landing_forum
      content.funfacts = data.data.landing_funfacts
      content.products = data.data.landing_products
      content.library = data.data.landing_library
      content.promo = data.data.landing_promo
      content.collaboration = data.data.landing_collaboration
      content.footer = data.data.landing_footer
      content.sectionOrder = data.data.landing_section_order
      
      isLandingPageActive.value = content.siteSettings?.isLandingPageActive ?? true
    }
  } catch (error) {
    console.error('Failed to load content:', error)
    showError('Gagal memuat konten')
  } finally {
    loading.value = false
  }
}

// Mark content as changed
const markAsChanged = () => {
  hasChanges.value = true
}

// Toggle landing page
const toggleLandingPage = async () => {
  try {
    const newState = !isLandingPageActive.value
    await siteContentService.toggleLandingPage(newState)
    isLandingPageActive.value = newState
    showSuccess(newState ? 'Landing page diaktifkan' : 'Landing page dinonaktifkan')
  } catch (error) {
    console.error('Failed to toggle landing page:', error)
    showError('Gagal mengubah status landing page')
  }
}

// Save all changes
const saveAllChanges = async () => {
  try {
    saving.value = true

    // Save each section that has been modified
    const promises = []

    if (content.siteSettings) {
      promises.push(siteContentService.updateSiteSettings(content.siteSettings))
    }
    if (content.navbar) {
      promises.push(siteContentService.updateNavbar(content.navbar))
    }
    if (content.hero) {
      promises.push(siteContentService.updateHero(content.hero))
    }
    if (content.footer) {
      promises.push(siteContentService.updateFooter(content.footer))
    }
    if (content.events) {
      promises.push(siteContentService.updateSection('events', content.events))
    }
    if (content.merchandise) {
      promises.push(siteContentService.updateSection('merchandise', content.merchandise))
    }
    if (content.forum) {
      promises.push(siteContentService.updateSection('forum', content.forum))
    }
    if (content.funfacts) {
      promises.push(siteContentService.updateSection('funfacts', content.funfacts))
    }
    if (content.products) {
      promises.push(siteContentService.updateSection('products', content.products))
    }
    if (content.library) {
      promises.push(siteContentService.updateSection('library', content.library))
    }
    if (content.promo) {
      promises.push(siteContentService.updateSection('promo', content.promo))
    }
    if (content.collaboration) {
      promises.push(siteContentService.updateSection('collaboration', content.collaboration))
    }
    if (content.sectionOrder) {
      promises.push(siteContentService.updateSectionOrder(content.sectionOrder.sections))
    }

    await Promise.all(promises)
    hasChanges.value = false
    showSuccess('Semua perubahan berhasil disimpan')
  } catch (error) {
    console.error('Failed to save changes:', error)
    showError('Gagal menyimpan perubahan')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadContent()
})
</script>
