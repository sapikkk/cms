<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <router-link
        to="/dashboard/library"
        class="p-2 bg-white dark:bg-green-900/40 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-gray-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
      >
        <PhArrowLeft :size="20" />
      </router-link>
      <div>
        <h1
          class="text-3xl font-bold text-text-green dark:text-gray-400 flex items-center gap-2"
        >
          <PhBookOpen :size="32" weight="duotone" />
          {{ isEdit ? "Edit Buku" : "Tambah Buku Baru" }}
        </h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">
          Kelola katalog pustaka digital
        </p>
        >
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="saveBook" class="max-w-4xl">
      <div
        class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-6 transition-colors"
      >
        <h2
          class="text-lg font-bold text-text-green dark:text-gray-400 mb-6 flex items-center gap-2"
        >
          <PhInfo :size="20" />
          Informasi Buku
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Judul Buku</label
            >>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder-green-400 dark:placeholder-green-700/50"
              placeholder="Contoh: The World Atlas of Coffee"
            />
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Penulis</label
            >>
            <div class="relative">
              <PhUser
                :size="18"
                class="absolute left-4 top-3.5 text-green-400"
              />
              <input
                v-model="form.author"
                type="text"
                required
                class="w-full pl-10 pr-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                placeholder="Nama Penulis"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Harga (Rp)</label
            >>
            <div class="relative">
              <span
                class="absolute left-4 top-3.5 text-green-500 dark:text-gray-400 font-bold"
                >Rp</span
              >
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                class="w-full pl-12 pr-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                placeholder="0 untuk gratis"
              />
            </div>
          </div>

          <div class="md:col-span-2">
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Cover Buku</label
            >
            <CloudinaryImageUploader
              v-model="form.coverUrl"
              folder="antitesa/books"
              hint="Upload cover buku (PNG, JPG, Max 10MB)"
            />
          </div>

          <div class="md:col-span-2">
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Ringkasan</label
            >>
            <textarea
              v-model="form.summary"
              rows="4"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              placeholder="Tulis ringkasan singkat tentang buku ini..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Style Customization -->
      <div
        class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-6 transition-colors"
      >
        <h2
          class="text-lg font-bold text-text-green dark:text-gray-400 mb-2 flex items-center gap-2"
        >
          <PhPalette :size="20" />
          Kustomisasi Tampilan Halaman
        </h2>
        <p class="text-sm text-green-500 dark:text-gray-400 mb-6">
          Atur warna dan font khusus untuk halaman detail buku ini agar sesuai
          dengan mood buku.
        </p>
        >

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            class="p-4 bg-cream-100 dark:bg-green-900/60 rounded-lg border border-green-100 dark:border-green-800"
          >
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Background Color</label
            >>
            <div class="flex items-center gap-3">
              <input
                v-model="form.styleConfig.bgColor"
                type="color"
                class="w-10 h-10 rounded cursor-pointer border-0 p-0"
              />
              <span
                class="text-sm font-mono text-green-600 dark:text-gray-400 border border-green-200 dark:border-green-700 px-2 py-1 rounded bg-white dark:bg-green-950"
                >{{ form.styleConfig.bgColor }}</span
              >
            </div>
          </div>

          <div
            class="p-4 bg-cream-100 dark:bg-green-900/60 rounded-lg border border-green-100 dark:border-green-800"
          >
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Accent Color</label
            >>
            <div class="flex items-center gap-3">
              <input
                v-model="form.styleConfig.accentColor"
                type="color"
                class="w-10 h-10 rounded cursor-pointer border-0 p-0"
              />
              <span
                class="text-sm font-mono text-green-600 dark:text-gray-400 border border-green-200 dark:border-green-700 px-2 py-1 rounded bg-white dark:bg-green-950"
                >{{ form.styleConfig.accentColor }}</span
              >
            </div>
          </div>

          <div
            class="p-4 bg-cream-100 dark:bg-green-900/60 rounded-lg border border-green-100 dark:border-green-800"
          >
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Font Judul</label
            >>
            <div class="relative">
              <PhTextT
                :size="18"
                class="absolute left-3 top-3.5 text-green-400"
              />
              <select
                v-model="form.styleConfig.titleFont"
                class="w-full pl-10 pr-4 py-2.5 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
              >
                <option value="font-sans">Sans Serif (Modern)</option>
                <option value="font-serif">Serif (Klasik)</option>
                <option value="font-mono">Monospace (Technical)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div
        class="flex gap-4 pt-4 border-t border-green-200 dark:border-green-800 mt-8"
      >
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2.5 bg-brand-orange text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-bold shadow-sm"
        >
          <PhFloppyDisk :size="20" weight="fill" />
          {{ loading ? "Menyimpan..." : "Simpan Buku" }}
        </button>
        <router-link
          to="/dashboard/library"
          class="px-6 py-2.5 bg-white dark:bg-green-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-white rounded-lg hover:bg-cream-100 dark:hover:bg-green-700 transition-colors font-medium"
        >
          Batal
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import CloudinaryImageUploader from "@/components/ui/CloudinaryImageUploader.vue";
import {
  PhArrowLeft,
  PhBook,
  PhBookOpen,
  PhInfo,
  PhPalette,
  PhImage,
  PhUser,
  PhTextT,
  PhFloppyDisk,
} from "@phosphor-icons/vue";
import bookService from "@/api/services/book.service";
import { showToast } from "@/utils/toast";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);

const form = reactive({
  title: "",
  author: "",
  summary: "",
  price: 0,
  coverUrl: "",
  contentUrl: "",
  styleConfig: {
    bgColor: "#FFFBF2",
    accentColor: "#FF6600",
    titleFont: "font-serif",
  },
});

const saveBook = async () => {
  loading.value = true;
  try {
    if (isEdit.value) {
      await bookService.update(route.params.id, form);
      showToast.success("Berhasil!", "Buku telah diupdate");
    } else {
      await bookService.create(form);
      showToast.success("Berhasil!", "Buku baru telah ditambahkan");
    }
    router.push("/dashboard/library");
  } catch (e) {
    console.error(e);
    showToast.error("Gagal!", "Tidak dapat menyimpan buku");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await bookService.getById(route.params.id);
      const book = data.data;
      form.title = book.title;
      form.author = book.author;
      form.price = book.price;
      form.summary = book.summary;
      form.coverUrl = book.coverUrl;
      form.contentUrl = book.contentUrl;
      if (book.styleConfig) {
        // Ensure styleConfig defaults are preserved if some keys missing
        form.styleConfig = { ...form.styleConfig, ...book.styleConfig };
      }
    } catch (err) {
      console.error("Error fetching book:", err);
    }
  }
});
</script>
