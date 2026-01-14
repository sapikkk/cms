<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <router-link
        to="/dashboard/events"
        class="p-2 bg-white dark:bg-green-900/40 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-gray-400 hover:text-brand-orange transition-colors"
      >
        <PhArrowLeft :size="20" />
      </router-link>
      <div>
        <h1
          class="text-3xl font-bold text-text-green dark:text-white flex items-center gap-2"
        >
          <PhCalendar :size="32" weight="duotone" />
          {{ isEdit ? "Edit Event" : "Buat Event Baru" }}
        </h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">
          Lengkapi informasi event atau workshop
        </p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="saveEvent" class="max-w-4xl">
      <!-- Basic Info -->
      <div
        class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-6"
      >
        <h2
          class="text-lg font-bold text-text-green dark:text-white mb-6 flex items-center gap-2"
        >
          <PhInfo :size="20" />
          Informasi Dasar
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Judul Event</label
            >
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="Workshop Coffee Brewing"
            />
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Tanggal & Waktu</label
            >
            <input
              v-model="form.eventDate"
              type="datetime-local"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
            />
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Lokasi</label
            >
            <input
              v-model="form.location"
              type="text"
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="Cafe Antitesa / Online"
            />
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Maksimal Peserta</label
            >
            <input
              v-model.number="form.maxParticipants"
              type="number"
              min="0"
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="Kosongkan untuk unlimited"
            />
          </div>

          <div>
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Deadline Pendaftaran</label
            >
            <input
              v-model="form.registrationDeadline"
              type="datetime-local"
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
            />
          </div>

          <div class="md:col-span-2">
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Cover Image Event</label
            >
            <CloudinaryImageUploader
              v-model="form.coverImage"
              folder="antitesa/events"
              hint="Upload cover image event (PNG, JPG, Max 10MB)"
            />
          </div>

          <div class="md:col-span-2">
            <label
              class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
              >Deskripsi</label
            >
            <textarea
              v-model="form.description"
              rows="4"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="Deskripsi event..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Pricing -->
      <div
        class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-6"
      >
        <h2 class="text-lg font-bold text-text-green dark:text-white mb-6">
          Harga
        </h2>

        <div class="flex items-center gap-4 mb-4">
          <input
            v-model="form.isFree"
            type="checkbox"
            id="isFree"
            class="w-5 h-5 text-brand-orange focus:ring-brand-orange rounded"
          />
          <label
            for="isFree"
            class="text-green-700 dark:text-gray-300 font-medium"
            >Event Gratis</label
          >
        </div>

        <div v-if="!form.isFree">
          <label
            class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2"
            >Harga (Rp)</label
          >
          <div class="relative max-w-xs">
            <span
              class="absolute left-4 top-3.5 text-green-500 dark:text-gray-400 font-bold"
              >Rp</span
            >
            <input
              v-model.number="form.price"
              type="number"
              min="0"
              class="w-full pl-12 pr-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="50000"
            />
          </div>
        </div>
      </div>

      <!-- Publishing -->
      <div
        class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-6"
      >
        <h2 class="text-lg font-bold text-text-green dark:text-white mb-6">
          Publikasi
        </h2>

        <div class="space-y-4">
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
              >Publish Event</label
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
              >Tampilkan di Homepage</label
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
          {{ loading ? "Menyimpan..." : "Simpan Event" }}
        </button>
        <router-link
          to="/dashboard/events"
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
import {
  PhArrowLeft,
  PhCalendar,
  PhInfo,
  PhFloppyDisk,
} from "@phosphor-icons/vue";
import eventService from "@/api/services/event.service";
import { showToast } from "@/utils/toast";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);

const form = reactive({
  title: "",
  slug: "",
  description: "",
  eventDate: "",
  location: "",
  maxParticipants: null,
  registrationDeadline: "",
  isFree: true,
  price: 0,
  coverImage: "",
  isPublished: false,
  isFeatured: false,
});

const saveEvent = async () => {
  loading.value = true;
  try {
    // Generate slug from title
    form.slug = form.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]/g, "");

    // Format dates to ISO-8601 (datetime-local gives "YYYY-MM-DDTHH:mm", we need to add seconds and timezone)
    const payload = {
      ...form,
      eventDate: form.eventDate ? new Date(form.eventDate).toISOString() : null,
      registrationDeadline: form.registrationDeadline
        ? new Date(form.registrationDeadline).toISOString()
        : null,
    };

    if (isEdit.value) {
      await eventService.update(route.params.id, payload);
      showToast.success("Berhasil!", "Event telah diupdate");
    } else {
      await eventService.create(payload);
      showToast.success("Berhasil!", "Event baru telah dibuat");
    }
    router.push("/dashboard/events");
  } catch (e) {
    console.error(e);
    showToast.error("Gagal!", "Tidak dapat menyimpan event");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await eventService.getById(route.params.id);
      const event = data.data;
      Object.assign(form, {
        title: event.title,
        slug: event.slug,
        description: event.description,
        eventDate: event.eventDate.slice(0, 16), // Format for datetime-local
        location: event.location,
        maxParticipants: event.maxParticipants,
        registrationDeadline: event.registrationDeadline?.slice(0, 16),
        isFree: event.isFree,
        price: event.price,
        coverImage: event.coverImage,
        isPublished: event.isPublished,
        isFeatured: event.isFeatured,
      });
    } catch (err) {
      console.error("Error fetching event:", err);
    }
  }
});
</script>
