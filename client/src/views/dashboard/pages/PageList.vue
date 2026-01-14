<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-text-green dark:text-gray-400">Page Builder</h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">Kelola halaman website dan layout dinamis</p>>
      </div>
      <button
        v-if="isMasterAdmin"
        @click="showCreateModal = true"
        class="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium"
      >
        <PhFilePlus :size="20" weight="bold" />
        <span>Buat Halaman</span>
      </button>
    </div>

    <!-- Pages List -->
    <div class="bg-white dark:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-cream-100 dark:bg-green-900/60">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-bold text-green-700 dark:text-gray-400">Judul</th>
              <th class="px-6 py-4 text-left text-sm font-bold text-green-700 dark:text-gray-400">Slug</th>
              <th class="px-6 py-4 text-center text-sm font-bold text-green-700 dark:text-gray-400">Status</th>
              <th class="px-6 py-4 text-center text-sm font-bold text-green-700 dark:text-gray-400">Navbar</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-green-700 dark:text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-green-800">
            <tr v-for="page in pages" :key="page.id" class="hover:bg-cream-100 dark:hover:bg-green-800/20 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <PhFileText :size="24" class="text-green-400 dark:text-green-600" />
                  <span class="font-bold text-green-800 dark:text-white">{{ page.title }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-green-500 dark:text-gray-400 font-mono text-sm">/{{ page.slug }}</td>
              <td class="px-6 py-4 text-center">
                <button
                  @click="togglePublish(page)"
                  :class="[
                    'px-2 py-1 text-xs rounded-full font-bold cursor-pointer transition-all hover:scale-105',
                    page.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200'
                  ]"
                  :title="page.isPublished ? 'Click to unpublish' : 'Click to publish'"
                >
                  {{ page.isPublished ? '✓ Published' : '○ Draft' }}
                </button>
              </td>
              <td class="px-6 py-4 text-center">
                <button 
                  @click="toggleNavbar(page)"
                  class="p-2 rounded-full hover:bg-cream-200 dark:hover:bg-green-700/50 transition-colors group"
                  :title="page.inNavbar ? 'Sembunyikan dari Navbar' : 'Tampilkan di Navbar'"
                >
                  <PhCheckCircle 
                    :size="20" 
                    :weight="page.inNavbar ? 'fill' : 'duotone'"
                    :class="[
                      'mx-auto transition-colors',
                      page.inNavbar ? 'text-green-500' : 'text-gray-300 dark:text-gray-600 group-hover:text-brand-orange'
                    ]" 
                  />
                </button>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex gap-2 justify-end">
                  <router-link
                    :to="`/dashboard/pages/${page.id}`"
                    class="px-3 py-1.5 flex items-center gap-1.5 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 rounded-lg text-sm transition-colors font-medium"
                  >
                    <PhEye :size="16" />
                    View
                  </router-link>
                  <router-link
                    :to="`/dashboard/pages/${page.id}/builder`"
                    class="px-3 py-1.5 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-sm transition-colors font-medium"
                  >
                    <PhPaintBrush :size="16" />
                    Builder
                  </router-link>
                  <button
                    v-if="isMasterAdmin"
                    @click="deletePage(page.id)"
                    class="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-sm transition-colors"
                  >
                    <PhTrash :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pages.length === 0" class="text-center py-16">
        <PhFiles :size="64" weight="duotone" class="mx-auto text-green-200 dark:text-green-800/50 mb-4" />
        <p class="text-green-500 dark:text-gray-400 font-medium">Belum ada halaman. Buat halaman pertama!</p>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-white rounded-lg p-6 w-full max-w-md shadow-xl border border-green-200 dark:border-green-800 dark:bg-green-900">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-green-800 dark:text-white">Buat Halaman Baru</h2>
          <button @click="showCreateModal = false" class="text-green-400 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-200">
            <PhX :size="24" />
          </button>
        </div>
        
        <form @submit.prevent="createPage">
          <div class="mb-4">
            <label class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">Judul Halaman</label>
            <input
              v-model="newPage.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              placeholder="Contoh: About Us"
            />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">Slug (URL Path)</label>
            <div class="flex items-center">
              <span class="text-green-400 dark:text-white0 mr-2 font-mono">/</span>
              <input
                v-model="newPage.slug"
                type="text"
                required
                class="flex-1 px-4 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                placeholder="about-us"
              />
            </div>
          </div>
          <div class="mb-6">
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="relative">
                <input type="checkbox" v-model="newPage.inNavbar" class="sr-only peer">
                <div class="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-orange/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
              </div>
              <span class="text-sm font-bold text-green-700 dark:text-gray-300 group-hover:text-brand-orange transition-colors">
                Tampilkan di Navbar
              </span>
            </label>
          </div>
          <div class="flex gap-3">
             <button
              type="button"
              @click="showCreateModal = false"
              class="flex-1 py-2.5 bg-cream-200 hover:bg-cream-300 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-white rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              class="flex-1 py-2.5 bg-brand-orange text-white hover:bg-orange-700 rounded-lg font-bold transition-colors"
            >
              Buat Halaman
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { PhFilePlus, PhFileText, PhCheckCircle, PhPaintBrush, PhTrash, PhFiles, PhX, PhEye } from '@phosphor-icons/vue'
import pageService from '@/api/services/page.service'
import { useAuthStore } from '@/stores/auth.store'
import { useConfirm } from '@/composables/useConfirm'
import { showToast } from '@/utils/toast'

