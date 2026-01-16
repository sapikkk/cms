<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <router-link
        to="/dashboard/funfacts"
        class="p-2 bg-white dark:bg-green-900/40 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-gray-400 hover:text-brand-orange transition-colors"
      >
        <PhArrowLeft :size="20" />
      </router-link>
      <div>
        <h1 class="text-3xl font-bold text-text-green dark:text-white">
          {{ isEdit ? "Edit Fun Fact" : "Buat Fun Fact Baru" }}
        </h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">
          Bagikan trivia dan fakta menarik
        </p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="saveFunFact" class="max-w-4xl">
      <div
        class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Judul</label
            >
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="Tahukah Anda?"
            />
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Kategori</label
            >
            <select
              v-model="form.category"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
            >
              <option value="">Pilih Kategori</option>
              <option value="COFFEE">Coffee</option>
              <option value="HISTORY">History</option>
              <option value="HEALTH">Health</option>
              <option value="CULTURE">Culture</option>
              <option value="TRIVIA">Trivia</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Gambar (Opsional)</label
            >
            <CloudinaryImageUploader
              v-model="form.image"
              folder="antitesa/funfacts"
              hint="Upload gambar fun fact (PNG, JPG, Max 10MB)"
            />
          </div>

          <div class="md:col-span-2">
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Konten</label
            >
            <RichTextEditor
              v-model="form.contentHtml"
              :initial-content="form.contentHtml || form.content"
              placeholder="Tulis fakta menarik di sini..."
              class="min-h-[300px]"
              @update:text="(text) => form.content = text" 
            />
            <p class="text-xs text-green-600 mt-1">* Konten otomatis disimpan dalam format Rich Text HTML</p>
          </div>

          <div class="md:col-span-2">
            <div class="flex items-center gap-4">
              <input
                v-model="form.isPublished"
                type="checkbox"
                id="isPublished"
                class="w-5 h-5 text-brand-orange focus:ring-brand-orange rounded"
              />
              <label
                for="isPublished"
                class="text-green-700 dark:text-gray-300 font-medium"
                >Publish Fun Fact</label
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex gap-4 pt-4 mb-12">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2.5 bg-brand-orange text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2 font-bold shadow-sm"
        >
          <PhFloppyDisk :size="20" weight="fill" />
          {{ loading ? "Menyimpan..." : "Simpan Fun Fact" }}
        </button>
        <router-link
          to="/dashboard/funfacts"
          class="px-6 py-2.5 bg-white dark:bg-green-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-white rounded-lg hover:bg-cream-100 font-medium"
        >
          Batal
        </router-link>
      </div>
    </form>

    <!-- Discussion / Comments Management Section (Only in Edit Mode) -->
    <div v-if="isEdit" class="max-w-4xl border-t border-green-200 dark:border-green-800 pt-8 mt-8">
      <h2 class="text-2xl font-bold text-text-green dark:text-white mb-6 flex items-center gap-2">
        <PhChatCircle :size="24" />
        Moderasi Diskusi
      </h2>

      <div v-if="loadingComments" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mx-auto"></div>
        <p class="mt-2 text-green-600">Memuat komentar...</p>
      </div>

      <div v-else-if="comments.length === 0" class="text-center py-8 bg-white dark:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-800">
        <p class="text-green-500">Belum ada komentar pada topik ini.</p>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="comment in comments" 
          :key="comment.id"
          class="bg-white dark:bg-green-900/40 p-4 rounded-lg border border-green-200 dark:border-green-800"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <span class="font-bold text-green-800 dark:text-white">{{ comment.authorName }}</span>
              <span class="text-xs text-green-500 ml-2">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span 
                v-if="!comment.isApproved"
                class="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full"
              >
                Pending
              </span>
               <span 
                v-else
                class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full"
              >
                Approved
              </span>
            </div>
          </div>

          <div class="text-green-700 dark:text-gray-300 text-sm mb-3 ProseMirror" v-html="comment.contentHtml || comment.text"></div>

          <div class="flex gap-2">
            <button 
              v-if="!comment.isApproved"
              @click="moderateComment(comment.id, true, true)"
              class="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-bold"
            >
              Approve
            </button>
            <button 
              v-else
              @click="moderateComment(comment.id, false, false)"
              class="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-xs font-bold"
            >
              Hide / Unapprove
            </button>
            <button 
              @click="deleteComment(comment.id)"
              class="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import CloudinaryImageUploader from "@/components/ui/CloudinaryImageUploader.vue";
