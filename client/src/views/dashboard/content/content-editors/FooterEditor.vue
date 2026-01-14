<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-green-800 dark:text-green-100">
        Footer Configuration
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Brand Name -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Brand Name
        </label>
        <input
          v-model="localContent.brandName"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Brand Logo -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Brand Logo URL
        </label>
        <input
          v-model="localContent.brandLogo"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Description -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Deskripsi
        </label>
        <RichTextEditor
          v-model="localContent.description"
          placeholder="Deskripsi footer..."
        />
      </div>

      <!-- Copyright -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Copyright Text
        </label>
        <input
          v-model="localContent.copyright"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>
    </div>

    <!-- Contact Info -->
    <div>
      <h3 class="text-sm font-medium text-green-700 dark:text-green-300 mb-3">Informasi Kontak</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs text-green-600 dark:text-green-400 mb-1">Alamat</label>
          <input
            v-model="localContent.contact.address"
            type="text"
            class="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            @input="emitUpdate"
          />
        </div>
        <div>
          <label class="block text-xs text-green-600 dark:text-green-400 mb-1">Email</label>
          <input
            v-model="localContent.contact.email"
            type="email"
            class="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            @input="emitUpdate"
          />
        </div>
        <div>
          <label class="block text-xs text-green-600 dark:text-green-400 mb-1">Telepon</label>
          <input
            v-model="localContent.contact.phone"
            type="text"
            class="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            @input="emitUpdate"
          />
        </div>
      </div>
    </div>

    <!-- Social Media -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium text-green-700 dark:text-green-300">Social Media</h3>
        <button
          @click="addSocialMedia"
          class="px-3 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          + Tambah
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="(social, index) in localContent.socialMedia"
          :key="index"
          class="flex items-center gap-2 p-3 bg-cream-50 dark:bg-green-900/30 rounded-lg"
        >
          <select
            v-model="social.platform"
            class="px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            @change="emitUpdate"
          >
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter/X</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          <input
            v-model="social.link"
            type="text"
            placeholder="URL"
            class="flex-1 px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            @input="emitUpdate"
          />
          <button
            @click="removeSocialMedia(index)"
            class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <PhTrash :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Footer Columns -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium text-green-700 dark:text-green-300">Kolom Link Footer</h3>
        <button
          @click="addColumn"
          class="px-3 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          + Tambah Kolom
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(column, colIndex) in localContent.columns"
          :key="colIndex"
          class="p-4 bg-cream-50 dark:bg-green-900/30 rounded-lg"
        >
          <div class="flex items-center justify-between mb-3">
            <input
              v-model="column.title"
              type="text"
              placeholder="Judul Kolom"
              class="flex-1 px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              @input="emitUpdate"
            />
            <button
              @click="removeColumn(colIndex)"
              class="ml-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <PhTrash :size="18" />
            </button>
          </div>
          <div class="space-y-2">
            <div
              v-for="(link, linkIndex) in column.links"
              :key="linkIndex"
              class="flex items-center gap-2"
            >
              <input
                v-model="link.label"
                type="text"
                placeholder="Label"
                class="flex-1 px-2 py-1 border border-green-300 dark:border-green-600 rounded bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                @input="emitUpdate"
              />
              <input
                v-model="link.link"
                type="text"
                placeholder="Link"
                class="flex-1 px-2 py-1 border border-green-300 dark:border-green-600 rounded bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                @input="emitUpdate"
              />
              <button
                @click="removeLink(colIndex, linkIndex)"
                class="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
              >
                <PhX :size="14" />
              </button>
            </div>
            <button
              @click="addLink(colIndex)"
              class="text-sm text-orange-500 hover:text-orange-600"
            >
              + Tambah Link
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { PhTrash, PhX, PhFacebookLogo, PhInstagramLogo, PhTwitterLogo, PhYoutubeLogo, PhTiktokLogo, PhWhatsappLogo } from '@phosphor-icons/vue'
import RichTextEditor from '@/components/molecules/RichTextEditor.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'update'])

const localContent = reactive({
  brandName: '',
  brandLogo: '',
  description: '',
  columns: [],
  contact: {
    address: '',
    email: '',
    phone: ''
  },
  socialMedia: [],
  copyright: ''
})

const emitUpdate = () => {
  emit('update:modelValue', { ...localContent })
  emit('update')
}

const addSocialMedia = () => {
  localContent.socialMedia.push({
    platform: 'instagram',
    link: ''
  })
  emitUpdate()
}

const removeSocialMedia = (index) => {
  localContent.socialMedia.splice(index, 1)
  emitUpdate()
}

const addColumn = () => {
  localContent.columns.push({
    title: 'New Column',
    links: [{ label: 'Link', link: '/' }]
  })
  emitUpdate()
}

const removeColumn = (index) => {
  localContent.columns.splice(index, 1)
  emitUpdate()
}

const addLink = (colIndex) => {
  localContent.columns[colIndex].links.push({ label: '', link: '' })
  emitUpdate()
}

const removeLink = (colIndex, linkIndex) => {
  localContent.columns[colIndex].links.splice(linkIndex, 1)
  emitUpdate()
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    Object.assign(localContent, {
      ...newVal,
      columns: newVal.columns ? JSON.parse(JSON.stringify(newVal.columns)) : [],
      socialMedia: newVal.socialMedia ? [...newVal.socialMedia] : [],
      contact: newVal.contact || { address: '', email: '', phone: '' }
    })
  }
}, { immediate: true, deep: true })
</script>
