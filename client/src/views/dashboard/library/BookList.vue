<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-text-green dark:text-gray-400">Pustaka Digital</h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">Kelola koleksi buku dan literatur</p>>
      </div>
      <router-link
        to="/dashboard/library/create"
        class="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium"
      >
        <PhBookOpen :size="20" weight="bold" />
        <span>Tambah Buku</span>
      </router-link>
    </div>

    <!-- Books Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="book in books"
        :key="book.id"
        class="bg-white dark:bg-green-900/40 rounded-lg overflow-hidden border border-green-200 dark:border-green-800 hover:border-brand-orange dark:hover:border-brand-orange transition-all duration-300 group"
      >
        <div class="h-56 bg-brand-bg dark:bg-green-800/50 flex items-center justify-center relative">
          <img
            v-if="book.coverUrl"
            :src="book.coverUrl"
            :alt="book.title"
            class="w-full h-full object-cover"
          />
          <PhBook v-else :size="64" weight="duotone" class="text-brand-orange opacity-50 group-hover:scale-110 transition-transform duration-300" />
          <div 
            v-if="book.price === 0" 
            class="absolute top-2 right-2 px-2 py-1 bg-text-green text-white text-xs rounded-lg font-bold"
          >
            GRATIS
          </div>
          <div v-if="book.isFeatured" class="absolute top-2 left-2 px-2 py-1 bg-brand-orange text-white text-xs rounded-lg font-bold">
            FEATURED
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-green-800 dark:text-white mb-1 truncate text-lg">{{ book.title }}</h3>
          <p class="text-sm text-green-500 dark:text-gray-400 mb-2">{{ book.author }}</p>>
          <p class="text-brand-orange font-bold">
            {{ book.price > 0 ? `Rp ${formatPrice(book.price)}` : 'Gratis' }}
          </p>
          <div class="flex gap-2 mt-4">
            <router-link
              :to="`/dashboard/library/${book.id}/edit`"
              class="flex-1 py-2 flex items-center justify-center gap-2 bg-cream-100 hover:bg-cream-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-white rounded-lg text-sm transition-colors font-medium"
            >
              <PhPencilSimple :size="16" />
              Edit
            </router-link>
            <button
              @click="deleteBook(book.id)"
              class="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-sm transition-colors"
            >
              <PhTrash :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="books.length === 0" class="text-center py-16">
      <PhBooks :size="64" weight="duotone" class="mx-auto text-green-200 dark:text-green-800/50 mb-4" />
      <p class="text-green-500 dark:text-gray-400 font-medium">Belum ada buku. Tambah buku pertama Anda!</p>>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PhBookOpen, PhBook, PhBooks, PhPencilSimple, PhTrash } from '@phosphor-icons/vue'
import bookService from '@/api/services/book.service'
import { useConfirm } from '@/composables/useConfirm'
import { showToast } from '@/utils/toast'

const books = ref([])
const loading = ref(false)
const { confirm } = useConfirm()

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const fetchBooks = async () => {
  loading.value = true
  try {
    const response = await bookService.getAll()
    books.value = response.data.data || []
  } catch (err) {
    console.error('Error fetching books:', err)
  } finally {
    loading.value = false
  }
}

const deleteBook = async (id) => {
  const confirmed = await confirm({
    title: 'Hapus Buku?',
    message: 'Buku akan dihapus permanen dari library',
    variant: 'danger',
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal'
  })
  
  if (!confirmed) return
  
  const loadingToast = showToast.loading('Menghapus buku...')
  
  try {
    await bookService.delete(id)
    books.value = books.value.filter(b => b.id !== id)
    showToast.success('Berhasil!', 'Buku telah dihapus')
  } catch (err) {
    const message = err.response?.data?.message || 'Tidak dapat menghapus buku'
    showToast.error('Gagal!', message)
    console.error('Error deleting book:', err)
  }
}

onMounted(async () => {
  await fetchBooks()
})
</script>
