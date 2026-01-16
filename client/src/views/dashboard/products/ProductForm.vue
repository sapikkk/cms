<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <router-link
        to="/dashboard/products"
        class="p-2 bg-white dark:bg-green-900/40 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-gray-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
      >
        <PhArrowLeft :size="20" />
      </router-link>
      <div>
        <h1
          class="text-3xl font-bold text-text-green dark:text-gray-400 flex items-center gap-2"
        >
          <PhCoffee :size="32" weight="duotone" />
          {{ isEdit ? "Edit Produk" : "Tambah Produk Baru" }}
        </h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">
          Lengkapi informasi produk kopi atau menu lainnya
        </p>
        >
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="saveProduct" class="max-w-4xl">
      <div
        class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-6 transition-colors"
      >
        <h2
          class="text-lg font-bold text-text-green dark:text-gray-400 mb-6 flex items-center gap-2"
        >
          <PhInfo :size="20" />
          Informasi Dasar
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Nama Produk</label
            >>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              placeholder="Contoh: Cappuccino"
            />
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Kategori</label
            >>
            <div class="flex gap-2">
              <select
                v-model="form.categoryId"
                required
                class="flex-1 px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              >
                <option value="">Pilih Kategori</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
              <button
                type="button"
                @click="showCategoryModal = true"
                class="p-3 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
                title="Kelola Kategori"
              >
                <PhGear :size="20" />
              </button>
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Harga Dasar (Rp)</label
            >>
            <div class="relative">
              <span
                class="absolute left-4 top-3.5 text-green-500 dark:text-gray-400 font-bold"
                >Rp</span
              >
              <input
                v-model.number="form.basePrice"
                type="number"
                required
                min="0"
                class="w-full pl-12 pr-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                placeholder="35000"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Gambar Produk</label
            >
            <CloudinaryImageUploader
              v-model="form.image"
              folder="antitesa/products"
              hint="Upload gambar produk (PNG, JPG, Max 10MB)"
            />
          </div>
        </div>

        <div class="mt-6">
          <label
            class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
            >Deskripsi</label
          >>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
            placeholder="Deskripsi produk..."
          ></textarea>
        </div>
      </div>

      <!-- Ingredients Section -->
      <div
        class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-6"
      >
        <div class="flex items-center justify-between mb-6">
          <h2
            class="text-lg font-bold text-text-green dark:text-gray-400 flex items-center gap-2"
          >
            <PhFlask :size="20" />
            Komposisi & Resep
          </h2>
          <button
            type="button"
            @click="addIngredient"
            class="px-4 py-2 text-sm bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50 rounded-lg flex items-center gap-2 font-bold transition-colors"
          >
            <PhPlus :size="16" weight="bold" />
            Tambah Bahan
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="(ing, index) in form.ingredients"
            :key="index"
            class="flex gap-3 items-end p-4 bg-cream-100 dark:bg-green-900/60 rounded-lg border border-green-100 dark:border-green-800 transition-colors"
          >
            <div class="flex-1">
              <label
                class="text-xs font-bold text-green-500 dark:text-gray-400 mb-1 block"
                >Nama Bahan</label
              >>
              <input
                v-model="ing.name"
                type="text"
                class="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-950 text-green-900 dark:text-white text-sm focus:ring-1 focus:ring-brand-orange outline-none"
                placeholder="Contoh: Arabica Beans"
              />
            </div>
            <div class="w-24">
              <label
                class="text-xs font-bold text-green-500 dark:text-gray-400 mb-1 block"
                >Jumlah</label
              >>
              <input
                v-model.number="ing.amount"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-950 text-green-900 dark:text-white text-sm focus:ring-1 focus:ring-brand-orange outline-none"
              />
            </div>
            <div class="w-32">
              <label
                class="text-xs font-bold text-green-500 dark:text-gray-400 mb-1 block"
                >Unit</label
              >>
              <select
                v-model="ing.unit"
                class="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-green-950 text-green-900 dark:text-white text-sm focus:ring-1 focus:ring-brand-orange outline-none"
              >
                <option value="GRAM">gram</option>
                <option value="ML">ml</option>
                <option value="SHOT">shot</option>
                <option value="PCS">pcs</option>
              </select>
            </div>
            <button
              type="button"
              @click="removeIngredient(index)"
              class="p-2.5 text-green-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <PhTrash :size="18" />
            </button>
          </div>
        </div>

        <div
          v-if="form.ingredients.length === 0"
          class="text-center py-8 text-green-400 dark:text-green-800/50 border-2 border-dashed border-green-200 dark:border-green-800 rounded-lg mt-4"
        >
          <PhFlask :size="32" class="mx-auto mb-2 opacity-50" />
          <p class="text-sm">
            Belum ada bahan. Klik tombol "Tambah Bahan" di atas.
          </p>
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
          {{ loading ? "Menyimpan..." : "Simpan Produk" }}
        </button>
        <router-link
          to="/dashboard/products"
          class="px-6 py-2.5 bg-white dark:bg-green-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-white rounded-lg hover:bg-cream-100 dark:hover:bg-green-700 transition-colors font-medium"
        >
          Batal
        </router-link>
      </div>
    </form>

    <!-- Category Management Modal -->
    <div
      v-if="showCategoryModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white dark:bg-green-900 rounded-xl w-full max-w-md p-6 shadow-xl border border-green-200 dark:border-green-800"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-green-900 dark:text-white">
            Kelola Kategori
          </h3>
          <button
            @click="showCategoryModal = false"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <PhX :size="20" />
          </button>
        </div>

        <!-- Add New -->
        <div class="flex gap-2 mb-6">
          <input
            v-model="newCategoryName"
            type="text"
            placeholder="Kategori baru..."
            class="flex-1 px-4 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-cream-50 dark:bg-green-950 text-sm focus:ring-2 focus:ring-brand-orange outline-none"
            @keyup.enter="addNewCategory"
          />
          <button
            @click="addNewCategory"
            :disabled="!newCategoryName"
            class="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tambah
          </button>
        </div>

        <!-- List -->
        <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
          <div
            v-if="categories.length === 0"
            class="text-center text-gray-500 text-sm py-4"
          >
            Belum ada kategori.
          </div>
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="flex items-center justify-between p-3 bg-cream-50 dark:bg-green-950/50 rounded-lg border border-green-100 dark:border-green-800"
          >
            <span class="text-green-800 dark:text-green-200 font-medium">{{
              cat.name
            }}</span>
            <button
              @click="removeCategory(cat.id)"
              class="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              title="Hapus Kategori"
            >
              <PhTrash :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  PhArrowLeft,
  PhCoffee,
  PhInfo,
  PhFlask,
  PhPlus,
  PhTrash,
  PhFloppyDisk,
  PhGear,
  PhX,
} from "@phosphor-icons/vue";
import CloudinaryImageUploader from "@/components/ui/CloudinaryImageUploader.vue";
import productService from "@/api/services/product.service";
import { useConfirm } from "@/composables/useConfirm";
import { showToast } from "@/utils/toast";

