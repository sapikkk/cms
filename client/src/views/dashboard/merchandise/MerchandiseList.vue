<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-text-green dark:text-white">Manajemen Merchandise</h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">Kelola merchandise dan produk non-kopi</p>
      </div>
      <router-link
        to="/dashboard/merchandise/create"
        class="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium"
      >
        <PhPlus :size="20" weight="bold" />
        <span>Tambah Merchandise</span>
      </router-link>
    </div>

    <!-- Filter -->
    <div class="bg-white dark:bg-green-900/40 rounded-lg p-4 border border-green-200 dark:border-green-800 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <PhMagnifyingGlass :size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari merchandise..."
            class="w-full pl-10 pr-4 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-900/60 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
          />
        </div>
        <select
          v-model="filterCategory"
          class="px-4 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-900/60 text-green-900 dark:text-white"
        >
          <option value="">Semua Kategori</option>
          <option value="CLOTHING">Pakaian</option>
          <option value="ACCESSORIES">Aksesoris</option>
          <option value="EQUIPMENT">Peralatan</option>
          <option value="GIFT">Hadiah</option>
          <option value="OTHER">Lainnya</option>
        </select>
      </div>
    </div>

    <!-- Merchandise Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="item in filteredMerchandise"
        :key="item.id"
        class="bg-white dark:bg-green-900/40 rounded-lg overflow-hidden border border-green-200 dark:border-green-800 hover:border-brand-orange transition-all"
      >
        <div class="h-48 bg-brand-bg dark:bg-green-800/50 flex items-center justify-center relative">
          <img
            v-if="item.mainImage"
            :src="item.mainImage"
            :alt="item.name"
            class="w-full h-full object-cover"
          />
          <PhTShirt v-else :size="64" weight="duotone" class="text-brand-orange opacity-50" />
          <div v-if="item.isFeatured" class="absolute top-2 right-2 px-2 py-1 bg-brand-orange text-white text-xs rounded-lg font-bold">
            FEATURED
          </div>
          <div
            :class="[
              'absolute bottom-2 right-2 px-2 py-1 text-xs rounded-lg font-bold',
              item.stock > 10 ? 'bg-green-500 text-white' :
              item.stock > 0 ? 'bg-yellow-500 text-white' :
              'bg-red-500 text-white'
            ]"
          >
            Stok: {{ item.stock }}
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-1 bg-cream-200 dark:bg-green-800 text-green-600 dark:text-white text-xs rounded-lg font-medium">
              {{ categoryLabel(item.category) }}
            </span>
          </div>
          <h3 class="font-bold text-green-800 dark:text-white mb-1 text-lg">{{ item.name }}</h3>
          <p class="text-text-green dark:text-gray-400 font-bold">Rp {{ formatPrice(item.price) }}</p>
          <div class="flex gap-2 mt-4">
            <router-link
              :to="`/dashboard/merchandise/${item.id}/edit`"
              class="flex-1 py-2 flex items-center justify-center gap-2 bg-cream-100 hover:bg-cream-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-white rounded-lg text-sm transition-colors font-medium"
            >
              <PhPencilSimple :size="16" />
              Edit
            </router-link>
            <button
              @click="deleteMerchandise(item.id)"
              class="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-sm"
            >
              <PhTrash :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredMerchandise.length === 0" class="text-center py-16">
      <PhTShirt :size="64" weight="duotone" class="mx-auto text-green-200 dark:text-green-800/50 mb-4" />
      <p class="text-green-500 dark:text-gray-400 font-medium">Belum ada merchandise. Tambah merchandise pertama!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PhPlus, PhMagnifyingGlass, PhTShirt, PhPencilSimple, PhTrash, PhShoppingBag } from '@phosphor-icons/vue'
import merchandiseService from '@/api/services/merchandise.service'
import { useConfirm } from '@/composables/useConfirm'
import { showToast } from '@/utils/toast'

const items = ref([])
const searchQuery = ref('')
const filterCategory = ref('')
const loading = ref(false)
const { confirm } = useConfirm()

const fetchMerchandise = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterCategory.value) params.category = filterCategory.value
    
    const response = await merchandiseService.getAll(params)
    items.value = response.data.data || []
  } catch (err) {
    console.error('Error fetching merchandise:', err)
  } finally {
    loading.value = false
  }
}

const filteredMerchandise = computed(() => {
  let filtered = items.value

  if (searchQuery.value) {
    filtered = filtered.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered
})

const categoryLabel = (category) => {
  const labels = {
    CLOTHING: 'Pakaian',
    ACCESSORIES: 'Aksesoris',
    EQUIPMENT: 'Peralatan',
    GIFT: 'Hadiah',
    OTHER: 'Lainnya'
  }
  return labels[category] || category
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const deleteItem = async (id) => {
  const confirmed = await confirm({
    title: 'Hapus Merchandise?',
    message: 'Item merchandise akan dihapus permanen',
    variant: 'danger',
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal'
  })
  
  if (!confirmed) return
  
  const loadingToast = showToast.loading('Menghapus merchandise...')
  
  try {
    await merchandiseService.delete(id)
    items.value = items.value.filter(i => i.id !== id)
    showToast.success('Berhasil!', 'Merchandise telah dihapus')
  } catch (err) {
    showToast.error('Gagal!', 'Tidak dapat menghapus merchandise')
    console.error('Error deleting merchandise:', err)
  }
}

onMounted(() => {
  fetchMerchandise()
})
</script>
