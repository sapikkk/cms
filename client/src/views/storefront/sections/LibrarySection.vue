<template>
  <section class="py-20 px-4 bg-green-900 dark:bg-green-950 transition-colors duration-300 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23F9F6EF\' fill-opacity=\'1\'%3E%3Cpath d=\'M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <!-- Header -->
      <div class="text-center mb-16">
        <div v-if="badge" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream-100/10 backdrop-blur-sm border border-cream-100/20 mb-6">
          <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <span class="text-xs font-bold tracking-widest uppercase text-cream-100">{{ badge }}</span>
        </div>
        
        <h2 v-if="title" class="text-4xl md:text-5xl font-bold text-white mb-4" v-html="title"></h2>
        <p v-if="description" class="text-lg text-cream-200 max-w-2xl mx-auto" v-html="description">
        </p>
      </div>

      <!-- Main Content Grid -->
      <div class="grid lg:grid-cols-2 gap-8 mb-12">
        <!-- Library Info Card -->
        <div class="bg-cream-50/10 dark:bg-green-950/50 backdrop-blur-sm rounded-2xl p-8 border border-cream-100/20 hover:border-orange-500/50 transition-all duration-300">
          <div class="flex items-start gap-4 mb-6">
            <div class="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-white mb-2">{{ libraryTitle }}</h3>
              <p class="text-cream-200 text-sm">{{ librarySubtitle }}</p>
            </div>
          </div>

          <div v-if="libraryFeatures && libraryFeatures.length > 0" class="space-y-4">
            <div v-for="(feature, index) in libraryFeatures" :key="index" class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p class="text-white font-semibold">{{ feature.title }}</p>
                <p class="text-cream-300 text-sm">{{ feature.subtitle }}</p>
              </div>
            </div>
          </div>

          <div v-if="libraryQuote" class="mt-8 pt-6 border-t border-cream-100/20">
            <p class="text-cream-300 text-sm italic">{{ libraryQuote }}</p>
          </div>
        </div>

        <!-- Workspace Info Card -->
        <div class="bg-cream-50/10 dark:bg-green-950/50 backdrop-blur-sm rounded-2xl p-8 border border-cream-100/20 hover:border-orange-500/50 transition-all duration-300">
          <div class="flex items-start gap-4 mb-6">
            <div class="w-16 h-16 rounded-2xl bg-green-400/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-white mb-2">{{ workspaceTitle }}</h3>
              <p class="text-cream-200 text-sm">{{ workspaceSubtitle }}</p>
            </div>
          </div>

          <div v-if="workspaceFeatures && workspaceFeatures.length > 0" class="space-y-4">
            <div v-for="(feature, index) in workspaceFeatures" :key="index" class="flex items-start gap-3">
              <svg class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <div>
                <p class="text-white font-semibold">{{ feature.title }}</p>
                <p class="text-cream-300 text-sm">{{ feature.subtitle }}</p>
              </div>
            </div>
          </div>

          <div v-if="workspaceQuote" class="mt-8 pt-6 border-t border-cream-100/20">
            <p class="text-cream-300 text-sm italic">{{ workspaceQuote }}</p>
          </div>
        </div>
      </div>

      <!-- Features Row -->
      <div v-if="stats && stats.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="(stat, index) in stats" :key="index" class="text-center p-6 bg-cream-50/5 rounded-xl border border-cream-100/10 hover:bg-cream-50/10 transition-all">
          <div class="text-3xl font-bold text-orange-500 mb-2">{{ stat.value }}</div>
          <div class="text-sm text-cream-200">{{ stat.label }}</div>
        </div>
      </div>

      <!-- CTA -->
      <div v-if="buttonText" class="text-center mt-12">
        <button class="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
          {{ buttonText }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  badge: { type: String, default: 'Library & Workspace' },
  title: { type: String, default: 'Tempat Otak <span class="text-orange-500">Bekerja</span>' },
  description: { type: String, default: 'Koleksi buku pilihan, ruang kerja nyaman, dan atmosfer yang bikin lu betah berjam-jam. Ini bukan coworking space biasa.' },
  
  // Library Card
  libraryTitle: { type: String, default: 'Perpustakaan Kurated' },
  librarySubtitle: { type: String, default: '500+ buku pilihan dari berbagai genre' },
  libraryFeatures: { 
    type: Array, 
    default: () => [
      { title: 'Filosofi & Pemikiran', subtitle: 'Dari Nietzsche sampai Rumi' },
      { title: 'Self-Development', subtitle: 'Upgrade diri lewat bacaan berkualitas' },
      { title: 'Sastra & Fiksi', subtitle: 'Karya klasik dan kontemporer' },
      { title: 'Bisnis & Kreativitas', subtitle: 'Inspirasi untuk penggerak perubahan' }
    ]
  },
  libraryQuote: { type: String, default: '"Buku yang tepat di tangan yang tepat bisa mengubah dunia."' },

  // Workspace Card
  workspaceTitle: { type: String, default: 'Workspace Premium' },
  workspaceSubtitle: { type: String, default: '24 meja kerja dengan fasilitas lengkap' },
  workspaceFeatures: {
    type: Array,
    default: () => [
      { title: 'Colokan di Setiap Meja', subtitle: 'Laptop, phone, tablet - charge sepuasnya' },
      { title: 'Lampu Baca Personal', subtitle: 'Adjust brightness sesuai mood lu' },
      { title: 'High-Speed WiFi', subtitle: '100 Mbps - no buffering, no lag' },
      { title: 'Silent Zone', subtitle: 'Area khusus yang 100% hening' }
    ]
  },
  workspaceQuote: { type: String, default: '"Productivity meets comfort. Work smarter, not harder."' },

  // Stats
  stats: {
    type: Array,
    default: () => [
      { value: '500+', label: 'Koleksi Buku' },
      { value: '24', label: 'Workspace Seat' },
      { value: '100', label: 'Mbps WiFi' },
      { value: '15H', label: 'Open Daily' }
    ]
  },

  buttonText: { type: String, default: 'Reservasi Workspace →' }
})
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
</style>