const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);

const categories = ref([]);
const showCategoryModal = ref(false);
const newCategoryName = ref("");

const form = reactive({
  name: "",
  categoryId: "",
  basePrice: 0,
  image: "",
  description: "",
  ingredients: [{ name: "Espresso", amount: 1, unit: "SHOT" }],
});

const addIngredient = () => {
  form.ingredients.push({ name: "", amount: 0, unit: "GRAM" });
};

const removeIngredient = (index) => {
  form.ingredients.splice(index, 1);
};

const fetchCategories = async () => {
  try {
    const response = await productService.getCategories();
    categories.value = response.data.data || [];
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
};

const addNewCategory = async () => {
  if (!newCategoryName.value.trim()) return;

  try {
    await productService.createCategory({ name: newCategoryName.value });
    await fetchCategories();
    newCategoryName.value = "";
    showToast.success("Berhasil!", "Kategori baru telah ditambahkan");
  } catch (err) {
    console.error(err);
    showToast.error(
      "Gagal!",
      err.response?.data?.message || "Tidak dapat menambah kategori"
    );
  }
};

const removeCategory = async (id) => {
  const confirmed = await confirm({
    title: "Hapus Kategori?",
    message: "Kategori akan dihapus jika tidak ada produk di dalamnya",
    variant: "danger",
    confirmText: "Ya, Hapus",
    cancelText: "Batal",
  });

  if (!confirmed) return;

  try {
    await productService.deleteCategory(id);
    await fetchCategories();

    // If deleted category was selected, reset selection
    if (form.categoryId === id) {
      form.categoryId = "";
    }
    showToast.success("Berhasil!", "Kategori telah dihapus");
  } catch (err) {
    console.error(err);
    showToast.error("Gagal!", "Pastikan tidak ada produk di dalam kategori");
  }
};

const saveProduct = async () => {
  if (!form.categoryId) {
    showToast.error("Gagal!", "Kategori produk harus dipilih");
    return;
  }

  loading.value = true;
  try {
    // Generate slug from name
    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const payload = {
      ...form,
      slug,
      // Sanitize image: send undefined if empty string to pass Zod optional/union validation
      image: form.image || undefined, 
      // Ensure basePrice is number
      basePrice: Number(form.basePrice)
    };

    if (isEdit.value) {
      // For update, exclude slug if you don't want to change it, or include it. 
      // Usually slug update is sensitive, but let's include it for consistency with schema 
      // or check if backend allows partial update without slug.
      // DTO: UpdateProductSchema extends CreateProductSchema (partial) but adds ID.
      // So optional fields are optional.
      await productService.update(route.params.id, payload);
      showToast.success("Berhasil!", "Produk telah diupdate");
    } else {
      await productService.create(payload);
      showToast.success("Berhasil!", "Produk baru telah ditambahkan");
    }
    router.push("/dashboard/products");
  } catch (e) {
    console.error(e);
    const msg = e.response?.data?.message || "Tidak dapat menyimpan produk";
    showToast.error("Gagal!", msg);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchCategories();

  if (isEdit.value) {
    try {
      const { data } = await productService.getById(route.params.id);
      const product = data.data;
      form.name = product.name;
      form.categoryId = product.categoryId;
      form.basePrice = product.basePrice;
      form.description = product.description;
      form.image = product.image;
      form.ingredients = product.ingredients || [];
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  }
});
</script>
