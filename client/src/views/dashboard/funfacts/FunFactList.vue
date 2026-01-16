<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-text-green dark:text-white">Fun Facts</h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">Trivia dan fakta menarik tentang kopi</p>
      </div>
      <router-link
        to="/dashboard/funfacts/create"
        class="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium"
      >
        <PhPlus :size="20" weight="bold" />
        <span>Tambah Fun Fact</span>
      </router-link>
    </div>

    <!-- Fun Facts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="fact in funfacts"
        :key="fact.id"
        class="bg-white dark:bg-green-900/40 rounded-lg overflow-hidden border border-green-200 dark:border-green-800 hover:border-brand-orange transition-all"
      >
        <div v-if="fact.image" class="h-48 bg-brand-bg dark:bg-green-800/50">
          <img :src="fact.image" :alt="fact.title" class="w-full h-full object-cover" />
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-1 bg-cream-200 dark:bg-green-800 text-green-600 dark:text-white text-xs rounded-lg font-medium">
              {{ fact.category }}
            </span>
            <span
              :class="[
                'px-2 py-1 text-xs rounded-lg font-medium',
                fact.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-800/50 dark:text-green-300' : 'bg-gray-100 text-gray-700'
              ]"
            >
              {{ fact.isPublished ? 'Published' : 'Draft' }}
            </span>
          </div>
          <h3 class="font-bold text-green-800 dark:text-white mb-2 text-lg">{{ fact.title }}</h3>
          <p class="text-sm text-green-500 dark:text-gray-400 mb-3 line-clamp-2">{{ fact.content }}</p>
          <div class="flex items-center gap-4 mb-4 text-sm text-green-600 dark:text-gray-400">
            <span class="flex items-center gap-1">
              <PhEye :size="16" />
              {{ fact.viewCount }}
            </span>
            <span class="flex items-center gap-1">
              <PhChatCircle :size="16" />
              {{ fact._count?.comments || 0 }}
            </span>
          </div>
          <div class="flex gap-2">
            <router-link
              :to="`/dashboard/funfacts/${fact.id}/edit`"
              class="flex-1 py-2 flex items-center justify-center gap-2 bg-cream-100 hover:bg-cream-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-white rounded-lg text-sm transition-colors font-medium"
            >
              <PhPencilSimple :size="16" />
              Kelola / Moderasi
            </router-link>
            <button
              @click="deleteFunFact(fact.id)"
              class="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-sm"
            >
              <PhTrash :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="funfacts.length === 0" class="text-center py-16">
      <PhLightbulb :size="64" weight="duotone" class="mx-auto text-green-200 dark:text-green-800/50 mb-4" />
      <p class="text-green-500 dark:text-gray-400 font-medium">Belum ada fun fact. Buat fun fact pertama!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PhPlus, PhEye, PhChatCircle, PhPencilSimple, PhTrash, PhLightbulb } from '@phosphor-icons/vue'
import funfactService from '@/api/services/funfact.service'
import { useConfirm } from '@/composables/useConfirm'
import { showToast } from '@/utils/toast'

const funfacts = ref([])
const loading = ref(false)

const { confirm } = useConfirm()

const fetchFunFacts = async () => {
  loading.value = true
  try {
    const response = await funfactService.getAll()
    funfacts.value = response.data.data || []
  } catch (err) {
    console.error('Error fetching fun facts:', err)
  } finally {
    loading.value = false
  }
}

const deleteFunFact = async (id) => {
  const confirmed = await confirm({
    title: 'Hapus Fun Fact?',
    message: 'Fun fact akan dihapus permanen',
    variant: 'danger',
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal'
  })
  
  if (!confirmed) return
  
  const loadingToast = showToast.loading('Menghapus fun fact...')
  
  try {
    await funfactService.delete(id)
    funfacts.value = funfacts.value.filter(f => f.id !== id)
    showToast.success('Berhasil!', 'Fun fact telah dihapus')
  } catch (err) {
    showToast.error('Gagal!', 'Tidak dapat menghapus fun fact')
    console.error('Error deleting fun fact:', err)
  } finally {
    loadingToast.dismiss()
  }
}

onMounted(() => {
  fetchFunFacts()
})
</script>
