<template>
  <div class="min-h-screen bg-cream-100 dark:bg-green-950">
    <!-- Header / Toolbar -->
    <div class="sticky top-0 z-50 bg-white dark:bg-green-900 border-b border-green-200 dark:border-green-800 shadow-sm">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <router-link to="/dashboard/pages" class="p-2 hover:bg-cream-100 dark:hover:bg-green-800 rounded-lg text-green-600 dark:text-green-400 transition-colors">
            <PhArrowLeft :size="20" />
          </router-link>
          <div>
            <h1 class="text-xl font-bold text-green-800 dark:text-white">
              {{ pageTitle }}
            </h1>
            <p class="text-xs text-green-500 dark:text-green-400">Preview Mode</p>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <router-link
            :to="`/dashboard/pages/${pageId}/builder`"
            class="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            <PhPencilSimple :size="18" />
            Edit Page
          </router-link>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="flex items-center gap-3 text-green-600 dark:text-green-400">
        <PhSpinner :size="32" class="animate-spin" />
        <span class="font-medium">Memuat halaman...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-20 text-center">
      <div class="max-w-md mx-auto">
        <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-full inline-flex mb-4">
          <PhWarning :size="48" class="text-red-500" />
        </div>
        <h2 class="text-2xl font-bold text-green-800 dark:text-white mb-2">Halaman Tidak Ditemukan</h2>
        <p class="text-green-600 dark:text-green-400 mb-6">{{ error }}</p>
        <router-link to="/dashboard/pages" class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
          Kembali ke Daftar Halaman
        </router-link>
      </div>
    </div>

    <!-- Page Content with Navbar -->
    <div v-else>
      <!-- Navbar Preview (from actual storefront) -->
      <Navbar :navbar-data="navbarConfig" />
      
      <div class="pb-20">
        <!-- Empty State -->
        <div v-if="sections.length === 0" class="container mx-auto px-4 py-20 text-center">
          <div class="max-w-md mx-auto">
            <div class="p-4 bg-cream-100 dark:bg-green-800 rounded-full inline-flex mb-4">
              <PhPackage :size="48" class="text-brand-orange" weight="duotone" />
            </div>
            <h2 class="text-2xl font-bold text-green-800 dark:text-white mb-2">Halaman Masih Kosong</h2>
            <p class="text-green-600 dark:text-green-400 mb-6">
              Belum ada konten di halaman ini. Mulai tambahkan widget dari builder.
            </p>
            <router-link
              :to="`/dashboard/pages/${pageId}/builder`"
              class="inline-block px-6 py-3 bg-brand-orange text-white rounded-lg font-bold hover:bg-orange-700 transition-colors"
            >
              Mulai Edit
            </router-link>
          </div>
        </div>

        <!-- Render Sections -->
        <div v-else>
          <component
            v-for="section in sections"
            :key="section.id"
            :is="getWidgetComponent(section.type)"
            v-bind="section.props"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, markRaw, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { 
  PhArrowLeft, 
  PhPencilSimple, 
  PhSpinner, 
  PhWarning, 
  PhPackage 
} from '@phosphor-icons/vue'
import Navbar from '@/components/storefront/Navbar.vue'
import pageService from '@/api/services/page.service'

// Dynamic Widget Imports (Same as Builder)
const HeroBannerCenter = defineAsyncComponent(() => import('@/views/storefront/sections/HeroSection.vue'))
const HeroSplitRight = defineAsyncComponent(() => import('@/views/storefront/sections/HeroSplitRight.vue'))
const HeroSplitLeft = defineAsyncComponent(() => import('@/views/storefront/sections/HeroSplitLeft.vue'))
const ProductGrid = defineAsyncComponent(() => import('@/views/storefront/sections/ProductsSection.vue'))
const FeatureGrid3 = defineAsyncComponent(() => import('@/views/storefront/sections/FeatureGrid3.vue'))
const FeatureGrid4 = defineAsyncComponent(() => import('@/views/storefront/sections/FeatureGrid4.vue'))
const ContentImageRight = defineAsyncComponent(() => import('@/views/storefront/sections/ContentImageRight.vue'))
const ContentImageLeft = defineAsyncComponent(() => import('@/views/storefront/sections/ContentImageLeft.vue'))
const TextBlock = defineAsyncComponent(() => import('@/views/storefront/sections/TextBlock.vue'))
const Stats3Col = defineAsyncComponent(() => import('@/views/storefront/sections/Stats3Col.vue'))
const CTACentered = defineAsyncComponent(() => import('@/views/storefront/sections/CTACentered.vue'))
const CTASplit = defineAsyncComponent(() => import('@/views/storefront/sections/CTASplit.vue'))
const TestimonialCard = defineAsyncComponent(() => import('@/views/storefront/sections/TestimonialCard.vue'))
const GalleryGrid = defineAsyncComponent(() => import('@/views/storefront/sections/GalleryGrid.vue'))
const PricingCard = defineAsyncComponent(() => import('@/views/storefront/sections/PricingCard.vue'))
const FAQSection = defineAsyncComponent(() => import('@/views/storefront/sections/FAQSection.vue'))
const TeamGrid = defineAsyncComponent(() => import('@/views/storefront/sections/TeamGrid.vue'))
const NewsletterForm = defineAsyncComponent(() => import('@/views/storefront/sections/NewsletterForm.vue'))
const LogoCloud = defineAsyncComponent(() => import('@/views/storefront/sections/LogoCloud.vue'))
const VideoEmbed = defineAsyncComponent(() => import('@/views/storefront/sections/VideoEmbed.vue'))
const ContactCard = defineAsyncComponent(() => import('@/views/storefront/sections/ContactCard.vue'))
const LibrarySection = defineAsyncComponent(() => import('@/views/storefront/sections/LibrarySection.vue'))
const MerchandiseSection = defineAsyncComponent(() => import('@/views/storefront/sections/MerchandiseSection.vue'))
const EventsSection = defineAsyncComponent(() => import('@/views/storefront/sections/EventsSection.vue'))
const FunFactsSection = defineAsyncComponent(() => import('@/views/storefront/sections/FunFactsSection.vue'))

