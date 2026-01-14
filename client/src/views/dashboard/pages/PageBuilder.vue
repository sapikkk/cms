<template>
  <div
    class="h-screen flex flex-col md:flex-row bg-cream-100 dark:bg-green-950 transition-colors duration-300"
  >
    <!-- Left Panel: Available Widgets -->
    <aside
      class="w-full md:w-64 bg-white dark:bg-green-900 border-r border-green-200 dark:border-green-800 p-4 overflow-y-auto flex-shrink-0 z-10 shadow-sm md:shadow-none"
    >
      <div
        class="font-bold text-green-800 dark:text-white mb-4 flex items-center gap-2"
      >
        <PhPackage :size="24" class="text-brand-orange" weight="duotone" />
        Widgets
      </div>
      <div class="space-y-2">
        <div
          v-for="widget in availableWidgets"
          :key="widget.type"
          @click="addWidget(widget)"
          class="p-3 bg-cream-100 dark:bg-green-900/60 border border-green-200 dark:border-green-800 rounded-lg cursor-pointer hover:border-brand-orange dark:hover:border-brand-orange hover:bg-orange-50 dark:hover:bg-green-800 transition-all flex items-center gap-3 group"
        >
          <div
            class="p-2 bg-white dark:bg-green-800 rounded-md shadow-sm group-hover:shadow text-brand-orange"
          >
            <component :is="widget.iconComponent" :size="20" />
          </div>
          <span class="text-sm font-bold text-green-700 dark:text-white">{{
            widget.label
          }}</span>
        </div>
      </div>

      <div
        class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
      >
        <p class="text-xs text-blue-800 dark:text-blue-300 font-medium">
          💡 Tips: Klik widget untuk menambahkannya ke canvas. Drag & drop untuk
          mengatur posisi.
        </p>
      </div>
    </aside>

    <!-- Center: Editor Area (Tabs + Form) -->
    <main
      class="flex-1 bg-cream-200 dark:bg-green-950 flex flex-col min-w-0 overflow-hidden"
    >
      <!-- Toolbar -->
      <div
        class="px-6 py-4 bg-white dark:bg-green-900 border-b border-green-200 dark:border-green-800 flex items-center justify-between shrink-0"
      >
        <div class="flex items-center gap-4">
          <router-link
            to="/dashboard/pages"
            class="p-2 hover:bg-cream-100 dark:hover:bg-green-800 rounded-lg text-green-600 dark:text-green-400 transition-colors"
          >
            <PhArrowLeft :size="20" />
          </router-link>
          <div>
            <h1
              class="text-xl font-bold text-green-800 dark:text-white flex items-center gap-2"
            >
              {{ pageTitle }}
              <PhPencilSimple
                :size="16"
                class="text-green-400 cursor-pointer hover:text-brand-orange"
              />
            </h1>
            <div class="flex items-center gap-2 text-xs">
              <span
                v-if="saving"
                class="text-brand-orange flex items-center gap-1"
              >
                <PhSpinner :size="12" class="animate-spin" /> Menyimpan...
              </span>
              <span v-else-if="lastSaved" class="text-green-500">
                ✓ Tersimpan {{ formatTime(lastSaved) }}
              </span>
              <span v-else class="text-green-400">Belum ada perubahan</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="showDebug = !showDebug"
            class="p-2 hover:bg-cream-100 dark:hover:bg-green-800 rounded-lg text-green-600 dark:text-green-400 transition-colors"
            :class="{
              'text-brand-orange bg-orange-50 dark:bg-green-800': showDebug,
            }"
            title="Toggle Debugger"
          >
            <PhBug :size="20" />
          </button>

          <button
            @click="preview"
            class="px-4 py-2 bg-white dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-700 dark:text-white rounded-lg text-sm font-medium hover:bg-cream-100 dark:hover:bg-green-800 transition-colors flex items-center gap-2"
          >
            <PhEye :size="18" />
            Preview
          </button>

          <button
            @click="savePage(false)"
            :disabled="saving"
            class="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            <PhFloppyDisk :size="18" />
            Simpan
          </button>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div
        class="px-6 pt-4 bg-white dark:bg-green-900 border-b border-green-200 dark:border-green-800 overflow-x-auto shrink-0"
      >
        <nav class="flex gap-1 min-w-max pb-px">
          <!-- Dynamic Section Tabs -->
          <button
            v-for="(section, index) in sections"
            :key="section.id"
            @click="activeTab = section.id"
            :class="[
              'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2',
              activeTab === section.id
                ? 'border-brand-orange text-brand-orange dark:text-brand-orange bg-orange-50 dark:bg-green-800/50 rounded-t-lg'
                : 'border-transparent text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 hover:bg-green-50 dark:hover:bg-green-800/30 rounded-t-lg',
            ]"
          >
            <component :is="getWidgetIcon(section.type)" :size="16" />
            {{ getWidgetLabel(section.type) }} {{ index + 1 }}
          </button>

          <!-- Order Management Tab -->
          <button
            @click="activeTab = 'order'"
            :class="[
              'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ml-4 relative',
              activeTab === 'order'
                ? 'border-brand-orange text-brand-orange dark:text-brand-orange bg-orange-50 dark:bg-green-800/50 rounded-t-lg'
                : 'border-transparent text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 hover:bg-green-50 dark:hover:bg-green-800/30 rounded-t-lg',
            ]"
          >
            <PhListNumbers :size="16" />
            Atur Urutan
            <span
              class="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs px-1.5 py-0.5 rounded-full ml-1"
              >{{ sections.length }}</span
            >
          </button>
        </nav>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="max-w-4xl mx-auto">
          <!-- Empty State -->
          <div
            v-if="sections.length === 0"
            class="flex flex-col items-center justify-center py-20 bg-white dark:bg-green-900/40 rounded-xl border border-dashed border-green-300 dark:border-green-700"
          >
            <div
              class="p-4 bg-cream-100 dark:bg-green-800 rounded-full mb-4 text-brand-orange"
            >
              <PhPackage :size="48" weight="duotone" />
            </div>
            <h3 class="text-xl font-bold text-green-800 dark:text-white mb-2">
              Halaman Kosong
            </h3>
            <p
              class="text-green-600 dark:text-gray-400 text-center max-w-sm mb-6"
            >
              Belum ada konten di halaman ini. Pilih widget dari panel kiri
              untuk menambahkan konten.
            </p>
          </div>

          <!-- Section Editor Form -->
          <div
            v-if="activeSection"
            class="bg-white dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div
              class="p-6 border-b border-green-100 dark:border-green-800 flex justify-between items-start bg-green-50/50 dark:bg-green-800/30"
            >
              <div>
                <h2
                  class="text-lg font-bold text-green-800 dark:text-white flex items-center gap-2"
                >
                  <component
                    :is="getWidgetIcon(activeSection.type)"
                    :size="24"
                    class="text-brand-orange"
                  />
                  Edit {{ getWidgetLabel(activeSection.type) }}
                </h2>
                <p class="text-sm text-green-600 dark:text-green-400 mt-1">
                  Sesuaikan konten dan tampilan section ini.
                </p>
              </div>
              <button
                @click="
                  removeSection(sections.findIndex((s) => s.id === activeTab))
                "
                class="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <PhTrash :size="16" />
                Hapus Section
              </button>
            </div>

            <div class="p-6 space-y-6">
              <!-- Properties Loop -->
              <div v-for="(value, key) in activeSection.props" :key="key">
                <label
                  class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2 capitalize"
                >
                  {{ formatLabel(key) }}
                </label>

                <!-- Array Editor (For features, stats, items, etc.) -->
                <div v-if="Array.isArray(value)" class="space-y-3">
                  <div
                    v-for="(item, index) in activeSection.props[key]"
                    :key="index"
                    class="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-cream-50 dark:bg-green-950/50 relative group"
                  >
                    <div class="absolute top-2 right-2">
                      <button
                        @click="removeArrayItem(key, index)"
                        class="p-1.5 bg-red-500/20 hover:bg-red-500 text-red-600 hover:text-white rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <PhX :size="14" />
                      </button>
                    </div>

                    <!-- If item is an object with properties -->
                    <div
                      v-if="typeof item === 'object' && !Array.isArray(item)"
                      class="space-y-2 pr-8"
                    >
                      <div v-for="(propValue, propKey) in item" :key="propKey">
                        <label
                          class="block text-xs font-medium text-green-600 dark:text-green-400 mb-1"
                          >{{ propKey }}</label
                        >
                        <input
                          v-model="activeSection.props[key][index][propKey]"
                          type="text"
                          class="w-full px-3 py-1.5 text-sm border border-green-200 dark:border-green-600 rounded bg-white dark:bg-green-900 text-green-800 dark:text-white focus:ring-1 focus:ring-brand-orange outline-none"
                        />
                      </div>
                    </div>

                    <!-- If item is a simple value -->
                    <input
                      v-else
                      v-model="activeSection.props[key][index]"
                      type="text"
                      class="w-full px-3 py-2 border border-green-200 dark:border-green-600 rounded bg-white dark:bg-green-900 text-green-800 dark:text-white text-sm focus:ring-1 focus:ring-brand-orange outline-none"
                    />
                  </div>

                  <button
                    @click="addArrayItem(key)"
                    class="mt-2 px-4 py-2 bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 text-green-700 dark:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <PhPlusCircle :size="16" />
                    Tambah {{ formatLabel(key) }}
                  </button>
                </div>

                <!-- Rich Text / Long Text -->
                <div
                  v-else-if="
                    key === 'content' ||
                    key === 'subtitle' ||
                    key === 'description' ||
                    key === 'title'
                  "
                  class="relative"
                >
                  <RichTextEditor
                    v-model="activeSection.props[key]"
                    :placeholder="`Masukkan ${formatLabel(key)}...`"
                  />
                </div>

                <!-- Image URL Special Input with Cloudinary Upload -->
                <div
                  v-else-if="
                    typeof value === 'string' &&
                    (key.toLowerCase().includes('image') ||
                      key.toLowerCase().includes('url'))
                  "
                  class="space-y-3"
                >
                  <CloudinaryImageUploader
                    v-model="activeSection.props[key]"
                    :folder="`antitesa/pages/${pageId}`"
                    :hint="`Upload ${formatLabel(key)} (Max 10MB)`"
                  />

                  <!-- Alternative: Manual URL Input -->
                  <div
                    class="pt-3 border-t border-green-200 dark:border-green-700"
                  >
                    <label
                      class="block text-xs font-medium text-green-600 dark:text-green-400 mb-2"
                    >
                      Atau paste URL manual:
                    </label>
                    <input
                      v-model="activeSection.props[key]"
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      class="w-full px-3 py-2 text-sm border border-green-300 dark:border-green-700 rounded-lg bg-cream-50 dark:bg-green-950 text-green-800 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none"
                    />
                  </div>
                </div>

                <!-- Object/Complex Data (JSON Editor) -->
                <div
                  v-else-if="typeof value === 'object' && !Array.isArray(value)"
                  class="relative"
                >
                  <textarea
                    :value="JSON.stringify(activeSection.props[key], null, 2)"
                    @input="updateObjectProp(key, $event.target.value)"
                    rows="6"
                    class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-50 dark:bg-green-950 text-green-800 dark:text-white text-xs font-mono focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                    placeholder="JSON format"
                  ></textarea>
                  <span class="text-xs text-green-500 dark:text-green-400"
                    >Klik di luar field untuk menerapkan perubahan JSON</span
                  >
                </div>

                <!-- Standard Input (String/Number) -->
                <input
                  v-else
                  v-model="activeSection.props[key]"
                  type="text"
                  class="w-full px-4 py-2.5 border border-green-300 dark:border-green-700 rounded-lg bg-cream-50 dark:bg-green-950 text-green-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <!-- Order Editor (Draggable List) -->
          <div
            v-else-if="activeTab === 'order'"
            class="bg-white dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-xl shadow-sm p-6"
          >
            <h2
              class="text-lg font-bold text-green-800 dark:text-white mb-4 flex items-center gap-2"
            >
              <PhListNumbers :size="24" class="text-brand-orange" />
              Urutan Section
            </h2>
            <p class="text-sm text-green-600 dark:text-green-400 mb-6">
              Drag dan drop item di bawah ini untuk mengatur urutan tampilan
              section di halaman publik.
            </p>

            <draggable
              v-model="sections"
              item-key="id"
              handle=".drag-handle"
              ghost-class="ghost-item"
              @start="drag = true"
              @end="drag = false"
              class="space-y-3"
            >
              <template #item="{ element: section, index }">
                <div
                  class="flex items-center gap-4 p-4 border border-green-200 dark:border-green-800 rounded-lg bg-cream-50 dark:bg-green-900/50 hover:bg-white dark:hover:bg-green-800 transition-colors group"
                >
                  <button
                    class="drag-handle p-2 text-green-400 hover:text-green-600 cursor-grab active:cursor-grabbing"
                  >
                    <PhList :size="20" />
                  </button>
                  <div
                    class="p-2 bg-white dark:bg-green-800 rounded border border-green-100 dark:border-green-700 text-brand-orange"
                  >
                    <component :is="getWidgetIcon(section.type)" :size="20" />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-green-800 dark:text-white">
                      {{ getWidgetLabel(section.type) }}
                    </h4>
                    <div class="text-xs text-green-500 font-mono mt-0.5">
                      ID: {{ section.id }}
                    </div>
                  </div>
                  <div
                    class="text-xs font-bold bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100 px-2.5 py-1 rounded-full"
                  >
                    Posisi {{ index + 1 }}
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </main>

    <!-- DEBUG PANEL (Temporary) -->
    <div
      v-if="showDebug"
      class="fixed bottom-0 left-0 right-0 bg-black/90 text-green-400 p-4 font-mono text-xs z-[9999] h-48 overflow-auto border-t-2 border-green-500"
    >
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-bold">🔍 DEBUG: RAW SECTION DATA</h3>
        <span class="text-white">{{ sections.length }} Sections Loaded</span>
      </div>
      <pre>{{ JSON.stringify(sections, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, markRaw, h, watch } from "vue";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import draggable from "vuedraggable";
import RichTextEditor from "@/components/molecules/RichTextEditor.vue";
import CloudinaryImageUploader from "@/components/ui/CloudinaryImageUploader.vue";
import {
  PhPackage,
  PhArrowLeft,
  PhPencilSimple,
  PhEye,
  PhFloppyDisk,
  PhArrowUp,
  PhArrowDown,
  PhGear,
  PhTrash,
  PhLayout,
  PhFaders,
  PhX,
  PhImage,
  PhSquaresFour,
  PhTextT,
  PhTextbox,
  PhCoffee,
  PhLightning,
  PhBook,
  PhMusicNotes,
  PhWifiHigh,
  PhBookOpen,
  PhPaintBrush,
  PhStar,
  PhUser,
  PhCamera,
  PhCheckCircle,
  PhQuestion,
  PhUserCircle,
  PhEnvelopeSimple,
  PhPaperPlaneTilt,
  PhBuildings,
  PhPlayCircle,
  PhMapPin,
  PhPhone,
  PhArrowsOutLineHorizontal,
  PhBug,
  PhList,
  PhListNumbers,
  PhSpinner,
  PhPlusCircle,
  PhBell,
} from "@phosphor-icons/vue";
import pageService from "@/api/services/page.service";

// ==================== WIDGET COMPONENTS ====================
import { defineAsyncComponent } from "vue";

// Dynamic Imports (Shared with Storefront)
const HeroBannerCenter = defineAsyncComponent(
  () => import("@/views/storefront/sections/HeroSection.vue")
);
const HeroSplitRight = defineAsyncComponent(
  () => import("@/views/storefront/sections/HeroSplitRight.vue")
);
const HeroSplitLeft = defineAsyncComponent(
  () => import("@/views/storefront/sections/HeroSplitLeft.vue")
);
const ProductGrid = defineAsyncComponent(
  () => import("@/views/storefront/sections/ProductsSection.vue")
);
const FeatureGrid3 = defineAsyncComponent(
  () => import("@/views/storefront/sections/FeatureGrid3.vue")
);
const FeatureGrid4 = defineAsyncComponent(
  () => import("@/views/storefront/sections/FeatureGrid4.vue")
);
const ContentImageRight = defineAsyncComponent(
  () => import("@/views/storefront/sections/ContentImageRight.vue")
);
const ContentImageLeft = defineAsyncComponent(
  () => import("@/views/storefront/sections/ContentImageLeft.vue")
);
const TextBlock = defineAsyncComponent(
  () => import("@/views/storefront/sections/TextBlock.vue")
);
const Stats3Col = defineAsyncComponent(
  () => import("@/views/storefront/sections/Stats3Col.vue")
);
const CTACentered = defineAsyncComponent(
  () => import("@/views/storefront/sections/CTACentered.vue")
);
const CTASplit = defineAsyncComponent(
  () => import("@/views/storefront/sections/CTASplit.vue")
);
const TestimonialCard = defineAsyncComponent(
  () => import("@/views/storefront/sections/TestimonialCard.vue")
);
const GalleryGrid = defineAsyncComponent(
  () => import("@/views/storefront/sections/GalleryGrid.vue")
);
const PricingCard = defineAsyncComponent(
  () => import("@/views/storefront/sections/PricingCard.vue")
);
const FAQSection = defineAsyncComponent(
  () => import("@/views/storefront/sections/FAQSection.vue")
);
const TeamGrid = defineAsyncComponent(
  () => import("@/views/storefront/sections/TeamGrid.vue")
);
const NewsletterForm = defineAsyncComponent(
  () => import("@/views/storefront/sections/NewsletterForm.vue")
);
const LogoCloud = defineAsyncComponent(
  () => import("@/views/storefront/sections/LogoCloud.vue")
);
const VideoEmbed = defineAsyncComponent(
  () => import("@/views/storefront/sections/VideoEmbed.vue")
);
const ContactCard = defineAsyncComponent(
  () => import("@/views/storefront/sections/ContactCard.vue")
);
const LibrarySection = defineAsyncComponent(
  () => import("@/views/storefront/sections/LibrarySection.vue")
);
const MerchandiseSection = defineAsyncComponent(
  () => import("@/views/storefront/sections/MerchandiseSection.vue")
);
const EventsSection = defineAsyncComponent(
  () => import("@/views/storefront/sections/EventsSection.vue")
);
const FunFactsSection = defineAsyncComponent(
  () => import("@/views/storefront/sections/FunFactsSection.vue")
);
const NotificationSection = defineAsyncComponent(
  () => import("@/views/storefront/sections/NotificationSection.vue")
);

import { useConfirm } from "@/composables/useConfirm";
import { showToast } from "@/utils/toast";
import { useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();

// State
const isMobile = ref(false);
const pageId = computed(() => route.params.id);
const pageTitle = ref("Loading...");

const sections = ref([]);
const activeTab = ref(null); // Holds section ID or 'order'
const showDebug = ref(false);
const saving = ref(false);
const autoSaving = ref(false);
const lastSaved = ref(null);
let saveTimeout = null;
let isInitialLoad = true;

const availableWidgets = [
  {
    type: "HeroBannerCenter",
    label: "Hero - Center",
    iconComponent: PhImage,
    defaultProps: {
      badgeText: "Marpoyan, Pekanbaru",
      title: 'Bukan Cuma<br><span class="text-orange-500">Tempat Ngopi</span>',
      subtitle:
        "Library. Workspace. Coffee. Tiga elemen yang bikin lu produktif sambil tetep santai. <b>Antitesa</b> bukan tempat nongkrong biasa.",
      buttonText: "Lihat Menu",
      secondaryButtonText: "Eksplor Ruang",
      features: [
        { text: "500+ Buku" },
        { text: "High-Speed WiFi" },
        { text: "08:00 - 23:00" },
      ],
    },
  },
  {
    type: "HeroSplitRight",
    label: "Hero - Image Right",
    iconComponent: PhImage,
    defaultProps: {
      badge: "Premium Experience",
      headingLine1: "Kopi Bukan",
      headingLine2Part1: "Sekadar",
      headingLine2Part2: "Minuman",
      description:
        "Ini tentang ritual. Tentang menemukan momen di tengah kesibukan. Tentang menyeduh pikiran sambil menikmati seduhan terbaik.",
      features: [
        {
          title: "Single Origin Beans",
          subtitle: "Biji kopi pilihan dari petani lokal Indonesia",
        },
        {
          title: "Manual Brew Methods",
          subtitle: "V60, Chemex, French Press - lu pilih, kita seduh",
        },
        {
          title: "Barista Bersertifikat",
          subtitle: "Bukan asal bikin. Setiap cangkir adalah karya",
        },
      ],
      buttonText: "Eksplor Menu Kopi →",
      imageUrl: "",
      quoteText:
        "Kopi yang baik datang dari biji yang baik. Pikiran yang jernih datang dari ruang yang tenang.",
      quoteAuthor: "Filosofi Antitesa",
    },
  },
  {
    type: "HeroSplitLeft",
    label: "Hero - Image Left",
    iconComponent: PhImage,
    defaultProps: {
      badge: "DI JALAN MARPOYAN",
      headingLine1: "Ruang Baca.",
      headingLine2: "Ruang Kerja.",
      headingLine3: "Ruang Pikir.",
      description:
        "Gak cuma sekedar wifi gratisan dan kursi empuk. Di sini lu dapet akses ke ribuan buku, meja kerja yang proper, sama kopi yang bikin otak fresh.",
      features: [
        {
          title: "Private Workspace",
          subtitle: "Meja individual dengan colokan & lampu baca",
        },
        {
          title: "Koleksi Buku Kurated",
          subtitle: "Dari filosofi sampe self-development",
        },
        {
          title: "Suasana Tenang",
          subtitle: "No drama. No noise. Pure focus.",
        },
      ],
      buttonPrimary: "Book Workspace",
      buttonSecondary: "Lihat Virtual Tour",
      imageUrl: "",
      stats: [
        { value: "500+", label: "Buku" },
        { value: "24", label: "Meja Kerja" },
        { value: "100%", label: "Focus Mode" },
      ],
    },
  },
  {
    type: "ProductGrid",
    label: "Product Grid (API)",
    iconComponent: PhSquaresFour,
    defaultProps: {
      title: 'Koleksi <span class="text-orange-500">Terbaik</span> Kami',
      subtitle: "Dipilih khusus untuk menemani waktu produktif anda",
      limit: 8,
      showLink: true,
    },
  },
  {
    type: "NotificationSection",
    label: "Announcements",
    iconComponent: PhBell,
    defaultProps: {
      title: "Pengumuman Terbaru",
      limit: 5,
    },
  },
  {
    type: "FeatureGrid3",
    label: "Features (3 Col)",
    iconComponent: PhSquaresFour,
    defaultProps: {
      title: 'Tiga Pilar <span class="text-orange-500">Antitesa</span>',
      subtitle:
        "Bukan cuma tempat ngopi. Ini ekosistem lengkap buat lu yang pengen produktif sambil tetep nyaman.",
      features: [
        {
          title: "Premium Coffee",
          description:
            "Single origin beans, manual brew methods, barista bersertifikat.",
          items: [
            { text: "Biji kopi dari petani lokal pilihan" },
            { text: "V60, Chemex, French Press" },
          ],
        },
        {
          title: "Curated Library",
          description: "500+ buku pilihan dari filosofi hingga bisnis.",
          items: [
            { text: "Koleksi klasik & kontemporer" },
            { text: "Reading corner nyaman" },
          ],
        },
        {
          title: "Pro Workspace",
          description: "24 meja kerja dengan WiFi 100 Mbps.",
          items: [
            { text: "Private & shared workspace" },
            { text: "Silent zone" },
          ],
        },
      ],
      bottomText:
        "Tiga elemen ini bukan cuma <em>exist</em>. Mereka <strong>synergize</strong>.",
      buttonText: "Experience the Difference →",
    },
  },
  {
    type: "FeatureGrid4",
    label: "Features (4 Col)",
    iconComponent: PhSquaresFour,
    defaultProps: { title: "What We Offer" },
  },
  {
    type: "ContentImageRight",
    label: "Content + Image Right",
    iconComponent: PhTextbox,
    defaultProps: {
      badge: "Philosophy",
      title: '<span class="text-orange-500">Slow Down,</span> <br/>Think Deep',
      description:
        "Di dunia yang serba cepat, kita tawarkan sesuatu yang berbeda: ruang untuk melambat, berpikir, dan berkembang.",
      content:
        "Setiap detail di Antitesa dirancang untuk mendukung deep work dan meaningful conversation.",
      items: [
        { text: "Noise level terkontrol" },
        { text: "Ergonomic furniture" },
        { text: "Natural lighting balance" },
      ],
      buttonText: "Experience It Yourself",
      imageUrl: "",
    },
  },
  {
    type: "ContentImageLeft",
    label: "Content + Image Left",
    iconComponent: PhTextbox,
    defaultProps: {
      badge: "Our Story",
      title:
        'Lahir dari Kecintaan pada <span class="text-orange-500">Kopi & Buku</span>',
      description:
        "Antitesa dimulai dari pertanyaan sederhana: kenapa gak ada tempat yang combine kopi berkualitas dengan library yang proper?",
      content:
        "Kita percaya ruang mempengaruhi pikiran. Pikiran mempengaruhi karya. Dan karya mengubah dunia.",
      buttonText: "Baca Selengkapnya →",
      imageUrl: "",
    },
  },
  {
    type: "TextBlock",
    label: "Text Block",
    iconComponent: PhTextT,
    defaultProps: { title: "About Us", content: "Share your story here..." },
  },
  {
    type: "Stats3Col",
    label: "Stats (3 Columns)",
    iconComponent: PhSquaresFour,
    defaultProps: { title: "Numbers Speak" },
  },
  {
    type: "CTACentered",
    label: "CTA - Centered",
    iconComponent: PhPackage,
    defaultProps: {
      title:
        'Siap Upgrade <br/><span class="text-orange-500">Pengalaman Ngopi</span> Lu?',
      description:
        "Gak cuma tempat minum kopi. Ini tentang menemukan ruang dimana pikiran lu bisa berkembang.",
      stats: [
        { value: "500+", label: "Buku Pilihan" },
        { value: "24", label: "Workspace" },
        { value: "4.9", label: "Rating" },
      ],
      primaryButtonText: "Reservasi Sekarang",
      secondaryButtonText: "Lihat Menu",
      badges: [
        { icon: "star", text: "4.9/5 dari 300+ reviews" },
        { icon: "check", text: "Reservasi gratis & mudah" },
      ],
    },
  },
  {
    type: "CTASplit",
    label: "CTA - Split Layout",
    iconComponent: PhPackage,
    defaultProps: { title: "Subscribe Newsletter", buttonText: "Subscribe" },
  },
  {
    type: "TestimonialCard",
    label: "Testimonial",
    iconComponent: PhTextbox,
    defaultProps: {
      name: "John Doe",
      role: "CEO",
      quote: "Outstanding service!",
    },
  },
  {
    type: "GalleryGrid",
    label: "Gallery Grid",
    iconComponent: PhImage,
    defaultProps: { title: "Our Gallery" },
  },
  {
    type: "PricingCard",
    label: "Pricing Card",
    iconComponent: PhPackage,
    defaultProps: { title: "Premium", price: "99K", period: "month" },
  },
  {
    type: "FAQSection",
    label: "FAQ",
    iconComponent: PhTextbox,
    defaultProps: { title: "Frequently Asked Questions" },
  },
  {
    type: "TeamGrid",
    label: "Team Members",
    iconComponent: PhSquaresFour,
    defaultProps: { title: "Meet The Team" },
  },
  {
    type: "NewsletterForm",
    label: "Newsletter Signup",
    iconComponent: PhPackage,
    defaultProps: { title: "Stay Connected", subtitle: "Get updates" },
  },
  {
    type: "LogoCloud",
    label: "Logo/Partner Cloud",
    iconComponent: PhSquaresFour,
    defaultProps: { title: "Partners" },
  },
  {
    type: "VideoEmbed",
    label: "Video Player",
    iconComponent: PhImage,
    defaultProps: { title: "Watch Video", videoUrl: "" },
  },
  {
    type: "ContactCard",
    label: "Contact Info",
    iconComponent: PhTextbox,
    defaultProps: { title: "Get In Touch" },
  },
  {
    type: "EventsSection",
    label: "Events Calendar (API)",
    iconComponent: PhPackage,
    defaultProps: {
      title: 'Lebih dari Sekedar <span class="text-orange-500">Ngopi</span>',
      subtitle: "Workshop, book club, dan networking events setiap bulan",
      limit: 3,
      showLink: true,
    },
  },
  {
    type: "FunFactsSection",
    label: "Fun Facts (API)",
    iconComponent: PhLightning,
    defaultProps: {
      title: "Antitesa in Numbers",
      subtitle: "Data speaks louder than promises",
      limit: 4,
      bottomQuote: "Tempat favorit gue buat kerja dan baca.",
      quoteAuthor: "Happy Member",
    },
  },
  {
    type: "LibrarySection",
    label: "Book Library Info",
    iconComponent: PhBook,
    defaultProps: {
      badge: "Library & Workspace",
      title: 'Tempat Otak <span class="text-orange-500">Bekerja</span>',
      description:
        "Koleksi buku pilihan, ruang kerja nyaman, dan atmosfer yang bikin lu betah berjam-jam.",
      libraryTitle: "Perpustakaan Kurated",
      librarySubtitle: "500+ buku pilihan dari berbagai genre",
      libraryFeatures: [
        {
          title: "Filosofi & Pemikiran",
          subtitle: "Dari Nietzsche sampai Rumi",
        },
        {
          title: "Self-Development",
          subtitle: "Upgrade diri lewat bacaan berkualitas",
        },
      ],
      workspaceTitle: "Workspace Premium",
      workspaceSubtitle: "24 meja kerja dengan fasilitas lengkap",
      workspaceFeatures: [
        { title: "Colokan di Setiap Meja", subtitle: "Charge sepuasnya" },
        { title: "High-Speed WiFi", subtitle: "100 Mbps" },
      ],
      stats: [
        { value: "500+", label: "Koleksi Buku" },
        { value: "24", label: "Workspace Seat" },
        { value: "100", label: "Mbps WiFi" },
        { value: "15H", label: "Open Daily" },
      ],
      buttonText: "Reservasi Workspace →",
    },
  },
  {
    type: "MerchandiseSection",
    label: "Merchandise Store (API)",
    iconComponent: PhPackage,
    defaultProps: {
      title: 'Bawa Pulang <span class="text-orange-500">Vibe</span>-nya',
      subtitle: "Official merch buat lu yang pengen piece of Antitesa at home",
      limit: 3,
      showLink: true,
    },
  },
];

const widgetComponents = {
  HeroBannerCenter: markRaw(HeroBannerCenter),
  HeroSplitRight: markRaw(HeroSplitRight),
  HeroSplitLeft: markRaw(HeroSplitLeft),
  ProductGrid: markRaw(ProductGrid),
  FeatureGrid3: markRaw(FeatureGrid3),
  FeatureGrid4: markRaw(FeatureGrid4),
  ContentImageRight: markRaw(ContentImageRight),
  ContentImageLeft: markRaw(ContentImageLeft),
  TextBlock: markRaw(TextBlock),
  Stats3Col: markRaw(Stats3Col),
  CTACentered: markRaw(CTACentered),
  CTASplit: markRaw(CTASplit),
  TestimonialCard: markRaw(TestimonialCard),
  GalleryGrid: markRaw(GalleryGrid),
  PricingCard: markRaw(PricingCard),
  FAQSection: markRaw(FAQSection),
  TeamGrid: markRaw(TeamGrid),
  NewsletterForm: markRaw(NewsletterForm),
  LogoCloud: markRaw(LogoCloud),
  VideoEmbed: markRaw(VideoEmbed),
  ContactCard: markRaw(ContactCard),
  LibrarySection: markRaw(LibrarySection),
  MerchandiseSection: markRaw(MerchandiseSection),
  NotificationSection: markRaw(NotificationSection),
  EventsSection: markRaw(EventsSection),
  FunFactsSection: markRaw(FunFactsSection),
};

const getWidgetComponent = (type) => widgetComponents[type] || TextBlock;

const addWidget = (widget) => {
  const newId = `section-${Date.now()}`;
  sections.value.push({
    id: newId,
    type: widget.type,
    props: { ...widget.defaultProps },
  });
  // Switch to the new tab immediately
  activeTab.value = newId;
};

const removeSection = async (index) => {
  const confirmed = await confirm({
    title: "Hapus Section?",
    message:
      "Section ini akan dihapus dari halaman. Tindakan ini tidak dapat dibatalkan.",
    variant: "danger",
    confirmText: "Ya, Hapus",
    cancelText: "Batal",
  });

  if (confirmed) {
    sections.value.splice(index, 1);
    if (sections.value.length > 0) {
      activeTab.value = sections.value[Math.max(0, index - 1)].id;
    } else {
      activeTab.value = null;
    }
    showToast.success("Berhasil", "Section dihapus");
  }
};

// Helpers
const activeSection = computed(() => {
  if (activeTab.value === "order") return null;
  return sections.value.find((s) => s.id === activeTab.value);
});

const getWidgetLabel = (type) => {
  const widget = availableWidgets.find((w) => w.type === type);
  return widget ? widget.label : type;
};

const getWidgetIcon = (type) => {
  const widget = availableWidgets.find((w) => w.type === type);
  return widget ? widget.iconComponent : PhLayout;
};

const formatLabel = (key) => {
  return key.replace(/([A-Z])/g, " $1").trim();
};

// Helper: Add array item
const addArrayItem = (key) => {
  if (!activeSection.value) return;

  const currentArray = activeSection.value.props[key];
  if (!Array.isArray(currentArray)) return;

  // Determine structure based on existing items
  if (currentArray.length > 0 && typeof currentArray[0] === "object") {
    // Clone structure of first item
    const template = {};
    Object.keys(currentArray[0]).forEach((k) => {
      template[k] = "";
    });
    activeSection.value.props[key].push(template);
  } else {
    // Simple string value
    activeSection.value.props[key].push("");
  }
};

// Helper: Remove array item
const removeArrayItem = async (key, index) => {
  if (!activeSection.value) return;

  const confirmed = await confirm({
    title: "Hapus Item?",
    message: "Item ini akan dihapus permanen.",
    variant: "danger",
  });

  if (confirmed) {
    activeSection.value.props[key].splice(index, 1);
  }
};

// Helper: Update object property from JSON input
const updateObjectProp = (key, jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    activeSection.value.props[key] = parsed;
  } catch (e) {
    console.warn("Invalid JSON, tidak bisa update:", e);
    // Keep existing value if JSON is invalid
  }
};

const formatTime = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

const savePage = async (isAuto = false) => {
  if (isAuto) {
    autoSaving.value = true;
  } else {
    saving.value = true;
  }

  try {
    // Sanitize payload: Remove Vue Reactivity Proxies
    const payload = JSON.parse(JSON.stringify(sections.value));
    await pageService.updateSections(pageId.value, payload);
    lastSaved.value = new Date();

    if (!isAuto) {
      showToast.success("Berhasil!", "Halaman berhasil disimpan");
    }

    console.log(
      `✅ Page ${isAuto ? "auto-" : ""}saved successfully at ${lastSaved.value.toLocaleTimeString()}`
    );
  } catch (e) {
    console.error("Error saving page:", e);
    if (!isAuto) {
      showToast.error("Gagal!", "Gagal menyimpan halaman");
    }
  } finally {
    if (isAuto) {
      autoSaving.value = false;
    } else {
      saving.value = false;
    }
  }
};

const preview = () => {
  // Navigate to PageViewer with current page ID
  router.push({ name: "PageViewer", params: { id: pageId.value } });
};

const fetchPage = async () => {
  try {
    const { data } = await pageService.getById(pageId.value);
    const page = data.data;
    pageTitle.value = page.title;

    // Map backend sections to frontend widgets
    if (page.sections && Array.isArray(page.sections)) {
      sections.value = page.sections
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((s) => {
          // IMPORTANT: contentData already contains componentType and all props
          // Backend structure: contentData = { componentType: "HeroBannerCenter", title: "...", subtitle: "..." }
          const contentData = s.contentData || {};

          // Extract componentType from contentData
          let widgetType = contentData.componentType;

          // Fallback: Try to extract from section name if componentType is missing
          if (!widgetType) {
            widgetType = s.name.replace(/\s+\d+$/, "").replace(/\s/g, "");
            console.warn(
              `[FetchPage] componentType missing for section ${s.id}. Fallback to name: ${widgetType}`
            );
          }

          // Remove componentType from props (it's metadata, not a prop)
          const { componentType, ...props } = contentData;

          console.log(
            `[FetchPage] ✅ Section ID: ${s.id}, Type: ${widgetType}, Props:`,
            props
          );

          // Validate widget exists in registry
          if (!widgetComponents[widgetType]) {
            console.warn(
              `[FetchPage] ⚠️ Widget type "${widgetType}" not found in registry. Using TextBlock as fallback.`
            );
          }

          return {
            id: s.id,
            type: widgetType,
            props: props, // All props except componentType
          };
        });

      console.log(
        `[FetchPage] 🎉 Successfully loaded ${sections.value.length} sections`
      );

      // Auto-select first section
      if (sections.value.length > 0) {
        activeTab.value = sections.value[0].id;
      }
    } else {
      console.log("[FetchPage] No sections found in page data");
      sections.value = [];
    }
  } catch (err) {
    console.error("Error fetching page:", err);
    pageTitle.value = "Page Not Found";
  }
};

onMounted(async () => {
  if (pageId.value) {
    await fetchPage();
    // Mark initial load complete after a short delay
    setTimeout(() => {
      isInitialLoad = false;
    }, 1000);
  }
});

// Auto-save watcher with debounce
watch(
  sections,
  () => {
    // Skip auto-save during initial load
    if (isInitialLoad) return;

    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Set new timeout for auto-save (2 seconds after last change)
    saveTimeout = setTimeout(() => {
      saveTimeout = null;
      savePage(true);
    }, 2000);
  },
  { deep: true }
);

// Ensure we save before navigating away if there are pending changes
onBeforeRouteLeave(async (to, from, next) => {
  // If currently saving, warn user
  if (saving.value || autoSaving.value) {
    const confirmed = await confirm({
      title: "Penyimpanan dalam proses",
      message:
        "Penyimpanan sedang berlangsung. Yakin ingin keluar? Perubahan mungkin tidak tersimpan.",
      variant: "warning",
      confirmText: "Ya, Keluar",
      cancelText: "Tunggu",
    });

    if (confirmed) {
      next();
    } else {
      next(false);
    }
    return;
  }

  if (saveTimeout) {
    const confirmed = await confirm({
      title: "Perubahan belum tersimpan",
      message: "Ada perubahan yang belum tersimpan. Simpan sekarang?",
      variant: "info",
      confirmText: "Simpan & Keluar",
      cancelText: "Keluar Tanpa Simpan",
    });

    if (confirmed) {
      clearTimeout(saveTimeout);
      saveTimeout = null;
      await savePage(false); // Force manual-like save to ensure it completes
      next();
    } else {
      next();
    }
  } else {
    next();
  }
});

const onDragEnd = () => {
  // Trigger auto-save immediately purely for UX responsiveness feel, though watcher handles it too
  if (!isInitialLoad) {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => savePage(true), 500);
  }
};
</script>

<style scoped>
.ghost-item {
  opacity: 0.5;
  background: #f0fdf4; /* Green-50ish */
  border: 2px dashed #16a34a; /* Green-600 */
}
.dark .ghost-item {
  background: #14532d; /* Green-900 */
  border-color: #4ade80; /* Green-400 */
}
</style>
