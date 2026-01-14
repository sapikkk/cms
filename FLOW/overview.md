Spesifikasi Teknis & Arsitektur Lengkap: CoffeeShop Enterprise CMS

Versi Dokumen: 2.1 (Implemented)
Arsitektur: Hybrid Relational (SQL) + Document (JSONB)
Platform: Web (Single Page Application) + REST API

1. Ringkasan Eksekutif (Project Overview)

Proyek ini adalah pengembangan Platform CMS & E-Commerce Terintegrasi khusus untuk bisnis Coffee Shop. Berbeda dengan website konvensional, sistem ini dirancang sebagai Dynamic Page Builder yang memberikan fleksibilitas total kepada pengguna (Admin/Media) untuk mengubah struktur layout, desain, dan konten tanpa menyentuh kode, namun tetap menjaga integritas data transaksi dan keamanan yang ketat melalui kontrol Master Admin.

Pilar Utama Sistem:

Data-Driven UI: Tampilan frontend digerakkan sepenuhnya oleh konfigurasi JSON dari database.

Coffee Intelligence: Manajemen produk mendalam hingga level bahan baku (ingredients) dan takaran.

Digital Library: Modul pustaka/buku digital dengan kustomisasi visual per item.

Absolute Security: Hirarki hak akses dengan mekanisme "Master Lock" dan Audit Trail lengkap.

2. Tech Stack & Dependencies

Berikut adalah daftar teknologi dan library yang wajib digunakan untuk memenuhi kebutuhan fitur kompleks.

A. Frontend (Client Side)

Core Framework: Vue.js 3 (Script Setup, Composition API).

Build Tool: Vite (Untuk performa development dan build production yang cepat).

State Management: Pinia (Store terpusat untuk Auth, Page Config, Cart).

Routing: Vue Router 4 (Dynamic Routing & Guard Navigation).

UI Framework: Tailwind CSS 3 (Utility-first styling).

HTTP Client: Axios (Interceptors untuk handle Token JWT).

Rich Text Editor: Tiptap atau Quill (Untuk menulis konten buku/blog).

Data Visualization: Chart.js atau ApexCharts (Laporan Keuangan).

Export Tools:

jspdf & jspdf-autotable (Generate Laporan PDF).

xlsx / SheetJS (Generate Laporan Excel).

Date Handling: Day.js (Ringan & powerful untuk format tanggal).

Icons: Phosphor Icons atau Heroicons (SVG Component).

B. Backend (Server Side)

Runtime: Node.js (LTS Version).

Framework: Express.js (dengan TypeScript) atau NestJS.

Database: PostgreSQL (Wajib versi terbaru support JSONB).

ORM: Prisma ORM (Type-safe database client).

Authentication: JSON Web Token (JWT) + Bcrypt (Hashing Password).

File Upload: Multer (Middleware upload) -> Simpan ke Cloud Storage (AWS S3 / Firebase Storage / MinIO).

Logging: Winston atau Morgan (Pencatatan log server).

Validation: Zod (Validasi input API yang ketat).

3. Struktur Folder Lengkap (Monorepo Enterprise)

Struktur ini memisahkan client dan server secara tegas, dengan pembagian layer yang sangat granular untuk skalabilitas.

