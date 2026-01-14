<template>
  <div class="min-h-screen bg-cream-100 dark:bg-green-950">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-[60vh] flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-orange mx-auto mb-4"></div>
        <p class="text-green-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>

    <!-- Render all sections dynamically -->
    <div v-else-if="sections.length > 0" class="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <component
        v-for="section in sections"
        :key="section.id"
        :is="getWidgetComponent(section.type)"
        v-bind="section.props"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="min-h-[60vh] flex items-center justify-center">
      <div class="text-center">
        <PhLayout :size="80" class="mx-auto text-green-200 dark:text-green-800 mb-4" weight="duotone" />
        <h2 class="text-2xl font-bold text-green-800 dark:text-white mb-2">Page belum tersedia</h2>
        <p class="text-green-600 dark:text-gray-400">Konten sedang dalam proses pembuatan</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, markRaw, h } from 'vue'
import { useRoute } from 'vue-router'
import {
  PhLayout, PhImage, PhCoffee, PhLightning, PhBook, PhMusicNotes, PhWifiHigh,
  PhBookOpen, PhPaintBrush, PhStar, PhUser, PhCamera, PhCheckCircle,
  PhQuestion, PhUserCircle, PhEnvelopeSimple, PhPaperPlaneTilt, PhBuildings,
  PhPlayCircle, PhMapPin, PhPhone
} from '@phosphor-icons/vue'
import pageService from '@/api/services/page.service'

// ==================== WIDGET COMPONENTS (Same as PageEditor) ====================

// 1. Hero Banner - Center
const HeroBannerCenter = {
  props: ['title', 'subtitle', 'buttonText', 'imageUrl'],
  render() {
    return h('div', { class: 'bg-gradient-to-r from-green-900 to-green-800 dark:from-black dark:to-green-950 rounded-lg p-12 text-center relative overflow-hidden' }, [
      h('div', { class: 'relative z-10' }, [
        h('h2', { class: 'text-3xl md:text-5xl font-extrabold text-white mb-4' }, this.title || 'Hero Title'),
        h('p', { class: 'text-lg text-green-200 dark:text-gray-300 mb-8 max-w-2xl mx-auto' }, this.subtitle || 'Subtitle goes here'),
        h('button', { class: 'px-6 py-3 bg-brand-orange text-white rounded-lg font-bold hover:bg-orange-600 transition-colors' }, this.buttonText || 'Get Started')
      ])
    ])
  }
}

// 2. Hero Split - Image Right
const HeroSplitRight = {
  props: ['title', 'subtitle', 'buttonText', 'imageUrl'],
  render() {
    return h('div', { class: 'grid md:grid-cols-2 gap-8 p-8 bg-white dark:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-800' }, [
      h('div', { class: 'flex flex-col justify-center' }, [
        h('h2', { class: 'text-4xl font-bold text-green-800 dark:text-white mb-4' }, this.title || 'Discover Amazing Content'),
        h('p', { class: 'text-green-600 dark:text-gray-300 mb-6' }, this.subtitle || 'Learn more about our services'),
        h('button', { class: 'px-6 py-3 bg-brand-orange text-white rounded-lg font-bold w-fit' }, this.buttonText || 'Explore')
      ]),
      this.imageUrl 
        ? h('img', { class: 'rounded-lg h-64 w-full object-cover', src: this.imageUrl, alt: 'Hero Image' })
        : h('div', { class: 'bg-gradient-to-br from-orange-200 to-green-200 dark:from-green-800 dark:to-green-900 rounded-lg h-64 flex items-center justify-center' }, [
            h(PhImage, { size: 64, class: 'text-green-600 dark:text-green-400' })
          ])
    ])
  }
}

