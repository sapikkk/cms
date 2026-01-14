<template>
  <div class="min-h-screen bg-cream-100 dark:bg-green-950">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center gap-4 text-green-600 dark:text-green-400">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span class="font-medium">Memuat halaman...</span>
      </div>
    </div>

    <!-- Error State (Page Not Found) -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen px-4">
      <div class="max-w-md text-center">
        <div class="text-9xl mb-4">😕</div>
        <h1 class="text-4xl font-bold text-green-800 dark:text-white mb-4">404</h1>
        <p class="text-lg text-green-600 dark:text-green-400 mb-8">
          Halaman yang Anda cari tidak ditemukan.
        </p>
        <router-link
          to="/"
          class="inline-block px-6 py-3 bg-brand-orange text-white rounded-lg font-bold hover:bg-orange-700 transition-colors"
        >
          Kembali ke Beranda
        </router-link>
      </div>
    </div>

    <!-- Page Content -->
    <div v-else>
      <!-- Render all sections -->
      <component
        v-for="section in sections"
        :key="section.id"
        :is="getWidgetComponent(section.type)"
        v-bind="section.props"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, markRaw, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import pageService from '@/api/services/page.service'

// Dynamic Widget Imports (Same as Viewer/Builder)
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
const slug = computed(() => route.params.slug || 'index')
const sections = ref([])
const loading = ref(true)
const error = ref(false)

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
    error.value = false
    
    const { data } = await pageService.getBySlug(slug.value)
    const page = data.data
    
    // Only show published pages
    if (!page.isPublished) {
      error.value = true
      return
    }

    // Map backend sections to frontend widgets
    if (page.sections && Array.isArray(page.sections)) {
      sections.value = page.sections
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .filter(s => s.isVisible) // Only show visible sections
        .map(s => {
          const contentData = s.contentData || {}
          let widgetType = contentData.componentType
          
          if (!widgetType) {
            widgetType = s.name.replace(/\s+\d+$/, '').replace(/\s/g, '')
          }
          
          const { componentType, ...props } = contentData
          
          return {
            id: s.id,
            type: widgetType,
            props: props
          }
        })
      
      console.log(`[DynamicPage] Loaded ${sections.value.length} sections for /${slug.value}`)
    }
  } catch (err) {
    console.error('[DynamicPage] Error fetching page:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPage()
})
</script>

<style scoped>
/* Any custom styles if needed */
</style>
