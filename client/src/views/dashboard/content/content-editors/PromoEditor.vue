<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-green-800 dark:text-green-100">
        Promo Section
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Judul Promo
        </label>
        <RichTextEditor
          v-model="localContent.title"
          placeholder="Promo Title"
        />
      </div>

      <!-- Subtitle -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Subtitle
        </label>
        <RichTextEditor
          v-model="localContent.subtitle"
          placeholder="Description"
        />
      </div>

      <!-- Banner Image -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Banner Image URL
        </label>
        <input
          v-model="localContent.bannerImage"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Promo Code -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Kode Promo
        </label>
        <input
          v-model="localContent.promoCode"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 font-mono focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Valid Until -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Berlaku Sampai
        </label>
        <input
          v-model="localContent.validUntil"
          type="date"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- CTA Button -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          CTA Button Text
        </label>
        <input
          v-model="localContent.ctaButton.text"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          CTA Button Link
        </label>
        <input
          v-model="localContent.ctaButton.link"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>
    </div>

    <!-- Active Toggle -->
    <label class="flex items-center gap-2 px-4 py-2 bg-cream-100 dark:bg-green-700 rounded-lg cursor-pointer w-fit">
      <input
        v-model="localContent.isActive"
        type="checkbox"
        class="rounded text-orange-500 focus:ring-orange-500"
        @change="emitUpdate"
      />
      <span class="text-sm text-green-700 dark:text-green-300">Promo Aktif</span>
    </label>

    <!-- Preview -->
    <div class="p-4 bg-cream-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
      <h3 class="text-sm font-medium text-green-700 dark:text-green-300 mb-3">Preview Promo Banner</h3>
      <div 
        class="relative rounded-lg overflow-hidden h-32 flex items-center justify-center"
        :style="{ 
          backgroundImage: localContent.bannerImage ? `url(${localContent.bannerImage})` : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }"
      >
        <div class="absolute inset-0 bg-black/30"></div>
        <div class="relative z-10 text-center text-white">
          <h3 class="text-xl font-bold">{{ localContent.title || 'Promo Title' }}</h3>
          <p class="text-sm opacity-90">{{ localContent.subtitle }}</p>
          <div v-if="localContent.promoCode" class="mt-2 inline-block px-3 py-1 bg-white/20 rounded font-mono text-sm">
            {{ localContent.promoCode }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import RichTextEditor from '@/components/molecules/RichTextEditor.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'update'])

const localContent = reactive({
  title: '',
  subtitle: '',
  bannerImage: '',
  promoCode: '',
  validUntil: '',
  ctaButton: {
    text: '',
    link: ''
  },
  isActive: true
})

const emitUpdate = () => {
  emit('update:modelValue', { ...localContent })
  emit('update')
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    Object.assign(localContent, {
      ...newVal,
      ctaButton: newVal.ctaButton || { text: '', link: '' }
    })
  }
}, { immediate: true, deep: true })
</script>
