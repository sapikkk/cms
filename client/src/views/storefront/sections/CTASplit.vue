<template>
  <section class="py-20 px-4 bg-cream-500 dark:bg-green-950 transition-colors duration-300">
    <div class="max-w-7xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12 items-center bg-green-900 dark:bg-green-950 rounded-3xl overflow-hidden border border-green-800">
        <!-- Left Content -->
        <div class="p-8 lg:p-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
            <div class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <span class="text-xs font-bold tracking-widest uppercase text-orange-400">Special Offer</span>
          </div>

          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Jadi Member, <br/>
            Dapet <span class="text-orange-500">Lebih Banyak</span>
          </h2>

          <p class="text-lg text-cream-200 mb-8 leading-relaxed">
            Monthly Pass dengan benefit unlimited workspace, daily free drink, priority booking, 
            dan akses ke exclusive events. Worth every rupiah.
          </p>

          <!-- Benefits List -->
          <ul class="space-y-4 mb-10">
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p class="text-white font-semibold">Unlimited Workspace Access</p>
                <p class="text-sm text-cream-300">Dateng kapan aja, suka-suka lu</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p class="text-white font-semibold">Daily Free Drink</p>
                <p class="text-sm text-cream-300">1 cup coffee setiap hari, your choice</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p class="text-white font-semibold">Priority Booking</p>
                <p class="text-sm text-cream-300">Spot favorit always reserved for you</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p class="text-white font-semibold">Exclusive Events</p>
                <p class="text-sm text-cream-300">Workshop, book club, networking sessions</p>
              </div>
            </li>
          </ul>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button class="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
              Daftar Sekarang
            </button>
            <button class="px-8 py-4 bg-transparent border-2 border-cream-100/30 text-white font-bold rounded-xl hover:bg-cream-100/10 hover:border-cream-100 transition-all duration-300">
              Info Lengkap
            </button>
          </div>

          <!-- Price Tag -->
          <div class="mt-8 flex items-center gap-3 text-cream-200">
            <div class="flex items-baseline gap-2">
              <span class="text-xs">Mulai dari</span>
              <span class="text-3xl font-bold text-orange-500">Rp 400K</span>
              <span class="text-xs">/bulan</span>
            </div>
          </div>
        </div>

        <!-- Right Visual Card -->
        <div class="relative h-full min-h-[500px] bg-gradient-to-br from-green-800 to-green-950 p-8 lg:p-16 flex items-center justify-center">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-5">
            <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23F9F6EF\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
          </div>

          <!-- Card -->
          <div class="relative bg-cream-50 dark:bg-green-900 rounded-2xl p-8 shadow-2xl border border-green-700 max-w-sm w-full transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <!-- Badge -->
            <div class="absolute -top-4 -right-4 px-4 py-2 bg-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
              BEST VALUE
            </div>

            <div class="text-center mb-6">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 mb-4">
                <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-green-900 dark:text-white mb-2">Monthly Pass</h3>
              <p class="text-sm text-green-600 dark:text-green-400">Unlimited everything</p>
            </div>

            <div class="text-center mb-6">
              <div class="flex items-baseline justify-center gap-2">
                <span class="text-4xl font-bold text-green-900 dark:text-white">400K</span>
                <span class="text-green-600 dark:text-green-400">/month</span>
              </div>
              <p class="text-xs text-green-500 mt-2">Hemat sampai 50% vs daily rate</p>
            </div>

            <!-- Quick Features -->
            <div class="space-y-2 mb-6">
              <div class="flex items-center gap-2 text-sm text-green-700 dark:text-cream-300">
                <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Unlimited workspace</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-green-700 dark:text-cream-300">
                <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Daily free drink</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-green-700 dark:text-cream-300">
                <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Priority booking</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-green-700 dark:text-cream-300">
                <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Exclusive events</span>
              </div>
            </div>

            <div class="text-center pt-6 border-t border-green-200 dark:border-green-800">
              <p class="text-xs text-green-600 dark:text-green-400 italic">
                "Investment terbaik untuk produktivitas lu"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  membershipPrice: {
    type: String,
    default: '400K'
  }
})
</script>