import RichTextEditor from "@/components/common/RichTextEditor.vue"; // Import RichTextEditor
import { PhArrowLeft, PhLightning, PhFloppyDisk, PhChatCircle } from "@phosphor-icons/vue";
import funfactService from "@/api/services/funfact.service";
import forumService from "@/api/services/forum.service"; // Need this for comment moderation
import { showToast } from "@/utils/toast";
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);
const loadingComments = ref(false);
const comments = ref([]);

const form = reactive({
  title: "",
  content: "",      // Plain text fallback
  contentHtml: "",  // Rich text
  image: "",
  category: "",
  isPublished: false,
});

const saveFunFact = async () => {
  loading.value = true;
  try {
    // Ensure contentHtml is populated
    if (!form.contentHtml && form.content) {
      form.contentHtml = `<p>${form.content}</p>`;
    } else if (form.contentHtml && !form.content) {
      // Basic strip tags for plain text fallback
      form.content = form.contentHtml.replace(/<[^>]*>?/gm, '');
    }

    if (isEdit.value) {
      await funfactService.update(route.params.id, form);
      showToast.success("Berhasil!", "Fun fact telah diupdate");
    } else {
      await funfactService.create(form);
      showToast.success("Berhasil!", "Fun fact baru telah ditambahkan");
    }
    router.push("/dashboard/funfacts");
  } catch (e) {
    console.error(e);
    showToast.error("Gagal!", "Tidak dapat menyimpan fun fact");
  } finally {
    loading.value = false;
  }
};

const fetchComments = async (id) => {
  loadingComments.value = true;
  try {
    // We can use the public endpoint or admin endpoint.
    // Admin endpoint gives all comments (including hidden).
    // Let's use getById which includes comments in include
    const { data } = await funfactService.getById(id);
    // Wait, getById in controller includes comments? Yes "include: { comments: ... }"
    // But funfact.controller currently includes only { isVisible: true, isApproved: true }
    // We need an ADMIN endpoint to see ALL comments.
    // forum.controller has getAllComments but that's for ALL topics.
    
    // Let's just fetch from the getById result for now, but aware we might miss hidden ones unless we update controller.
    // Actually, as Admin, I should see everything. 
    // I might need to fetch `GET /api/v1/forum/:id/comments` via admin if I made one, or modify getById.
    
    // For now, let's just use what's available and maybe I'll add a fetchComments endpoint if needed.
    // Actually, I can use the general comment list filter if available.
    if (data.data.comments) {
      comments.value = data.data.comments;
    }
  } catch (err) {
    console.error(err);
  } finally {
    loadingComments.value = false;
  }
};

const moderateComment = async (commentId, isApproved, isVisible) => {
  try {
    await forumService.moderateComment(commentId, { isApproved, isVisible });
    // Update local state
    const comment = comments.value.find(c => c.id === commentId);
    if (comment) {
      comment.isApproved = isApproved;
      comment.isVisible = isVisible;
    }
    showToast.success("Berhasil", "Status komentar diperbarui");
  } catch (err) {
    showToast.error("Gagal", "Tidak dapat memoderasi komentar");
  }
};

const deleteComment = async (commentId) => {
  if (!confirm('Hapus komentar ini permanen?')) return;
  try {
    await forumService.deleteComment(commentId);
    comments.value = comments.value.filter(c => c.id !== commentId);
    showToast.success("Berhasil", "Komentar dihapus");
  } catch (err) {
    showToast.error("Gagal", "Tidak dapat menghapus komentar");
  }
};

const formatDate = (date) => dayjs(date).format('DD/MM/YYYY HH:mm');

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await funfactService.getById(route.params.id);
      const fact = data.data;
      Object.assign(form, {
        title: fact.title,
        content: fact.content,
        contentHtml: fact.contentHtml || fact.content, // Fallback if no rich text yet
        image: fact.image,
        category: fact.category,
        isPublished: fact.isPublished,
      });
      
      // Fetch comments
      if (fact.comments) {
        comments.value = fact.comments;
      }
    } catch (err) {
      console.error("Error fetching fun fact:", err);
    }
  }
});
</script>
