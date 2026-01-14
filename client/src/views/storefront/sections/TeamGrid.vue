<template>
  <section class="py-20 px-4 bg-cream-500 dark:bg-green-950 transition-colors duration-300">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800 mb-6">
          <span class="text-xs font-bold tracking-widest uppercase text-green-700 dark:text-green-300">Our Team</span>
        </div>
        
        <h2 class="text-4xl md:text-5xl font-bold text-green-900 dark:text-white mb-4" v-html="title || 'Tim di Balik Antitesa'">
        </h2>
        <p class="text-lg text-green-700 dark:text-cream-200 max-w-2xl mx-auto">
          Passionate people yang dedicated untuk memberikan experience terbaik
        </p>
      </div>

      <!-- Team Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(member, index) in team" 
          :key="index" 
          class="group bg-cream-50 dark:bg-green-900 rounded-2xl overflow-hidden border border-green-200 dark:border-green-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
        >
          <!-- Image Container -->
          <div class="relative h-64 bg-cream-200 dark:bg-green-800 overflow-hidden">
            <img 
              v-if="member.image" 
              :src="member.image" 
              :alt="member.name" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div 
              v-else 
              class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-200 to-orange-100 dark:from-green-900 dark:to-green-950"
            >
              <svg class="w-24 h-24 text-green-400 dark:text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            
            <!-- Overlay on hover -->
            <div class="absolute inset-0 bg-green-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div class="text-center text-white p-6">
                <p class="text-sm" v-if="member.bio">{{ member.bio }}</p>
                <p class="text-sm italic" v-else>"{{ member.quote || 'Passionate about coffee & people' }}"</p>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 text-center">
            <h3 class="text-xl font-bold text-green-900 dark:text-white mb-1">
              {{ member.name }}
            </h3>
            <p class="text-sm font-semibold text-orange-500 mb-3">
              {{ member.role }}
            </p>
            
            <!-- Optional specialty tags -->
            <div v-if="member.specialties" class="flex flex-wrap justify-center gap-2 mb-4">
              <span 
                v-for="(specialty, i) in member.specialties" 
                :key="i"
                class="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700"
              >
                {{ specialty }}
              </span>
            </div>

            <!-- Social Links (optional) -->
            <div v-if="member.social" class="flex justify-center gap-3 pt-4 border-t border-green-100 dark:border-green-800">
              <a 
                v-if="member.social.instagram" 
                :href="member.social.instagram"
                class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                target="_blank"
              >
                <span class="text-xs font-bold">IG</span>
              </a>
              <a 
                v-if="member.social.linkedin" 
                :href="member.social.linkedin"
                class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                target="_blank"
              >
                <span class="text-xs font-bold">IN</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Join Team CTA (optional) -->
      <div v-if="showJoinCTA" class="text-center mt-16">
        <div class="inline-block p-8 bg-green-100 dark:bg-green-900 rounded-2xl border border-green-200 dark:border-green-800">
          <h3 class="text-2xl font-bold text-green-900 dark:text-white mb-3">
            Join Our Team
          </h3>
          <p class="text-green-700 dark:text-cream-300 mb-6">
            Kita selalu cari passionate people untuk grow together
          </p>
          <button class="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            Lihat Lowongan
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  members: Array,
  showJoinCTA: {
    type: Boolean,
    default: false
  }
})

const team = computed(() => props.members || [
  { 
    name: 'Ahmad Rizki', 
    role: 'Head Barista', 
    image: null,
    quote: 'Coffee is my language',
    specialties: ['Latte Art', 'Manual Brew']
  },
  { 
    name: 'Sarah Permata', 
    role: 'Library Curator', 
    image: null,
    quote: 'Books change lives',
    specialties: ['Philosophy', 'Literature']
  },
  { 
    name: 'Budi Santoso', 
    role: 'Community Manager', 
    image: null,
    quote: 'Building connections',
    specialties: ['Events', 'Networking']
  }
])
</script>