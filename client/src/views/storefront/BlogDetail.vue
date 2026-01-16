<template>
  <div class="min-h-screen bg-neutral-900 text-cream-100 pb-20 pt-24 px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="max-w-4xl mx-auto space-y-8 animate-pulse">
      <div class="h-8 bg-white/5 rounded w-3/4"></div>
      <div class="h-64 bg-white/5 rounded-2xl w-full"></div>
      <div class="space-y-4">
        <div class="h-4 bg-white/5 rounded w-full"></div>
        <div class="h-4 bg-white/5 rounded w-5/6"></div>
      </div>
    </div>

    <div v-else-if="error" class="max-w-4xl mx-auto text-center py-20">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
        <PhWarning class="w-8 h-8 text-red-500" />
      </div>
      <h3 class="text-xl font-medium text-cream-100 mb-2">Article Not Found</h3>
      <p class="text-cream-100/60 mb-6">{{ error }}</p>
      <router-link to="/blog" class="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
        Back to Blog
      </router-link>
    </div>

    <div v-else-if="post" class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <router-link to="/blog" class="inline-flex items-center gap-2 text-cream-100/60 hover:text-orange-400 mb-8 transition-colors group">
        <PhArrowLeft class="group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </router-link>

      <!-- Article Header -->
      <header class="mb-10 text-center space-y-6">
        <span class="inline-block px-3 py-1 bg-orange-500/10 text-orange-400 text-sm font-bold rounded-full border border-orange-500/20">
          {{ formatCategory(post.category) }}
        </span>
        
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-cream-200">
          {{ post.title }}
        </h1>

        <div class="flex items-center justify-center gap-6 text-sm text-cream-100/50">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-neutral-900">
              {{ getInitials(post.author?.fullName || 'Admin') }}
            </div>
            <span>{{ post.author?.fullName || 'Admin' }}</span>
          </div>
          <span class="w-1.5 h-1.5 rounded-full bg-white/20"></span>
          <span class="flex items-center gap-1">
            <PhCalendarBlank class="w-4 h-4" />
            {{ formatDate(post.publishedAt) }}
          </span>
          <span class="w-1.5 h-1.5 rounded-full bg-white/20"></span>
          <span class="flex items-center gap-1">
            <PhEye class="w-4 h-4" />
            {{ post.viewCount }} Views
          </span>
        </div>
      </header>

      <!-- Featured Image -->
      <div class="mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative aspect-video">
        <img 
          :src="post.coverImage || '/placeholder-blog.jpg'" 
          :alt="post.title"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent pointer-events-none"></div>
      </div>

      <!-- Content -->
      <div 
        class="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:text-cream-100 prose-p:text-cream-100/80 prose-a:text-orange-400 hover:prose-a:text-orange-300 prose-strong:text-white prose-blockquote:border-orange-500 prose-li:text-cream-100/80"
        v-html="post.content"
      ></div>

      <!-- Footer / Share / Tags -->
      <div class="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <!-- Tags -->
        <div v-if="post.tags?.length" class="flex flex-wrap gap-2">
          <span class="text-sm text-cream-100/50 mr-2">Tags:</span>
          <span 
            v-for="tag in post.tags" 
            :key="tag"
            class="px-3 py-1 bg-white/5 rounded-full text-xs text-cream-100/70 hover:bg-white/10 transition-colors cursor-pointer"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- Interactions -->
        <div class="flex items-center gap-4">
          <button 
            @click="handleLike"
            :disabled="hasLiked"
            class="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
            :class="hasLiked ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 text-cream-100/70 hover:bg-white/15'"
          >
            <PhHeart :weight="hasLiked ? 'fill' : 'bold'" class="w-5 h-5" :class="{ 'animate-pulse': handlingLike }" />
            <span>{{ post.likeCount }}</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import blogService from '@/api/services/blog.service';
import { 
  PhArrowLeft, 
  PhCalendarBlank, 
  PhEye, 
  PhHeart, 
  PhWarning 
} from '@phosphor-icons/vue';
import dayjs from 'dayjs';

const route = useRoute();
const post = ref(null);
const loading = ref(true);
const error = ref(null);
const hasLiked = ref(false);
const handlingLike = ref(false);

const fetchPost = async () => {
  loading.value = true;
  try {
    const slug = route.params.slug;
    const response = await blogService.getBySlug(slug);
    if (response.data.success) {
      post.value = response.data.data;
      checkIfLiked(post.value.id);
    }
  } catch (err) {
    console.error('Error fetching post:', err);
    error.value = 'Failed to load article.';
  } finally {
    loading.value = false;
  }
};

const handleLike = async () => {
  if (hasLiked.value || !post.value) return;
  
  handlingLike.value = true;
  try {
    const response = await blogService.likePost(post.value.id);
    if (response.data.success) {
      post.value.likeCount = response.data.data.likeCount;
      hasLiked.value = true;
      localStorage.setItem(`liked_post_${post.value.id}`, 'true');
    }
  } catch (err) {
    console.error('Error liking post:', err);
  } finally {
    handlingLike.value = false;
  }
};

const checkIfLiked = (id) => {
  if (localStorage.getItem(`liked_post_${id}`)) {
    hasLiked.value = true;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).format('MMMM D, YYYY');
};

const formatCategory = (cat) => {
  if (!cat) return '';
  return cat.charAt(0) + cat.slice(1).toLowerCase();
};

const getInitials = (name) => {
  if (!name) return 'AD';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

onMounted(() => {
  fetchPost();
});
</script>

<style scoped>
/* Optional: Prose adjustments for dark mode */
:deep(.prose) {
  max-width: 100%;
}
</style>