const authStore = useAuthStore()
const isMasterAdmin = computed(() => authStore.user?.role === 'MASTER_ADMIN')
const { confirm } = useConfirm()

const pages = ref([])
const showCreateModal = ref(false)
const loading = ref(false)
const newPage = reactive({
  title: '',
  slug: '',
  inNavbar: false
})

const fetchPages = async () => {
  loading.value = true
  try {
    const { data } = await pageService.getAll()
    pages.value = data.data || []
  } catch (err) {
    console.error('Error fetching pages:', err)
  } finally {
    loading.value = false
  }
}

const createPage = async () => {
  const loadingToast = showToast.loading('Membuat halaman...')
  try {
    await pageService.create(newPage)
    await fetchPages()
    showCreateModal.value = false
    newPage.title = ''
    newPage.slug = ''
    newPage.inNavbar = false
    showToast.success('Berhasil!', 'Halaman baru telah dibuat')
  } catch (err) {
    console.error('Error creating page:', err)
    showToast.error('Gagal!', 'Tidak dapat membuat halaman')
  }
}

const deletePage = async (id) => {
  const confirmed = await confirm({
    title: 'Hapus Halaman?',
    message: 'Halaman dan semua kontennya akan dihapus permanen',
    variant: 'danger',
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal'
  })
  
  if (!confirmed) return
  
  const loadingToast = showToast.loading('Menghapus halaman...')
  try {
    await pageService.delete(id)
    pages.value = pages.value.filter(p => p.id !== id)
    showToast.success('Berhasil!', 'Halaman telah dihapus')
  } catch (err) {
    console.error('Error deleting page:', err)
    showToast.error('Gagal!', 'Tidak dapat menghapus halaman')
  }
}

const togglePublish = async (page) => {
  const newStatus = !page.isPublished
  const previousStatus = page.isPublished
  
  // Optimistic UI update
  page.isPublished = newStatus
  
  try {
    if (newStatus) {
      await pageService.publish(page.id)
    } else {
      await pageService.unpublish(page.id)
    }
    showToast.success('Berhasil!', `Halaman ${newStatus ? 'dipublikasi' : 'di-unpublish'}`)
  } catch (err) {
    // Revert on error
    page.isPublished = previousStatus
    console.error('Error toggling publish status:', err)
    showToast.error('Gagal!', `Tidak dapat ${newStatus ? 'mempublikasi' : 'meng-unpublish'} halaman`)
  }
}

const toggleNavbar = async (page) => {
  const newStatus = !page.inNavbar
  const previousStatus = page.inNavbar
  
  // Optimistic UI update
  page.inNavbar = newStatus
  
  try {
    const { data } = await pageService.toggleNavbar(page.id)
    // Update with server response just in case
    if (data.data) {
      page.inNavbar = data.data.inNavbar
    }
    showToast.success('Berhasil!', `Halaman ${newStatus ? 'ditampilkan di' : 'dihapus dari'} navbar`)
  } catch (err) {
    // Revert on error
    page.inNavbar = previousStatus
    console.error('Error toggling navbar status:', err)
    showToast.error('Gagal!', 'Tidak dapat mengubah status navbar')
  }
}

onMounted(async () => {
  await fetchPages()
})
</script>
