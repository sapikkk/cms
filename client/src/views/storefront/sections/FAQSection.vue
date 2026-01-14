<template>
  <section class="py-20 px-4 bg-cream-500 dark:bg-green-950 transition-colors duration-300">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800 mb-6">
          <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-xs font-bold tracking-widest uppercase text-green-700 dark:text-green-300">FAQ</span>
        </div>
        
        <h2 class="text-4xl md:text-5xl font-bold text-green-900 dark:text-white mb-4">
          Pertanyaan <span class="text-orange-500">yang Sering</span> Ditanya
        </h2>
        <p class="text-lg text-green-700 dark:text-cream-200">
          Jawaban lugas untuk pertanyaan umum. No bullshit.
        </p>
      </div>

      <!-- FAQ Items -->
      <div class="space-y-4">
        <!-- FAQ Item 1 -->
        <details class="group bg-cream-50 dark:bg-green-900 rounded-2xl border border-green-200 dark:border-green-800 overflow-hidden hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300">
          <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
            <h3 class="text-lg font-bold text-green-900 dark:text-white pr-4">
              Apakah harus pesan workspace atau bisa walk-in?
            </h3>
            <svg class="w-6 h-6 text-orange-500 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </summary>
          <div class="px-6 pb-6 text-green-700 dark:text-cream-300 leading-relaxed border-t border-green-100 dark:border-green-800 pt-4">
            <p class="mb-4">
              Bisa walk-in kok, tapi kita sangat rekomendasikan reservasi dulu lewat website atau WA. 
              Kenapa? Karena workspace favorit cepet penuh, especially weekend dan evening.
            </p>
            <p>
              Reservasi gratis, cuma butuh 2 menit. Daripada nyampe ternyata full, mending aman dulu kan?
            </p>
          </div>
        </details>

        <!-- FAQ Item 2 -->
        <details class="group bg-cream-50 dark:bg-green-900 rounded-2xl border border-green-200 dark:border-green-800 overflow-hidden hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300">
          <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
            <h3 class="text-lg font-bold text-green-900 dark:text-white pr-4">
              Berapa lama bisa pakai workspace?
            </h3>
            <svg class="w-6 h-6 text-orange-500 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </summary>
          <div class="px-6 pb-6 text-green-700 dark:text-cream-300 leading-relaxed border-t border-green-100 dark:border-green-800 pt-4">
            <p class="mb-4">
              Ada beberapa paket:
            </p>
            <ul class="space-y-2 ml-4">
              <li class="flex items-start gap-2">
                <span class="text-orange-500 font-bold"></span>
                <span><strong>Half Day (4 jam)</strong> - Rp 25K + 1 drink</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-orange-500 font-bold"></span>
                <span><strong>Full Day (8 jam)</strong> - Rp 40K + 2 drinks</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-orange-500 font-bold"></span>
                <span><strong>Monthly Pass</strong> - Rp 400K unlimited access + daily drink</span>
              </li>
            </ul>
            <p class="mt-4">
              Semua paket sudah termasuk WiFi, colokan, dan akses ke library. Worth it banget.
            </p>
          </div>
        </details>

        <!-- FAQ Item 3 -->
        <details class="group bg-cream-50 dark:bg-green-900 rounded-2xl border border-green-200 dark:border-green-800 overflow-hidden hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300">
          <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
            <h3 class="text-lg font-bold text-green-900 dark:text-white pr-4">
              Boleh bawa makanan dari luar?
            </h3>
            <svg class="w-6 h-6 text-orange-500 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </summary>
          <div class="px-6 pb-6 text-green-700 dark:text-cream-300 leading-relaxed border-t border-green-100 dark:border-green-800 pt-4">
            <p class="mb-4">
              Untuk minuman dari luar <strong class="text-orange-500">tidak diperbolehkan</strong>. 
              Kita coffee shop, jadi ya logikanya gitu.
            </p>
            <p>
              Tapi makanan ringan dari luar boleh kok. Cuma tolong jangan yang berbau menyengat ya. 
              Respect ke yang lain yang lagi fokus kerja atau baca.
            </p>
          </div>
        </details>

        <!-- FAQ Item 4 -->
        <details class="group bg-cream-50 dark:bg-green-900 rounded-2xl border border-green-200 dark:border-green-800 overflow-hidden hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300">
          <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
            <h3 class="text-lg font-bold text-green-900 dark:text-white pr-4">
              Apakah ada ruang meeting atau diskusi kelompok?
            </h3>
            <svg class="w-6 h-6 text-orange-500 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </summary>
          <div class="px-6 pb-6 text-green-700 dark:text-cream-300 leading-relaxed border-t border-green-100 dark:border-green-800 pt-4">
            <p class="mb-4">
              Ada! Kita punya <strong>Private Meeting Room</strong> yang bisa accommodate 6-8 orang. 
              Dilengkapi dengan:
            </p>
            <ul class="space-y-2 ml-4 mb-4">
              <li class="flex items-start gap-2">
                <span class="text-orange-500 font-bold"></span>
                <span>Whiteboard & marker</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-orange-500 font-bold"></span>
                <span>TV/Projector untuk presentasi</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-orange-500 font-bold"></span>
                <span>AC & soundproof</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-orange-500 font-bold"></span>
                <span>Coffee & snack catering available</span>
              </li>
            </ul>
            <p>
              Rate: Rp 100K/3 jam. Reservasi H-1 recommended.
            </p>
          </div>
        </details>

        <!-- FAQ Item 5 -->
        <details class="group bg-cream-50 dark:bg-green-900 rounded-2xl border border-green-200 dark:border-green-800 overflow-hidden hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300">
          <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
            <h3 class="text-lg font-bold text-green-900 dark:text-white pr-4">
              Buku-buku di library boleh dipinjam pulang?
            </h3>
            <svg class="w-6 h-6 text-orange-500 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </summary>
          <div class="px-6 pb-6 text-green-700 dark:text-cream-300 leading-relaxed border-t border-green-100 dark:border-green-800 pt-4">
            <p class="mb-4">
              Untuk saat ini, semua buku hanya bisa dibaca di tempat. Kita mau maintain koleksi supaya 
              tetap lengkap dan available buat semua orang.
            </p>
            <p>
              Tapi kalo lu regular member dengan Monthly Pass, ada benefit khusus bisa "book" buku favorit 
              supaya gak keburu dipinjam orang lain saat lu datang. Smart, kan?
            </p>
          </div>
        </details>

        <!-- FAQ Item 6 -->
        <details class="group bg-cream-50 dark:bg-green-900 rounded-2xl border border-green-200 dark:border-green-800 overflow-hidden hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300">
          <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
            <h3 class="text-lg font-bold text-green-900 dark:text-white pr-4">
              Jam operasional Antitesa?
            </h3>
            <svg class="w-6 h-6 text-orange-500 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </summary>
          <div class="px-6 pb-6 text-green-700 dark:text-cream-300 leading-relaxed border-t border-green-100 dark:border-green-800 pt-4">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="font-semibold">Senin - Kamis</span>
                <span>08:00 - 22:00</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-semibold">Jumat</span>
                <span>08:00 - 23:00</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-semibold">Sabtu - Minggu</span>
                <span>09:00 - 23:00</span>
              </div>
            </div>
            <p class="mt-4 text-sm">
              <span class="text-orange-500 font-bold">Pro tip:</span> Datang pagi (sebelum jam 10) untuk dapet spot terbaik dan suasana paling tenang.
            </p>
          </div>
        </details>
      </div>

      <!-- Contact CTA -->
      <div class="mt-12 text-center p-8 bg-green-100 dark:bg-green-900 rounded-2xl border border-green-200 dark:border-green-800">
        <h3 class="text-xl font-bold text-green-900 dark:text-white mb-2">
          Masih ada pertanyaan lain?
        </h3>
        <p class="text-green-700 dark:text-cream-300 mb-6">
          Hit us up. Kita respon cepet, gak pake bot.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="px-8 py-3 bg-green-800 hover:bg-green-900 dark:bg-cream-100 dark:hover:bg-cream-200 text-white dark:text-green-900 font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
            WhatsApp Kami
          </button>
          <button class="px-8 py-3 bg-transparent border-2 border-green-300 dark:border-green-700 text-green-900 dark:text-cream-100 font-bold rounded-xl hover:bg-green-200 dark:hover:bg-green-800 transition-all duration-300">
            Email Kami
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Bisa ditambahkan props untuk FAQ items dinamis
defineProps({
  faqs: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
details summary::-webkit-details-marker {
  display: none;
}
</style>