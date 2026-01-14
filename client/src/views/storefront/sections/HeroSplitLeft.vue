<template>
  <section class="min-h-screen grid lg:grid-cols-2 bg-cream-500 dark:bg-green-950 transition-colors duration-300">
    <!-- Left Content -->
    <div class="flex items-center justify-center p-8 lg:p-16 order-2 lg:order-1">
      <div class="max-w-xl">
        <!-- Badge (Editable) -->
        <div v-if="badge" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 mb-6">
          <span class="text-xs font-bold tracking-widest uppercase text-orange-700 dark:text-orange-400">{{ badge }}</span>
        </div>

        <!-- Heading (Editable, supports 3 lines with middle highlighted) -->
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 dark:text-white mb-6 leading-tight">
          {{ headingLine1 }} <br v-if="headingLine1"/>
          <span class="text-orange-500">{{ headingLine2 }}</span> <br v-if="headingLine2"/>
          {{ headingLine3 }}
        </h2>

        <!-- Description (Editable) -->
        <p v-if="description" class="text-lg text-green-700 dark:text-cream-200 mb-8 leading-relaxed" v-html="description">
        </p>

        <!-- Feature List (Editable Array) -->
        <ul v-if="features && features.length > 0" class="space-y-4 mb-10">
          <li v-for="(feature, index) in features" :key="index" class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p class="font-semibold text-green-900 dark:text-white">{{ feature.title }}</p>
              <p v-if="feature.subtitle" class="text-sm text-green-600 dark:text-green-300">{{ feature.subtitle }}</p>
            </div>
          </li>
        </ul>

        <!-- Buttons (Editable) -->
        <div v-if="buttonPrimary || buttonSecondary" class="flex flex-col sm:flex-row gap-4">
          <button v-if="buttonPrimary" class="px-8 py-4 bg-green-800 hover:bg-green-900 dark:bg-cream-100 dark:hover:bg-cream-200 text-white dark:text-green-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            {{ buttonPrimary }}
          </button>
          <button v-if="buttonSecondary" class="px-8 py-4 bg-transparent border-2 border-green-300 dark:border-green-700 text-green-900 dark:text-cream-100 font-bold rounded-xl hover:bg-green-100 dark:hover:bg-green-900 transition-all duration-300">
            {{ buttonSecondary }}
          </button>
        </div>
      </div>
    </div>

    <!-- Right Image -->
    <div class="relative bg-green-100 dark:bg-green-900 order-1 lg:order-2 min-h-[400px] lg:min-h-screen">
      <!-- Image or Placeholder -->
      <div v-if="imageUrl" class="absolute inset-0">
        <img :src="imageUrl" alt="Hero Image" class="w-full h-full object-cover"/>
      </div>
      <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-200 to-cream-200 dark:from-green-900 dark:to-green-950">
        <div class="text-center p-8">
          <div class="w-32 h-32 mx-auto mb-6 rounded-2xl bg-cream-100 dark:bg-green-800 flex items-center justify-center shadow-2xl">
            <svg class="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <p class="text-sm text-green-700 dark:text-green-400 font-medium">[ Workspace Image ]</p>
        </div>
      </div>

      <!-- Decorative overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-green-950/20 to-transparent"></div>
      
      <!-- Floating Stats (Editable) -->
      <div v-if="stats && stats.length > 0" class="absolute bottom-8 left-8 right-8 grid gap-4" :class="`grid-cols-${stats.length}`">
        <div v-for="(stat, index) in stats" :key="index" class="bg-cream-50/95 dark:bg-green-950/95 backdrop-blur-sm p-4 rounded-xl border border-green-100 dark:border-green-800">
          <p class="text-2xl font-bold text-orange-500">{{ stat.value }}</p>
          <p class="text-xs text-green-700 dark:text-green-400">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  badge: {
    type: String,
    default: 'DI JALAN MARPOYAN'
  },
  headingLine1: {
    type: String,
    default: 'Ruang Baca.'
  },
  headingLine2: {
    type: String,
    default: 'Ruang Kerja.'
  },
  headingLine3: {
    type: String,
    default: 'Ruang Pikir.'
  },
  description: {
    type: String,
    default: 'Gak cuma sekedar wifi gratisan dan kursi empuk. Di sini lu dapet akses ke ribuan buku, meja kerja yang proper, sama kopi yang bikin otak fresh.'
  },
  features: {
    type: Array,
    default: () => [
      { title: 'Private Workspace', subtitle: 'Meja individual dengan colokan & lampu baca' },
      { title: 'Koleksi Buku Kurated', subtitle: 'Dari filosofi sampe self-development' },
      { title: 'Suasana Tenang', subtitle: 'No drama. No noise. Pure focus.' }
    ]
  },
  buttonPrimary: {
    type: String,
    default: 'Book Workspace'
  },
  buttonSecondary: {
    type: String,
    default: 'Lihat Virtual Tour'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  stats: {
    type: Array,
    default: () => [
      { value: '500+', label: 'Buku' },
      { value: '24', label: 'Meja Kerja' },
      { value: '100%', label: 'Focus Mode' }
    ]
  }
})
</script>