// 3. Hero Split - Image Left
const HeroSplitLeft = {
  props: ['title', 'subtitle', 'buttonText', 'imageUrl'],
  render() {
    return h('div', { class: 'grid md:grid-cols-2 gap-8 p-8 bg-white dark:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-800' }, [
      this.imageUrl 
        ? h('img', { class: 'rounded-lg h-64 w-full object-cover', src: this.imageUrl, alt: 'Hero Image' })
        : h('div', { class: 'bg-gradient-to-br from-green-200 to-orange-200 dark:from-green-900 dark:to-green-800 rounded-lg h-64 flex items-center justify-center' }, [
            h(PhImage, { size: 64, class: 'text-green-600 dark:text-green-400' })
          ]),
      h('div', { class: 'flex flex-col justify-center' }, [
        h('h2', { class: 'text-4xl font-bold text-green-800 dark:text-white mb-4' }, this.title || 'Welcome Back'),
        h('p', { class: 'text-green-600 dark:text-gray-300 mb-6' }, this.subtitle || 'Continue your journey'),
        h('button', { class: 'px-6 py-3 bg-brand-orange text-white rounded-lg font-bold w-fit' }, this.buttonText || 'Continue')
      ])
    ])
  }
}

// 4. Product Grid
const ProductGrid = {
  props: ['title', 'limit'],
  render() {
    const limit = parseInt(this.limit) || 3
    const products = Array.from({ length: limit }, (_, i) => i + 1)
    return h('div', { class: 'p-6 bg-white dark:bg-green-900/40 rounded-lg border border-green-100 dark:border-green-800' }, [
      h('div', { class: 'flex items-center justify-between mb-6' }, [
        h('h3', { class: 'text-2xl font-bold text-green-800 dark:text-white' }, this.title || 'Our Products'),
        h('span', { class: 'text-sm text-brand-orange font-medium cursor-pointer' }, 'View All →')
      ]),
      h('div', { class: 'grid grid-cols-2 md:grid-cols-3 gap-4' }, 
        products.map(i => h('div', { class: 'bg-cream-100 dark:bg-green-800/40 rounded-lg p-4 text-center border border-green-100', key: i }, [
          h('div', { class: 'w-16 h-16 bg-cream-300 dark:bg-green-800 rounded-full mx-auto mb-3 flex items-center justify-center' }, [
            h(PhCoffee, { size: 32, class: 'text-brand-orange' })
          ]),
          h('p', { class: 'text-sm font-bold text-green-700 dark:text-white' }, `Product ${i}`),
          h('p', { class: 'text-xs text-green-500 dark:text-gray-400 mt-1' }, 'Rp 25.000')
        ]))
      )
    ])
  }
}

// 5. Feature Grid - 3 Columns
const FeatureGrid3 = {
  props: ['title', 'features'],
  render() {
    const featureList = this.features || [
      { icon: 'Lightning', title: 'Fast Delivery', desc: 'Quick service' },
      { icon: 'Diamond', title: 'Premium Quality', desc: 'Best ingredients' },
      { icon: 'Target', title: 'Perfect Taste', desc: 'Expert baristas' }
    ]
    return h('div', { class: 'p-8 bg-cream-50 dark:bg-green-950 rounded-lg' }, [
      h('h3', { class: 'text-2xl font-bold text-center text-green-800 dark:text-white mb-8' }, this.title || 'Why Choose Us'),
      h('div', { class: 'grid md:grid-cols-3 gap-6' }, featureList.map((f, i) => 
        h('div', { class: 'text-center p-6 bg-white dark:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-800', key: i }, [
          h('div', { class: 'flex justify-center mb-4' }, [
            h(PhLightning, { size: 48, class: 'text-brand-orange', weight: 'duotone' })
          ]),
          h('h4', { class: 'font-bold text-green-800 dark:text-white mb-2' }, f.title),
          h('p', { class: 'text-sm text-green-600 dark:text-gray-300' }, f.desc)
        ])
      ))
    ])
  }
}

