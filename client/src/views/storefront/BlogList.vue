<template>
  <div class="min-h-screen bg-neutral-900 text-cream-100 pb-20 pt-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-12">
      
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-cream-200">
          News & Articles
        </h1>
        <p class="text-lg text-cream-100/60 max-w-2xl mx-auto">
          Insights, updates, and stories from the world of ANTITESA.
        </p>
      </div>

      <!-- Filters & Search -->
      <div class="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
        <!-- Categories -->
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="cat in categories" 
            :key="cat.value"
            @click="activeCategory = cat.value"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            :class="activeCategory === cat.value 
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
              : 'bg-white/5 text-cream-100/70 hover:bg-white/10 border border-white/5'"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Search -->
        <div class="relative w-full md:w-64">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search articles..."
            class="w-full bg-black/20 text-cream-100 text-sm rounded-lg pl-10 pr-4 py-2 border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-cream-100/30"
            @input="handleSearch"
          />
          <PhMagnifyingGlass class="absolute left-3 top-2.5 text-cream-100/40 w-4 h-4" />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="n in 6" :key="n" class="bg-white/5 rounded-2xl h-96 animate-pulse"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="posts.length === 0" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
          <PhNewspaper class="w-8 h-8 text-cream-100/40" />
        </div>
        <h3 class="text-xl font-medium text-cream-100 mb-2">No articles found</h3>
        <p class="text-cream-100/60">Try adjusting your search or category filters.</p>
      </div>

      <!-- Blog Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="post in posts" 
          :key="post.id"
          class="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col h-full"
        >
          <!-- Image -->
          <div class="relative aspect-video overflow-hidden">
            <img 
              :src="post.coverImage || '/placeholder-blog.jpg'" 
              :alt="post.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent"></div>
            
            <!-- Category Badge -->
            <span class="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-orange-400 text-xs font-bold rounded-full border border-orange-500/20">
              {{ formatCategory(post.category) }}
            </span>
          </div>

          <!-- Content -->
          <div class="p-6 flex flex-col flex-grow">
            <!-- Meta -->
            <div class="flex items-center gap-3 text-xs text-cream-100/50 mb-3">
              <span class="flex items-center gap-1">
                <PhCalendarBlank class="w-3.5 h-3.5" />
                {{ formatDate(post.publishedAt) }}
              </span>
              <span class="w-1 h-1 rounded-full bg-white/20"></span>
              <span class="flex items-center gap-1">
                <PhEye class="w-3.5 h-3.5" />
                {{ post.viewCount }}
              </span>
            </div>

            <!-- Title -->
            <h2 class="text-xl font-bold text-cream-100 mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors">
              <router-link :to="`/blog/${post.slug}`" class="focus:outline-none">
                <span class="absolute inset-0 z-10"></span>
                {{ post.title }}
              </router-link>
            </h2>

            <!-- Excerpt -->
            <p class="text-sm text-cream-100/70 mb-4 line-clamp-3">
              {{ post.excerpt }}
            </p>

            <!-- Footer -->
            <div class="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
              <!-- Author -->
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-neutral-900">
                  {{ getInitials(post.author?.fullName || 'Admin') }}
                </div>
                <span class="text-xs text-cream-100/60 font-medium">
                  {{ post.author?.fullName || 'Admin' }}
                </span>
              </div>
              
              <span class="text-xs font-medium text-orange-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Article <PhArrowRight class="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.pages > 1" class="flex justify-center pt-8">
        <nav class="flex items-center gap-2">
          <button 
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-cream-100"
          >
            <PhCaretLeft class="w-5 h-5" />
          </button>
          
          <span class="text-sm text-cream-100/60 font-medium px-4">
            Page {{ pagination.page }} of {{ pagination.pages }}
          </span>

          <button 
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.pages"
            class="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-cream-100"
          >
            <PhCaretRight class="w-5 h-5" />
          </button>
        </nav>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import blogService from '@/api/services/blog.service';
import { 
  PhMagnifyingGlass, 
  PhCalendarBlank, 
  PhEye, 
  PhCaretLeft, 
  PhCaretRight,
  PhNewspaper,
  PhArrowRight
} from '@phosphor-icons/vue';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const posts = ref([]);
const pagination = ref({ page: 1, limit: 9, total: 0, pages: 1 });
const searchQuery = ref('');
const activeCategory = ref('');

const categories = [
  { label: 'All', value: '' },
  { label: 'News', value: 'NEWS' },
  { label: 'Articles', value: 'ARTICLE' },
  { label: 'Tutorials', value: 'TUTORIAL' },
  { label: 'Announcements', value: 'ANNOUNCEMENT' }
];

const fetchPosts = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      category: activeCategory.value || undefined, // Send undefined if empty string
      search: searchQuery.value || undefined
    };
    
    const response = await blogService.getAll(params);
    if (response.data.success) {
      posts.value = response.data.data;
      pagination.value = response.data.pagination;
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  } finally {
    loading.value = false;
  }
};

// Custom debounce
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const handleSearch = debounce(() => {
  pagination.value.page = 1;
  fetchPosts();
}, 500);

const changePage = (newPage) => {
  if (newPage < 1 || newPage > pagination.value.pages) return;
  pagination.value.page = newPage;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  fetchPosts();
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).format('MMM D, YYYY');
};

const formatCategory = (cat) => {
  return cat.charAt(0) + cat.slice(1).toLowerCase();
};

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

// Simple debounce implementation if lodash not available
function manualDebounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Watchers
watch(activeCategory, () => {
  pagination.value.page = 1;
  fetchPosts();
});

onMounted(() => {
  fetchPosts();
});
</script>
