<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-green-900 dark:text-gray-400 flex items-center gap-2">
        <PhPalette :size="32" weight="duotone" />
        Theme Customizer
      </h1>
      <p class="text-green-500 dark:text-gray-400 mt-1">Ubah tampilan website secara real-time</p>
    </div>

    <!-- Alert for Dark Mode -->
     <div class="mb-8 p-4 bg-green-50 dark:bg-green-900/40 border-l-4 border-green-500 rounded-r-lg flex gap-3">
       <PhInfo :size="24" class="text-green-500 flex-shrink-0" weight="fill" />
       <div>
         <h3 class="font-bold text-green-800 dark:text-gray-400">Mode Tema</h3>
         <p class="text-sm text-green-700 dark:text-gray-400 mt-1">
           Pengaturan warna di bawah ini berlaku untuk <strong>Light Mode</strong>. Dark mode menggunakan palet warna `green-900` yang sudah dioptimalkan secara otomatis oleh sistem.
         </p>
       </div>
     </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Settings Panel -->
      <div class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800 shadow-sm transition-colors">
        <h2 class="text-lg font-bold text-green-800 dark:text-white mb-6 flex items-center gap-2">
          <PhFaders :size="20" />
          Pengaturan Warna
        </h2>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">Primary Color (Brand)</label>>
            <div class="flex items-center gap-4">
              <input
                v-model="theme.primary"
                type="color"
                class="w-16 h-12 rounded-lg cursor-pointer border border-green-200 dark:border-green-700 bg-transparent p-0"
                @input="updateTheme"
              />
              <input
                v-model="theme.primary"
                type="text"
                class="flex-1 px-4 py-2 border border-green-300 dark:border-green-700 rounded-lg font-mono text-sm bg-white dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none uppercase"
                @input="updateTheme"
              />
            </div>
            <p class="text-xs text-green-500 mt-1">Warna utama untuk tombol dan highlight.</p>
          </div>

          <div>
            <label class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">Secondary Color (Accent)</label>>
            <div class="flex items-center gap-4">
              <input
                v-model="theme.secondary"
                type="color"
                class="w-16 h-12 rounded-lg cursor-pointer border border-green-200 dark:border-green-600 bg-transparent p-0"
                @input="updateTheme"
              />
              <input
                v-model="theme.secondary"
                type="text"
                class="flex-1 px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg font-mono text-sm bg-white dark:bg-green-700 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none uppercase"
                @input="updateTheme"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">Background Color (Light Mode)</label>>
            <div class="flex items-center gap-4">
              <input
                v-model="theme.background"
                type="color"
                class="w-16 h-12 rounded-lg cursor-pointer border border-green-200 dark:border-green-600 bg-transparent p-0"
                @input="updateTheme"
              />
              <input
                v-model="theme.background"
                type="text"
                class="flex-1 px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg font-mono text-sm bg-white dark:bg-green-700 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none uppercase"
                @input="updateTheme"
              />
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-green-100 dark:border-green-800 flex gap-4">
          <button
            @click="saveTheme"
            class="flex-1 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-sm dark:bg-orange-600 dark:hover:bg-orange-700"
          >
            <PhFloppyDisk :size="20" weight="fill" />
            Simpan Tema
          </button>
          <button
            @click="resetTheme"
            class="px-6 py-3 bg-white dark:bg-green-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-white rounded-lg hover:bg-cream-100 dark:hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
          >
            <PhArrowCounterClockwise :size="20" />
            Reset
          </button>
        </div>
      </div>

      <!-- Preview Panel -->
      <div class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800 shadow-sm transition-colors">
        <h2 class="text-lg font-bold text-green-800 dark:text-white mb-6 flex items-center gap-2">
          <PhEye :size="20" />
          Live Preview
        </h2>
        
        <!-- The Preview Box matches the Theme -->
        <div
          class="rounded-lg p-6 transition-all duration-300 border border-green-200 dark:border-green-800 shadow-inner"
          :style="{ backgroundColor: theme.background }"
        >
          <div
            class="rounded-lg p-6 mb-4 shadow-sm border border-green-100"
            :style="{ backgroundColor: theme.surface }"
          >
            <h3 class="font-bold text-xl mb-2" :style="{ color: theme.primary }">Judul Halaman</h3>
            <p class="text-green-600 mb-4">Ini adalah contoh paragraf untuk melihat keterbacaan teks pada background yang dipilih.</p>
            
            <div class="flex gap-3">
               <button
                class="px-4 py-2 text-white rounded-lg text-sm font-bold shadow-sm"
                :style="{ backgroundColor: theme.primary }"
              >
                Primary Button
              </button>
               <button
                class="px-4 py-2 text-white rounded-lg text-sm font-bold shadow-sm"
                :style="{ backgroundColor: theme.secondary }"
              >
                Secondary
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 text-white text-sm font-bold text-center">
            <div
              class="rounded-lg p-4 shadow-sm"
              :style="{ backgroundColor: theme.primary }"
            >
              Primary
              <br><span class="opacity-75 font-normal text-xs">{{ theme.primary }}</span>
            </div>
            <div
              class="rounded-lg p-4 shadow-sm"
              :style="{ backgroundColor: theme.secondary }"
            >
              Secondary
              <br><span class="opacity-75 font-normal text-xs">{{ theme.secondary }}</span>
            </div>
          </div>
        </div>

        <!-- Preset Themes -->
        <div class="mt-8">
          <h3 class="text-sm font-bold text-green-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Preset Themes</h3>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="preset in presets"
              :key="preset.name"
              @click="applyPreset(preset)"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border hover:border-brand-orange transition-all bg-white dark:bg-green-800 dark:border-green-700 dark:text-white text-green-700"
            >
              <span class="w-4 h-4 rounded-full" :style="{ backgroundColor: preset.primary }"></span>
              {{ preset.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { showToast } from '@/utils/toast'
import { 
  PhPalette, PhFaders, PhEye, PhFloppyDisk, PhArrowCounterClockwise, PhInfo 
} from '@phosphor-icons/vue'

const { setTheme, loadTheme } = useTheme()

const theme = reactive({
  primary: '#FF6600',
  secondary: '#006633',
  background: '#F9F6EF',
  surface: '#FFFFFF'
})

const presets = [
  { name: 'Coffee (Default)', primary: '#FF6600', secondary: '#006633', background: '#F9F6EF', surface: '#FFFFFF' },
  { name: 'Ocean', primary: '#0EA5E9', secondary: '#38BDF8', background: '#F0F9FF', surface: '#FFFFFF' },
  { name: 'Forest', primary: '#059669', secondary: '#34D399', background: '#F0FDF4', surface: '#FFFFFF' },
  { name: 'Midnight', primary: '#6366F1', secondary: '#A78BFA', background: '#eef2ff', surface: '#FFFFFF' }
]

const updateTheme = () => {
  setTheme(theme)
}

const applyPreset = (preset) => {
  Object.assign(theme, preset)
  updateTheme()
}

const resetTheme = () => {
  applyPreset(presets[0])
}

const saveTheme = () => {
  setTheme(theme)
  showToast.success('Berhasil!', 'Tema telah disimpan')
}

onMounted(() => {
  // loadTheme() // We use default for now to prevent weird overrides during demo
})
</script>
