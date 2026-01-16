<template>
  <div class="rich-text-editor">
    <label v-if="label" class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="border border-green-300 dark:border-green-700 rounded-lg overflow-hidden bg-white dark:bg-green-950">
      <QuillEditor
        :content="editorContent"
        :content-type="contentType"
        :toolbar="toolbarOptions"
        :placeholder="placeholder"
        theme="snow"
        @update:content="onContentChange"
        class="min-h-[200px]"
      />
    </div>
    
    <p v-if="hint" class="text-xs text-green-600 dark:text-gray-400 mt-1">
      {{ hint }}
    </p>
    
    <p v-if="error" class="text-xs text-red-500 mt-1">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Tulis sesuatu...'
  },
  hint: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  contentType: {
    type: String,
    default: 'html' // 'html' or 'text'
  },
  minLength: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update:modelValue', 'update:text']);

const editorContent = ref(props.modelValue);

// Toolbar configuration (simple and user-friendly)
const toolbarOptions = [
  ['bold', 'italic', 'underline'],        // Text formatting
  [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Lists
  ['link'],                                // Links
  ['clean']                                // Remove formatting
];

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== editorContent.value) {
    editorContent.value = newValue;
  }
});

// Handle content changes
const onContentChange = (content) => {
  // Update internal state
  editorContent.value = content;
  
  emit('update:modelValue', content);
  
  // Extract text for validation
  const div = document.createElement('div');
  div.innerHTML = content;
  const text = div.textContent || div.innerText || '';
  emit('update:text', text);
};

// Computed for validation
const plainText = computed(() => {
  const div = document.createElement('div');
  div.innerHTML = editorContent.value;
  return div.textContent || div.innerText || '';
});
</script>

<style scoped>
/* Quill editor custom styling for dark mode */
:deep(.ql-toolbar) {
  background-color: rgb(var(--color-cream-100));
  border-bottom: 1px solid rgb(var(--color-green-300));
}

:deep(.dark .ql-toolbar) {
  background-color: rgb(var(--color-green-900));
  border-bottom: 1px solid rgb(var(--color-green-700));
}

:deep(.ql-container) {
  background-color: white;
  color: rgb(var(--color-green-900));
  font-size: 14px;
}

:deep(.dark .ql-container) {
  background-color: rgb(var(--color-green-950));
  color: white;
}

:deep(.ql-editor) {
  min-height: 150px;
  padding: 12px 15px;
}

:deep(.ql-editor.ql-blank::before) {
  color: rgb(var(--color-green-400));
  font-style: italic;
}

:deep(.dark .ql-editor.ql-blank::before) {
  color: rgb(var(--color-green-500));
}

/* Toolbar button styling */
:deep(.ql-toolbar button),
:deep(.ql-toolbar .ql-picker-label) {
  color: rgb(var(--color-green-700));
}

:deep(.dark .ql-toolbar button),
:deep(.dark .ql-toolbar .ql-picker-label) {
  color: rgb(var(--color-cream-100));
}

:deep(.ql-toolbar button:hover),
:deep(.ql-toolbar button.ql-active) {
  color: rgb(var(--color-brand-orange));
}

:deep(.ql-stroke) {
  stroke: rgb(var(--color-green-700));
}

:deep(.dark .ql-stroke) {
  stroke: rgb(var(--color-cream-100));
}

:deep(.ql-fill) {
  fill: rgb(var(--color-green-700));
}

:deep(.dark .ql-fill) {
  fill: rgb(var(--color-cream-100));
}
</style>
