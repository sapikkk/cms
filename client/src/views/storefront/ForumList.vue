<template>
  <div class="min-h-screen bg-cream-100 dark:bg-green-950">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-green-800 to-green-600 dark:from-green-950 dark:to-green-900 text-white py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/20 mb-6">
            <PhChatsCircle :size="40" class="text-orange-500" />
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Forum Diskusi
          </h1>
          <p class="text-xl text-cream-200">
            Berbagi pengetahuan dan pengalaman seputar kopi. Diskusi terbuka untuk semua!
          </p>
        </div>
      </div>
    </section>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <PhSpinner :size="48" class="animate-spin text-brand-orange" />
      </div>

      <!-- Topics List -->
      <div v-else-if="topics.length > 0" class="max-w-4xl mx-auto space-y-4">
        <router-link
          v-for="topic in topics"
          :key="topic.id"
          :to="`/forum/${topic.id}`"
          class="block bg-white dark:bg-green-900/40 rounded-xl border border-green-200 dark:border-green-700 p-6 hover:border-brand-orange dark:hover:border-brand-orange transition-all duration-300 hover:shadow-lg group"
        >
          <div class="flex items-start gap-4">
            <!-- Icon/Image -->
            <div class="flex-shrink-0">
              <div
                v-if="topic.image"
                class="w-20 h-20 rounded-lg overflow-hidden"
              >
                <img
                  :src="topic.image"
                  :alt="topic.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-20 h-20 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
              >
                <PhChatCircleDots :size="32" class="text-white" />
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <!-- Category Badge -->
              <span class="inline-block px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs font-semibold rounded mb-2">
                {{ topic.category }}
              </span>

              <!-- Title -->
              <h2 class="text-xl font-bold text-green-800 dark:text-white mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">
                {{ topic.title }}
              </h2>

              <!-- Excerpt -->
              <p class="text-green-600 dark:text-green-400 text-sm mb-4 line-clamp-2">
                {{ getExcerpt(topic.content) }}
              </p>

              <!-- Meta Info -->
              <div class="flex items-center gap-4 text-xs text-green-500 dark:text-green-500">
                <span class="flex items-center gap-1">
                  <PhEye :size="16" />
                  {{ topic.viewCount }}
                </span>
                <span class="flex items-center gap-1">
                  <PhHeart :size="16" />
                  {{ topic.likeCount }}
                </span>
                <span class="flex items-center gap-1">
                  <PhChatCircleDots :size="16" />
                  {{ topic._count?.comments || 0 }} komentar
                </span>
                <span class="ml-auto text-green-400 dark:text-green-600">
                  {{ formatDate(topic.publishedAt || topic.createdAt) }}
                </span>
              </div>
            </div>

            <!-- Arrow Icon -->
            <div class="flex-shrink-0">
              <PhArrowRight
                :size="24"
                class="text-green-300 dark:text-green-700 group-hover:text-brand-orange group-hover:translate-x-1 transition-all"
              />
            </div>
          </div>
        </router-link>

        <!-- Pagination -->
        <div v-if="pagination.pages > 1" class="flex justify-center gap-2 pt-8">
          <button
            v-for="page in pagination.pages"
            :key="page"
            @click="changePage(page)"
            class="px-4 py-2 rounded-lg font-semibold transition-colors"
            :class="
              page === pagination.page
                ? 'bg-brand-orange text-white'
                : 'bg-white dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800'
            "
          >
            {{ page }}
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="max-w-2xl mx-auto text-center py-20">
        <PhChatCenteredDots :size="80" class="mx-auto text-green-300 dark:text-green-700 mb-6" />
        <h2 class="text-2xl font-bold text-green-800 dark:text-white mb-2">
          Belum Ada Topik Forum
        </h2>
        <p class="text-green-600 dark:text-green-400">
          Topik diskusi akan muncul di sini.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  PhChatsCircle,
  PhSpinner,
  PhChatCircleDots,
  PhChatCenteredDots,
  PhEye,
  PhHeart,
  PhArrowRight
} from '@phosphor-icons/vue';
import forumService from '@/api/services/forum.service';

const topics = ref([]);
const loading = ref(true);
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  pages: 1
});

const fetchTopics = async (page = 1) => {
  try {
    loading.value = true;

    const { data } = await forumService.getAllTopics({
      page,
      limit: pagination.value.limit,
      sortBy: 'publishedAt',
      order: 'desc'
    });

    if (data.success) {
      topics.value = data.data;
      pagination.value = data.pagination;
    }
  } catch (error) {
    console.error('Error fetching topics:', error);
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  fetchTopics(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const getExcerpt = (html) => {
  // Strip HTML tags and get first 150 characters
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  return text.length > 150 ? text.substring(0, 150) + '...' : text;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(() => {
  fetchTopics();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
