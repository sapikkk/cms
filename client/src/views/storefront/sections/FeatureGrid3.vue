<template>
  <section class="py-20 px-4 bg-cream-100 dark:bg-green-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto">
      <div v-if="title || subtitle" class="text-center mb-16">
        <h2 v-if="title" class="text-4xl md:text-5xl font-bold text-green-900 dark:text-white mb-4" v-html="title"></h2>
        <div v-if="subtitle" class="text-lg text-green-700 dark:text-cream-200 max-w-2xl mx-auto" v-html="subtitle"></div>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(feature, index) in features" :key="index" class="group relative bg-cream-50 dark:bg-green-950 rounded-3xl p-8 border border-green-200 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
          <div class="relative mb-8">
            <div class="w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500" :class="index === 0 ? 'bg-orange-500/10' : index === 1 ? 'bg-green-500/10' : 'bg-orange-500/10'">
              <svg class="w-10 h-10" :class="index === 0 ? 'text-orange-500' : index === 1 ? 'text-green-500' : 'text-orange-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" :class="index === 0 ? 'bg-orange-500' : index === 1 ? 'bg-green-500' : 'bg-orange-500'">
              {{ index + 1 }}
            </div>
          </div>

          <h3 class="text-2xl font-bold text-green-900 dark:text-white mb-4">{{ feature.title }}</h3>
          <p v-if="feature.description" class="text-green-700 dark:text-cream-300 mb-6 leading-relaxed">{{ feature.description }}</p>

          <ul v-if="feature.items && feature.items.length > 0" class="space-y-3">
            <li v-for="(item, idx) in feature.items" :key="idx" class="flex items-start gap-3">
              <svg class="w-5 h-5 flex-shrink-0 mt-0.5" :class="index === 0 ? 'text-orange-500' : index === 1 ? 'text-green-500' : 'text-orange-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-sm text-green-700 dark:text-cream-300">{{ item.text || item }}</span>
            </li>
          </ul>

          <div class="absolute bottom-0 right-0 w-32 h-32 rounded-tl-full transition-all duration-500 group-hover:scale-150 group-hover:opacity-0" :class="index === 0 ? 'bg-orange-500/5' : index === 1 ? 'bg-green-500/5' : 'bg-orange-500/5'"></div>
        </div>
      </div>

      <div v-if="bottomText || buttonText" class="mt-16 text-center">
        <p v-if="bottomText" class="text-green-700 dark:text-cream-300 mb-6 text-lg" v-html="bottomText"></p>
        <button v-if="buttonText" class="px-8 py-4 bg-green-800 hover:bg-green-900 dark:bg-cream-100 dark:hover:bg-cream-200 text-white dark:text-green-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
          {{ buttonText }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Tiga Pilar <span class="text-orange-500">Antitesa</span>' },
  subtitle: { type: String, default: 'Bukan cuma tempat ngopi. Ini ekosistem lengkap buat lu yang pengen produktif sambil tetep nyaman.' },
  features: {
    type: Array,
    default: () => [
      {
        title: 'Premium Coffee',
        description: 'Single origin beans, manual brew methods, barista bersertifikat. Setiap cangkir adalah hasil dari dedikasi dan keahlian.',
        items: [
          { text: 'Biji kopi dari petani lokal pilihan' },
          { text: 'V60, Chemex, French Press available' },
          { text: 'Customizable strength & temperature' }
        ]
      },
      {
        title: 'Curated Library',
        description: '500+ buku pilihan dari filosofi, sastra, self-development, hingga bisnis. Bukan random, semuanya carefully selected.',
        items: [
          { text: 'Koleksi klasik & kontemporer' },
          { text: 'Reading corner yang nyaman' },
          { text: 'Update koleksi setiap bulan' }
        ]
      },
      {
        title: 'Pro Workspace',
        description: '24 meja kerja dengan fasilitas lengkap. Colokan, lampu baca, WiFi 100 Mbps. Semua yang lu butuh untuk produktif maksimal.',
        items: [
          { text: 'Private & shared workspace' },
          { text: 'Silent zone untuk deep work' },
          { text: 'Meeting room tersedia' }
        ]
      }
    ]
  },
  bottomText: { type: String, default: 'Tiga elemen ini bukan cuma <em>exist</em>. Mereka <strong>synergize</strong>.' },
  buttonText: { type: String, default: 'Experience the Difference →' }
})
</script>