coffeeshop-project/
├── .github/                         # CI/CD Workflows
├── .vscode/                         # Shared VSCode Settings
├── client/                          # [FRONTEND VUE.JS 3 + VITE]
│   ├── public/                      # Static files (favicon, robots.txt)
│   ├── src/
│   │   ├── api/                     # API Layer (Centralized)
│   │   │   ├── core/                # Axios instance configuration
│   │   │   │   └── axiosClient.js   # Interceptors (Req/Res)
│   │   │   ├── services/            # Modul API per fitur
│   │   │   │   ├── auth.service.js
│   │   │   │   ├── product.service.js
│   │   │   │   ├── page.service.js
│   │   │   │   ├── book.service.js
│   │   │   │   ├── master.service.js
│   │   │   │   └── report.service.js
│   │   │
│   │   ├── assets/
│   │   │   ├── fonts/               # Custom fonts (WOFF2)
│   │   │   ├── images/              # Fallbacks & Placeholders
│   │   │   └── styles/              # Global CSS
│   │   │       ├── main.css         # Tailwind directives
│   │   │       ├── _variables.css   # CSS Var definitions (--primary-color)
│   │   │       └── _transitions.css # Vue transitions classes
│   │   │
│   │   ├── components/              # ATOMIC DESIGN SYSTEM
│   │   │   ├── atoms/               # Komponen unit terkecil
│   │   │   │   ├── AppButton.vue
│   │   │   │   ├── AppInput.vue
│   │   │   │   ├── AppIcon.vue      # Wrapper for SVG icons
│   │   │   │   ├── AppBadge.vue
│   │   │   │   ├── AppLoader.vue
│   │   │   │   └── AppToggle.vue    # Switch button (ON/OFF)
│   │   │   ├── molecules/           # Gabungan unit atoms
│   │   │   │   ├── FormGroup.vue    # Label + Input + Error Msg
│   │   │   │   ├── SearchBar.vue
│   │   │   │   ├── DatePicker.vue   # Range selector
│   │   │   │   ├── PaginationControl.vue
│   │   │   │   └── IngredientRow.vue
│   │   │   ├── organisms/           # Section UI kompleks
│   │   │   │   ├── TheSidebar.vue
│   │   │   │   ├── TheNavbar.vue
│   │   │   │   ├── DataTable.vue    # Reusable table with sorting
│   │   │   │   ├── LogTable.vue     # Specialized for audit logs
│   │   │   │   └── FileUploader.vue # Dropzone area
│   │   │   └── builder-widgets/     # Dynamic Page Blocks (Drag & Drop)
│   │   │       ├── HeroBanner.vue
│   │   │       ├── ProductCatalog.vue
│   │   │       ├── TextBlock.vue
│   │   │       └── EventCalendar.vue
│   │   │
│   │   ├── composables/             # Vue Composables (Business Logic)
│   │   │   ├── useAuth.js           # Login state handling
│   │   │   ├── usePermission.js     # ACL Logic (isMaster, isLocked)
│   │   │   ├── useTheme.js          # Dynamic CSS injection
│   │   │   ├── usePageBuilder.js    # Logic penyusunan JSON halaman
│   │   │   ├── useNotification.js   # Toast/Snackbar
│   │   │   └── useCurrency.js       # IDR formatting
│   │   │
│   │   ├── config/                  # Frontend Constants
│   │   │   ├── app.config.js
│   │   │   └── menu.config.js       # Struktur Sidebar per role
│   │   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.vue       # Blank canvas for login
│   │   │   ├── DashboardLayout.vue  # Main Admin Panel
│   │   │   └── StorefrontLayout.vue # Public Site Wrapper
│   │   │
│   │   ├── router/
│   │   │   ├── index.js
│   │   │   └── guards/
│   │   │       ├── auth.guard.js    # Cek token keberadaan
│   │   │       └── role.guard.js    # Cek hak akses route
│   │   │
│   │   ├── stores/                  # Pinia Stores
│   │   │   ├── auth.store.js
│   │   │   ├── ui.store.js          # State sidebar/modal
│   │   │   ├── cart.store.js        # Shopping cart
│   │   │   └── page.store.js        # Active page config
│   │   │
│   │   ├── utils/                   # Pure JS Helpers
│   │   │   ├── date-format.js
│   │   │   ├── validations.js
│   │   │   └── export-helper.js     # Logic generate PDF/Excel
│   │   │
│   │   ├── views/                   # PAGES / SCREENS
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.vue
│   │   │   │   └── AccessLocked.vue # Halaman jika akun dikunci
│   │   │   ├── master-admin/
│   │   │   │   ├── AuditLogs.vue
│   │   │   │   └── SystemAccess.vue # Matrix toggle hak akses
│   │   │   ├── dashboard/
│   │   │   │   ├── Overview.vue
│   │   │   │   ├── products/
│   │   │   │   │   ├── ProductList.vue
│   │   │   │   │   └── ProductForm.vue
│   │   │   │   ├── library/
│   │   │   │   │   ├── BookList.vue
│   │   │   │   │   └── BookForm.vue
│   │   │   │   ├── pages/
│   │   │   │   │   ├── PageList.vue
│   │   │   │   │   └── PageEditor.vue # Canvas Drag-n-drop
│   │   │   │   ├── reports/
│   │   │   │   │   └── FinancialReport.vue
│   │   │   │   └── settings/
│   │   │           └── ThemeCustomizer.vue
│   │   │   └── storefront/
│   │   │       ├── DynamicEntry.vue # Catch-all route handler
│   │   │       ├── ProductDetail.vue
│   │   │       └── BookDetail.vue
│   │   │
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # [BACKEND NODE.JS + TS]
│   ├── src/
│   │   ├── config/                  # Configuration & Env
│   │   │   ├── db.ts                # Prisma Client Singleton
│   │   │   ├── env.ts               # Env validation (Zod)
│   │   │   └── logger.ts            # Winston/Morgan setup
│   │   │
│   │   ├── constants/
│   │   │   ├── roles.ts             # Enum Roles
│   │   │   └── messages.ts          # Standard Response Messages
│   │   │
│   │   ├── controllers/             # HTTP Request Handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── page.controller.ts
│   │   │   ├── book.controller.ts
│   │   │   ├── report.controller.ts
│   │   │   └── master.controller.ts
│   │   │
│   │   ├── dtos/                    # Data Transfer Objects (Validation)
│   │   │   ├── auth.dto.ts
│   │   │   ├── product.dto.ts       # Schema validasi input produk
│   │   │   └── page.dto.ts
│   │   │
│   │   ├── interfaces/              # TypeScript Types/Interfaces
│   │   │   ├── request.interface.ts # Extend Express Request
│   │   │   └── jwt.interface.ts
│   │   │
│   │   ├── middlewares/             # Express Middlewares
│   │   │   ├── error.middleware.ts  # Global Error Handler
│   │   │   ├── auth.middleware.ts   # Verify JWT Token
│   │   │   ├── rbac.middleware.ts   # Role Checking (ACL)
│   │   │   ├── upload.middleware.ts # Multer config (File limitation)
│   │   │   ├── audit.middleware.ts  # Activity Logger (Pre/Post hooks)
│   │   │   ├── lock.middleware.ts   # Account Blocking
│   │   │   └── ratelimit.middleware.ts # API Rate Limiting
│   │   │
│   │   ├── routes/                  # API Routes Definition
│   │   │   ├── v1/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── product.routes.ts
│   │   │   │   ├── page.routes.ts
│   │   │   │   └── master.routes.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── services/                # Business Logic Layer (Database Calls)
│   │   │   ├── auth.service.ts
│   │   │   ├── product.service.ts
│   │   │   ├── page.service.ts      # Logic manipulasi JSON layout
│   │   │   ├── log.service.ts       # Saving logic to Prisma
│   │   │   └── report.service.ts    # Generating report buffer
│   │   │
│   │   ├── utils/                   # Shared Utility Functions
│   │   │   ├── password.ts          # Bcrypt hashing helper
│   │   │   ├── jwt.ts               # Token signing/decoding
│   │   │   └── file-storage.ts      # Cloud upload helper (S3/MinIO)
│   │   │
│   │   ├── app.ts                   # Express App Setup
│   │   └── server.ts                # Server Entry Point
│   │
│   ├── prisma/
│   │   ├── migrations/              # SQL Migration files
│   │   ├── schema.prisma            # Database Schema
│   │   └── seed.ts                  # Initial Data Seeding (Default Admin)
│   │
│   ├── tests/                       # Unit & Integration Tests
│   ├── .env.example
│   ├── nodemon.json
│   ├── package.json
│   └── tsconfig.json
│
└── package.json                     # Monorepo Root Script


