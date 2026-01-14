Fase 3: The Builder, Product Intelligence & Library Module

Dokumen ini adalah panduan kerja (Sprint Guide) untuk Fase 3. Di fase ini, kita akan mengubah dashboard admin biasa menjadi "Site Builder" yang powerful. Kita juga akan mengimplementasikan logika bisnis kopi yang mendalam (Ingredients) dan modul pustaka digital.

🎯 Target Deliverables (Capaian Fase 3)

Drag-and-Drop Builder: Admin bisa menyusun halaman dengan menyeret widget dari panel ke kanvas.

Dynamic Rendering Engine: Halaman publik (storefront) bisa merender komponen sesuai urutan JSON yang dibuat di builder.

Product Intelligence UI: Form input produk yang mendukung Nested Ingredients (Nama bahan, takaran, satuan) dan Varian Harga.

Digital Library Module: CRUD Buku dengan fitur kustomisasi gaya (warna/font) per buku oleh tim Media.

Reporting System: Fitur export data ke PDF dan Excel.

🏗️ Langkah 1: The Page Builder (Drag & Drop)

Inti dari CMS ini. Kita membutuhkan library vuedraggable (wrapper untuk Sortable.js).

1.1 Install Dependency

npm install vuedraggable@next


1.2 Konsep Data Builder

Struktur data yang akan dimanipulasi di PageEditor.vue:

// State di Pinia / Composable
const activeSections = ref([
  { id: 'uuid-1', type: 'HeroBanner', props: { title: 'Halo', image: '...' } },
  { id: 'uuid-2', type: 'ProductGrid', props: { category: 'coffee' } }
]);


1.3 Widget Registry (src/config/widget-registry.js)

Mapping antara nama string JSON dengan komponen Vue asli.

import HeroBanner from '@/components/builder-widgets/HeroBanner.vue';
import ProductGrid from '@/components/builder-widgets/ProductGrid.vue';
import TextBlock from '@/components/builder-widgets/TextBlock.vue';

export const WIDGET_MAP = {
  HeroBanner,
  ProductGrid,
  TextBlock
};

export const AVAILABLE_WIDGETS = [
  { type: 'HeroBanner', label: 'Hero Banner', icon: 'image', defaultProps: { title: 'Judul Baru' } },
  { type: 'ProductGrid', label: 'Katalog Produk', icon: 'grid', defaultProps: { limit: 6 } },
  // ... widget lain
];


1.4 Editor Canvas UI (src/views/dashboard/pages/PageEditor.vue)

<template>
  <div class="flex h-screen">
    <!-- Panel Kiri: Daftar Widget -->
    <aside class="w-64 p-4 border-r bg-gray-50">
      <div class="font-bold mb-4">Widgets</div>
      <draggable 
        :list="availableWidgets" 
        :group="{ name: 'sections', pull: 'clone', put: false }" 
        item-key="type"
      >
        <template #item="{ element }">
          <div class="p-3 mb-2 bg-white border rounded cursor-move shadow-sm hover:shadow-md">
            {{ element.label }}
          </div>
        </template>
      </draggable>
    </aside>

    <!-- Area Tengah: Canvas -->
    <main class="flex-1 bg-gray-100 p-8 overflow-y-auto">
      <div class="max-w-4xl mx-auto bg-white min-h-[800px] shadow-lg">
        <draggable 
          v-model="activeSections" 
          group="sections" 
          item-key="id"
          class="min-h-full p-4 space-y-4"
        >
          <template #item="{ element, index }">
            <div class="relative group border border-transparent hover:border-primary">
              <!-- Render Komponen Asli -->
              <component :is="resolveWidget(element.type)" v-bind="element.props" />
              
              <!-- Controls (Delete/Edit) -->
              <div class="absolute top-2 right-2 hidden group-hover:flex gap-2">
                <button @click="openSettings(index)" class="bg-blue-500 text-white p-1 rounded">⚙️</button>
                <button @click="removeSection(index)" class="bg-red-500 text-white p-1 rounded">🗑️</button>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </main>
    
    <!-- Panel Kanan: Property Editor (Muncul saat klik gear) -->
    <aside v-if="selectedSection" class="w-80 border-l bg-white p-4">
      <!-- Form dinamis berdasarkan props widget -->
    </aside>
  </div>
</template>

<script setup>
import draggable from 'vuedraggable';
import { WIDGET_MAP, AVAILABLE_WIDGETS } from '@/config/widget-registry';
// ... logic setup
</script>


🚀 Langkah 2: Dynamic Rendering Engine (Storefront)

Bagaimana menampilkan data JSON tersebut ke pengunjung website?

2.1 Dynamic Page View (src/views/storefront/DynamicPage.vue)

Komponen ini akan dipanggil oleh Router untuk menangkap slug /:slug(.*)*.

<template>
  <div v-if="pageData">
    <!-- SEO Meta -->
    <Head>
      <title>{{ pageData.metaTitle }}</title>
    </Head>

    <!-- The Engine -->
    <component 
      v-for="section in pageData.sections" 
      :key="section.id"
      :is="WIDGET_MAP[section.type]"
      v-bind="section.props"
    />
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import pageService from '@/api/services/page.service';
import { WIDGET_MAP } from '@/config/widget-registry';

