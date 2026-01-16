<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream-500 dark:bg-green-950 transition-colors duration-300">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23006633\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
    </div>

    <div class="container mx-auto px-4 py-20 relative z-10">
      <div class="max-w-5xl mx-auto text-center">
        
        <!-- Badge -->
        <div v-if="badgeText" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800 mb-8 animate-fade-in">
          <div class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
          <span class="text-xs font-bold tracking-widest uppercase text-green-700 dark:text-green-300">{{ badgeText }}</span>
        </div>

        <!-- Main Heading -->
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold text-green-900 dark:text-white mb-6 tracking-tight leading-none" v-html="formattedTitle"></h1>

        <!-- Subtitle -->
        <p v-if="subtitle" class="text-lg md:text-xl text-green-700 dark:text-cream-200 max-w-2xl mx-auto mb-12 leading-relaxed font-light" v-html="subtitle">
        </p>

        <!-- CTA Buttons -->
        <div v-if="buttonText || secondaryButtonText" class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <component
            v-if="buttonText"
            :is="primaryButtonUrl ? (primaryButtonUrl.startsWith('/') ? 'router-link' : 'a') : 'button'"
            :to="primaryButtonUrl && primaryButtonUrl.startsWith('/') ? primaryButtonUrl : undefined"
            :href="primaryButtonUrl && !primaryButtonUrl.startsWith('/') ? primaryButtonUrl : undefined"
            class="group relative px-8 py-4 bg-green-800 hover:bg-green-900 dark:bg-cream-100 dark:hover:bg-cream-200 text-white dark:text-green-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 min-w-[200px] inline-block text-center"
          >
            <span class="relative z-10">{{ buttonText }}</span>
            <div class="absolute inset-0 bg-orange-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </component>
          
          <component
            v-if="secondaryButtonText"
            :is="secondaryButtonUrl ? (secondaryButtonUrl.startsWith('/') ? 'router-link' : 'a') : 'button'"
            :to="secondaryButtonUrl && secondaryButtonUrl.startsWith('/') ? secondaryButtonUrl : undefined"
            :href="secondaryButtonUrl && !secondaryButtonUrl.startsWith('/') ? secondaryButtonUrl : undefined"
            class="px-8 py-4 bg-transparent border-2 border-green-300 dark:border-green-700 text-green-900 dark:text-cream-100 font-bold rounded-xl hover:bg-green-100 dark:hover:bg-green-900 transition-all duration-300 min-w-[200px] inline-block text-center"
          >
            {{ secondaryButtonText }}
          </component>
        </div>

        <!-- Feature Pills (Editable Array) -->
        <div v-if="features && features.length > 0" class="flex flex-wrap justify-center gap-4 mb-12">
          <div v-for="(feature, index) in features" :key="index" class="group relative px-6 py-3 bg-cream-100 dark:bg-green-900 rounded-full border border-green-200 dark:border-green-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 cursor-pointer">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                <!-- Icon placeholder - uses feature.icon or default -->
                <svg class="w-4 h-4 text-green-700 dark:text-green-300 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span class="text-sm font-semibold text-green-900 dark:text-cream-100">{{ feature.text || feature }}</span>
            </div>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="animate-bounce">
          <svg class="w-6 h-6 mx-auto text-green-400 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="absolute top-20 left-10 w-20 h-20 rounded-full bg-orange-500/10 blur-3xl"></div>
    <div class="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-green-500/10 blur-3xl"></div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  badgeText: {
    type: String,
    default: 'Marpoyan, Pekanbaru'
  },
  title: {
    type: String,
    default: 'Bukan Cuma<br><span class="text-orange-500">Tempat Ngopi</span>'
  },
  subtitle: {
    type: String,
    default: 'Library. Workspace. Coffee. Tiga elemen yang bikin lu produktif sambil tetep santai. <b>Antitesa</b> bukan tempat nongkrong biasa.'
  },
  buttonText: {
    type: String,
    default: 'Lihat Menu'
  },
  primaryButtonUrl: {
    type: String,
    default: '/menu'  // Default URL for primary button
  },
  secondaryButtonText: {
    type: String,
    default: 'Eksplor Ruang'
  },
  secondaryButtonUrl: {
    type: String,
    default: '/about'  // Default URL for secondary button
  },
  features: {
    type: Array,
    default: () => [
      { text: '500+ Buku' },
      { text: 'High-Speed WiFi' },
      { text: '08:00 - 23:00' }
    ]
  }
})

// Compute formatted title to handle line breaks properly if user inputs regular text
const formattedTitle = computed(() => {
  // If title doesn't contain HTML tags, treat newlines as <br>
  if (!props.title.includes('<')) {
    return props.title.replace(/\n/g, '<br>')
  }
  return props.title
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>