<template>
  <div class="public-comment-form bg-white dark:bg-green-900/40 rounded-xl border border-green-200 dark:border-green-700 p-6">
    <h3 class="text-xl font-bold text-green-800 dark:text-white mb-4 flex items-center gap-2">
      <PhChatCircleDots :size="24" class="text-brand-orange" />
      Tambah Komentar
    </h3>

    <p class="text-sm text-green-600 dark:text-green-400 mb-6">
      Bagikan pemikiran Anda! Tidak perlu login untuk berkomentar.
    </p>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Name Input -->
      <div>
        <label class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">
          Nama Anda <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.authorName"
          type="text"
          required
          minlength="2"
          maxlength="100"
          placeholder="Masukkan nama Anda"
          class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          :class="{ 'border-red-500': errors.authorName }"
        />
        <p v-if="errors.authorName" class="text-xs text-red-500 mt-1">
          {{ errors.authorName }}
        </p>
      </div>

      <!-- Email Input (Optional) -->
      <div>
        <label class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">
          Email <span class="text-green-500 text-xs">(opsional)</span>
        </label>
        <input
          v-model="form.authorEmail"
          type="email"
          placeholder="email@example.com"
          class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          :class="{ 'border-red-500': errors.authorEmail }"
        />
        <p v-if="errors.authorEmail" class="text-xs text-red-500 mt-1">
          {{ errors.authorEmail }}
        </p>
        <p class="text-xs text-green-600 dark:text-gray-400 mt-1">
          Email tidak akan ditampilkan secara publik
        </p>
      </div>

      <!-- Rich Text Comment -->
      <div>
        <RichTextEditor
          v-model="form.contentHtml"
          label="Komentar"
          placeholder="Tulis komentar Anda di sini..."
          hint="Tulis komentar Anda"
          required
          :error="errors.contentHtml"
          @update:text="form.text = $event"
        />
      </div>

      <!-- Submit Button -->
      <div class="flex items-center justify-between pt-4">
        <p class="text-xs text-green-600 dark:text-gray-400">
          <PhInfo :size="16" class="inline mr-1" />
          Komentar akan ditampilkan setelah disetujui
        </p>
        
        <button
          type="submit"
          :disabled="submitting"
          class="px-6 py-3 bg-brand-orange hover:bg-orange-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
        >
          <PhPaperPlaneTilt v-if="!submitting" :size="20" />
          <PhSpinner v-else :size="20" class="animate-spin" />
          {{ submitting ? 'Mengirim...' : 'Kirim Komentar' }}
        </button>
      </div>
    </form>

    <!-- Success Message -->
    <div
      v-if="showSuccess"
      class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3"
    >
      <PhCheckCircle :size="24" class="text-green-600 dark:text-green-400 flex-shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-semibold text-green-800 dark:text-green-300">
          Komentar berhasil dikirim!
        </p>
        <p class="text-xs text-green-600 dark:text-green-400 mt-1">
          Terima kasih atas kontribusi Anda. Komentar akan muncul setelah moderasi.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import {
  PhChatCircleDots,
  PhPaperPlaneTilt,
  PhSpinner,
  PhInfo,
  PhCheckCircle
} from '@phosphor-icons/vue';
import RichTextEditor from '@/components/common/RichTextEditor.vue';
import forumService from '@/api/services/forum.service';

const props = defineProps({
  topicId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['comment-added']);

const form = reactive({
  authorName: '',
  authorEmail: '',
  text: '',        // Plain text from editor
  contentHtml: ''  // Rich HTML from editor
});

const errors = reactive({
  authorName: '',
  authorEmail: '',
  contentHtml: ''
});

const submitting = ref(false);
const showSuccess = ref(false);

const validateForm = () => {
  let isValid = true;
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '');

  // Validate name
  if (!form.authorName || form.authorName.trim().length < 2) {
    errors.authorName = 'Nama minimal 2 karakter';
    isValid = false;
  } else if (form.authorName.length > 100) {
    errors.authorName = 'Nama maksimal 100 karakter';
    isValid = false;
  }

  // Validate email (if provided)
  if (form.authorEmail && form.authorEmail.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.authorEmail)) {
      errors.authorEmail = 'Format email tidak valid';
      isValid = false;
    }
  }

  // Validate comment
  if (!form.text || form.text.trim().length < 1) {
    errors.contentHtml = 'Komentar wajib diisi';
    isValid = false;
  } else if (form.text.length > 5000) {
    errors.contentHtml = 'Komentar maksimal 5000 karakter';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    submitting.value = true;

    const payload = {
      authorName: form.authorName.trim(),
      authorEmail: form.authorEmail.trim() || null,
      text: form.text.trim(),
      contentHtml: form.contentHtml.trim()
    };

    const { data } = await forumService.addComment(props.topicId, payload);

    if (data.success) {
      // Show success message
      showSuccess.value = true;
      
      // Reset form
      form.authorName = '';
      form.authorEmail = '';
      form.text = '';
      form.contentHtml = '';

      // Emit event to parent
      emit('comment-added', data.data);

      // Hide success message after 5 seconds
      setTimeout(() => {
        showSuccess.value = false;
      }, 5000);
    }
  } catch (error) {
    console.error('Error submitting comment:', error);
    
    if (error.response?.data?.errors) {
      // Handle validation errors from backend
      error.response.data.errors.forEach(err => {
        if (err.path) {
          errors[err.path] = err.msg;
        }
      });
    } else {
      errors.contentHtml = error.response?.data?.message || 'Gagal mengirim komentar. Silakan coba lagi.';
    }
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
/* Add any additional custom styles if needed */
</style>
