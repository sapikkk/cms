Fase 2: Frontend Foundation & Dashboard Core

Dokumen ini adalah panduan kerja (Sprint Guide) untuk Fase 2. Setelah backend dan database siap (Fase 1), saatnya membangun aplikasi Vue.js, mengimplementasikan autentikasi JWT di sisi klien, dan membuat Dashboard Admin dengan kemampuan kustomisasi tema (Theme Engine).

🎯 Target Deliverables (Capaian Fase 2)

Frontend Init: Project Vue 3 + Vite + Tailwind CSS terinstall di folder client.

Architecture Setup: Struktur folder Atomic Design (atoms, molecules, organisms) terimplementasi.

Auth Integration: Login Page berfungsi, menyimpan JWT, dan proteksi rute Dashboard (Auth Guard).

Dashboard Layout: Sidebar dinamis berdasarkan Role (Master vs Admin vs Media).

Theme Engine: Fitur untuk mengubah warna global (--primary-color) secara real-time dari Dashboard.

Basic Page Manager: CRUD halaman (List, Create, Delete Page) terhubung ke API.

🛠️ Langkah 1: Inisialisasi Project Vue.js

Kita bekerja di dalam folder client pada Monorepo.

1.1 Install Vue & Dependencies

cd client
npm create vite@latest . -- --template vue

# Install Core Dependencies
npm install vue-router pinia axios @vueuse/core phosphor-vue dayjs

# Install Styling Dependencies
npm install -D tailwindcss postcss autoprefixer sass
npx tailwindcss init -p


1.2 Konfigurasi Tailwind (tailwind.config.js)

Kita set agar Tailwind membaca CSS Variables untuk mendukung Theme Editor.

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Menggunakan CSS Variables agar bisa diubah runtime
        primary: "var(--color-primary)", 
        secondary: "var(--color-secondary)",
        background: "var(--color-bg)",
        surface: "var(--color-surface)",
      }
    },
  },
  plugins: [],
}


1.3 Global CSS (src/assets/styles/main.css)

Definisikan variable default.

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #8B4513; /* SaddleBrown (Default Coffee) */
  --color-secondary: #F4A460;
  --color-bg: #F9FAFB;
  --color-surface: #FFFFFF;
}


🧱 Langkah 2: Implementasi Atomic Design & Layout

Membuat komponen dasar yang akan digunakan berulang kali.

2.1 Atoms (Contoh: AppButton.vue)

Komponen tombol standar.

<template>
  <button 
    :class="[
      'px-4 py-2 rounded-lg font-medium transition-all duration-200',
      variant === 'primary' ? 'bg-primary text-white hover:opacity-90' : 'bg-gray-200 text-gray-800'
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({ variant: { type: String, default: 'primary' } });
</script>


2.2 Organisms (Contoh: TheSidebar.vue)

Sidebar yang menu-nya berubah tergantung siapa yang login.

<script setup>
import { useAuthStore } from '@/stores/auth.store';
const auth = useAuthStore();

const menus = [
  { label: 'Dashboard', to: '/dashboard', roles: ['ALL'] },
  { label: 'Products', to: '/dashboard/products', roles: ['ADMIN_OWNER', 'MEDIA_STAFF'] },
  { label: 'Pages', to: '/dashboard/pages', roles: ['ADMIN_OWNER', 'MEDIA_STAFF'] },
  { label: 'System Access', to: '/master/access', roles: ['MASTER_ADMIN'] }, // Hanya Master
];
</script>

<template>
  <aside class="w-64 bg-surface border-r h-screen p-4">
    <div class="logo mb-8">☕ CoffeeCMS</div>
    <nav class="space-y-2">
      <template v-for="menu in menus" :key="menu.to">
        <router-link 
          v-if="menu.roles.includes('ALL') || menu.roles.includes(auth.user.role)"
          :to="menu.to" 
          class="block p-3 rounded hover:bg-gray-50 text-gray-700"
          active-class="bg-primary/10 text-primary font-bold"
        >
          {{ menu.label }}
        </router-link>
      </template>
    </nav>
  </aside>
