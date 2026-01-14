<template>
  <section class="min-h-screen grid lg:grid-cols-2 bg-cream-500 dark:bg-green-950 transition-colors duration-300">
    <!-- Left Image -->
    <div class="relative bg-green-100 dark:bg-green-900 min-h-[400px] lg:min-h-screen">
      <div v-if="imageUrl" class="absolute inset-0">
        <img :src="imageUrl" alt="Hero Image" class="w-full h-full object-cover"/>
      </div>
      <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-cream-200 dark:from-green-900 dark:to-green-950">
        <div class="text-center p-8">
          <div class="w-32 h-32 mx-auto mb-6 rounded-2xl bg-cream-100 dark:bg-green-800 flex items-center justify-center shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-500">
            <svg class="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
            </svg>
          </div>
          <p class="text-sm text-green-700 dark:text-green-400 font-medium">[ {{ imagePlaceholder }} ]</p>
        </div>
      </div>

      <div class="absolute inset-0 bg-gradient-to-t from-green-950/20 to-transparent"></div>
      
      <div v-if="quoteText" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md">
        <div class="bg-cream-50/95 dark:bg-green-950/95 backdrop-blur-sm p-8 rounded-2xl border border-green-200 dark:border-green-800 shadow-2xl">
          <div class="text-orange-500 text-6xl font-serif mb-4">"</div>
          <p class="text-lg text-green-900 dark:text-white font-light italic leading-relaxed mb-4">
            {{ quoteText }}
          </p>
          <p v-if="quoteAuthor" class="text-sm text-green-600 dark:text-green-400 font-semibold">— {{ quoteAuthor }}</p>
        </div>
      </div>
    </div>

    <!-- Right Content -->
    <div class="flex items-center justify-center p-8 lg:p-16">
      <div class="max-w-xl">
        <div v-if="badge" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 mb-6">
          <svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span class="text-xs font-bold tracking-widest uppercase text-orange-700 dark:text-orange-400">{{ badge }}</span>
        </div>

        <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 dark:text-white mb-6 leading-tight">
          {{ headingLine1 }} <br v-if="headingLine1"/>
          {{ headingLine2Part1 }} <span class="text-orange-500">{{ headingLine2Part2 }}</span>
        </h2>

        <p v-if="description" class="text-lg text-green-700 dark:text-cream-200 mb-8 leading-relaxed" v-html="description">
        </p>

        <div v-if="features && features.length > 0" class="space-y-6 mb-10">
          <div v-for="(feature, index) in features" :key="index" class="flex gap-4 p-4 bg-cream-100 dark:bg-green-900 rounded-xl border border-green-100 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-800 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
              <svg class="w-6 h-6 text-green-700 dark:text-green-300 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-green-900 dark:text-white mb-1">{{ feature.title }}</h4>
              <p v-if="feature.subtitle" class="text-sm text-green-600 dark:text-green-300">{{ feature.subtitle }}</p>
            </div>
          </div>
        </div>

        <button v-if="buttonText" class="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
          {{ buttonText }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  badge: { type: String, default: 'Premium Experience' },
  headingLine1: { type: String, default: 'Kopi Bukan' },
  headingLine2Part1: { type: String, default: 'Sekadar' },
  headingLine2Part2: { type: String, default: 'Minuman' },
  description: { type: String, default: 'Ini tentang ritual. Tentang menemukan momen di tengah kesibukan. Tentang menyeduh pikiran sambil menikmati seduhan terbaik.' },
  features: {
    type: Array,
    default: () => [
      { title: 'Single Origin Beans', subtitle: 'Biji kopi pilihan dari petani lokal Indonesia' },
      { title: 'Manual Brew Methods', subtitle: 'V60, Chemex, French Press - lu pilih, kita seduh' },
      { title: 'Barista Bersertifikat', subtitle: 'Bukan asal bikin. Setiap cangkir adalah karya' }
    ]
  },
  buttonText: { type: String, default: 'Eksplor Menu Kopi →' },
  imageUrl: { type: String, default: '' },
  imagePlaceholder: { type: String, default: 'Coffee Culture Image' },
  quoteText: { type: String, default: 'Kopi yang baik datang dari biji yang baik. Pikiran yang jernih datang dari ruang yang tenang.' },
  quoteAuthor: { type: String, default: 'Filosofi Antitesa' }
})
</script>