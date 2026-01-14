<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <router-link
        to="/dashboard/funfacts"
        class="p-2 bg-white dark:bg-green-900/40 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-gray-400 hover:text-brand-orange transition-colors"
      >
        <PhArrowLeft :size="20" />
      </router-link>
      <div>
        <h1 class="text-3xl font-bold text-text-green dark:text-white">
          {{ isEdit ? "Edit Fun Fact" : "Buat Fun Fact Baru" }}
        </h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">
          Bagikan trivia dan fakta menarik
        </p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="saveFunFact" class="max-w-4xl">
      <div
        class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Judul</label
            >
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="Tahukah Anda?"
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
              <option value="COFFEE">Coffee</option>
              <option value="HISTORY">History</option>
              <option value="HEALTH">Health</option>
              <option value="CULTURE">Culture</option>
              <option value="TRIVIA">Trivia</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Gambar (Opsional)</label
            >
            <CloudinaryImageUploader
              v-model="form.image"
              folder="antitesa/funfacts"
              hint="Upload gambar fun fact (PNG, JPG, Max 10MB)"
            />
          </div>

          <div class="md:col-span-2">
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Konten</label
            >
            <textarea
              v-model="form.content"
              rows="6"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="Tulis fakta menarik di sini..."
            ></textarea>
          </div>

          <div class="md:col-span-2">
            <div class="flex items-center gap-4">
              <input
                v-model="form.isPublished"
                type="checkbox"
                id="isPublished"
                class="w-5 h-5 text-brand-orange focus:ring-brand-orange rounded"
              />
              <label
                for="isPublished"
                class="text-green-700 dark:text-gray-300 font-medium"
                >Publish Fun Fact</label
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex gap-4 pt-4">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2.5 bg-brand-orange text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2 font-bold shadow-sm"
        >
          <PhFloppyDisk :size="20" weight="fill" />
          {{ loading ? "Menyimpan..." : "Simpan Fun Fact" }}
        </button>
        <router-link
          to="/dashboard/funfacts"
          class="px-6 py-2.5 bg-white dark:bg-green-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-white rounded-lg hover:bg-cream-100 font-medium"
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
import { PhArrowLeft, PhLightning, PhFloppyDisk } from "@phosphor-icons/vue";
import funfactService from "@/api/services/funfact.service";
import { showToast } from "@/utils/toast";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);

const form = reactive({
  title: "",
  content: "",
  image: "",
  category: "",
  isPublished: false,
});

const saveFunFact = async () => {
  loading.value = true;
  try {
    if (isEdit.value) {
      await funfactService.update(route.params.id, form);
      showToast.success("Berhasil!", "Fun fact telah diupdate");
    } else {
      await funfactService.create(form);
      showToast.success("Berhasil!", "Fun fact baru telah ditambahkan");
    }
    router.push("/dashboard/funfacts");
  } catch (e) {
    console.error(e);
    showToast.error("Gagal!", "Tidak dapat menyimpan fun fact");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await funfactService.getById(route.params.id);
      const fact = data.data;
      Object.assign(form, {
        title: fact.title,
        content: fact.content,
        image: fact.image,
        category: fact.category,
        isPublished: fact.isPublished,
      });
    } catch (err) {
      console.error("Error fetching fun fact:", err);
    }
  }
});
</script>
