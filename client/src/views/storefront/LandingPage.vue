<template>
  <div class="min-h-screen">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-[50vh]">
      <div class="flex flex-col items-center gap-4">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
        <p class="text-green-600 dark:text-gray-400 font-medium">Memuat konten...</p>
      </div>
    </div>

    <!-- Content Sections -->
    <div v-else class="space-y-0">
      <div v-if="sections.length === 0" class="py-20 text-center text-gray-500">
        <p>Halaman ini belum memiliki konten.</p>
      </div>

      <component 
        v-for="section in sections" 
        :key="section.id"
        :is="getComponent(section)"
        v-bind="section.contentData"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent, markRaw } from 'vue'
import pageService from '@/api/services/page.service'

// ==================== WIDGET COMPONENTS ====================
// Complete Component Registry - Matches PageBuilder.vue
const HeroBannerCenter = defineAsyncComponent(() => import('./sections/HeroSection.vue'))
const HeroSplitRight = defineAsyncComponent(() => import('./sections/HeroSplitRight.vue'))
const HeroSplitLeft = defineAsyncComponent(() => import('./sections/HeroSplitLeft.vue'))
const ProductGrid = defineAsyncComponent(() => import('./sections/ProductsSection.vue'))
const FeatureGrid3 = defineAsyncComponent(() => import('./sections/FeatureGrid3.vue'))
const FeatureGrid4 = defineAsyncComponent(() => import('./sections/FeatureGrid4.vue'))
const ContentImageRight = defineAsyncComponent(() => import('./sections/ContentImageRight.vue'))
const ContentImageLeft = defineAsyncComponent(() => import('./sections/ContentImageLeft.vue'))
const TextBlock = defineAsyncComponent(() => import('./sections/TextBlock.vue'))
const Stats3Col = defineAsyncComponent(() => import('./sections/Stats3Col.vue'))
const CTACentered = defineAsyncComponent(() => import('./sections/CTACentered.vue'))
const CTASplit = defineAsyncComponent(() => import('./sections/CTASplit.vue'))
const TestimonialCard = defineAsyncComponent(() => import('./sections/TestimonialCard.vue'))
const GalleryGrid = defineAsyncComponent(() => import('./sections/GalleryGrid.vue'))
const PricingCard = defineAsyncComponent(() => import('./sections/PricingCard.vue'))
const FAQSection = defineAsyncComponent(() => import('./sections/FAQSection.vue'))
const TeamGrid = defineAsyncComponent(() => import('./sections/TeamGrid.vue'))
const NewsletterForm = defineAsyncComponent(() => import('./sections/NewsletterForm.vue'))
const LogoCloud = defineAsyncComponent(() => import('./sections/LogoCloud.vue'))
const VideoEmbed = defineAsyncComponent(() => import('./sections/VideoEmbed.vue'))
const ContactCard = defineAsyncComponent(() => import('./sections/ContactCard.vue'))
const LibrarySection = defineAsyncComponent(() => import('./sections/LibrarySection.vue'))
const MerchandiseSection = defineAsyncComponent(() => import('./sections/MerchandiseSection.vue'))
const EventsSection = defineAsyncComponent(() => import('./sections/EventsSection.vue'))
const FunFactsSection = defineAsyncComponent(() => import('./sections/FunFactsSection.vue'))

// Map componentType string (from JSON contentData) to Vue Component
const componentMap = {
  'HeroBannerCenter': HeroBannerCenter,
  'HeroSplitRight': HeroSplitRight,
  'HeroSplitLeft': HeroSplitLeft,
  'ProductGrid': ProductGrid,
  'FeatureGrid3': FeatureGrid3,
  'FeatureGrid4': FeatureGrid4,
  'ContentImageRight': ContentImageRight,
  'ContentImageLeft': ContentImageLeft,
  'TextBlock': TextBlock,
  'Stats3Col': Stats3Col,
  'CTACentered': CTACentered,
  'CTASplit': CTASplit,
  'TestimonialCard': TestimonialCard,
  'GalleryGrid': GalleryGrid,
  'PricingCard': PricingCard,
  'FAQSection': FAQSection,
  'TeamGrid': TeamGrid,
  'NewsletterForm': NewsletterForm,
  'LogoCloud': LogoCloud,
  'VideoEmbed': VideoEmbed,
  'ContactCard': ContactCard,
  'LibrarySection': LibrarySection,
  'MerchandiseSection': MerchandiseSection,
  'EventsSection': EventsSection,
  'FunFactsSection': FunFactsSection,
  // Legacy/Backward compatibility mappings
  'hero': HeroBannerCenter,
  'products': ProductGrid,
  'events': EventsSection,
  'merchandise': MerchandiseSection,
  'library': LibrarySection,
  'funfacts': FunFactsSection
}

const sections = ref([])
const loading = ref(true)

const getComponent = (section) => {
  // Priority 1: Check contentData.componentType (New Standard)
  if (section.contentData?.componentType && componentMap[section.contentData.componentType]) {
    return componentMap[section.contentData.componentType]
  }
  
  // Priority 2: Check standard sectionType Enum (converted to TitleCase or mapped)
  // This is a fallback if componentType is missing
  
  return null // Return null if unknown, v-if will hide it
}

const fetchHomeContent = async () => {
  loading.value = true
  try {
    let pageData = null
    
    // 1. Coba cari halaman dengan slug 'index' (Prioritas Utama User)
    // 2. Jika tidak ada, coba cari slug 'home' (Standar)
    const prioritySlugs = ['index', 'home']
    
    for (const slug of prioritySlugs) {
      try {
        const { data } = await pageService.getBySlug(slug)
        if (data.success && data.data) {
          pageData = data.data
          break
        }
      } catch (e) {
        // Lanjut ke slug berikutnya jika 404
      }
    }

    // 3. Jika masih tidak ketemu, ambil halaman Published PERTAMA yang ada di database
    if (!pageData) {
      try {
        const { data } = await pageService.getAll()
        if (data.success && Array.isArray(data.data)) {
          // Cari yang statusnya PUBLISHED
          const publishedPages = data.data.filter(p => p.status === 'PUBLISHED')
          
          if (publishedPages.length > 0) {
            // Ambil yang pertama (asumsi based on created date/id usually)
            const firstPage = publishedPages[0]
            
            // Fetch ulang detailnya by ID untuk memastikan dapat sections
            const detailRes = await pageService.getById(firstPage.id)
            if (detailRes.data.success) {
              pageData = detailRes.data.data
            }
          }
        }
      } catch (e) {
        console.warn('Fallback fetch failed', e)
      }
    }

    // Jika data halaman ditemukan, render seksinya
    if (pageData) {
      const pageSections = pageData.sections || []
      sections.value = pageSections.sort((a, b) => a.sortOrder - b.sortOrder)
    }
  } catch (error) {
    console.error('Failed to load home content:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchHomeContent()
})
</script>
