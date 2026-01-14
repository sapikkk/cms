<template>
  <section class="py-20 px-4 bg-cream-500 dark:bg-green-950 transition-colors duration-300">
    <div class="max-w-7xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="relative rounded-3xl overflow-hidden bg-green-100 dark:bg-green-900 aspect-[4/3]">
          <div v-if="imageUrl" class="absolute inset-0">
            <img :src="imageUrl" alt="Content Image" class="w-full h-full object-cover"/>
          </div>
          <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-200 to-cream-100 dark:from-green-900 dark:to-green-950">
            <svg class="w-32 h-32 text-green-300 dark:text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>

        <div>
          <div v-if="badge" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 mb-6">
            <span class="text-xs font-bold tracking-widest uppercase text-orange-700 dark:text-orange-400">{{ badge }}</span>
          </div>
          
          <h2 class="text-3xl md:text-4xl font-bold text-green-900 dark:text-white mb-6 leading-tight" v-html="title"></h2>
          
          <p v-if="description" class="text-lg text-green-700 dark:text-cream-200 mb-6 leading-relaxed" v-html="description">
          </p>
          
          <p v-if="content" class="text-green-700 dark:text-cream-300 mb-8 leading-relaxed" v-html="content">
          </p>

          <button v-if="buttonText" class="px-8 py-4 bg-green-800 hover:bg-green-900 dark:bg-cream-100 dark:hover:bg-cream-200 text-white dark:text-green-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  badge: { type: String, default: 'Our Story' },
  title: { type: String, default: 'Lahir dari Kecintaan pada <span class="text-orange-500">Kopi & Buku</span>' },
  description: { type: String, default: 'Antitesa dimulai dari pertanyaan sederhana: kenapa gak ada tempat yang combine kopi berkualitas dengan library yang proper?' },
  content: { type: String, default: 'Kita percaya ruang mempengaruhi pikiran. Pikiran mempengaruhi karya. Dan karya mengubah dunia. Makanya kita ciptakan space dimana semua elemen ini saling support.' },
  buttonText: { type: String, default: 'Baca Selengkapnya →' },
  imageUrl: { type: String, default: '' }
})
</script>