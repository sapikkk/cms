<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <router-link
        to="/dashboard/merchandise"
        class="p-2 bg-white dark:bg-green-900/40 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-gray-400 hover:text-brand-orange transition-colors"
      >
        <PhArrowLeft :size="20" />
      </router-link>
      <div>
        <h1
          class="text-3xl font-bold text-text-green dark:text-white flex items-center gap-2"
        >
          <PhTShirt :size="32" weight="duotone" />
          {{ isEdit ? "Edit Merchandise" : "Tambah Merchandise Baru" }}
        </h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">
          Lengkapi informasi merchandise
        </p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="saveMerchandise" class="max-w-4xl">
      <!-- Basic Info -->
      <div
        class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-6"
      >
        <h2 class="text-lg font-bold text-text-green dark:text-white mb-6">
          Informasi Dasar
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Nama Produk</label
            >
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="T-Shirt Antitesa"
            />
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >SKU (Opsional)</label
            >
            <input
              v-model="form.sku"
              type="text"
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="MERCH-001"
            />
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Kategori</label
            >
            <select
              v-model="form.category"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
            >
              <option value="">Pilih Kategori</option>
              <option value="CLOTHING">Pakaian</option>
              <option value="ACCESSORIES">Aksesoris</option>
              <option value="EQUIPMENT">Peralatan</option>
              <option value="GIFT">Hadiah</option>
              <option value="OTHER">Lainnya</option>
            </select>
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Harga (Rp)</label
            >
            <div class="relative">
              <span
                class="absolute left-4 top-3.5 text-green-500 dark:text-gray-400 font-bold"
                >Rp</span
              >
              <input
                v-model.number="form.price"
                type="number"
                required
                min="0"
                class="w-full pl-12 pr-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
                placeholder="150000"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Stok</label
            >
            <input
              v-model.number="form.stock"
              type="number"
              required
              min="0"
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="50"
            />
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Gambar Merchandise</label
            >
            <CloudinaryImageUploader
              v-model="form.mainImage"
              folder="antitesa/merchandise"
              hint="Upload gambar merchandise (PNG, JPG, Max 10MB)"
            />
          </div>

          <div class="md:col-span-2">
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Deskripsi</label
            >
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="Deskripsi merchandise..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Publishing -->
      <div
        class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-6"
      >
        <h2 class="text-lg font-bold text-text-green dark:text-white mb-6">
          Status
        </h2>

        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <input
              v-model="form.isActive"
              type="checkbox"
              id="isActive"
              class="w-5 h-5 text-brand-orange focus:ring-brand-orange rounded"
            />
            <label
              for="isActive"
              class="text-green-700 dark:text-gray-300 font-medium"
              >Aktif (Tampilkan di Katalog)</label
            >
          </div>

          <div class="flex items-center gap-4">
            <input
              v-model="form.isFeatured"
              type="checkbox"
              id="isFeatured"
              class="w-5 h-5 text-brand-orange focus:ring-brand-orange rounded"
            />
            <label
              for="isFeatured"
              class="text-green-700 dark:text-gray-300 font-medium"
              >Featured (Tampilkan di Homepage)</label
            >
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
          class="px-6 py-2.5 bg-brand-orange text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2 font-bold shadow-sm"
        >
          <PhFloppyDisk :size="20" weight="fill" />
          {{ loading ? "Menyimpan..." : "Simpan Merchandise" }}
        </button>
        <router-link
          to="/dashboard/merchandise"
          class="px-6 py-2.5 bg-white dark:bg-green-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-white rounded-lg hover:bg-cream-100 dark:hover:bg-green-700 font-medium"
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
import { PhArrowLeft, PhTShirt, PhFloppyDisk } from "@phosphor-icons/vue";
import merchandiseService from "@/api/services/merchandise.service";
import { showToast } from "@/utils/toast";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);

const form = reactive({
  name: "",
  slug: "",
  description: "",
  sku: "",
  price: 0,
  stock: 0,
  mainImage: "",
  category: "",
  isActive: true,
  isFeatured: false,
});

const saveMerchandise = async () => {
  loading.value = true;
  try {
    if (isEdit.value) {
      await merchandiseService.update(route.params.id, form);
      showToast.success("Berhasil!", "Merchandise telah diupdate");
    } else {
      await merchandiseService.create(form);
      showToast.success("Berhasil!", "Merchandise baru telah ditambahkan");
    }
    router.push("/dashboard/merchandise");
  } catch (e) {
    console.error(e);

    // Handle specific error codes
    let errorMessage = "Tidak dapat menyimpan merchandise";

    if (e.response?.status === 409) {
      const msg = e.response.data?.message || "";
      if (msg.toLowerCase().includes("sku")) {
        errorMessage = `SKU "${form.sku}" sudah digunakan`;
      } else if (msg.toLowerCase().includes("slug")) {
        errorMessage = `Slug "${form.slug}" sudah ada`;
      } else if (msg.toLowerCase().includes("name")) {
        errorMessage = `Nama "${form.name}" sudah ada`;
      } else {
        errorMessage = "Data sudah ada. Gunakan nama/SKU yang berbeda";
      }
    } else if (e.response?.data?.message) {
      errorMessage = e.response.data.message;
    }

    showToast.error("Gagal!", errorMessage);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await merchandiseService.getById(route.params.id);
      const merch = data.data;
      Object.assign(form, {
        name: merch.name,
        slug: merch.slug,
        description: merch.description,
        sku: merch.sku,
        price: merch.price,
        stock: merch.stock,
        mainImage: merch.mainImage,
        category: merch.category,
        isActive: merch.isActive,
        isFeatured: merch.isFeatured,
      });
    } catch (err) {
      console.error("Error fetching merchandise:", err);
    }
  }
});
</script>
