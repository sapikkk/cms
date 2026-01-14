<template>
  <section class="py-20 px-4 bg-cream-500 dark:bg-green-950 transition-colors duration-300">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div v-if="badge" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 mb-6">
          <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-xs font-bold tracking-widest uppercase text-orange-700 dark:text-orange-400">{{ badge }}</span>
        </div>

        <h2 class="text-3xl md:text-4xl font-bold text-green-900 dark:text-white mb-4">
          {{ title || 'Watch Our Story' }}
        </h2>
        
        <p v-if="description" class="text-lg text-green-700 dark:text-cream-200 max-w-2xl mx-auto">
          {{ description }}
        </p>
      </div>

      <!-- Video Container -->
      <div 
        class="relative rounded-2xl overflow-hidden border-4 transition-all duration-300 group"
        :class="embedUrl ? 'border-green-200 dark:border-green-800' : 'border-orange-300 dark:border-orange-700'"
      >
        <!-- Video Embed -->
        <div 
          class="relative aspect-video bg-gradient-to-br from-green-900 to-green-950 dark:from-black dark:to-green-950"
          :class="{ 'cursor-pointer': !embedUrl }"
          @click="handleClick"
        >
          <!-- YouTube/Video iframe -->
          <iframe 
            v-if="embedUrl" 
            :src="embedUrl" 
            class="absolute inset-0 w-full h-full"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>

          <!-- Placeholder with Play Button -->
          <div 
            v-else 
            class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-800 to-orange-800 dark:from-green-950 dark:to-orange-950"
          >
            <!-- Thumbnail if provided -->
            <img 
              v-if="thumbnail" 
              :src="thumbnail" 
              alt="Video thumbnail"
              class="absolute inset-0 w-full h-full object-cover opacity-40"
            />

            <!-- Play Button -->
            <div class="relative z-10 group-hover:scale-110 transition-transform duration-300">
              <div class="w-24 h-24 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center shadow-2xl cursor-pointer transition-colors">
                <svg class="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>

            <!-- Play Text -->
            <p class="relative z-10 mt-6 text-white text-lg font-bold">
              Click to Play
            </p>
          </div>

          <!-- Optional Overlay Info -->
          <div 
            v-if="!embedUrl && overlayText" 
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white"
          >
            <p class="text-lg font-semibold">{{ overlayText }}</p>
            <p v-if="duration" class="text-sm text-cream-200 mt-1">{{ duration }}</p>
          </div>
        </div>
      </div>

      <!-- Video Stats/Info (optional) -->
      <div v-if="showStats" class="grid grid-cols-3 gap-4 mt-8">
        <div class="text-center p-4 bg-cream-50 dark:bg-green-900 rounded-xl border border-green-200 dark:border-green-800">
          <div class="text-2xl font-bold text-orange-500">{{ views || '10K+' }}</div>
          <div class="text-sm text-green-600 dark:text-green-400">Views</div>
        </div>
        <div class="text-center p-4 bg-cream-50 dark:bg-green-900 rounded-xl border border-green-200 dark:border-green-800">
          <div class="text-2xl font-bold text-orange-500">{{ likes || '500+' }}</div>
          <div class="text-sm text-green-600 dark:text-green-400">Likes</div>
        </div>
        <div class="text-center p-4 bg-cream-50 dark:bg-green-900 rounded-xl border border-green-200 dark:border-green-800">
          <div class="text-2xl font-bold text-orange-500">{{ duration || '5:30' }}</div>
          <div class="text-sm text-green-600 dark:text-green-400">Duration</div>
        </div>
      </div>

      <!-- Call to Action (optional) -->
      <div v-if="ctaText" class="text-center mt-8">
        <button 
          @click="$emit('cta-click')"
          class="px-8 py-4 bg-green-800 hover:bg-green-900 dark:bg-cream-100 dark:hover:bg-cream-200 text-white dark:text-green-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          {{ ctaText }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  description: String,
  badge: String,
  videoUrl: String,
  thumbnail: String,
  overlayText: String,
  duration: String,
  views: String,
  likes: String,
  showStats: {
    type: Boolean,
    default: false
  },
  ctaText: String
})

const emit = defineEmits(['cta-click', 'video-click'])

// Convert various video URLs to embed format
const embedUrl = computed(() => {
  if (!props.videoUrl) return null
  
  const url = props.videoUrl
  
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = ''
    
    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0]
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0]
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1].split('?')[0]
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null
  }
  
  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1].split('?')[0]
    return `https://player.vimeo.com/video/${videoId}`
  }
  
  // Direct embed URL
  if (url.includes('embed')) {
    return url
  }
  
  return null
})

const handleClick = () => {
  if (!embedUrl.value) {
    emit('video-click')
  }
}
</script>