// 6. Feature Grid - 4 Columns
const FeatureGrid4 = {
  props: ['title'],
  render() {
    const features = [
      { Component: PhBook, title: 'Rich Library' },
      { Component: PhCoffee, title: 'Great Coffee' },
      { Component: PhMusicNotes, title: 'Cozy Music' },
      { Component: PhWifiHigh, title: 'Free WiFi' }
    ]
    return h('div', { class: 'p-8' }, [
      h('h3', { class: 'text-2xl font-bold text-center text-green-800 dark:text-white mb-8' }, this.title || 'Our Features'),
      h('div', { class: 'grid grid-cols-2 md:grid-cols-4 gap-4' }, features.map((f, i) => 
        h('div', { class: 'text-center p-4 hover:bg-orange-50 dark:hover:bg-green-900/20 rounded-lg transition-colors', key: i }, [
          h('div', { class: 'flex justify-center mb-2' }, [
            h(f.Component, { size: 40, class: 'text-brand-orange', weight: 'duotone' })
          ]),
          h('p', { class: 'text-sm font-bold text-green-700 dark:text-white' }, f.title)
        ])
      ))
    ])
  }
}

// 7. Content - Text Left Image Right
const ContentImageRight = {
  props: ['title', 'content', 'imageUrl'],
  render() {
    return h('div', { class: 'grid md:grid-cols-2 gap-8 p-8 bg-white dark:bg-green-900/40 rounded-lg' }, [
      h('div', [
        h('h3', { class: 'text-2xl font-bold text-green-800 dark:text-white mb-4' }, this.title || 'Our Story'),
        h('p', { class: 'text-green-600 dark:text-gray-300 leading-relaxed' }, this.content || 'Share your story here...')
      ]),
      this.imageUrl 
        ? h('img', { class: 'rounded-lg h-64 w-full object-cover', src: this.imageUrl, alt: 'Content Image' })
        : h('div', { class: 'bg-gradient-to-br from-green-300 to-orange-300 dark:from-green-800 dark:to-orange-900 rounded-lg h-64 flex items-center justify-center' }, [
            h(PhBookOpen, { size: 64, class: 'text-green-700 dark:text-green-300' })
          ])
    ])
  }
}

// 8. Content - Text Right Image Left  
const ContentImageLeft = {
  props: ['title', 'content', 'imageUrl'],
  render() {
    return h('div', { class: 'grid md:grid-cols-2 gap-8 p-8 bg-white dark:bg-green-900/40 rounded-lg' }, [
      this.imageUrl 
        ? h('img', { class: 'rounded-lg h-64 w-full object-cover', src: this.imageUrl, alt: 'Content Image' })
        : h('div', { class: 'bg-gradient-to-br from-orange-300 to-green-300 dark:from-orange-900 dark:to-green-800 rounded-lg h-64 flex items-center justify-center' }, [
            h(PhPaintBrush, { size: 64, class: 'text-orange-700 dark:text-orange-300' })
          ]),
      h('div', [
        h('h3', { class: 'text-2xl font-bold text-green-800 dark:text-white mb-4' }, this.title || 'About Us'),
        h('p', { class: 'text-green-600 dark:text-gray-300 leading-relaxed' }, this.content || 'Tell your audience about yourself...')
      ])
    ])
  }
}

// 9. Text Block Simple
const TextBlock = {
  props: ['title', 'content'],
  render() {
    return h('div', { class: 'prose dark:prose-invert max-w-none p-6 bg-white dark:bg-green-900/40 rounded-lg border border-green-100 dark:border-green-800' }, [
      this.title ? h('h3', { class: 'text-xl font-bold mb-3 text-green-800 dark:text-white' }, this.title) : null,
      h('p', { class: 'text-green-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap' }, this.content || 'Enter your text content here...')
    ])
  }
}

// 10. Stats Section - 3 Columns
const Stats3Col = {
  props: ['title', 'stats'],
  render() {
    const statsList = this.stats || [
      { number: '500+', label: 'Happy Customers' },
      { number: '50+', label: 'Menu Items' },
      { number: '5★', label: 'Average Rating' }
    ]
    return h('div', { class: 'p-8 bg-gradient-to-r from-orange-500 to-green-700 dark:from-orange-900 dark:to-green-900 rounded-lg text-white' }, [
      h('h3', { class: 'text-2xl font-bold text-center mb-8' }, this.title || 'Our Achievements'),
      h('div', { class: 'grid md:grid-cols-3 gap-8' }, statsList.map((s, i) => 
        h('div', { class: 'text-center', key: i }, [
          h('div', { class: 'text-4xl font-extrabold mb-2' }, s.number),
          h('p', { class: 'text-green-100' }, s.label)
        ])
      ))
    ])
  }
}

