<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-text-green dark:text-gray-400">Manajemen Produk</h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">Kelola produk kopi dan menu</p>>
      </div>
      <router-link
        to="/dashboard/products/create"
        class="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium"
      >
        <PhPlus :size="20" weight="bold" />
        <span>Tambah Produk</span>
      </router-link>
    </div>

    <!-- Search & Filter -->
    <div class="bg-white dark:bg-green-900/40 rounded-lg p-4 border border-green-200 dark:border-green-800 mb-6 transition-colors">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
           <PhMagnifyingGlass :size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari produk..."
            class="w-full pl-10 pr-4 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-900/60 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>
        <select
          v-model="selectedCategory"
          class="px-4 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-900/60 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
        >
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white dark:bg-green-900/40 rounded-lg overflow-hidden border border-green-200 dark:border-green-800 hover:border-brand-orange dark:hover:border-brand-orange transition-all duration-300"
      >
        <div class="h-48 bg-brand-bg dark:bg-green-800/50 flex items-center justify-center relative">
          <img
            v-if="product.image"
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <PhCoffee v-else :size="64" weight="duotone" class="text-brand-orange opacity-50" />
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-1 bg-cream-200 dark:bg-green-800 text-green-600 dark:text-white text-xs rounded-lg font-medium">
              {{ product.category?.name || 'Uncategorized' }}
            </span>
          </div>
          <h3 class="font-bold text-green-800 dark:text-white mb-1 text-lg">{{ product.name }}</h3>
          <p class="text-text-green dark:text-gray-400 font-bold mb-2">Rp {{ formatPrice(product.basePrice) }}</p>
          <div class="flex items-center gap-2 mb-3">
            <span
              v-if="product.stock !== undefined"
              :class="[
                'px-2 py-1 text-xs rounded font-bold',
                product.stock === 0 ? 'bg-red-500 text-white' :
                product.stock <= product.lowStockThreshold ? 'bg-yellow-500 text-white' :
                'bg-green-500 text-white'
              ]"
            >
              {{ product.stock === -1 ? 'Unlimited' : `Stok: ${product.stock}` }}
            </span>
          </div>
          <div class="flex gap-2 mt-4">
            <router-link
              :to="`/dashboard/products/${product.id}/edit`"
              class="flex-1 py-2 flex items-center justify-center gap-2 bg-cream-100 hover:bg-cream-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-white rounded-lg text-sm transition-colors font-medium"
            >
              <PhPencilSimple :size="16" />
              Edit
            </router-link>
            <button
              @click="deleteProduct(product.id)"
              class="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-sm transition-colors"
            >
              <PhTrash :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProducts.length === 0" class="text-center py-16">
      <PhPackage :size="64" weight="duotone" class="mx-auto text-green-200 dark:text-green-800/50 mb-4" />
      <p class="text-green-500 dark:text-gray-400 font-medium">Belum ada produk. Tambah produk pertama Anda!</p>>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PhPlus, PhMagnifyingGlass, PhCoffee, PhPencilSimple, PhTrash, PhPackage } from '@phosphor-icons/vue'
import productService from '@/api/services/product.service'
import { useConfirm } from '@/composables/useConfirm'
import { showToast } from '@/utils/toast'

const products = ref([])
const categories = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const loading = ref(false)
const error = ref(null)
const { confirm } = useConfirm()

const fetchProducts = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await productService.getAll({
      search: searchQuery.value,
      category: selectedCategory.value
    })
    products.value = response.data.data || []
  } catch (err) {
    error.value = 'Gagal memuat produk'
    console.error('Error fetching products:', err)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await categoryService.getAll() // Assuming getAll for categories
    categories.value = response.data.data || []
  } catch (err) {
    console.error('Error fetching categories:', err)
    // Optionally set an error for categories specifically or merge with general error
  }
}

const filteredProducts = computed(() => {
  // With API filtering, this computed property might become redundant if the API handles all filtering.
  // However, if the API only provides a subset and further client-side filtering is needed, keep it.
  // For now, assuming API handles search/category, so this just returns the fetched products.
  return products.value
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const deleteProduct = async (id) => {
  const confirmed = await confirm({
    title: 'Hapus Produk?',
    message: 'Produk akan dihapus permanen dari database',
    variant: 'danger',
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal'
  })
  
  if (!confirmed) return
  
  const loadingToast = showToast.loading('Menghapus produk...')
  
  try {
    await productService.delete(id)
    products.value = products.value.filter(p => p.id !== id)
    showToast.success('Berhasil!', 'Produk telah dihapus')
  } catch (err) {
    const message = err.response?.data?.message || 'Tidak dapat menghapus produk'
    showToast.error('Gagal!', message)
    console.error('Error deleting product:', err)
  }
}

onMounted(async () => {
  await fetchProducts()
})
</script>
