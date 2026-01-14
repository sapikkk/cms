<template>
  <div class="bg-white dark:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-800 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-green-800 dark:text-white flex items-center gap-2">
        <PhCalculator :size="24" class="text-brand-orange" />
        Kalkulator HPP & Margin
      </h3>
      <div class="flex gap-2">
        <button 
          @click="resetCalculator"
          class="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Recipe Name -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-gray-300 mb-1">Nama Resep / Produk</label>
        <input 
          v-model="recipeName"
          type="text" 
          placeholder="Contoh: Kopi Susu Gula Aren"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-950 text-green-800 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
        />
      </div>

      <!-- Ingredients List -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <label class="block text-sm font-medium text-green-700 dark:text-gray-300">Komposisi Bahan</label>
          <button 
            @click="addIngredient"
            class="text-sm text-brand-orange font-bold hover:underline"
          >
            + Tambah Bahan
          </button>
        </div>

        <div v-if="ingredients.length === 0" class="text-center py-8 bg-green-50 dark:bg-green-900/20 rounded-lg border border-dashed border-green-300 dark:border-green-700">
          <p class="text-green-500 dark:text-gray-400">Belum ada bahan. Tambahkan bahan baku.</p>
        </div>

        <div v-else class="space-y-3">
          <div 
            v-for="(item, index) in ingredients" 
            :key="index"
            class="flex items-start gap-3 p-3 bg-cream-50 dark:bg-green-800/20 rounded-lg border border-green-100 dark:border-green-700 relative group"
          >
            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <!-- Material Selection -->
              <div>
                <label class="text-xs text-green-500 mb-1 block">Bahan Baku</label>
                <select 
                  v-model="item.materialId"
                  @change="onMaterialChange(item)"
                  class="w-full px-2 py-1.5 text-sm border border-green-200 dark:border-green-600 rounded bg-white dark:bg-green-900 text-green-800 dark:text-white"
                >
                  <option value="" disabled>Pilih Bahan</option>
                  <option v-for="mat in availableMaterials" :key="mat.id" :value="mat.id">
                    {{ mat.name }} (Rp {{ formatPrice(mat.price) }}/{{ mat.unit }})
                  </option>
                </select>
              </div>

              <!-- Usage & Cost -->
              <div class="flex gap-2">
                <div class="flex-1">
                  <label class="text-xs text-green-500 mb-1 block">Pakai ({{ item.unit || 'Unit' }})</label>
                  <input 
                    v-model.number="item.usage" 
                    type="number" 
                    min="0"
                    step="0.1"
                    class="w-full px-2 py-1.5 text-sm border border-green-200 dark:border-green-600 rounded bg-white dark:bg-green-900 text-green-800 dark:text-white"
                  />
                </div>
                <div class="flex-1">
                  <label class="text-xs text-text-green mb-1 block">Cost</label>
                  <div class="px-2 py-1.5 text-sm bg-green-100 dark:bg-green-800 rounded text-green-800 dark:text-white font-medium">
                    Rp {{ formatPrice(calculateItemCost(item)) }}
                  </div>
                </div>
              </div>
            </div>

            <button 
              @click="removeIngredient(index)"
              class="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300 mt-6"
            >
              <PhTrash :size="16" />
            </button>
          </div>
        </div>
      </div>

      <hr class="border-green-200 dark:border-green-800" />

      <!-- Results -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- HPP Output -->
        <div class="p-4 bg-cream-100 dark:bg-green-800/40 rounded-lg">
          <p class="text-sm text-green-600 dark:text-gray-300 mb-1">Total HPP (Modal)</p>
          <p class="text-2xl font-bold text-green-800 dark:text-white">Rp {{ formatPrice(totalHPP) }}</p>
        </div>

        <!-- Selling Price Input -->
        <div class="p-4 bg-white dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
          <label class="block text-sm text-green-600 dark:text-gray-300 mb-1">Rencana Harga Jual</label>
          <input 
            v-model.number="sellingPrice"
            type="number" 
            class="w-full bg-transparent text-2xl font-bold text-brand-orange outline-none border-b border-dashed border-green-300 focus:border-brand-orange"
            placeholder="0"
          />
        </div>
      </div>

      <!-- Margin Analysis -->
      <div class="p-4 rounded-lg transition-colors" :class="marginColorClass">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm font-medium opacity-80">Gross Profit</p>
            <p class="text-xl font-bold">Rp {{ formatPrice(grossProfit) }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium opacity-80">Margin</p>
            <p class="text-2xl font-bold">{{ marginPercentage }}%</p>
          </div>
        </div>
        <p class="text-xs mt-2 opacity-70">Target margin ideal F&B: 50% - 70%</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-2">
        <button 
          @click="saveRecipe"
          class="flex-1 py-3 bg-brand-orange text-white rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/20"
        >
          Simpan Resep
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PhCalculator, PhTrash } from '@phosphor-icons/vue'