const route = useRoute();
const pageData = ref(null);

onMounted(async () => {
  try {
    const slug = route.params.slug || ''; // Empty string = Home
    const { data } = await pageService.getBySlug(slug);
    pageData.value = data;
  } catch (e) {
    // Redirect 404
  }
});
</script>


☕ Langkah 3: Product Intelligence (Ingredients)

Membuat form produk yang bisa menangani relasi One-to-Many (1 Produk punya N Ingredients) dalam satu kali submit.

3.1 Product Form UI (src/views/dashboard/products/ProductForm.vue)

Gunakan v-for untuk input ingredients.

<template>
  <form @submit.prevent="saveProduct">
    <!-- Basic Info -->
    <FormGroup label="Nama Produk">
      <AppInput v-model="form.name" />
    </FormGroup>

    <!-- Ingredients Section -->
    <div class="mt-6 border-t pt-4">
      <h3 class="font-bold mb-2">Komposisi & HPP</h3>
      
      <div v-for="(ing, index) in form.ingredients" :key="index" class="flex gap-2 mb-2 items-end">
        <div class="flex-1">
          <label class="text-xs text-gray-500">Bahan</label>
          <AppInput v-model="ing.name" placeholder="Contoh: Susu UHT" />
        </div>
        <div class="w-24">
          <label class="text-xs text-gray-500">Jlh</label>
          <AppInput type="number" v-model="ing.amount" />
        </div>
        <div class="w-24">
          <label class="text-xs text-gray-500">Unit</label>
          <select v-model="ing.unit" class="border p-2 rounded w-full">
            <option value="ML">ml</option>
            <option value="GRAM">gram</option>
            <option value="SHOT">shot</option>
          </select>
        </div>
        <button type="button" @click="removeIng(index)" class="text-red-500 p-2">×</button>
      </div>

      <AppButton type="button" variant="secondary" size="sm" @click="addIng">
        + Tambah Bahan
      </AppButton>
    </div>

    <!-- Submit -->
    <div class="mt-8 flex justify-end">
      <AppButton type="submit">Simpan Produk</AppButton>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue';

const form = reactive({
  name: '',
  basePrice: 0,
  ingredients: [
    { name: 'Espresso', amount: 1, unit: 'SHOT' } // Default row
  ]
});

const addIng = () => form.ingredients.push({ name: '', amount: 0, unit: 'GRAM' });
const removeIng = (idx) => form.ingredients.splice(idx, 1);
</script>


📚 Langkah 4: Digital Library Module

Fitur unik di mana Media bisa mengkustomisasi tampilan halaman detail buku.

4.1 Schema Data Buku (Review)

Ingat, kita punya kolom styleConfig (JSON) di database.

4.2 Book Editor UI

Form untuk editor buku harus memiliki bagian "Styling Override".

<!-- Bagian dalam BookForm.vue -->
<div class="bg-gray-50 p-4 rounded border mt-4" v-if="isMediaRole">
  <h3 class="text-sm font-bold text-gray-700 mb-2 uppercase">🎨 Custom Page Styling</h3>
  
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label>Background Color</label>
      <input type="color" v-model="form.styleConfig.bgColor" class="w-full h-10 cursor-pointer" />
    </div>
    <div>
      <label>Title Font</label>
      <select v-model="form.styleConfig.titleFont" class="w-full border p-2 rounded">
        <option value="font-sans">Sans Serif (Modern)</option>
        <option value="font-serif">Serif (Klasik/Elegan)</option>
        <option value="font-mono">Monospace (Technical)</option>
      </select>
    </div>
  </div>
</div>


📊 Langkah 5: Reporting System (Export)

Implementasi fitur download laporan.

5.1 Export Helper (src/utils/export-helper.js)

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (headers, data, title = 'Report') => {
  const doc = new jsPDF();
  doc.text(title, 14, 15);
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 20,
  });
  doc.save(`${title}_${Date.now()}.pdf`);
};

export const exportToExcel = (data, title = 'Report') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${title}_${Date.now()}.xlsx`);
};


✅ Checklist Penyelesaian Fase 3

Sebelum project dianggap MVP (Minimum Viable Product), pastikan:

[ ] Drag & Drop: Widget bisa ditarik dari sidebar ke canvas dan urutannya bisa diubah.

[ ] JSON Save: Tombol "Save Page" berhasil mengirim struktur JSON yang benar ke Backend.

[ ] Storefront: Halaman publik merender widget sesuai urutan yang dibuat di dashboard.

[ ] Ingredients: Bisa menyimpan produk dengan >1 bahan baku, dan data tersimpan relasional di DB.

[ ] Book Styling: Mengubah warna background buku di dashboard benar-benar mengubah tampilan halaman detail buku tersebut.

[ ] Export: Tombol "Export PDF" menghasilkan file PDF yang bisa dibuka dan dibaca.

Next Step (Final Phase): Security Hardening (Master Lock), Deployment, dan Optimization.