const route = useRoute()
const pageId = computed(() => route.params.id)
const pageTitle = ref('Loading...')
const sections = ref([])
const loading = ref(true)
const error = ref(null)
const navbarConfig = ref(null) // Store navbar data for preview

const widgetComponents = {
  HeroBannerCenter: markRaw(HeroBannerCenter),
  HeroSplitRight: markRaw(HeroSplitRight),
  HeroSplitLeft: markRaw(HeroSplitLeft),
  ProductGrid: markRaw(ProductGrid),
  FeatureGrid3: markRaw(FeatureGrid3),
  FeatureGrid4: markRaw(FeatureGrid4),
  ContentImageRight: markRaw(ContentImageRight),
  ContentImageLeft: markRaw(ContentImageLeft),
  TextBlock: markRaw(TextBlock),
  Stats3Col: markRaw(Stats3Col),
  CTACentered: markRaw(CTACentered),
  CTASplit: markRaw(CTASplit),
  TestimonialCard: markRaw(TestimonialCard),
  GalleryGrid: markRaw(GalleryGrid),
  PricingCard: markRaw(PricingCard),
  FAQSection: markRaw(FAQSection),
  TeamGrid: markRaw(TeamGrid),
  NewsletterForm: markRaw(NewsletterForm),
  LogoCloud: markRaw(LogoCloud),
  VideoEmbed: markRaw(VideoEmbed),
  ContactCard: markRaw(ContactCard),
  LibrarySection: markRaw(LibrarySection),
  MerchandiseSection: markRaw(MerchandiseSection),
  EventsSection: markRaw(EventsSection),
  FunFactsSection: markRaw(FunFactsSection)
}

const getWidgetComponent = (type) => widgetComponents[type] || TextBlock

const fetchPage = async () => {
  try {
    loading.value = true
    error.value = null
    
    const { data } = await pageService.getById(pageId.value)
    const page = data.data
    
    pageTitle.value = page.title
    
    // Extract navbar configuration from page metadata or use global config
    if (page.navbarData) {
      navbarConfig.value = page.navbarData
    } else {
      // Fallback: Load navbar from global site config or use default
      navbarConfig.value = {
        showInNavbar: page.showInNavbar !== undefined ? page.showInNavbar : true,
        title: page.title,
        slug: page.slug
      }
    }
    
    // Map backend sections to frontend widgets
    if (page.sections && Array.isArray(page.sections)) {
      sections.value = page.sections
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(s => {
          // IMPORTANT: contentData contains componentType + all props
          const contentData = s.contentData || {}
          
          // Extract componentType
          let widgetType = contentData.componentType
          
          // Fallback: Extract from name
          if (!widgetType) {
            widgetType = s.name.replace(/\s+\d+$/, '').replace(/\s/g, '')
            console.warn(`[PageViewer] componentType missing for section ${s.id}. Fallback to name: ${widgetType}`)
          }
          
          // Remove componentType from props
          const { componentType, ...props } = contentData
          
          console.log(`[PageViewer] ✅ Section ID: ${s.id}, Type: ${widgetType}, Props:`, props)
          
          return {
            id: s.id,
            type: widgetType,
            props: props  // Clean props without componentType
          }
        })
      
      console.log(`[PageViewer] 🎉 Loaded ${sections.value.length} sections for display`)
    } else {
      console.log('[PageViewer] No sections found in page data')
      sections.value = []
    }
  } catch (err) {
    console.error('Error fetching page:', err)
    error.value = err.response?.data?.message || 'Gagal memuat halaman'
    pageTitle.value = 'Error'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (pageId.value) {
    fetchPage()
  }
})
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