</template>


🔐 Langkah 3: Authentication System (The Brain)

Integrasi dengan API Fase 1.

3.1 Axios Instance (src/api/core/axiosClient.js)

Wajib ada Interceptor untuk menyisipkan Token JWT otomatis.

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // URL Backend Fase 1
  headers: { 'Content-Type': 'application/json' }
});

// Request Interceptor: Tempel Token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle 401 (Token Expired/Locked)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;


3.2 Auth Store (src/stores/auth.store.js)

State management untuk user yang sedang login.

import { defineStore } from 'pinia';
import authService from '@/api/services/auth.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(email, password) {
      const { data } = await authService.login(email, password);
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('token', data.token);
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    }
  }
});


🎨 Langkah 4: Theme Engine (Fitur "Media")

Fitur untuk mengubah CSS Variable secara runtime.

4.1 Composable (src/composables/useTheme.js)

export function useTheme() {
  const setTheme = (colorConfig) => {
    const root = document.documentElement;
    
    // Update CSS Variables di :root
    root.style.setProperty('--color-primary', colorConfig.primary);
    root.style.setProperty('--color-secondary', colorConfig.secondary);
    
    // Simpan ke LocalStorage agar persisten saat refresh
    localStorage.setItem('theme_config', JSON.stringify(colorConfig));
  };

  const loadTheme = () => {
    const saved = localStorage.getItem('theme_config');
    if (saved) setTheme(JSON.parse(saved));
  };

  return { setTheme, loadTheme };
}


4.2 UI Implementation (ThemeEditor.vue)

Komponen visual untuk Media/Admin memilih warna.

<template>
  <div class="p-6 bg-white rounded shadow">
    <h2 class="text-xl mb-4">Global Theme Customizer</h2>
    
    <div class="flex gap-4 items-center">
      <label>Primary Color</label>
      <input type="color" v-model="colors.primary" @input="updateTheme" />
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useTheme } from '@/composables/useTheme';

const { setTheme } = useTheme();
const colors = reactive({ primary: '#8B4513', secondary: '#F4A460' });

const updateTheme = () => {
  setTheme(colors); // Warna web langsung berubah saat digeser!
};
</script>


📄 Langkah 5: Page Manager (Foundation)

Sebelum masuk ke drag-and-drop builder (Fase 3), kita perlu manajemen data halamannya dulu.

5.1 Page Service (src/api/services/page.service.js)

import api from '../core/axiosClient';

export default {
  getAll() { return api.get('/pages'); },
  create(payload) { return api.post('/pages', payload); }, // { title, slug }
  delete(id) { return api.delete(`/pages/${id}`); }
};


5.2 Page List UI

Buat tabel sederhana di views/dashboard/pages/PageList.vue yang me-looping data halaman, menampilkan status (Published/Draft), dan tombol Edit/Delete.

✅ Checklist Penyelesaian Fase 2

Sebelum lanjut ke Fase 3 (Complex CMS & Drag-n-Drop), pastikan:

[ ] npm run dev berjalan tanpa error di folder client.

[ ] Login page berhasil menembus API Backend Fase 1 & menyimpan Token.

[ ] Jika token dihapus dari Application Storage, user otomatis terlempar ke Login saat refresh.

[ ] Sidebar Dashboard menampilkan menu yang berbeda saat login sebagai Master Admin vs Media Staff.

[ ] Mengubah warna di ThemeEditor.vue langsung mengubah warna tombol/header di seluruh aplikasi.

[ ] Bisa menambah Halaman baru di menu Page Manager (meskipun isinya masih kosong).

Next Step (Fase 3): Kita akan membangun "The Builder" (Drag & Drop Canvas), Integrasi Produk/Ingredients, dan Modul Library Buku.