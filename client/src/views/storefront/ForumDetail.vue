<template>
  <div class="min-h-screen bg-cream-100 dark:bg-green-950">
    <!-- Back Button -->
    <div class="bg-white dark:bg-green-900 border-b border-green-200 dark:border-green-800">
      <div class="container mx-auto px-4 py-4">
        <router-link
          to="/forum"
          class="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-brand-orange transition-colors"
        >
          <PhArrowLeft :size="20" />
          <span class="font-medium">Kembali ke Forum</span>
        </router-link>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-20">
      <div class="flex items-center justify-center">
        <PhSpinner :size="48" class="animate-spin text-brand-orange" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-20">
      <div class="text-center">
        <PhWarning :size="64" class="mx-auto text-red-500 mb-4" />
        <h2 class="text-2xl font-bold text-green-800 dark:text-white mb-2">
          Topik Tidak Ditemukan
        </h2>
        <p class="text-green-600 dark:text-green-400">{{ error }}</p>
      </div>
    </div>

    <!-- Topic Content -->
    <div v-else class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Topic Card -->
      <article class="bg-white dark:bg-green-900/40 rounded-xl border border-green-200 dark:border-green-700 overflow-hidden mb-8">
        <!-- Featured Image -->
        <div v-if="topic.image" class="aspect-video overflow-hidden">
          <img
            :src="topic.image"
            :alt="topic.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Content -->
        <div class="p-6 md:p-8">
          <!-- Category Badge -->
          <span class="inline-block px-3 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full mb-4">
            {{ topic.category }}
          </span>

          <!-- Title -->
          <h1 class="text-3xl md:text-4xl font-bold text-green-800 dark:text-white mb-4">
            {{ topic.title }}
          </h1>

          <!-- Meta Info -->
          <div class="flex items-center gap-4 text-sm text-green-600 dark:text-green-400 mb-6 pb-6 border-b border-green-200 dark:border-green-700">
            <span class="flex items-center gap-1">
              <PhEye :size="18" />
              {{ topic.viewCount }} views
            </span>
            <span class="flex items-center gap-1">
              <PhHeart :size="18" />
              {{ topic.likeCount }} likes
            </span>
            <span class="flex items-center gap-1">
              <PhChatCircleDots :size="18" />
              {{ topic._count?.comments || 0 }} komentar
            </span>
          </div>

          <!-- Topic Content -->
          <div 
            class="prose prose-green dark:prose-invert max-w-none text-green-900 dark:text-gray-200"
            v-html="topic.content"
          ></div>

          <!-- Like Button -->
          <div class="mt-8 pt-6 border-t border-green-200 dark:border-green-700">
            <button
              @click="handleLike"
              :disabled="liking"
              class="inline-flex items-center gap-2 px-6 py-3 bg-cream-100 dark:bg-green-800 hover:bg-green-100 dark:hover:bg-green-700 text-green-800 dark:text-white font-semibold rounded-lg transition-all duration-300"
              :class="{ 'opacity-50 cursor-not-allowed': liking }"
            >
              <PhHeart :size="20" :weight="liked ? 'fill' : 'regular'" class="text-red-500" />
              {{ liked ? 'Liked!' : 'Suka topik ini' }}
            </button>
          </div>
        </div>
      </article>

      <!-- Comments Section -->
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-green-800 dark:text-white flex items-center gap-2">
          <PhChatsCircle :size="28" class="text-brand-orange" />
          Komentar ({{ topic.comments?.length || 0 }})
        </h2>

        <!-- Comments List -->
        <div v-if="topic.comments && topic.comments.length > 0" class="space-y-4">
          <div
            v-for="comment in topic.comments"
            :key="comment.id"
            class="bg-white dark:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-700 p-6"
          >
            <!-- Comment Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                  {{ getInitials(comment.authorName) }}
                </div>
                <div>
                  <p class="font-semibold text-green-800 dark:text-white">
                    {{ comment.authorName }}
                  </p>
                  <p class="text-xs text-green-600 dark:text-green-400">
                    {{ formatDate(comment.createdAt) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Comment Content (Rich HTML) -->
            <div
              class="prose prose-sm prose-green dark:prose-invert max-w-none text-green-900 dark:text-gray-200"
              v-html="comment.contentHtml"
            ></div>
          </div>
        </div>

        <!-- No Comments -->
        <div v-else class="text-center py-12 bg-white dark:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-700">
          <PhChatCenteredDots :size="64" class="mx-auto text-green-300 dark:text-green-700 mb-4" />
          <p class="text-green-600 dark:text-green-400">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        </div>

        <!-- Comment Form -->
        <PublicCommentForm
          :topic-id="topicId"
          @comment-added="onCommentAdded"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  PhArrowLeft,
  PhSpinner,
  PhWarning,
  PhEye,
  PhHeart,
  PhChatCircleDots,
  PhChatsCircle,
  PhChatCenteredDots
} from '@phosphor-icons/vue';
import PublicCommentForm from '@/components/forum/PublicCommentForm.vue';
import forumService from '@/api/services/forum.service';

const route = useRoute();
const topicId = computed(() => route.params.id);

const topic = ref(null);
const loading = ref(true);
const error = ref(null);
const liking = ref(false);
const liked = ref(false);

const fetchTopic = async () => {
  try {
    loading.value = true;
    error.value = null;

    const { data } = await forumService.getTopicById(topicId.value);
    
    if (data.success) {
      topic.value = data.data;
    }
  } catch (err) {
    console.error('Error fetching topic:', err);
    error.value = err.response?.data?.message || 'Gagal memuat topik';
  } finally {
    loading.value = false;
  }
};

const handleLike = async () => {
  if (liking.value || liked.value) return;

  try {
    liking.value = true;
    const { data } = await forumService.likeTopic(topicId.value);
    
    if (data.success) {
      topic.value.likeCount = data.data.likeCount;
      liked.value = true;
    }
  } catch (err) {
    console.error('Error liking topic:', err);
  } finally {
    liking.value = false;
  }
};

const onCommentAdded = (newComment) => {
  // Add new comment to list (if auto-approved)
  if (newComment.isApproved) {
    if (!topic.value.comments) {
      topic.value.comments = [];
    }
    topic.value.comments.unshift(newComment);
    
    // Update count
    if (topic.value._count) {
      topic.value._count.comments = (topic.value._count.comments || 0) + 1;
    }
  }
};

const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `${diffMins} menit yang lalu`;
  } else if (diffHours < 24) {
    return `${diffHours} jam yang lalu`;
  } else if (diffDays < 7) {
    return `${diffDays} hari yang lalu`;
  } else {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

onMounted(() => {
  fetchTopic();
});
</script>

<style scoped>
/* Prose styling for content */
:deep(.prose) {
  line-height: 1.625;
}

:deep(.prose p) {
  margin-bottom: 1rem;
}

:deep(.prose strong) {
  font-weight: 700;
  color: var(--color-green-900);
}

.dark :deep(.prose strong) {
  color: white;
}

:deep(.prose em) {
  font-style: italic;
}

:deep(.prose ul),
:deep(.prose ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

:deep(.prose li) {
  margin-bottom: 0.5rem;
}

:deep(.prose a) {
  color: #FF6600; /* brand-orange */
  text-decoration: none;
}

:deep(.prose a:hover) {
  text-decoration: underline;
}
</style>