// Mock Data Materials (To be replaced with API data)
const availableMaterials = ref([
  { id: 1, name: 'Espresso Beans House Blend', price: 250000, unit: 'kg', conversion: 1000 }, // 250 per gram
  { id: 2, name: 'Fresh Milk Diamond', price: 19000, unit: 'L', conversion: 1000 }, // 19 per ml
  { id: 3, name: 'Gula Aren Cair', price: 35000, unit: 'L', conversion: 1000 }, // 35 per ml
  { id: 4, name: 'Cup Plastic 14oz', price: 800, unit: 'pcs', conversion: 1 }, // 800 per pcs
  { id: 5, name: 'Ice Cube', price: 10000, unit: 'bag', conversion: 1 }, // Est per cup
])

const recipeName = ref('')
const ingredients = ref([])
const sellingPrice = ref(0)

const addIngredient = () => {
  ingredients.value.push({
    materialId: '',
    name: '',
    usage: 0,
    unit: '',
    basePrice: 0,
    conversion: 1
  })
}

const removeIngredient = (index) => {
  ingredients.value.splice(index, 1)
}

const onMaterialChange = (item) => {
  const mat = availableMaterials.value.find(m => m.id === item.materialId)
  if (mat) {
    item.name = mat.name
    item.unit = mat.unit === 'kg' ? 'gr' : (mat.unit === 'L' ? 'ml' : mat.unit)
    item.basePrice = mat.price
    item.conversion = mat.conversion
  }
}

const calculateItemCost = (item) => {
  if (!item.basePrice || !item.usage) return 0
  // Cost = (Harga Beli / Konversi Unit) * Pemakaian
  return (item.basePrice / item.conversion) * item.usage
}

const totalHPP = computed(() => {
  return ingredients.value.reduce((sum, item) => sum + calculateItemCost(item), 0)
})

const grossProfit = computed(() => {
  return sellingPrice.value - totalHPP.value
})

const marginPercentage = computed(() => {
  if (!sellingPrice.value || sellingPrice.value === 0) return 0
  return ((grossProfit.value / sellingPrice.value) * 100).toFixed(1)
})

const marginColorClass = computed(() => {
  const m = parseFloat(marginPercentage.value)
  if (m >= 60) return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
  if (m >= 40) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
  if (m > 0) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200'
  return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(price)
}

const resetCalculator = () => {
  recipeName.value = ''
  ingredients.value = []
  sellingPrice.value = 0
}

const saveRecipe = () => {
  if (!recipeName.value) return alert('Nama resep harus diisi')
  if (ingredients.value.length === 0) return alert('Bahan belum ada')
  
  // Logic save to API/Local
  alert(`Resep "${recipeName.value}" berhasil disimpan!\nTotal HPP: Rp ${formatPrice(totalHPP.value)}\nMargin: ${marginPercentage.value}%`)
}
</script>
