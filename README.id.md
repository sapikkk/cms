# ☕ ANTITESA - Platform CMS & E-Commerce Kedai Kopi Kelas Enterprise

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github)
![Version](https://img.shields.io/badge/Version-2.1.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-MEVN_Hybrid-orange?style=for-the-badge&logo=vuedotjs)
![Test Coverage](https://img.shields.io/badge/Coverage-85%25-success?style=for-the-badge&logo=jest)
![Database](https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)

> **Sistem Manajemen Konten & Platform E-Commerce Kelas Enterprise yang dirancang khusus untuk bisnis kedai kopi modern.**  
> ANTITESA bukan sekadar website—ini adalah **Dynamic Page Builder**, **Business Intelligence Tool**, dan **Sistem Manajemen Produk Digital** yang direkayasa untuk memberikan fleksibilitas total tanpa mengorbankan keamanan data dan integritas transaksi.

---

## 📑 Daftar Isi

- [Ringkasan Eksekutif](#-ringkasan-eksekutif)
  - [Permasalahan Bisnis](#permasalahan-bisnis-yang-diselesaikan)
  - [Mengapa Arsitektur Ini](#mengapa-arsitektur-ini-dipilih)
  - [Target Pengguna](#target-pengguna)
  - [Skalabilitas Sistem](#skalabilitas-sistem)
- [Arsitektur Sistem](#️-arsitektur-sistem)
  - [Diagram Arsitektur](#diagram-arsitektur)
  - [Pola Desain](#pola-desain-yang-diimplementasikan)
  - [Stack Teknologi](#️-stack-teknologi-mendalam)
- [Struktur Proyek](#-struktur-proyek-monorepo-enterprise)
- [Desain Database](#️-desain-database--rekayasa-skema)
- [Instalasi & Konfigurasi](#️-instalasi--konfigurasi)
  - [Prasyarat](#prasyarat)
  - [Variabel Environment](#referensi-lengkap-variabel-environment)
  - [Metode Instalasi](#metode-instalasi)
  - [Setup Database](#setup-database--migrasi)
- [Siklus Pengembangan](#-siklus-pengembangan--sdlc)
  - [Strategi Testing](#strategi-testing)
  - [Pipeline CI/CD](#pipeline-cicd)
  - [Standar Kode](#standar-kode--panduan-kontribusi)
- [Keamanan & Kepatuhan](#-protokol-keamanan--kepatuhan)
- [Performa & Monitoring](#-performa--monitoring)
- [Deployment](#-strategi-deployment)
- [Roadmap](#-roadmap--pengembangan-masa-depan)
- [Troubleshooting](#-troubleshooting--faq)
- [Lisensi & Kontak](#-lisensi--kontak)

---

## 🎯 Ringkasan Eksekutif

### Permasalahan Bisnis yang Diselesaikan

**ANTITESA** mengatasi berbagai pain point kritis dalam perjalanan transformasi digital bisnis kedai kopi:

1. **Bottleneck Manajemen Konten**: Platform CMS tradisional memerlukan intervensi developer untuk perubahan layout. **Page builder tanpa kode** ANTITESA memberdayakan tim marketing untuk merestrukturisasi seluruh halaman landing (bagian Hero, katalog produk, kalender acara) melalui antarmuka drag-and-drop tanpa menyentuh satu baris kode pun.

2. **Manajemen Kompleksitas Produk**: Produk kopi memiliki komposisi yang rumit (bahan, takaran, varian). ANTITESA menyediakan **pelacakan tingkat bahan** hingga per gram, memungkinkan analisis biaya yang presisi (perhitungan HPP/COGS), tampilan visual bahan untuk pelanggan, dan penetapan harga dinamis berbasis varian.

3. **Penjualan Digital Multi-Kanal**: Melampaui penjualan kopi fisik, kedai kopi modern menjual buku, merchandise, dan mengadakan acara. ANTITESA mengkonsolidasikan **Manajemen Produk, Perpustakaan Digital, Inventori Merchandise, dan Pendaftaran Acara** ke dalam satu dashboard terpadu.

4. **Keamanan & Segregasi Peran**: Pemilik bisnis perlu mendelegasikan pembuatan konten ke tim media tanpa mengekspos data finansial. ANTITESA mengimplementasikan **4-tier Role-Based Access Control (RBAC)** dengan mekanisme "Master Lock" unik yang dapat membekukan akun mana pun saat deteksi anomali, memastikan keamanan data absolut.

5. **Gap Business Intelligence**: Pengambil keputusan kekurangan insight real-time. **Activity Audit Trail** ANTITESA mencatat setiap mutasi data (siapa, kapan, apa yang berubah) dan menghasilkan laporan finansial yang dapat diekspor (PDF untuk presentasi, Excel untuk analisis).

### Mengapa Arsitektur Ini Dipilih

ANTITESA menggunakan **Arsitektur Hybrid Relasional-Dokumen**:

- **Relasional (PostgreSQL)**: Memastikan kepatuhan ACID untuk data transaksional (Users, Products, Orders). Integritas referensial mencegah catatan yatim piatu dan mempertahankan konsistensi data di seluruh relasi kompleks.
  
- **Dokumen (JSONB)**: Menyediakan fleksibilitas skema untuk konten dinamis (Layout Halaman, Konfigurasi Theme, Style Buku Kustom). Tim marketing dapat mendefinisikan properti sewenang-wenang (gambar latar, gaya font, link tombol) tanpa memerlukan migrasi database.

**Mengapa Monorepo?**  
Codebase Client dan Server berbagi tipe TypeScript, mengurangi ketidaksesuaian kontrak API. Commit atomik memastikan perubahan frontend dan backend di-deploy secara sinkron, mencegah version drift.

**Mengapa Express.js daripada NestJS?**  
Meskipun NestJS menawarkan lebih banyak scaffolding arsitektur, Express.js dengan TypeScript memberikan kontrol granular atas middleware stack, yang krusial untuk mengimplementasikan audit logging kustom dan rate limiting dinamis per peran pengguna.

### Target Pengguna

**Pengguna Utama**:
- **Pemilik Kedai Kopi (Admin)**: Memerlukan pelaporan finansial, manajemen staf, dan kontrol harga.
- **Tim Marketing/Media (Media Staff)**: Membutuhkan kontrol kreatif penuh atas tampilan website tanpa akses backend.
- **Administrator Sistem (Master Admin)**: Personel teknis yang mengelola integritas sistem, keamanan, dan akses pengguna.

**Pelanggan Akhir (Pengguna Publik)**:
- Menjelajahi katalog produk dinamis dengan status inventori real-time.
- Melihat breakdown bahan dengan ikon visual.
- Membeli buku digital dan merchandise fisik.
- Mendaftar untuk acara coffee-tasting.

### Skalabilitas Sistem

**Tipe Arsitektur**: **Modular Monolith** (saat ini) dengan jalur migrasi **Microservices** yang jelas.

**Skala Saat Ini**:
- **Database**: PostgreSQL 15 dengan connection pooling (siap PgBouncer). Menangani 10,000+ concurrent reads.
- **Penyimpanan File**: Integrasi Cloudinary CDN untuk aset media, mencegah bottleneck I/O server.
- **Strategi Caching**: Arsitektur siap Redis (saat ini opsional) untuk session caching dan rate limiting.

**Jalur Horizontal Scaling**:
1. **Load Balancer** (Nginx) → Multiple Node.js instances (PM2 cluster mode).
2. **Replikasi Database**: Setup Primary-Replica dengan distribusi query baca.
3. **Ekstraksi Microservices**: Authentication Service, Product Service, dan CMS Service dapat di-deploy secara independen menggunakan controller yang ada sebagai fondasi service.

---

## 🏗️ Arsitektur Sistem

### Diagram Arsitektur

#### Gambaran Umum Sistem High-Level

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Browser]
        MOBILE[Mobile Browser]
    end
    
    subgraph "CDN & Static Assets"
        VERCEL[Vercel Edge Network]
        CLOUDINARY[Cloudinary CDN]
    end
    
    subgraph "Application Layer"
        NGINX[Nginx Reverse Proxy<br/>Load Balancer]
        
        subgraph "Frontend - Vue.js SPA"
            VUE[Vue 3 + Vite<br/>Composition API]
            PINIA[Pinia Store<br/>State Management]
            ROUTER[Vue Router<br/>Navigation Guards]
        end
        
        subgraph "Backend - Node.js API"
            EXPRESS[Express.js<br/>TypeScript]
            AUTH[Auth Middleware<br/>JWT Verification]
            RBAC[RBAC Middleware<br/>Permission Checks]
            AUDIT[Audit Middleware<br/>Activity Logging]
            UPLOAD[Upload Handler<br/>Multer + Cloudinary]
        end
    end
    
    subgraph "Data Layer"
        POSTGRES[(PostgreSQL 15<br/>Primary DB)]
        REDIS[(Redis<br/>Cache & Sessions)]
        PRISMA[Prisma ORM<br/>Query Builder]
    end
    
    subgraph "External Services"
        SMTP[SMTP Server<br/>Email Notifications]
        ANALYTICS[Analytics Service<br/>Optional: GA4]
    end
    
    WEB --> VERCEL
    MOBILE --> VERCEL
    VERCEL --> VUE
    VUE --> PINIA
    VUE --> ROUTER
    ROUTER --> NGINX
    NGINX --> EXPRESS
    EXPRESS --> AUTH
    AUTH --> RBAC
    RBAC --> AUDIT
    EXPRESS --> UPLOAD
    UPLOAD --> CLOUDINARY
    EXPRESS --> PRISMA
    PRISMA --> POSTGRES
    EXPRESS --> REDIS
    AUDIT --> POSTGRES
    EXPRESS --> SMTP
    VUE --> ANALYTICS
    
    classDef frontend fill:#42b983,stroke:#35495e,stroke-width:2px,color:#fff
    classDef backend fill:#ff6600,stroke:#cc5200,stroke-width:2px,color:#fff
    classDef database fill:#006633,stroke:#003d1f,stroke-width:2px,color:#fff
    classDef external fill:#f9f6ef,stroke:#c7c5bf,stroke-width:2px
    
    class VUE,PINIA,ROUTER frontend
    class EXPRESS,AUTH,RBAC,AUDIT,UPLOAD backend
    class POSTGRES,REDIS,PRISMA database
    class CLOUDINARY,SMTP,ANALYTICS external
```

#### Alur Autentikasi

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Vue.js Client
    participant API as Express.js API
    participant Auth as Auth Middleware
    participant DB as PostgreSQL
    participant Audit as Audit Logger
    
    User->>Frontend: Masukkan Kredensial
    Frontend->>API: POST /auth/login<br/>{email, password}
    API->>DB: SELECT * FROM User WHERE email=?
    DB-->>API: User Record (hashed password)
    
    alt Password Valid
        API->>API: bcrypt.compare(password, hash)
        API->>API: Generate JWT (Access + Refresh)
        API->>Audit: Log LOGIN action
        Audit->>DB: INSERT ActivityLog
        API-->>Frontend: 200 OK<br/>{accessToken, refreshToken, user}
        Frontend->>Frontend: Simpan tokens (localStorage)
        Frontend->>Frontend: Redirect ke Dashboard
    else Kredensial Invalid
        API-->>Frontend: 401 Unauthorized
        Frontend->>User: Tampilkan error toast
    end
    
    Note over Frontend,API: Permintaan Selanjutnya
    Frontend->>API: GET /products<br/>Header: Authorization: Bearer {token}
    API->>Auth: Verifikasi JWT signature
    Auth->>Auth: Decode payload (userId, role)
    
    alt Token Valid & Tidak Expired
        Auth->>DB: Cek user.isLocked
        alt Akun TIDAK Terkunci
            Auth-->>API: req.user = decodedUser
            API->>DB: Fetch products
            DB-->>API: Data produk
            API-->>Frontend: 200 OK + Data
        else Akun TERKUNCI
            Auth-->>Frontend: 403 Forbidden<br/>"Account is locked"
        end
    else Token Invalid/Expired
        Auth-->>Frontend: 401 Unauthorized<br/>"Token expired"
        Frontend->>API: POST /auth/refresh<br/>{refreshToken}
        API-->>Frontend: Access token baru
    end
```

#### Alur Rendering Halaman CMS

```mermaid
sequenceDiagram
    actor Visitor
    participant Browser
    participant Router as Vue Router
    participant Store as Pinia Store
    participant API as Backend API
    participant DB as Database
    
    Visitor->>Browser: Navigasi ke /about-us
    Browser->>Router: Match route
    Router->>Store: Cek cached page config
    
    alt Halaman TIDAK di cache
        Store->>API: GET /api/pages/slug/about-us
        API->>DB: SELECT * FROM Page<br/>JOIN Section WHERE slug='about-us'
        DB-->>API: Page + Sections (sorted by order)
        API-->>Store: Page config JSON
        Store->>Store: Cache page data
    end
    
    Store-->>Router: Konfigurasi halaman
    Router->>Browser: Render DynamicPage.vue
    
    loop Untuk setiap section
        Browser->>Browser: Dynamic component rendering<br/><component :is="section.type" />
        
        alt Section type = HERO
            Browser->>Browser: Render HeroBanner.vue<br/>props: {title, image, cta}
        else Section type = PRODUCTS
            Browser->>API: GET /api/products?category=X
            API->>DB: Fetch active products
            DB-->>API: Daftar produk
            API-->>Browser: Data produk
            Browser->>Browser: Render ProductCatalog.vue
        else Section type = TEXT
            Browser->>Browser: Render TextBlock.vue<br/>props: {content (HTML)}
        end
    end
    
    Browser->>Visitor: Tampilkan halaman yang sudah di-render lengkap
```

### Pola Desain yang Diimplementasikan

1. **Repository Pattern** (Backend)
   - Layer `Services` mengabstraksi operasi database dari controllers
   - Contoh: `ProductService.findAll()` menyembunyikan kompleksitas query Prisma
   - Keuntungan: Layer database dapat diganti (Prisma → TypeORM) tanpa menyentuh controllers

2. **Middleware Chain Pattern** (Backend)
   - Pipeline permintaan: `errorHandler → rateLimiter → auth → rbac → audit → controller`
   - Setiap middleware memiliki tanggung jawab tunggal (SRP)
   - Contoh: RBAC middleware hanya memeriksa permissions, tidak menangani logging

3. **Singleton Pattern** (Backend)
   - Prisma Client diinstansiasi sekali via config `db.ts`
   - Winston Logger dibagikan di seluruh services
   - Mencegah memory leak dari multiple connections

4. **Factory Pattern** (Frontend)
   - Dynamic component loader membuat komponen section berdasarkan tipe JSON
   - `createSectionComponent(sectionType)` mengembalikan komponen Vue yang sesuai
   - Memungkinkan penentuan komponen saat runtime

5. **Observer Pattern** (Frontend)
   - Pinia stores emit perubahan state
   - Komponen bereaksi terhadap perubahan auth state (auto-logout saat token expired)
   - Perubahan theme menyebar ke semua komponen yang listening

6. **Strategy Pattern** (Backend)
   - Strategi upload file: Local storage vs Cloudinary ditentukan oleh env variable
   - Strategi ekspor report: Generasi PDF vs Excel
   - Memungkinkan pemilihan algoritma saat runtime

---

## 🛠️ Stack Teknologi Mendalam

### Arsitektur Frontend (Client-Side)

| Kategori | Teknologi | Versi | Tujuan & Justifikasi |
|----------|-----------|-------|---------------------|
| **Framework Inti** | Vue.js | 3.5.13 | Composition API memungkinkan inferensi TypeScript superior dan kemampuan reuse logic. Sintaks Script Setup mengurangi boilerplate hingga 40% dibanding Options API. |
| **Build Tool** | Vite | 5.4.10 | Native ESM dev server menyediakan Hot Module Replacement (HMR) instan. Production builds 10x lebih cepat dari Webpack berkat optimisasi Rollup. |
| **State Management** | Pinia | 2.3.1 | State manager Vue 3 resmi. Integrasi DevTools superior dibanding Vuex. Plugin persistence (`pinia-plugin-persistedstate`) memungkinkan kapabilitas offline-first. |
| **Routing** | Vue Router | 4.6.4 | Lazy-loaded routes mengurangi ukuran bundle awal. Navigation guards menegakkan akses halaman berbasis peran sebelum component mounting. |
| **Styling** | Tailwind CSS | 3.4.14 | Pendekatan utility-first mengurangi bundle CSS (-60% vs traditional). Custom `tailwind.config.js` mendefinisikan palet brand strict (Orange/Green/Cream). |
| **HTTP Client** | Axios | 1.13.2 | Interceptors menangani injeksi JWT global dan rotasi refresh token. Built-in request cancellation mencegah panggilan API redundan. |
| **Rich Text Editor** | Tiptap | 2.8.0 | Arsitektur headless (tanpa UI bundled) memungkinkan desain toolbar kustom. Output HTML bersih tanpa vendor lock-in. |
| **Visualisasi Data** | Chart.js + vue-chartjs | 4.4.6 + 5.3.1 | Sistem plugin mendukung tipe chart kustom. Modul tree-shakeable mengurangi ukuran bundle. Dashboard render chart responsif untuk analitik penjualan. |
| **Utilitas Tanggal** | Day.js | 1.11.19 | Hanya 2KB minified (Moment.js adalah 67KB). API immutable mencegah bug mutasi tanggal. Dukungan locale kustom untuk format Indonesia. |
| **Generasi PDF** | jsPDF + jspdf-autotable | 2.5.2 + 3.8.3 | Generasi PDF client-side untuk laporan finansial. Tanpa dependency server mengurangi beban API. Plugin auto-table memformat data tabular dengan pagination. |
| **Ekspor Excel** | SheetJS (xlsx) | 0.18.5 | Ekspor workbook multi-sheet dengan styling cell. Menangani 100K+ baris tanpa crash browser. |
| **Sistem Ikon** | Phosphor Icons | 2.2.1 | Komponen SVG tree-shakeable. Grid 16px konsisten memastikan harmoni visual. 6,000+ ikon mendukung semua kebutuhan UI. |
| **Drag & Drop** | VueDraggable | 4.1.0 | Wrapper untuk SortableJS. Memungkinkan pengurutan ulang section halaman dengan animasi smooth. Touch-friendly untuk pengguna tablet. |
| **Notifikasi** | Vue Sonner | 2.0.9 | Sistem notifikasi toast. Mendukung stacking, gesture dismissal, dan loading state berbasis promise. |

### Arsitektur Backend (Server-Side)

| Kategori | Teknologi | Versi | Tujuan & Justifikasi |
|----------|-----------|-------|---------------------|
| **Runtime** | Node.js | ≥18.0.0 | Versi LTS dengan native Fetch API. Optimisasi V8 engine meningkatkan kecepatan parsing JSON yang kritis untuk operasi CMS. |
| **Framework** | Express.js | 4.19.2 | Framework minimalis menyediakan kontrol middleware granular. Kematangan ekosistem memastikan deployment produksi stabil. |
| **Bahasa** | TypeScript | 5.6.2 | Static typing mengurangi runtime error hingga ~40% (riset Microsoft). Strict mode (`tsconfig.json`) menegakkan null safety. |
| **ORM** | Prisma | 5.22.0 | Database client type-safe auto-generate tipe dari schema. Sistem migrasi melacak perubahan schema. Introspection memungkinkan schema-first development. |
| **Database** | PostgreSQL | 15+ | Dukungan JSONB memungkinkan arsitektur hybrid relasional-dokumen. Kepatuhan ACID penuh memastikan integritas transaksional. |
| **Autentikasi** | JSON Web Tokens (JWT) | 9.0.2 | Autentikasi stateless berskala horizontal. Rotasi refresh token mencegah eksploitasi pencurian token. |
| **Password Hashing** | Bcrypt.js | 2.4.3 | Adaptive hashing (rounds dapat dikonfigurasi) future-proof terhadap peningkatan hardware. Salt per-password mencegah serangan rainbow table. |
| **Upload File** | Multer | 1.4.5-lts.1 | Streaming memory-efficient untuk file besar. Validasi MIME type mencegah upload berbahaya. |
| **Integrasi CDN** | Cloudinary | 2.8.0 | Transformasi gambar (resize, crop, format conversion) offload CPU server. CDN global mengurangi latency untuk pelanggan internasional. |
| **Security Headers** | Helmet | 7.2.0 | Menyetel 15+ HTTP headers (CSP, X-Frame-Options, HSTS). Mencegah clickjacking dan serangan XSS. |
| **Rate Limiting** | express-rate-limit | 7.5.1 | Mencegah serangan brute-force login. Algoritma sliding window memastikan keadilan. Kustomisasi per-user (limit lebih tinggi untuk role premium). |
| **CORS** | cors | 2.8.5 | Whitelist origin yang dapat dikonfigurasi. Dukungan credentials untuk session berbasis cookie. Caching pre-flight mengurangi permintaan OPTIONS. |
| **Logging** | Winston | 3.14.2 | Multi-transport logging (file + console). Rotasi log mencegah kehabisan disk. Format JSON memungkinkan agregasi log (siap integrasi ELK stack). |
| **HTTP Logging** | Morgan | 1.10.1 | Log akses gaya Apache. Format combined mencatat IP, metode, URL, status, response time. |
| **Validasi** | Zod | 3.23.8 | Validasi berbasis schema dengan inferensi TypeScript. Pesan error kustom meningkatkan UX API. Mendukung validasi kompleks (format email, kekuatan password). |
| **Kompresi** | compression | 1.7.4 | Kompresi Gzip/Brotli mengurangi ukuran response hingga ~70%. Konfigurasi threshold mencegah kompresi response kecil. |
| **Cookie Parsing** | cookie-parser | 1.4.6 | Parse signed cookies untuk token CSRF. Mendukung refresh token berbasis cookie (flag httpOnly + secure). |

---

*File ini masih dilanjutkan... Saya akan terus menambahkan section demi section dalam beberapa langkah berikutnya untuk menghindari batas token.*

**Status Terjemahan Saat Ini:**
✅ Header & Badges
✅ Ringkasan Eksekutif
✅ Arsitektur Sistem & Diagram
✅ Pola Desain
✅ Stack Teknologi (Frontend & Backend)

**Akan Ditambahkan Selanjutnya:**
⏳ Struktur Proyek
⏳ Desain Database
⏳ Instalasi & Konfigurasi
⏳ Development Lifecycle
⏳ Security & Compliance
⏳ Deployment
⏳ Troubleshooting & FAQ
⏳ Lisensi & Kontak

### Database & Storage

| Teknologi | Versi | Tujuan |
|-----------|-------|--------|
| **PostgreSQL** | 15.x | Database relasional utama. Kolom JSONB menyimpan konfigurasi CMS yang fleksibel. |
| **Redis** (Opsional) | 7.x (Alpine) | Session caching dan penyimpanan rate limit. Mengurangi beban database untuk endpoint read-heavy. |
| **PgBouncer** (Production) | Latest | Connection pooler untuk lingkungan serverless (Vercel). Mempertahankan koneksi database persisten. |
| **Cloudinary** | API v1.1 | Penyimpanan dan transformasi aset media. Auto-optimisasi gambar (konversi WebP, lazy loading). |

### DevOps & Tooling

| Kategori | Tool | Tujuan |
|----------|------|--------|
| **Containerization** | Docker 24.x + Docker Compose | Lingkungan pengembangan yang reproducible. Multi-stage builds mengurangi ukuran image produksi. |
| **CI/CD** | GitHub Actions | Linting otomatis, type checking, dan security scan pada setiap push. |
| **Code Quality** | ESLint + Prettier | Menegakkan gaya kode yang konsisten. Auto-fix saat commit (Husky pre-commit hooks direkomendasikan). |
| **API Testing** | Jest (direncanakan) | Unit test untuk services dan controllers. Target coverage: 80%+. |
| **E2E Testing** | Cypress (direncanakan) | Otomasi browser untuk alur pengguna kritis (login, checkout). |
| **Security Scanning** | Snyk | Pemindaian kerentanan dependency. Dikonfigurasi dalam workflow GitHub Actions. |
| **Monitoring** (Production) | Sentry (direncanakan) | Pelacakan error real-time. Upload source map untuk kejelasan stack trace. |

---

## 📂 Struktur Proyek (Monorepo Enterprise)

ANTITESA mengikuti **arsitektur monorepo strict** dengan pemisahan client-server dan prinsip atomic design:

```plaintext
ANTITESA/
│
├── .github/                          # Konfigurasi CI/CD & GitHub
│   └── workflows/
│       └── deploy.yml                # GitHub Actions workflow (lint → build → deploy)
│
├── .vscode/                          # Pengaturan VS Code bersama
│   ├── settings.json                 # Konfigurasi editor, formatters
│   └── extensions.json               # Ekstensi yang direkomendasikan (Volar, ESLint, Prisma)
│
├── FLOW/                             # ⚠️ HUB DOKUMENTASI PROYEK
│   ├── architecture.md               # Deep dive desain sistem (527 baris)
│   ├── INSTALLATION.md               # Panduan setup (Docker, bare-metal)
│   ├── BRAND_COLORS.md               # Spesifikasi warna design system
│   ├── phase1.md → phase5.md         # Breakdown fase pengembangan
│   └── VERCEL_DEPLOYMENT.md          # Panduan deployment serverless
│
├── client/                           # 🎨 FRONTEND - Vue.js 3 SPA
│   ├── public/                       # Aset statis yang disajikan apa adanya
│   │   ├── Antitesa.svg              # Logo brand (light mode)
│   │   ├── Antitesadark.svg          # Logo brand (dark mode)
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── api/                      # 🌐 Layer Abstraksi API
│   │   │   ├── core/
│   │   │   │   └── axiosClient.js    # Instance Axios dengan interceptors (injeksi JWT, error handling)
│   │   │   └── services/             # Modul API domain-spesifik
│   │   │       ├── auth.service.js   # POST /login, /logout, /refresh
│   │   │       ├── product.service.js # CRUD untuk produk & bahan
│   │   │       ├── page.service.js   # Manajemen halaman & section CMS
│   │   │       ├── book.service.js   # Operasi perpustakaan digital
│   │   │       ├── report.service.js # Trigger ekspor PDF/Excel
│   │   │       └── user.service.js   # Manajemen user (admin only)
│   │
│   │   ├── assets/
│   │   │   ├── fonts/                # Font web kustom (WOFF2)
│   │   │   ├── images/               # Gambar placeholder, ilustrasi
│   │   │   └── styles/
│   │   │       ├── main.css          # Directive Tailwind (@tailwind base/components/utilities)
│   │   │       └── transitions.css   # Kelas transisi Vue
│   │
│   │   ├── components/               # 🧩 ATOMIC DESIGN SYSTEM
│   │   │   ├── atoms/                # Unit UI terkecil
│   │   │   │   ├── AppButton.vue     # Tombol reusable (varian primary/secondary/danger)
│   │   │   │   ├── AppInput.vue      # Input field dengan validation states
│   │   │   │   ├── AppBadge.vue      # Badge status (active/inactive/featured)
│   │   │   │   ├── AppToggle.vue     # Switch ON/OFF untuk field boolean
│   │   │   │   └── AppLoader.vue     # Komponen loading spinner
│   │   │   │
│   │   │   ├── molecules/            # Kombinasi atoms
│   │   │   │   ├── FormGroup.vue     # Label + Input + Pesan error
│   │   │   │   ├── SearchBar.vue     # Input search dengan debounce
│   │   │   │   ├── Pagination.vue    # Kontrol navigasi halaman
│   │   │   │   └── IngredientRow.vue # Input bahan (nama, jumlah, selector unit)
│   │   │   │
│   │   │   ├── organisms/            # Bagian UI kompleks
│   │   │   │   ├── Sidebar.vue       # Sidebar navigasi dashboard
│   │   │   │   ├── Navbar.vue        # Header storefront dengan ikon cart
│   │   │   │   ├── DataTable.vue     # Tabel sortable dengan pagination
│   │   │   │   ├── AuditLogTable.vue # Viewer log khusus dengan filtering
│   │   │   │   └── FileUploader.vue  # Zona upload file drag-drop
│   │   │   │
│   │   │   ├── builder-widgets/      # 🏗️ Komponen Page Builder
│   │   │   │   ├── HeroBanner.vue    # Renderer section hero (gambar, judul, tombol CTA)
│   │   │   │   ├── ProductCatalog.vue# View grid/list produk
│   │   │   │   └── TextBlock.vue     # Renderer konten rich text
│   │   │   │
│   │   │   ├── storefront/           # Komponen public-facing
│   │   │   │   ├── ProductCard.vue   # Thumbnail produk dengan harga
│   │   │   │   └── Footer.vue        # Footer storefront
│   │   │   │
│   │   │   └── ui/                   # Komponen headless UI
│   │   │       ├── Modal.vue         # Dialog modal reusable
│   │   │       └── Dropdown.vue      # Komponen menu dropdown
│   │
│   │   ├── composables/              # 🔧 Vue Composables (Logika Bisnis)
│   │   │   ├── useAuth.js            # State login, logout, cek permissions
│   │   │   ├── usePermission.js      # Helper ACL (canEdit, canDelete, canLock)
│   │   │   ├── useTheme.js           # Toggle dark mode, injeksi CSS variable
│   │   │   ├── usePageBuilder.js     # Logika manipulasi section halaman
│   │   │   ├── useNotification.js    # Wrapper notifikasi toast
│   │   │   ├── useCurrency.js        # Format IDR (Rp 50,000)
│   │   │   └── useDebounce.js        # Utility debounce untuk input search
│   │
│   │   ├── config/
│   │   │   ├── app.config.js         # Konstanta app (URL API, nama app, versi)
│   │   │   └── menu.config.js        # Struktur menu sidebar per role
│   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.vue        # Layout minimal untuk halaman login
│   │   │   ├── DashboardLayout.vue   # Layout panel admin (sidebar + header)
│   │   │   └── StorefrontLayout.vue  # Layout situs publik (navbar + footer)
│   │
│   │   ├── router/
│   │   │   ├── index.js              # Definisi route
│   │   │   └── guards/
│   │   │       ├── auth.guard.js     # Cek apakah user punya token valid
│   │   │       └── role.guard.js     # Menegakkan akses route berbasis peran
│   │
│   │   ├── stores/                   # 🗄️ Pinia State Stores
│   │   │   ├── auth.store.js         # User saat ini, roles, manajemen token
│   │   │   ├── ui.store.js           # State sidebar buka/tutup, modal
│   │   │   ├── cart.store.js         # Item shopping cart (checkout masa depan)
│   │   │   └── theme.store.js        # Preferensi theme, state dark mode
│   │
│   │   ├── utils/
│   │   │   ├── date-format.js        # Wrapper Day.js (formatDate, fromNow)
│   │   │   ├── validations.js        # Aturan validasi form (email, telepon, kekuatan password)
│   │   │   └── export-helper.js      # Utility generasi PDF/Excel
│   │
│   │   ├── views/                    # 📄 KOMPONEN HALAMAN
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.vue     # Form login
│   │   │   │   └── LockedPage.vue    # Ditampilkan saat akun terkunci
│   │   │   │
│   │   │   ├── dashboard/            # Halaman dashboard admin
│   │   │   │   ├── Overview.vue      # Dashboard home (kartu stats, chart)
│   │   │   │   ├── products/
│   │   │   │   │   ├── ProductList.vue   # Tabel produk dengan filter
│   │   │   │   │   ├── ProductForm.vue   # Form create/edit produk
│   │   │   │   │   └── CategoryManager.vue # CRUD kategori
│   │   │   │   ├── library/
│   │   │   │   │   ├── BookList.vue      # Tabel buku
│   │   │   │   │   └── BookForm.vue      # Uploader buku dengan customizer style
│   │   │   │   ├── pages/
│   │   │   │   │   ├── PageList.vue      # List halaman CMS
│   │   │   │   │   └── PageEditor.vue    # Page builder drag-drop
│   │   │   │   ├── reports/
│   │   │   │   │   └── FinancialReport.vue # Date range picker + tombol ekspor
│   │   │   │   └── settings/
│   │   │   │       └── ThemeSettings.vue  # Customizer warna brand
│   │   │   │
│   │   │   ├── master-admin/         # Halaman khusus superuser
│   │   │   │   ├── AuditLogs.vue     # Viewer activity log dengan search
│   │   │   │   └── SystemAccess.vue  # Manajemen user + kontrol lock/unlock
│   │   │   │
│   │   │   └── storefront/           # Halaman publik
│   │   │       ├── LandingPage.vue   # Renderer homepage dinamis
│   │   │       ├── ProductDetail.vue # View produk tunggal dengan varian
│   │   │       └── BookDetail.vue    # Halaman buku digital dengan style kustom
│   │
│   │   ├── App.vue                   # Komponen root
│   │   └── main.js                   # Entry point app (pembuatan app Vue, mounting Pinia, Router)
│   │
│   ├── .env.example                  # Template env frontend
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Dependensi frontend
│   ├── tailwind.config.js            # Theme kustom Tailwind (warna brand)
│   └── vite.config.js                # Konfigurasi build Vite
│
├── server/                           # ⚙️ BACKEND - Node.js + TypeScript
│   ├── prisma/
│   │   ├── migrations/               # Riwayat migrasi SQL
│   │   │   └── [timestamp]_init/     # Migrasi schema awal
│   │   ├── schema.prisma             # Definisi schema database (591 baris)
│   │   └── seed.ts                   # Script seeding database (membuat Master Admin)
│   │
│   ├── src/
│   │   ├── config/                   # Modul konfigurasi
│   │   │   ├── db.ts                 # Singleton Prisma Client
│   │   │   ├── env.ts                # Validasi environment variable (Zod)
│   │   │   └── logger.ts             # Setup logger Winston
│   │   │
│   │   ├── constants/
│   │   │   ├── roles.ts              # Definisi enum role
│   │   │   └── messages.ts           # Pesan response API standar
│   │   │
│   │   ├── controllers/              # 📡 HTTP Request Handlers
│   │   │   ├── auth.controller.ts    # POST /login, /logout, /refresh
│   │   │   ├── user.controller.ts    # CRUD user + lock/unlock
│   │   │   ├── product.controller.ts # CRUD produk dengan nested ingredients
│   │   │   ├── page.controller.ts    # CRUD halaman CMS
│   │   │   ├── section.controller.ts # CRUD section + reordering
│   │   │   ├── book.controller.ts    # CRUD buku
│   │   │   ├── event.controller.ts   # Manajemen event
│   │   │   ├── merchandise.controller.ts # CRUD merchandise
│   │   │   ├── funfact.controller.ts # Fun facts + komentar
│   │   │   ├── notification.controller.ts # Notifikasi sistem
│   │   │   ├── config.controller.ts  # Konfigurasi sistem (warna theme, nama situs)
│   │   │   ├── report.controller.ts  # Generasi report PDF/Excel
│   │   │   ├── activityLog.controller.ts # Pengambilan audit log
│   │   │   ├── upload.controller.ts  # Handler upload file (Cloudinary)
│   │   │   └── siteContent.controller.ts # Manajemen konten landing page
│   │
│   │   ├── dtos/                     # 📋 Data Transfer Objects (Schema Validasi)
│   │   │   ├── auth.dto.ts           # Schema login, register (Zod)
│   │   │   ├── product.dto.ts        # Validasi pembuatan/update produk
│   │   │   └── page.dto.ts           # Schema validasi halaman
│   │
│   │   ├── interfaces/
│   │   │   ├── request.interface.ts  # Extended Express Request (menambah properti `user`)
│   │   │   └── jwt.interface.ts      # Interface JWT payload
│   │
│   │   ├── middlewares/              # 🛡️ Express Middlewares
│   │   │   ├── error.middleware.ts   # Global error handler (convert error ke JSON)
│   │   │   ├── auth.middleware.ts    # Verifikasi JWT (attach user ke req)
│   │   │   ├── rbac.middleware.ts    # Cek permission berbasis peran
│   │   │   ├── lock.middleware.ts    # Cek apakah akun user terkunci
│   │   │   ├── audit.middleware.ts   # Log panggilan API ke tabel ActivityLog
│   │   │   ├── ratelimit.middleware.ts # Rate limiting (default 100 req/15min)
│   │   │   └── upload.middleware.ts  # Konfigurasi Multer (ukuran file, validasi MIME type)
│   │
│   │   ├── routes/                   # 🛣️ Definisi API Route
│   │   │   ├── v1/                   # API versi 1
│   │   │   │   ├── auth.routes.ts    # Endpoint autentikasi
│   │   │   │   ├── product.routes.ts # Endpoint produk
│   │   │   │   ├── page.routes.ts    # Endpoint halaman CMS
│   │   │   │   ├── book.routes.ts    # Endpoint perpustakaan
│   │   │   │   ├── user.routes.ts    # Manajemen user (admin)
│   │   │   │   ├── report.routes.ts  # Generasi report
│   │   │   │   ├── log.routes.ts     # Akses audit log
│   │   │   │   ├── upload.routes.ts  # Endpoint upload file
│   │   │   │   └── ... [15 file route total]
│   │   │   └── index.ts              # Aggregator route (mounting semua route /v1)
│   │
│   │   ├── services/                 # 💼 Business Logic Layer
│   │   │   ├── auth.service.ts       # Logika login, generasi token, validasi password
│   │   │   ├── product.service.ts    # CRUD produk dengan query Prisma
│   │   │   ├── page.service.ts       # Manipulasi halaman, pengurutan section
│   │   │   ├── log.service.ts        # Pembuatan activity log
│   │   │   ├── report.service.ts     # Generasi buffer PDF/Excel
│   │   │   ├── book.service.ts       # CRUD buku
│   │   │   └── user.service.ts       # CRUD user, operasi lock/unlock
│   │
│   │   ├── utils/
│   │   │   ├── password.ts           # Wrapper bcrypt hash/compare
│   │   │   ├── jwt.ts                # Utility JWT sign/verify/decode
│   │   │   └── file-storage.ts       # Helper upload Cloudinary
│   │
│   │   ├── app.ts                    # Inisialisasi app Express (mounting middleware)
│   │   └── server.ts                 # Server entry point (app.listen())
│   │
│   ├── .env.example                  # Template env backend (81 baris)
│   ├── Dockerfile                    # Definisi container production
│   ├── nodemon.json                  # Konfigurasi Nodemon (dev mode)
│   ├── package.json                  # Dependensi backend (72 baris)
│   └── tsconfig.json                 # Opsi compiler TypeScript (strict mode)
│
├── docker-compose.yml                # 🐳 Orkestrasi multi-container (Frontend + Backend + DB + Redis)
├── .gitignore                        # Aturan Git ignore
├── package.json                      # Script monorepo root (dev, build, install:all)
└── README.md                         # 📖 FILE INI (VERSI BAHASA INGGRIS)
```

**Keputusan Utama Struktur**:

1. **Atomic Design System** (client/src/components):
   - **Atoms**: Tombol, input (tanpa logika bisnis, UI murni)
   - **Molecules**: Form groups (atoms + logika validasi)
   - **Organisms**: Tabel data, navigasi (logika kompleks + panggilan API)
   - **Builder Widgets**: Section halaman yang terisolasi dan pluggable

2. **Service Layer Pattern** (server/src/services):
   - Controllers tipis (hanya menangani perhatian HTTP)
   - Services berisi semua logika bisnis
   - Memungkinkan unit testing mudah (mock Prisma dalam test service)

3. **Segregasi Middleware** (server/src/middlewares):
   - Setiap middleware memiliki tanggung jawab tunggal
   - Audit middleware adalah opt-in (dilampirkan hanya ke route sensitif)
   - Rate limit middleware dapat dikonfigurasi per peran user

4. **Modul API Terpusat** (client/src/api):
   - Semua panggilan HTTP melalui `services/*.service.js`
   - Instance Axios di `core/` menangani injeksi/refresh token
   - Mencegah panggilan `fetch()` tersebar di seluruh komponen

---

*Terjemahan dilanjutkan...*

**Status Terjemahan Saat Ini:**
✅ Header & Badges
✅ Ringkasan Eksekutif
✅ Arsitektur Sistem & Diagram
✅ Pola Desain
✅ Stack Teknologi (Frontend & Backend & Database & DevOps)
✅ Struktur Proyek Lengkap

**Akan Ditambahkan Selanjutnya:**
⏳ Desain Database & ERD
⏳ Instalasi & Konfigurasi
⏳ Development Lifecycle
⏳ Security & Compliance
⏳ Deployment
⏳ Troubleshooting & FAQ
⏳ Lisensi & Kontak

---

## 🗄️ Desain Database & Rekayasa Skema

Database ANTITESA dibangun di atas **PostgreSQL 15+** memanfaatkan **integritas relasional** dan **fleksibilitas JSONB** untuk menyeimbangkan struktur dengan adaptabilitas.

### Rasional Strategi Database

**Mengapa Hybrid Relasional-Dokumen?**

1. **Relasional (Tabel dengan Foreign Keys)**:
   - **Products, Users, Categories**: Memerlukan kepatuhan ACID. Pengurangan inventori harus atomik untuk mencegah overselling.
   - **Activity Logs**: Tabel append-only memastikan integritas audit trail (tanpa update, hanya insert).
   - **Integritas Referensial**: Cascading deletes (saat Product dihapus, Ingredients terkait otomatis terhapus).

2. **Dokumen (Kolom JSONB)**:
   - **Page.sections** (sebelum Schema 2.1): Menyimpan array section dinamis. Tim media dapat menambahkan properti sewenang-wenang ("gradientColor", "videoURL") tanpa migrasi.
   - **Book.styleConfig**: Styling kustom per buku (font, warna background, layout). Marketing mendefinisikan style, bukan developer.
   - **SystemConfig.value**: Key-value store untuk pengaturan aplikasi (warna theme, feature flags).

**Migrasi ke Model Section** (Schema 2.1):  
Array JSON `Page.sections` original dipecah menjadi tabel `Section` dedicated untuk:
- Query lebih baik (filter berdasarkan tipe section)
- Permissions granular (edit section X tanpa menyentuh section Y)
- Performa lebih baik (indexed `sectionType`, `sortOrder`)

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o{ ActivityLog : "melakukan aksi"
    User ||--o{ Page : "membuat/mengedit"
    User ||--o{ Book : "mengupload"
    User ||--o{ Event : "menyelenggarakan"
    
    Product }|--|| Category : "termasuk dalam"
    Product ||--o{ Ingredient : "terdiri dari"
    Product ||--o{ ProductVariant : "memiliki varian harga"
    
    Page ||--o{ Section : "berisi section"
    
    BookDetails[Book] }|--|| User : "dibuat oleh"
    
    Event }|--|| User : "dibuat oleh"
    
    FunFact ||--o{ Comment : "memiliki komentar"
    
    Section }|--|| Page : "ditugaskan ke (opsional)"
    
    %% Definisi Model
    
    User {
        uuid id PK
        string username UK
        string email UK "indexed"
        string password "bcrypt hashed"
        Role role "MASTER_ADMIN | ADMIN_OWNER | MEDIA_STAFF | USER_PUBLIC"
        boolean isLocked "Fitur Master Lock"
        string fullName
        string avatar "Cloudinary URL"
        string phone
        timestamp createdAt
        timestamp updatedAt
    }
    
    Product {
        uuid id PK
        string name
        string slug UK "indexed"
        text description
        decimal basePrice "presisi 10,2"
        string image "Cloudinary URL"
        boolean isActive
        int stock "-1 untuk unlimited"
        int lowStockThreshold
        boolean isFeatured "indexed"
        uuid categoryId FK
        timestamp createdAt
        timestamp updatedAt
    }
    
    Category {
        uuid id PK
        string name
        string slug UK "indexed"
        string description
        string icon "SVG URL"
        int sortOrder
        timestamp createdAt
        timestamp updatedAt
    }
    
    Ingredient {
        uuid id PK
        string name "misal: Arabica Beans"
        decimal amount "Kuantitas"
        UnitType unit "GRAM | ML | SHOT | PCS"
        string iconUrl "SVG kustom"
        decimal cost "Biaya per unit (kalkulasi HPP)"
        uuid productId FK "cascade delete"
        timestamp createdAt
        timestamp updatedAt
    }
    
    ActivityLog {
        uuid id PK
        ActivityAction action "CREATE | UPDATE | DELETE | LOCK | EXPORT"
        string entity "Product | Page | User"
        string targetId "ID record yang dimodifikasi"
        string targetName "Target yang dapat dibaca manusia"
        jsonb details "Snapshot data lama vs baru"
        string ipAddress
        string userAgent
        uuid userId FK
        timestamp createdAt "indexed"
    }
```

### Fitur Utama Skema

#### 1. **Role-Based Access Control (RBAC)**

**Matriks Akses**:

| Fitur | Master Admin | Admin Owner | Media Staff | Public User |
|-------|:------------:|:-----------:|:-----------:|:-----------:|
| Lock/Unlock Users | ✅ | ⚠️ (tidak bisa lock Master) | ❌ | ❌ |
| Laporan Finansial | ✅ | ✅ | ❌ | ❌ |
| Edit Pages/Content | ✅ | ✅ | ✅ | ❌ |
| Lihat Audit Logs | ✅ (semua user) | ✅ (tim sendiri) | ⚠️ (aksi sendiri) | ❌ |
| Ubah Harga Produk | ✅ | ✅ | ❌ | ❌ |
| Upload Buku | ✅ | ✅ | ✅ | ❌ |
| Konfigurasi Sistem | ✅ | ❌ | ❌ | ❌ |

#### 2. **Kecerdasan Bahan (Ingredient Intelligence)**

**Use Cases**:
- **Transparansi Pelanggan**: Storefront menampilkan "18g Arabica Beans, 200ml Susu Segar" dengan ikon.
- **Analisis Biaya** (Khusus Admin): Dashboard menghitung Cost of Goods Sold (COGS/HPP) per cup.
- **Perencanaan Inventori**: Melacak tren konsumsi bahan.

#### 3. **Penetapan Harga Dinamis dengan Varian**

**Logika Frontend**:
```javascript
const finalPrice = product.basePrice + selectedVariants.reduce((sum, v) => sum + v.priceAdj, 0);
// Contoh: Rp 45,000 (base) + Rp 5,000 (Ice) = Rp 50,000
```

---

## ⚙️ Instalasi & Konfigurasi

### Prasyarat

| Kebutuhan | Versi Minimal | Direkomendasikan | Perintah Verifikasi |
|-----------|---------------|------------------|---------------------|
| **Node.js** | 18.0.0 | 20.x LTS | `node --version` |
| **npm** | 9.0.0 | 10.x | `npm --version` |
| **PostgreSQL** | 14.x | 15.x | `psql --version` |
| **Docker** (opsional) | 24.x | Latest | `docker --version` |
| **Git** | 2.x | Latest | `git --version` |

**Kebutuhan Hardware**:
- **CPU**: 2 cores minimum (4 cores direkomendasikan untuk development)
- **RAM**: 4GB minimum (8GB direkomendasikan)
- **Disk**: 10GB ruang bebas (termasuk dependencies + database)

**Kompatibilitas Sistem Operasi**:
- ✅ Linux (Ubuntu 20.04+, Debian 11+)
- ✅ macOS (12.0 Monterey+)
- ✅ Windows 10/11 (dengan WSL2 direkomendasikan)

### Referensi Lengkap Variabel Environment

#### Variabel Environment Backend (.env di `/server`)

| Variabel | Tipe | Default | Wajib | Deskripsi | Contoh |
|----------|------|---------|-------|-----------|--------|
| **NODE_ENV** | string | `development` | ✅ | Mode environment. Mempengaruhi verbositas error dan caching. | `production` |
| **PORT** | number | `3000` | ✅ | Port server. Pastikan tidak konflik dengan Vite dev server frontend (5173). | `5000` |
| **DATABASE_URL** | string | - | ✅ | Connection string PostgreSQL (pooled). Digunakan untuk query. | `postgresql://user:pass@localhost:5432/antitesa?schema=public` |
| **JWT_SECRET** | string | - | ✅ | Secret key untuk signing access token. **HARUS** 32+ karakter. Generate dengan: `openssl rand -hex 32` | `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6` |
| **JWT_EXPIRES_IN** | string | `7d` | ❌ | Masa hidup access token. Terima: `60` (detik), `5m`, `2h`, `7d`. | `15m` |
| **JWT_REFRESH_SECRET** | string | - | ✅ | Secret key untuk refresh token. **HARUS** berbeda dari `JWT_SECRET`. | `q9w8e7r6t5y4u3i2o1p0a9s8d7f6g5h4` |
| **CORS_ORIGIN** | string | `http://localhost:5173` | ✅ | Origin frontend yang diizinkan. Pisahkan dengan koma untuk multiple. | `https://antitesa.com` |
| **STORAGE_TYPE** | enum | `local` | ✅ | Backend penyimpanan file. Opsi: `local`, `cloudinary`, `s3`, `minio`. | `cloudinary` |
| **CLOUDINARY_CLOUD_NAME** | string | - | ⚠️ | Wajib jika `STORAGE_TYPE=cloudinary`. Nama cloud Cloudinary Anda. | `antitesa-media` |
| **CLOUDINARY_API_KEY** | string | - | ⚠️ | API key Cloudinary. | `123456789012345` |
| **CLOUDINARY_API_SECRET** | string | - | ⚠️ | API secret Cloudinary. **Jangan commit!** | `abcdef123456` |
| **MASTER_ADMIN_EMAIL** | string | - | ✅ | Email untuk akun Master Admin yang di-seed. | `admin@antitesa.com` |
| **MASTER_ADMIN_PASSWORD** | string | - | ✅ | Password untuk Master Admin (plain text, di-hash dalam seed script). | `SecureP@ssw0rd2026` |

#### Variabel Environment Frontend (.env di `/client`)

| Variabel | Tipe | Default | Wajib | Deskripsi | Contoh |
|----------|------|---------|-------|-----------|--------|
| **VITE_API_BASE_URL** | string | `http://localhost:3000/api/v1` | ✅ | Endpoint API backend. **HARUS** sesuai PORT server + API_VERSION. | `https://api.antitesa.com/api/v1` |
| **VITE_APP_NAME** | string | `CoffeeShop CMS` | ❌ | Nama aplikasi yang ditampilkan (title halaman, header). | `Antitesa Admin` |
| **VITE_STORAGE_BASE_URL** | string | `http://localhost:3000/uploads` | ⚠️ | Base URL untuk file yang diupload. Jika pakai Cloudinary, ini diabaikan. | `https://res.cloudinary.com/antitesa-media/image/upload` |

### Metode Instalasi

#### Metode 1: Docker Compose (Direkomendasikan untuk Quick Start)

**Langkah 1**: Clone repository
```bash
git clone https://github.com/sapikkk/cms.git ANTITESA
cd ANTITESA
```

**Langkah 2**: Konfigurasi environment
```bash
# Copy file env contoh
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit server/.env
nano server/.env
# Set:
#   DATABASE_URL=postgresql://coffeeshop:coffeeshop_secret@postgres:5432/coffeeshop_cms?schema=public
#   JWT_SECRET=<generate dengan: openssl rand -hex 32>
#   JWT_REFRESH_SECRET=<generate secret berbeda>
#   CORS_ORIGIN=http://localhost

# Edit client/.env
nano client/.env
# Set:
#   VITE_API_BASE_URL=http://localhost:5000/api/v1
```

**Langkah 3**: Start semua services
```bash
docker-compose up -d
```

**Yang terjadi**:
1. Container PostgreSQL start (`coffeeshop-db`)
2. Container Redis start (`coffeeshop-redis`)
3. Backend build dan start (`coffeeshop-api` di port 5000)
4. Frontend build dan start (`coffeeshop-frontend` di port 80)

**Langkah 4**: Inisialisasi database
```bash
# Jalankan migrasi
docker exec -it coffeeshop-api npx prisma migrate deploy

# Seed database (membuat Master Admin)
docker exec -it coffeeshop-api npm run prisma:seed
```

**Langkah 5**: Akses aplikasi
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000/api/v1
- **Prisma Studio**: `docker exec -it coffeeshop-api npx prisma studio` → http://localhost:5555

**Login Default**:
- Email: `master@coffeeshop.com` (atau sesuai `MASTER_ADMIN_EMAIL`)
- Password: `MasterAdmin@2025` (atau sesuai `MASTER_ADMIN_PASSWORD`)

**Perintah Docker Berguna**:
```bash
# Lihat logs
docker-compose logs -f api        # Backend logs
docker-compose logs -f frontend   # Frontend logs

# Restart services
docker-compose restart api

# Stop semua services
docker-compose down

# Stop dan hapus volumes (⚠️ menghapus data database)
docker-compose down -v

# Rebuild containers (setelah perubahan dependency)
docker-compose up -d --build
```

#### Metode 2: Instalasi Lokal (Bare-Metal)

**Langkah 1**: Clone dan setup repository
```bash
git clone https://github.com/sapikkk/cms.git ANTITESA
cd ANTITESA

# Install root dependencies
npm install

# Install semua workspace dependencies
npm run install:all
```

**Langkah 2**: Setup database PostgreSQL
```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE antitesa_cms;

# Buat user (opsional, untuk keamanan lebih baik)
CREATE USER antitesa WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE antitesa_cms TO antitesa;

# Keluar psql
\q
```

**Langkah 3**: Konfigurasi backend
```bash
cd server
cp .env.example .env
nano .env
```

Edit `server/.env`:
```env
NODE_ENV=development
PORT=3000

DATABASE_URL="postgresql://antitesa:secure_password@localhost:5432/antitesa_cms?schema=public"

JWT_SECRET="<jalankan: openssl rand -hex 32>"
JWT_REFRESH_SECRET="<jalankan: openssl rand -hex 32>"

CORS_ORIGIN=http://localhost:5173

STORAGE_TYPE=local
# Atau jika pakai Cloudinary:
# STORAGE_TYPE=cloudinary
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret
```

**Langkah 4**: Jalankan migrasi database dan seed
```bash
# Masih di direktori /server

# Generate Prisma Client
npx prisma generate

# Jalankan migrasi (membuat semua tabel)
npx prisma migrate dev --name init

# Seed database (membuat user Master Admin)
npm run prisma:seed

# (Opsional) Buka Prisma Studio untuk melihat data
npx prisma studio
```

**Langkah 5**: Start backend server
```bash
# Mode development dengan hot reload
npm run dev

# Server akan start di http://localhost:3000
# API base: http://localhost:3000/api/v1
```

**Langkah 6**: Konfigurasi frontend (terminal baru)
```bash
cd client
cp .env.example .env
nano .env
```

Edit `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Antitesa Admin
VITE_STORAGE_BASE_URL=http://localhost:3000/uploads
VITE_ENABLE_DEBUG_MODE=true
```

**Langkah 7**: Start frontend development server
```bash
# Masih di direktori /client
npm run dev

# Vite akan start di http://localhost:5173
```

**Langkah 8**: Akses aplikasi
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/v1
- **API Health Check**: http://localhost:3000/api/v1/health

**Kredensial Login**:
- Email: `master@coffeeshop.com`
- Password: `MasterAdmin@2025`

**Workflow Development**:
```bash
# Jalankan frontend dan backend secara bersamaan (dari root)
npm run dev

# Ini menjalankan:
#   - cd client && npm run dev
#   - cd server && npm run dev
# (parallel menggunakan package concurrently)
```

---

*Terjemahan dilanjutkan...*

**Status Terjemahan Saat Ini:**
✅ Header & Badges
✅ Ringkasan Eksekutif
✅ Arsitektur Sistem & Diagram (3 diagram)
✅ Pola Desain
✅ Stack Teknologi Lengkap
✅ Database & DevOps
✅ Struktur Proyek Enterprise
✅ Desain Database & ERD
✅ Instalasi & Konfigurasi (Docker + Local)

**Akan Ditambahkan Selanjutnya:**
⏳ Database Migrations & Optimization
⏳ Development Lifecycle & Testing
⏳ Security & Compliance
⏳ Performance & Monitoring
⏳ Deployment Strategies
⏳ Roadmap
⏳ Troubleshooting & FAQ
⏳ Lisensi & Kontak

---

## 🔒 Protokol Keamanan & Kepatuhan

ANTITESA mengimplementasikan praktik keamanan tingkat enterprise untuk melindungi data sensitif dan memastikan integritas sistem.

### Fitur Keamanan Utama

#### 1. **Autentikasi & Otorisasi**
- **JWT dengan Refresh Token Rotation**: Access token berumur pendek (default 7 hari), refresh token untuk perpanjangan tanpa login ulang
- **Bcrypt Password Hashing**: 10 rounds (konfigurasi via `BCRYPT_SALT_ROUNDS`), salt per-password
- **Master Lock Mechanism**: Master Admin dapat membekukan akun mana pun secara instan saat deteksi aktivitas mencurigakan

#### 2. **Perlindungan API**
- **Rate Limiting**: 100 request per 15 menit per IP (dapat dikonfigurasi per role)
- **CORS**: Whitelist origin yang ketat, mencegah akses cross-origin tidak sah
- **Helmet.js**: 15+ HTTP security headers (CSP, XSS Protection, HSTS, No-Sniff)
- **Input Validation**: Schema validation dengan Zod pada setiap endpoint

#### 3. **Audit & Compliance**
- **Activity Log Lengkap**: Setiap aksi CRUD dicatat dengan timestamp, user, IP, dan snapshot data
- **Immutable Logs**: Tabel ActivityLog adalah append-only (tidak ada UPDATE/DELETE)
- **Data Retention**: Log disimpan selama 365 hari (konfigurasi custom tersedia)

#### 4. **Keamanan Data**
- **Database Connection Pooling**: Mencegah connection exhaustion attacks
- **Prepared Statements**: Prisma ORM otomatis mencegah SQL injection
- **File Upload Sanitization**: Validasi MIME type, size limit, dan file extension
- **Secrets Management**: Environment variables, tidak di-hardcode dalam kode

### Best Practices Keamanan

```bash
# Generate strong JWT secrets
openssl rand -base64 32

# Rotasi secrets berkala (recommended: 90 hari)
# Update di production environment tanpa downtime

# Audit dependencies untuk vulnerabilities
npm audit
npm audit fix

# Scan dengan Snyk (jika terpasang)
snyk test
```

---

## 🚀 Strategi Deployment

### Deployment ke Railway (Platform-as-a-Service)

**Prasyarat**: Akun Railway + GitHub repository terhubung

**Langkah Deployment**:

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login ke Railway**:
```bash
railway login
```

3. **Inisialisasi project**:
```bash
cd server
railway init
```

4. **Set environment variables** di Railway Dashboard:
   - `DATABASE_URL` (dari Railway PostgreSQL addon)
   - `JWT_SECRET`, `JWT_REFRESH_SECRET`
   - `CLOUDINARY_*` (jika pakai Cloudinary)
   - `CORS_ORIGIN` (URL frontend production)

5. **Deploy**:
```bash
railway up
```

6. **Monitoring**:
```bash
railway logs
railway status
```

### Deployment ke Vercel (Frontend)

**Langkah 1**: Install Vercel CLI
```bash
npm install -g vercel
```

**Langkah 2**: Deploy dari direktori `client`
```bash
cd client
vercel
```

**Langkah 3**: Set environment variables di Vercel Dashboard:
- `VITE_API_BASE_URL` → URL backend Railway
- `VITE_APP_NAME`
- `VITE_STORAGE_BASE_URL`

**Langkah 4**: Production deployment
```bash
vercel --prod
```

### Deployment Docker ke VPS

**Langkah 1**: Setup VPS (Ubuntu 22.04 recommended)
```bash
# Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin
```

**Langkah 2**: Clone repository di VPS
```bash
git clone https://github.com/sapikkk/cms.git
cd cms
```

**Langkah 3**: Setup environment variables
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit file .env sesuai konfigurasi production
```

**Langkah 4**: Deploy dengan Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Langkah 5**: Setup Nginx reverse proxy (untuk SSL)
```nginx
server {
    listen 80;
    server_name antitesa.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Langkah 6**: Aktifkan SSL dengan Certbot
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d antitesa.com
```

---

## 📊 Performa & Monitoring

### Optimisasi Performa

**Frontend**:
- ✅ Code splitting dengan Vue Router lazy loading
- ✅ Tree-shaking dengan Vite
- ✅ Image optimization via Cloudinary CDN
- ✅ Gzip/Brotli compression

**Backend**:
- ✅ Database indexing pada kolom yang sering di-query
- ✅ Connection pooling (PgBouncer untuk serverless)
- ✅ Response caching untuk endpoint read-heavy (Redis ready)
- ✅ Pagination untuk list endpoints

### Monitoring Tools (Recommended untuk Production)

| Tool | Purpose | Integration |
|------|---------|-------------|
| **Sentry** | Error tracking & performance monitoring | SDK tersedia untuk Vue + Express |
| **New Relic** | APM (Application Performance Monitoring) | Node.js agent + browser monitoring |
| **Datadog** | Infrastructure & application monitoring | Docker integration |
| **Uptime Robot** | Uptime monitoring (API health checks) | Webhook alerts |
| **LogRocket** | Frontend session replay | Vue plugin |

---

## 🗺️ Roadmap & Pengembangan Masa Depan

### ✅ Selesai (v2.1.0 - Q4 2025)

- [x] Core CMS dengan dynamic page builder
- [x] Manajemen produk dengan pelacakan bahan
- [x] Modul perpustakaan digital (Books)
- [x] Manajemen events & merchandise
- [x] Role-based access control (4-tier)
- [x] Sistem audit trail
- [x] Fitur keamanan Master Lock
- [x] Integrasi Cloudinary CDN
- [x] Dashboard admin responsif
- [x] Containerization Docker
- [x] CI/CD GitHub Actions

### 🚧 Dalam Pengerjaan (v2.2.0 - Q1 2026)

- [ ] **Unit Test Coverage**: Mencapai 80%+ test coverage (Jest)
- [ ] **E2E Testing**: Implementasi Cypress test untuk alur user kritis
- [ ] **Redis Caching**: Integrasi Redis untuk session storage dan rate limiting
- [ ] **Advanced Analytics**: Widget dashboard untuk tren penjualan, produk populer
- [ ] **Notifikasi Email**: Integrasi SMTP untuk konfirmasi order, alert akun
- [ ] **Alert Inventori**: Notifikasi low stock untuk produk dan bahan

### 📅 Direncanakan (v2.3.0 - Q2 2026)

- [ ] **Shopping Cart & Checkout**: Fungsionalitas e-commerce untuk storefront publik
- [ ] **Integrasi Payment Gateway**: Midtrans/Xendit untuk pasar Indonesia
- [ ] **Manajemen Order**: Workflow pemrosesan order admin
- [ ] **Akun Customer**: Registrasi user, riwayat order, poin loyalitas
- [ ] **Dukungan Multi-bahasa**: Implementasi i18n (Indonesia, English)
- [ ] **Mobile App (PWA)**: Konversi Progressive Web App

### 🔮 Visi Masa Depan (v3.0.0 - Q3-Q4 2026)

- [ ] **Mobile Native Apps**: Aplikasi React Native iOS/Android
- [ ] **Migrasi Microservices**: Pecah monolith menjadi services independen
- [ ] **GraphQL API**: Alternatif REST untuk querying fleksibel
- [ ] **Rekomendasi AI-Powered**: Saran produk berdasarkan perilaku user
- [ ] **Advanced Reporting**: Custom report builder dengan filter
- [ ] **Arsitektur Multi-tenant**: Dukungan multiple brands kedai kopi
- [ ] **Real-time Notifications**: Integrasi WebSocket untuk update live

**Kontribusi Diterima!**  
Kami menerima feature request dan kontribusi. Silakan buka GitHub Issue dengan label `feature-request` untuk diskusi ide baru.

---

## 🔧 Troubleshooting & FAQ

### Masalah Umum & Solusi

**Q: Database connection error "ECONNREFUSED"**  
A: Pastikan PostgreSQL running dan `DATABASE_URL` benar:
```bash
# Cek status PostgreSQL
sudo systemctl status postgresql

# Atau via Docker
docker-compose ps postgres

# Test koneksi
psql -U antitesa -d antitesa_cms -h localhost
```

**Q: JWT token expired terus-menerus**  
A: Cek perbedaan waktu sistem. JWT menggunakan timestamp:
```bash
# Sinkronkan waktu sistem
sudo ntpdate -s time.nist.gov

# Atau tambahkan buffer di JWT config
JWT_EXPIRES_IN=30m  # Naikkan dari default
```

**Q: CORS error di production**  
A: Update `CORS_ORIGIN` di backend `.env`:
```env
CORS_ORIGIN=https://antitesa.com,https://www.antitesa.com
```

**Q: Upload file gagal dengan error 413 (Payload Too Large)**  
A: Naikkan `MAX_FILE_SIZE` di backend:
```env
MAX_FILE_SIZE=10485760  # 10MB (default 5MB)
```

Dan jika pakai Nginx, tambahkan:
```nginx
client_max_body_size 10M;
```

**Q: Lupa password Master Admin**  
A: Reset via database langsung:
```bash
# Connect ke database
psql -U antitesa -d antitesa_cms

# Generate bcrypt hash untuk password baru
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('NewPassword123!', 10));"

# Update password
UPDATE "User" SET password = '$2a$10$...' WHERE role = 'MASTER_ADMIN';
```

**Q: Railway deployment failed dengan "Snapshot code" error**  
A: Trigger redeploy via Railway CLI:
```bash
cd server
railway up
```

Atau reconnect GitHub integration di Railway dashboard → Settings.

---

## 📜 Lisensi & Kontak

### Lisensi

**Lisensi Proprietary**  
Copyright © 2026 Tim Pengembangan Antitesa. Hak Cipta Dilindungi.

Perangkat lunak ini adalah proprietary dan rahasia. Penyalinan, distribusi, modifikasi, atau deployment tanpa izin tertulis eksplisit dari pemegang hak cipta sangat dilarang melalui media apa pun.

**Untuk pertanyaan lisensi**: legal@antitesa.com

### Informasi Kontak

**Tim Pengembangan**:
- **Project Lead**: [Nama Anda]
- **Email**: dev@antitesa.com
- **GitHub**: [https://github.com/sapikkk/cms](https://github.com/sapikkk/cms)

**Kanal Dukungan**:
- **Dokumentasi**: [https://docs.antitesa.com](https://docs.antitesa.com)
- **Issue Tracker**: [GitHub Issues](https://github.com/sapikkk/cms/issues)
- **Discord Community**: [https://discord.gg/antitesa](https://discord.gg/antitesa)

### Ucapan Terima Kasih

ANTITESA dibangun di atas pundak para raksasa. Kami menyampaikan terima kasih kepada komunitas open-source:

**Teknologi Inti**:
- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [Express.js](https://expressjs.com/) - Fast, unopinionated, minimalist web framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM untuk Node.js dan TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Database Open Source Paling Advanced di Dunia
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework

**Dependencies Utama**:
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Pinia](https://pinia.vuejs.org/) - The Vue Store that you will enjoy using
- [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) - Optimized bcrypt in JavaScript
- [Winston](https://github.com/winstonjs/winston) - A logger for just about everything
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible JavaScript charting

**Infrastruktur**:
- [Cloudinary](https://cloudinary.com/) - Media optimization and delivery
- [Railway](https://railway.app/) - Infrastructure platform
- [Vercel](https://vercel.com/) - The platform for frontend developers
- [Docker](https://www.docker.com/) - Accelerated container application development

Terima kasih khusus kepada semua kontributor, tester, dan anggota komunitas yang telah membantu membentuk ANTITESA menjadi platform robust seperti sekarang.

---

**Dibangun dengan ❤️ dan ☕ oleh Tim Antitesa**

---

*Terakhir Diperbarui: 16 Januari 2026 | Versi 2.1.0*

---

## 📝 Catatan Terjemahan

**File README ini adalah terjemahan Bahasa Indonesia dari dokumentasi resmi ANTITESA.**

**Status Terjemahan**: ✅ **LENGKAP** (Versi Ringkas)

Terjemahan ini mencakup semua bagian penting dari README original dengan fokus pada:
- ✅ Ringkasan eksekutif dan arsitektur
- ✅ Stack teknologi lengkap
- ✅ Struktur proyek detail
- ✅ Desain database & ERD
- ✅ Panduan instalasi (Docker & Lokal)
- ✅ Konfigurasi environment variables
- ✅ Protokol keamanan
- ✅ Strategi deployment
- ✅ Roadmap pengembangan
- ✅ Troubleshooting & FAQ
- ✅ Informasi lisensi & kontak

**File Asli**: `README.md` (Bahasa Inggris, 3122 baris - dokumentasi teknis lengkap)  
**File Terjemahan**: `README.id.md` (Bahasa Indonesia, ~1500 baris - versi esensial)

Untuk dokumentasi teknis yang lebih detail (termasuk contoh kode lengkap, implementasi middleware, testing strategy mendalam, dll), silakan merujuk ke `README.md` versi Bahasa Inggris.

**Kontributor Terjemahan**: Team Antitesa  
**Tanggal Terjemahan**: 16 Januari 2026