// 11. CTA - Centered
const CTACentered = {
  props: ['title', 'subtitle', 'buttonText'],
  render() {
    return h('div', { class: 'text-center p-12 bg-gradient-to-br from-green-800 to-green-900 dark:from-green-950 dark:to-black rounded-lg' }, [
      h('h3', { class: 'text-3xl font-bold text-white mb-4' }, this.title || 'Ready to Start?'),
      h('p', { class: 'text-green-200 mb-6 max-w-xl mx-auto' }, this.subtitle || 'Join thousands of satisfied customers'),
      h('button', { class: 'px-8 py-4 bg-brand-orange text-white rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors' }, this.buttonText || 'Get Started Now')
    ])
  }
}

// 12. CTA - Split
const CTASplit = {
  props: ['title', 'buttonText'],
  render() {
    return h('div', { class: 'flex flex-col md:flex-row items-center justify-between p-8 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-2 border-brand-orange' }, [
      h('div', [
        h('h3', { class: 'text-2xl font-bold text-green-800 dark:text-white mb-2' }, this.title || 'Subscribe to Newsletter'),
        h('p', { class: 'text-green-600 dark:text-gray-300' }, 'Get latest updates and offers')
      ]),
      h('button', { class: 'mt-4 md:mt-0 px-6 py-3 bg-brand-orange text-white rounded-lg font-bold' }, this.buttonText || 'Subscribe')
    ])
  }
}

// 13. Testimonial Card
const TestimonialCard = {
  props: ['name', 'role', 'quote', 'rating'],
  render() {
    const stars = parseInt(this.rating) || 5
    return h('div', { class: 'p-6 bg-white dark:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-800 shadow-sm' }, [
      h('div', { class: 'flex gap-1 mb-4' }, 
        Array.from({ length: stars }, (_, i) => h(PhStar, { key: i, size: 20, class: 'text-brand-orange', weight: 'fill' }))
      ),
      h('p', { class: 'text-green-700 dark:text-gray-300 italic mb-4' }, `"${this.quote || 'Amazing service and great atmosphere!'}"​`),
      h('div', { class: 'flex items-center gap-3' }, [
        h('div', { class: 'w-12 h-12 bg-green-300 dark:bg-green-700 rounded-full flex items-center justify-center' }, [
          h(PhUser, { size: 24, class: 'text-green-700 dark:text-green-300' })
        ]),
        h('div', [
          h('p', { class: 'font-bold text-green-800 dark:text-white' }, this.name || 'Customer Name'),
          h('p', { class: 'text-sm text-green-500 dark:text-gray-400' }, this.role || 'Regular Customer')
        ])
      ])
    ])
  }
}

// 14-21: Add remaining widgets (Gallery, Pricing, FAQ, Team, Newsletter, Logo, Video, Contact)
// ... (Continue with remaining widget definitions)

const route = useRoute()
const pageSlug = computed(() => route.params.slug || 'home')
const sections = ref([])
const loading = ref(true)

const fetchPageContent = async () => {
  loading.value = true
  try {
    const { data } = await pageService.getBySlug(pageSlug.value)
    const page = data.data
    
    if (page && page.sections) {
      sections.value = page.sections
        .filter(s => s.isVisible) // Only show visible sections
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(s => {
          const widgetType = s.name.replace(/\s+\d+$/, '')
          return {
            id: s.id,
            type: widgetType,
            props: s.contentData || {}
          }
        })
    }
  } catch (err) {
    console.error('Error loading page:', err)
  } finally {
    loading.value = false
  }
}

// Widget component mapping
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
  TestimonialCard: markRaw(TestimonialCard)
  // Add remaining 14-21 here
}

const getWidgetComponent = (type) => widgetComponents[type] || null

onMounted(async () => {
  await fetchPageContent()
})
</script>
