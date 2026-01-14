<template>
  <footer class="bg-green-800 dark:bg-green-900 text-green-50 py-12 border-t-4 border-orange-500">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="md:col-span-2">
          <div class="flex items-center gap-3 mb-4">
            <img 
              :src="footerContent.brandLogo || '/Antitesa.svg'" 
              :alt="footerContent.brandName || 'Antitesa'" 
              class="h-10 w-auto" 
            />
            <span class="font-bold text-2xl text-green-50">
              {{ footerContent.brandName || 'Antitesa' }}
            </span>
          </div>
          <div class="text-green-200 mb-4 max-w-md prose prose-sm prose-invert" v-html="footerContent.description || 'Platform manajemen modern untuk coffee shop. Kelola produk, pustaka digital, dan website dalam satu tempat.'">
          </div>
          <div class="flex gap-4">
            <a 
              v-for="social in footerContent.socialMedia" 
              :key="social.platform"
              :href="social.link" 
              target="_blank"
              class="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 flex items-center justify-center text-white transition-colors"
            >
              <component :is="getSocialIcon(social.platform)" :size="20" weight="fill" />
            </a>
          </div>
        </div>

        <!-- Dynamic Columns -->
        <div v-for="column in footerContent.columns" :key="column.title">
          <h3 class="font-bold text-lg mb-4 text-orange-300">{{ column.title }}</h3>
          <ul class="space-y-2">
            <li v-for="link in column.links" :key="link.label">
              <router-link 
                :to="link.link" 
                class="text-green-200 hover:text-orange-300 transition-colors"
              >
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact (if less than 2 columns) -->
        <div v-if="footerContent.columns?.length < 2 && footerContent.contact">
          <h3 class="font-bold text-lg mb-4 text-orange-300">Kontak</h3>
          <ul class="space-y-2 text-green-200">
            <li class="flex items-center gap-2" v-if="footerContent.contact.address">
              <PhMapPin :size="16" />
              <span>{{ footerContent.contact.address }}</span>
            </li>
            <li class="flex items-center gap-2" v-if="footerContent.contact.email">
              <PhEnvelope :size="16" />
              <span>{{ footerContent.contact.email }}</span>
            </li>
            <li class="flex items-center gap-2" v-if="footerContent.contact.phone">
              <PhPhone :size="16" />
              <span>{{ footerContent.contact.phone }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Contact Row (if 2+ columns) -->
      <div 
        v-if="footerContent.columns?.length >= 2 && footerContent.contact"
        class="mt-8 pt-8 border-t border-green-700 dark:border-green-800"
      >
        <div class="flex flex-wrap justify-center gap-6 text-green-200">
          <span v-if="footerContent.contact.address" class="flex items-center gap-2">
            <PhMapPin :size="16" />
            {{ footerContent.contact.address }}
          </span>
          <span v-if="footerContent.contact.email" class="flex items-center gap-2">
            <PhEnvelope :size="16" />
            {{ footerContent.contact.email }}
          </span>
          <span v-if="footerContent.contact.phone" class="flex items-center gap-2">
            <PhPhone :size="16" />
            {{ footerContent.contact.phone }}
          </span>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-8 pt-8 border-t border-green-700 dark:border-green-800 text-center text-green-300">
        <p>{{ footerContent.copyright || `© ${new Date().getFullYear()} Antitesa. All rights reserved.` }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  PhFacebookLogo, 
  PhInstagramLogo, 
  PhTwitterLogo,
  PhYoutubeLogo,
  PhTiktokLogo,
  PhWhatsappLogo,
  PhMapPin,
  PhEnvelope,
  PhPhone
} from '@phosphor-icons/vue'
import siteContentService from '@/api/services/siteContent.service'

const footerContent = ref({
  brandName: 'Antitesa',
  brandLogo: '/Antitesa.svg',
  description: 'Platform manajemen modern untuk coffee shop. Kelola produk, pustaka digital, dan website dalam satu tempat.',
  columns: [
    {
      title: 'Menu',
      links: [
        { label: 'Beranda', link: '/' },
        { label: 'Produk', link: '/menu' },
        { label: 'Pustaka', link: '/library' },
        { label: 'Tentang', link: '/about' }
      ]
    }
  ],
  contact: {
    address: 'Jakarta, Indonesia',
    email: 'hello@antitesa.id',
    phone: '+62 812 3456 7890'
  },
  socialMedia: [
    { platform: 'facebook', link: '#' },
    { platform: 'instagram', link: '#' },
    { platform: 'twitter', link: '#' }
  ],
  copyright: ''
})

const getSocialIcon = (platform) => {
  const icons = {
    facebook: PhFacebookLogo,
    instagram: PhInstagramLogo,
    twitter: PhTwitterLogo,
    youtube: PhYoutubeLogo,
    tiktok: PhTiktokLogo,
    whatsapp: PhWhatsappLogo
  }
  return icons[platform] || PhFacebookLogo
}

const loadFooterContent = async () => {
  try {
    const { data } = await siteContentService.getFooter()
    if (data.success && data.data) {
      footerContent.value = data.data
    }
  } catch (error) {
    console.log('Using default footer content')
  }
}

onMounted(() => {
  loadFooterContent()
})
</script>