4. Database Schema (Prisma ORM)

Skema database dirancang untuk menangani relasi data yang ketat (Produk, User) sekaligus fleksibilitas tinggi (Layout Halaman, Config Buku) menggunakan tipe data Json.

// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// --- ENUMS ---
enum Role {
  MASTER_ADMIN
  ADMIN_OWNER
  MEDIA_STAFF
  USER_PUBLIC
}

enum UnitType {
  GRAM
  ML
  SHOT
  PCS
}

// --- MODELS ---

// 1. User & Authentication
model User {
  id        String   @id @default(uuid())
  username  String
  email     String   @unique
  password  String   // Hashed
  role      Role     @default(USER_PUBLIC)
  
  // Master Lock Mechanism
  isLocked  Boolean  @default(false) // Jika true, user tidak bisa login/akses API
  
  // Relasi
  logs      ActivityLog[] // User activity history
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ... (Models lainnya sama dengan implementasi)


5. Matriks Hak Akses & Keamanan (Role-Based Access Control)

Sistem menggunakan Middleware Security di backend untuk memvalidasi setiap request.

A. Hirarki User

MASTER ADMIN (Level 0 - Absolute Power)

Deskripsi: Superuser teknis atau pemilik sistem utama.

Fitur Eksklusif:

User Lock: Membekukan akun Owner/Media (Login ditolak).

Feature Override: Menghidupkan/mematikan modul tertentu (misal: mematikan modul "Forum" global).

Global Audit Log: Melihat log aktivitas seluruh user.

System Config: Akses ke pengaturan sensitif (API Keys, Database).

Proteksi: Akun ini ANTI-LOCK (tidak bisa dikunci oleh siapapun).

ADMIN / OWNER (Level 1 - Business)

Deskripsi: Pemilik bisnis operasional.

Fitur Utama:

Financial Access: Melihat Laporan Keuangan, Omzet, HPP.

Staff Management: Membuat akun Media Staff.

Product Price: Mengatur harga jual produk.

Vulnerability: Bisa dikunci oleh Master Admin.

MEDIA STAFF (Level 2 - Creative)

Deskripsi: Tim marketing/desain/konten.

Fitur Utama:

Page Builder: Edit layout, tambah section, drag-n-drop.

Theme Editor: Ubah warna, font, upload logo.

Library Manager: Edit tampilan buku, upload cover.

Restriksi:

Tidak bisa melihat menu "Laporan Keuangan".

Setiap perubahan yang dilakukan tercatat di Log dan menotifikasi Owner.

Vulnerability: Bisa dikunci oleh Master Admin atau Owner.

USER PUBLIC (Level 3 - Visitor)

Deskripsi: Pengunjung website.

Fitur: View Page, View Product Ingredients, Read Book Summary, Comment.

6. Detail Fitur Fungsional

A. Fitur CMS & Page Builder

Drag & Drop: Menggunakan library seperti vuedraggable untuk menyusun urutan section.

Dynamic Component Loader: Frontend menggunakan <component :is="section.type" /> untuk merender blok secara dinamis berdasarkan data JSON dari backend.

Theme Injection: Perubahan warna di dashboard akan mengupdate CSS Variables (--primary-color) di :root website secara realtime.

B. Fitur Produk & Ingredients

Visual Ingredients: Media dapat mengupload SVG icon untuk setiap bahan.

Calculator: Sistem frontend menampilkan takaran.

Dynamic Pricing: Harga berubah real-time saat user memilih varian (Hot vs Ice) di frontend.

C. Fitur Pelaporan (Reporting)

Format: Export ke .pdf (Layout rapi untuk cetak) dan .xlsx (Data mentah).

Filter:

Date Range: "Dari Tanggal X sampai Y".

Entity: "Laporan Penjualan Kopi" vs "Laporan Penjualan Buku".

Log Export: Master Admin bisa mengunduh Audit Trail lengkap untuk investigasi.

7. Rencana Pengembangan (Roadmap)

✅ Fase 1: Setup Backend & Database: Implementasi Prisma Schema, Migrasi DB, dan Auth API.

✅ Fase 2: Dashboard Core: Pembuatan Theme Editor, Page Manager, dan User Management.

✅ Fase 3: Module Product & Library: Implementasi relasi Ingredients dan Books.

✅ Fase 4: Storefront Engine: Pembuatan engine render dinamis di sisi frontend.

✅ Fase 5: Security & Audit: Implementasi Middleware Log, Master Lock, Docker & CI/CD.

Dokumen ini adalah acuan final untuk pengembangan sistem. Setiap perubahan struktur database atau logika bisnis harus mereferensikan dokumen ini.