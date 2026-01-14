<template>
  <div class="rich-text-editor border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition-shadow">
    <!-- Toolbar -->
    <div v-if="editor" class="flex items-center gap-1 p-2 border-b border-green-200 dark:border-green-800 bg-cream-50 dark:bg-green-900/30 overflow-x-auto">
      
      <!-- Basic Formatting -->
      <button 
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'bg-green-200 dark:bg-green-700': editor.isActive('bold') }"
        class="p-1.5 rounded hover:bg-green-100 dark:hover:bg-green-800 text-green-800 dark:text-green-100 transition-colors"
        title="Bold (Ctrl+B)"
      >
        <strong class="font-bold">B</strong>
      </button>
      
      <button 
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'bg-green-200 dark:bg-green-700': editor.isActive('italic') }"
        class="p-1.5 rounded hover:bg-green-100 dark:hover:bg-green-800 text-green-800 dark:text-green-100 transition-colors"
        title="Italic (Ctrl+I)"
      >
        <em class="italic">I</em>
      </button>

      <div class="w-px h-5 bg-green-300 dark:bg-green-700 mx-1"></div>

      <!-- Colors -->
      <button 
        @click="setColor('text-orange-500')"
        :class="{ 'ring-2 ring-offset-1 ring-orange-500': editor.isActive('brandColor', { class: 'text-orange-500' }) }"
        class="w-6 h-6 rounded-full bg-orange-500 hover:scale-110 transition-transform"
        title="Orange Brand"
      ></button>
      
      <button 
        @click="setColor('text-green-500')"
        :class="{ 'ring-2 ring-offset-1 ring-green-500': editor.isActive('brandColor', { class: 'text-green-500' }) }"
        class="w-6 h-6 rounded-full bg-green-500 hover:scale-110 transition-transform"
        title="Green Brand"
      ></button>

       <button 
        @click="setColor(null)"
        class="p-1.5 text-xs rounded hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
        title="Clear Color"
      >
        Reset
      </button>

    </div>

    <!-- Editor Content -->
    <editor-content :editor="editor" class="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[100px] outline-none" />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Mark, mergeAttributes } from '@tiptap/core'
import { watch, onBeforeUnmount } from 'vue'

// Custom Mark for Brand Colors
const BrandColor = Mark.create({
  name: 'brandColor',
  
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) {
            return {}
          }
          return {
            class: attributes.class,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: element => element.hasAttribute('class') && element.getAttribute('class').includes('text-') ? {} : false,
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0]
  },
})

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Type something...'
  }
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: false, // Disable headings for now to keep it simple textual
    }),
    BrandColor
  ],
  editorProps: {
    attributes: {
      class: 'focus:outline-none min-h-[4rem]',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  if (editor.value && newVal !== editor.value.getHTML()) {
    editor.value.commands.setContent(newVal, false)
  }
})

const setColor = (className) => {
  if (!className) {
    editor.value.chain().focus().unsetMark('brandColor').run()
    return
  }
  // Toggle the mark
  if (editor.value.isActive('brandColor', { class: className })) {
    editor.value.chain().focus().unsetMark('brandColor').run()
  } else {
    editor.value.chain().focus().setMark('brandColor', { class: className }).run()
  }
}

onBeforeUnmount(() => {
  editor.value.destroy()
})
</script>

<style>
/* Scoped styles for the editor content if needed */
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
