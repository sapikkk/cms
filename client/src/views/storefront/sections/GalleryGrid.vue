<template>
  <section class="py-20 px-4 bg-cream-500 dark:bg-green-950 transition-colors duration-300">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800 mb-6">
          <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span class="text-xs font-bold tracking-widest uppercase text-green-700 dark:text-green-300">Gallery</span>
        </div>
        
        <h2 class="text-4xl md:text-5xl font-bold text-green-900 dark:text-white mb-4">
          Liat <span class="text-orange-500">Vibes</span> Kami
        </h2>
        <p class="text-lg text-green-700 dark:text-cream-200 max-w-2xl mx-auto">
          Gambar speaks louder than words. Ini real look dari Antitesa.
        </p>
      </div>

      <!-- Gallery Grid - Masonry Style -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- Gallery Item 1 - Tall -->
        <div class="group relative lg:row-span-2 rounded-2xl overflow-hidden bg-cream-200 dark:bg-green-900 border border-green-200 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 aspect-[3/4] lg:aspect-[3/5]">
          <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-200 to-cream-100 dark:from-green-900 dark:to-green-950">
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto text-green-400 dark:text-green-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <p class="text-sm font-medium text-green-700 dark:text-green-400">Library Corner</p>
            </div>
          </div>
          <div class="absolute inset-0 bg-green-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button class="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl">View</button>
          </div>
        </div>

        <!-- Gallery Item 2 -->
        <div class="group relative rounded-2xl overflow-hidden bg-cream-200 dark:bg-green-900 border border-green-200 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 aspect-square">
          <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-cream-100 dark:from-green-900 dark:to-green-950">
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto text-orange-400 dark:text-orange-900/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <p class="text-sm font-medium text-orange-700 dark:text-orange-400">Coffee Bar</p>
            </div>
          </div>
          <div class="absolute inset-0 bg-green-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button class="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl">View</button>
          </div>
        </div>

        <!-- Gallery Item 3 -->
        <div class="group relative rounded-2xl overflow-hidden bg-cream-200 dark:bg-green-900 border border-green-200 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 aspect-square">
          <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-cream-100 dark:from-green-900 dark:to-green-950">
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto text-green-400 dark:text-green-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <p class="text-sm font-medium text-green-700 dark:text-green-400">Workspace</p>
            </div>
          </div>
          <div class="absolute inset-0 bg-green-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button class="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl">View</button>
          </div>
        </div>

        <!-- Gallery Item 4 - Wide -->
        <div class="group relative md:col-span-2 rounded-2xl overflow-hidden bg-cream-200 dark:bg-green-900 border border-green-200 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 aspect-video md:aspect-[21/9]">
          <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream-200 to-orange-100 dark:from-green-900 dark:to-green-950">
            <div class="text-center">
              <svg class="w-20 h-20 mx-auto text-orange-400 dark:text-orange-900/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <p class="text-sm font-medium text-orange-700 dark:text-orange-400">Main Area</p>
            </div>
          </div>
          <div class="absolute inset-0 bg-green-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button class="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl">View</button>
          </div>
        </div>

        <!-- Gallery Item 5 -->
        <div class="group relative rounded-2xl overflow-hidden bg-cream-200 dark:bg-green-900 border border-green-200 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 aspect-square">
          <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-cream-100 dark:from-green-900 dark:to-green-950">
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto text-green-400 dark:text-green-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <p class="text-sm font-medium text-green-700 dark:text-green-400">Community</p>
            </div>
          </div>
          <div class="absolute inset-0 bg-green-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button class="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl">View</button>
          </div>
        </div>

        <!-- Gallery Item 6 -->
        <div class="group relative rounded-2xl overflow-hidden bg-cream-200 dark:bg-green-900 border border-green-200 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 aspect-square">
          <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-cream-100 dark:from-green-900 dark:to-green-950">
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto text-orange-400 dark:text-orange-900/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"></path>
              </svg>
              <p class="text-sm font-medium text-orange-700 dark:text-orange-400">Pastries</p>
            </div>
          </div>
          <div class="absolute inset-0 bg-green-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button class="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl">View</button>
          </div>
        </div>

        <!-- Gallery Item 7 - Tall -->
        <div class="group relative lg:row-span-2 rounded-2xl overflow-hidden bg-cream-200 dark:bg-green-900 border border-green-200 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 aspect-[3/4] lg:aspect-[3/5]">
          <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-200 to-cream-100 dark:from-green-900 dark:to-green-950">
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto text-green-400 dark:text-green-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-sm font-medium text-green-700 dark:text-green-400">Ambiance</p>
            </div>
          </div>
          <div class="absolute inset-0 bg-green-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button class="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl">View</button>
          </div>
        </div>

        <!-- Gallery Item 8 -->
        <div class="group relative rounded-2xl overflow-hidden bg-cream-200 dark:bg-green-900 border border-green-200 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 aspect-square">
          <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream-200 to-green-100 dark:from-green-900 dark:to-green-950">
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto text-green-400 dark:text-green-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-sm font-medium text-green-700 dark:text-green-400">Anytime</p>
            </div>
          </div>
          <div class="absolute inset-0 bg-green-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button class="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl">View</button>
          </div>
        </div>
      </div>

      <!-- View All Button -->
      <div class="text-center mt-12">
        <button class="px-8 py-4 bg-green-800 hover:bg-green-900 dark:bg-cream-100 dark:hover:bg-cream-200 text-white dark:text-green-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
          Lihat Semua Foto →
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  images: {
    type: Array,
    default: () => []
  }
})
</script>