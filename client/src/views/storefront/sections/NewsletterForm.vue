<template>
  <section class="py-20 px-4 bg-green-900 dark:bg-green-950 transition-colors duration-300 relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-4xl mx-auto text-center relative z-10">
      <!-- Icon -->
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 mb-6">
        <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      </div>

      <!-- Heading -->
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
        Stay in the <span class="text-orange-500">Loop</span>
      </h2>
      
      <p class="text-lg text-cream-200 mb-8 max-w-xl mx-auto">
        Dapet update tentang event, workshop, promo, dan konten eksklusif lainnya. 
        No spam. Pure value.
      </p>

      <!-- Form -->
      <div class="max-w-md mx-auto mb-8">
        <div class="flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            placeholder="your.email@example.com" 
            class="flex-1 px-6 py-4 rounded-xl bg-cream-50/10 border border-cream-100/20 text-white placeholder-cream-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-cream-50/20 transition-all"
          />
          <button class="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap">
            Subscribe
          </button>
        </div>
        <p class="text-xs text-cream-300 mt-3 text-left">
          Kita respect privacy lu. Bisa unsubscribe kapan aja.
        </p>
      </div>

      <!-- Benefits -->
      <div class="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-3">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h4 class="text-sm font-bold text-white mb-1">Event Updates</h4>
          <p class="text-xs text-cream-300">Workshop & meetup info</p>
        </div>
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/20 mb-3">
            <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <h4 class="text-sm font-bold text-white mb-1">Exclusive Deals</h4>
          <p class="text-xs text-cream-300">Member-only promos</p>
        </div>
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-3">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h4 class="text-sm font-bold text-white mb-1">Reading Lists</h4>
          <p class="text-xs text-cream-300">Curated book picks</p>
        </div>
      </div>

      <!-- Social Proof -->
      <div class="mt-8 pt-8 border-t border-cream-100/20">
        <p class="text-sm text-cream-300">
          <span class="font-bold text-orange-500">500+</span> people udah subscribe dan gak nyesel
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
const handleSubmit = () => {
  // Handle newsletter subscription
  console.log('Newsletter subscription')
}
</script>