<template>
  <section class="py-20 px-4 bg-green-800 dark:bg-green-950 relative overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-4xl mx-auto text-center relative z-10">
      <div v-if="showIcon" class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/20 mb-8">
        <svg class="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      </div>

      <h2 v-if="title" class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" v-html="title"></h2>
      <p v-if="description" class="text-xl text-cream-200 mb-12 max-w-2xl mx-auto leading-relaxed">{{ description }}</p>

      <div v-if="stats && stats.length > 0" class="grid gap-6 mb-12 max-w-2xl mx-auto" :class="`grid-cols-${Math.min(stats.length, 3)}`">
        <div v-for="(stat, index) in stats" :key="index" class="text-center">
          <div class="text-3xl md:text-4xl font-bold text-orange-500 mb-2">{{ stat.value }}</div>
          <div class="text-sm text-cream-300">{{ stat.label }}</div>
        </div>
      </div>

      <div v-if="primaryButtonText || secondaryButtonText" class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <component
          v-if="primaryButtonText"
          :is="primaryButtonUrl ? (primaryButtonUrl.startsWith('/') ? 'router-link' : 'a') : 'button'"
          :to="primaryButtonUrl && primaryButtonUrl.startsWith('/') ? primaryButtonUrl : undefined"
          :href="primaryButtonUrl && !primaryButtonUrl.startsWith('/') ? primaryButtonUrl : undefined"
          class="group relative px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 min-w-[200px] overflow-hidden inline-block text-center"
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            {{ primaryButtonText }}
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </span>
          <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </component>
        
        <component
          v-if="secondaryButtonText"
          :is="secondaryButtonUrl ? (secondaryButtonUrl.startsWith('/') ? 'router-link' : 'a') : 'button'"
          :to="secondaryButtonUrl && secondaryButtonUrl.startsWith('/') ? secondaryButtonUrl : undefined"
          :href="secondaryButtonUrl && !secondaryButtonUrl.startsWith('/') ? secondaryButtonUrl : undefined"
          class="px-8 py-4 bg-transparent border-2 border-cream-100/30 text-white font-bold rounded-xl hover:bg-cream-100/10 hover:border-cream-100 transition-all duration-300 min-w-[200px] inline-block text-center"
        >
          {{ secondaryButtonText }}
        </component>
      </div>

      <div v-if="badges && badges.length > 0" class="mt-12 flex items-center justify-center gap-6 text-cream-300 text-sm flex-wrap">
        <div v-for="(badge, index) in badges" :key="index" class="flex items-center gap-2">
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20" v-if="badge.icon === 'star'">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-else>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ badge.text }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Siap Upgrade <br/><span class="text-orange-500">Pengalaman Ngopi</span> Lu?' },
  description: { type: String, default: 'Gak cuma tempat minum kopi. Ini tentang menemukan ruang dimana pikiran lu bisa berkembang, produktivitas maksimal, dan kualitas hidup meningkat.' },
  stats: {
    type: Array,
    default: () => [
      { value: '500+', label: 'Buku Pilihan' },
      { value: '24', label: 'Workspace' },
      { value: '4.9', label: 'Rating' }
    ]
  },
  primaryButtonText: { type: String, default: 'Reservasi Sekarang' },
  primaryButtonUrl: { type: String, default: '/contact' },
  secondaryButtonText: { type: String, default: 'Lihat Menu' },
  secondaryButtonUrl: { type: String, default: '/menu' },
  badges: {
    type: Array,
    default: () => [
      { icon: 'star', text: '4.9/5 dari 300+ reviews' },
      { icon: 'check', text: 'Reservasi gratis & mudah' }
    ]
  },
  showIcon: { type: Boolean, default: true }
})
</script>