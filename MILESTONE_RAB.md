# 📊 MILESTONE & RENCANA ANGGARAN BIAYA (RAB)

## ANTITESA - CoffeeShop Enterprise CMS & E-Commerce Platform

**Versi Dokumen:** 1.0  
**Tanggal:** 16 Januari 2026  
**Project Type:** Full-Stack Web Application (Monorepo)

---

## 📋 RINGKASAN PROJECT

ANTITESA adalah platform CMS & E-Commerce terintegrasi untuk bisnis Coffee Shop yang mencakup:

- **Dynamic Page Builder** (Drag & Drop)
- **Product Intelligence** (Manajemen produk dengan ingredients)
- **Digital Library Module** (Pustaka digital)
- **Role-Based Access Control** (4-tier RBAC)
- **Business Intelligence & Reporting**

---

# 🗓️ PAKET 1 BULAN (4 Minggu)

### _Foundation & Core Features_

| No  | Tahapan                   | Deskripsi Pekerjaan                         | Progress Detail                                                                                                                                           | Harga |
| --- | ------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 1   | **Setup Infrastruktur**   | Inisialisasi project monorepo & environment | • Setup struktur folder client/server<br>• Konfigurasi TypeScript & ESLint<br>• Setup environment variables<br>• Instalasi dependencies core              |       |
| 2   | **Database Foundation**   | Desain & implementasi database PostgreSQL   | • Setup PostgreSQL + Prisma ORM<br>• Desain schema database (User, Product, Category)<br>• Implementasi migration system<br>• Seed data Master Admin      |       |
| 3   | **Authentication System** | Sistem autentikasi & otorisasi              | • API Register & Login dengan JWT<br>• Refresh token mechanism<br>• Password hashing (Bcrypt)<br>• Role-based access control (4-tier)                     |       |
| 4   | **Frontend Foundation**   | Setup Vue.js 3 & komponen dasar             | • Inisialisasi Vue 3 + Vite<br>• Setup Tailwind CSS dengan custom theme<br>• Implementasi Atomic Design System<br>• Komponen atoms (Button, Input, Badge) |       |
| 5   | **Dashboard Layout**      | Layout admin panel dasar                    | • Sidebar dinamis berdasarkan role<br>• Navbar dengan user menu<br>• Auth guard & route protection<br>• Pinia state management                            |       |
| 6   | **Login & Register UI**   | Halaman autentikasi frontend                | • Halaman Login dengan validasi<br>• Integrasi API auth<br>• Token persistence<br>• Error handling UI                                                     |       |

**Total Deliverables Paket 1 Bulan:**

- ✅ Backend server running
- ✅ Database dengan schema User
- ✅ API Authentication (Register, Login, Logout)
- ✅ Frontend dengan dashboard layout
- ✅ Role-based navigation
- ✅ Basic security implementation

| **TOTAL PAKET 1 BULAN** | | | |

---

# 🗓️ PAKET 2 BULAN (8 Minggu)

### _Foundation + CMS Core + Product Management_

## Bulan 1 (Minggu 1-4)

_Sama dengan Paket 1 Bulan_

| No  | Tahapan                   | Deskripsi Pekerjaan                         | Progress Detail                                                                                                                                           | Harga |
| --- | ------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 1   | **Setup Infrastruktur**   | Inisialisasi project monorepo & environment | • Setup struktur folder client/server<br>• Konfigurasi TypeScript & ESLint<br>• Setup environment variables<br>• Instalasi dependencies core              |       |
| 2   | **Database Foundation**   | Desain & implementasi database PostgreSQL   | • Setup PostgreSQL + Prisma ORM<br>• Desain schema database (User, Product, Category)<br>• Implementasi migration system<br>• Seed data Master Admin      |       |
| 3   | **Authentication System** | Sistem autentikasi & otorisasi              | • API Register & Login dengan JWT<br>• Refresh token mechanism<br>• Password hashing (Bcrypt)<br>• Role-based access control (4-tier)                     |       |
| 4   | **Frontend Foundation**   | Setup Vue.js 3 & komponen dasar             | • Inisialisasi Vue 3 + Vite<br>• Setup Tailwind CSS dengan custom theme<br>• Implementasi Atomic Design System<br>• Komponen atoms (Button, Input, Badge) |       |
| 5   | **Dashboard Layout**      | Layout admin panel dasar                    | • Sidebar dinamis berdasarkan role<br>• Navbar dengan user menu<br>• Auth guard & route protection<br>• Pinia state management                            |       |
| 6   | **Login & Register UI**   | Halaman autentikasi frontend                | • Halaman Login dengan validasi<br>• Integrasi API auth<br>• Token persistence<br>• Error handling UI                                                     |       |

## Bulan 2 (Minggu 5-8)

| No  | Tahapan                   | Deskripsi Pekerjaan                | Progress Detail                                                                                                                                       | Harga |
| --- | ------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 7   | **Page Builder Backend**  | API untuk dynamic page management  | • Schema Page dengan JSONB sections<br>• CRUD API Pages<br>• Slug-based routing<br>• Meta SEO fields support                                          |       |
| 8   | **Page Builder Frontend** | Drag & Drop page builder interface | • Integrasi vuedraggable library<br>• Widget registry system<br>• Canvas editor dengan preview<br>• Property editor panel<br>• Save/Publish mechanism |       |
| 9   | **Builder Widgets**       | Komponen widget untuk page builder | • HeroBanner widget<br>• TextBlock widget<br>• ProductCatalog widget<br>• Image Gallery widget<br>• EventCalendar widget                              |       |
| 10  | **Product Management**    | CRUD produk dengan fitur lengkap   | • Schema Product, Category, Variant<br>• API CRUD Products<br>• Image upload (Cloudinary)<br>• Category management<br>• Price variant system          |       |
| 11  | **Product Intelligence**  | Fitur ingredients & komposisi      | • Schema Ingredient<br>• Nested ingredients per product<br>• Takaran & satuan management<br>• HPP/COGS calculation support                            |       |
| 12  | **Storefront Public**     | Halaman publik untuk pengunjung    | • Dynamic page rendering engine<br>• Product catalog view<br>• Product detail page<br>• Category filtering<br>• Responsive design                     |       |

**Total Deliverables Paket 2 Bulan:**

- ✅ Semua fitur Paket 1 Bulan
- ✅ Full Page Builder (Drag & Drop)
- ✅ 5+ Builder Widgets
- ✅ Product Management dengan Ingredients
- ✅ Category Management
- ✅ Public Storefront
- ✅ Cloudinary Integration

| **TOTAL PAKET 2 BULAN** | | | |

---

# 🗓️ PAKET 3 BULAN (12 Minggu)

### _Complete Enterprise Solution_

## Bulan 1 (Minggu 1-4)

_Foundation & Core Setup_

| No  | Tahapan                   | Deskripsi Pekerjaan                         | Progress Detail                                                                                                                                | Harga |
| --- | ------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 1   | **Setup Infrastruktur**   | Inisialisasi project monorepo & environment | • Setup struktur folder client/server<br>• Konfigurasi TypeScript & ESLint<br>• Setup environment variables<br>• Instalasi dependencies core   |       |
| 2   | **Database Foundation**   | Desain & implementasi database PostgreSQL   | • Setup PostgreSQL + Prisma ORM<br>• Desain schema database lengkap<br>• Implementasi migration system<br>• Seed data Master Admin             |       |
| 3   | **Authentication System** | Sistem autentikasi & otorisasi              | • API Register & Login dengan JWT<br>• Refresh token mechanism<br>• Password hashing (Bcrypt)<br>• Role-based access control (4-tier)          |       |
| 4   | **Frontend Foundation**   | Setup Vue.js 3 & komponen dasar             | • Inisialisasi Vue 3 + Vite<br>• Setup Tailwind CSS dengan custom theme<br>• Implementasi Atomic Design System<br>• Komponen atoms & molecules |       |
| 5   | **Dashboard Layout**      | Layout admin panel dasar                    | • Sidebar dinamis berdasarkan role<br>• Navbar dengan user menu<br>• Auth guard & route protection<br>• Pinia state management                 |       |
| 6   | **Login & Register UI**   | Halaman autentikasi frontend                | • Halaman Login dengan validasi<br>• Integrasi API auth<br>• Token persistence<br>• Error handling UI                                          |       |

## Bulan 2 (Minggu 5-8)

_CMS Core & Product Management_

| No  | Tahapan                   | Deskripsi Pekerjaan                | Progress Detail                                                                                                                                       | Harga |
| --- | ------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 7   | **Page Builder Backend**  | API untuk dynamic page management  | • Schema Page dengan JSONB sections<br>• CRUD API Pages<br>• Slug-based routing<br>• Meta SEO fields support                                          |       |
| 8   | **Page Builder Frontend** | Drag & Drop page builder interface | • Integrasi vuedraggable library<br>• Widget registry system<br>• Canvas editor dengan preview<br>• Property editor panel<br>• Save/Publish mechanism |       |
| 9   | **Builder Widgets**       | Komponen widget untuk page builder | • HeroBanner widget<br>• TextBlock widget<br>• ProductCatalog widget<br>• Image Gallery widget<br>• EventCalendar widget<br>• Custom Button widget    |       |
| 10  | **Product Management**    | CRUD produk dengan fitur lengkap   | • Schema Product, Category, Variant<br>• API CRUD Products<br>• Image upload (Cloudinary)<br>• Category management<br>• Price variant system          |       |
| 11  | **Product Intelligence**  | Fitur ingredients & komposisi      | • Schema Ingredient<br>• Nested ingredients per product<br>• Takaran & satuan management<br>• HPP/COGS calculation support                            |       |
| 12  | **Storefront Public**     | Halaman publik untuk pengunjung    | • Dynamic page rendering engine<br>• Product catalog view<br>• Product detail page<br>• Category filtering<br>• Responsive design                     |       |

## Bulan 3 (Minggu 9-12)

_Advanced Features, Security & Deployment_

| No  | Tahapan                      | Deskripsi Pekerjaan               | Progress Detail                                                                                                                                                      | Harga |
| --- | ---------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 13  | **Digital Library Module**   | Modul pustaka/buku digital        | • Schema Book dengan styling JSON<br>• CRUD API Books<br>• Custom style per buku (warna, font)<br>• Rich text content editor<br>• Book detail public view            |       |
| 14  | **Forum & Blog Module**      | Fitur community engagement        | • Schema Forum Post & Comments<br>• CRUD API Forum/Blog<br>• Rich text editor (Tiptap)<br>• Comment system<br>• Moderation tools                                     |       |
| 15  | **User Management**          | Manajemen pengguna oleh Admin     | • List users dengan pagination<br>• Create/Edit user<br>• Role assignment<br>• Master Lock mechanism<br>• Account status toggle                                      |       |
| 16  | **Audit Trail System**       | Logging aktivitas sistem          | • Schema ActivityLog<br>• Audit middleware otomatis<br>• Log viewer di dashboard<br>• Filter by user/action/date<br>• Export log ke Excel                            |       |
| 17  | **Security Hardening**       | Implementasi keamanan production  | • Master Lock middleware<br>• Real-time account blocking<br>• Rate limiting<br>• Helmet security headers<br>• Input validation (Zod)                                 |       |
| 18  | **Reporting & Export**       | Fitur laporan & export data       | • Report dashboard UI<br>• Export PDF (jsPDF)<br>• Export Excel (xlsx)<br>• Date range filtering<br>• Summary statistics                                             |       |
| 19  | **Performance Optimization** | Optimasi performa aplikasi        | • Backend query optimization<br>• Frontend lazy loading<br>• Code splitting<br>• Image optimization<br>• Redis caching (optional)                                    |       |
| 20  | **Theme Engine**             | Fitur kustomisasi tampilan        | • CSS Variables system<br>• Color picker di dashboard<br>• Real-time theme preview<br>• Theme persistence<br>• Dark mode support                                     |       |
| 21  | **Deployment Setup**         | Konfigurasi deployment production | • Dockerfile client & server<br>• Docker-compose configuration<br>• Environment production setup<br>• Vercel/Railway deployment<br>• CI/CD pipeline (GitHub Actions) |       |
| 22  | **Testing & QA**             | Quality assurance & testing       | • Unit testing (Jest/Vitest)<br>• API testing<br>• Integration testing<br>• Bug fixing & refinement<br>• Performance testing                                         |       |
| 23  | **Documentation**            | Dokumentasi lengkap project       | • API Documentation (Swagger)<br>• User manual<br>• Technical documentation<br>• Deployment guide<br>• Handover documentation                                        |       |

**Total Deliverables Paket 3 Bulan:**

- ✅ Semua fitur Paket 2 Bulan
- ✅ Digital Library Module
- ✅ Forum & Blog Module
- ✅ Complete User Management
- ✅ Audit Trail System
- ✅ Security Hardening (Production-ready)
- ✅ Reporting & Export (PDF/Excel)
- ✅ Theme Engine & Dark Mode
- ✅ Docker Containerization
- ✅ CI/CD Pipeline
- ✅ Complete Documentation
- ✅ Production Deployment

| **TOTAL PAKET 3 BULAN** | | | |

---

# 📊 PERBANDINGAN PAKET

| Fitur                      | 1 Bulan | 2 Bulan | 3 Bulan |
| -------------------------- | :-----: | :-----: | :-----: |
| Backend Infrastructure     |   ✅    |   ✅    |   ✅    |
| Database + Prisma ORM      |   ✅    |   ✅    |   ✅    |
| Authentication (JWT)       |   ✅    |   ✅    |   ✅    |
| Role-Based Access Control  |   ✅    |   ✅    |   ✅    |
| Frontend Vue 3 + Tailwind  |   ✅    |   ✅    |   ✅    |
| Dashboard Layout           |   ✅    |   ✅    |   ✅    |
| Page Builder (Drag & Drop) |   ❌    |   ✅    |   ✅    |
| Builder Widgets (5+)       |   ❌    |   ✅    |   ✅    |
| Product Management         |   ❌    |   ✅    |   ✅    |
| Product Ingredients        |   ❌    |   ✅    |   ✅    |
| Category Management        |   ❌    |   ✅    |   ✅    |
| Public Storefront          |   ❌    |   ✅    |   ✅    |
| Cloudinary Integration     |   ❌    |   ✅    |   ✅    |
| Digital Library Module     |   ❌    |   ❌    |   ✅    |
| Forum & Blog Module        |   ❌    |   ❌    |   ✅    |
| User Management            |  Basic  |  Basic  | ✅ Full |
| Audit Trail System         |   ❌    |   ❌    |   ✅    |
| Security Hardening         |  Basic  |  Basic  | ✅ Full |
| Reporting (PDF/Excel)      |   ❌    |   ❌    |   ✅    |
| Theme Engine               |   ❌    |   ❌    |   ✅    |
| Docker Deployment          |   ❌    |   ❌    |   ✅    |
| CI/CD Pipeline             |   ❌    |   ❌    |   ✅    |
| API Documentation          |   ❌    |  Basic  | ✅ Full |
| Testing & QA               |   ❌    |  Basic  | ✅ Full |

---

# 💰 RINGKASAN HARGA

| Paket                | Durasi  | Harga |
| -------------------- | ------- | ----- |
| **Paket Basic**      | 1 Bulan |       |
| **Paket Standard**   | 2 Bulan |       |
| **Paket Enterprise** | 3 Bulan |       |

---

## 📝 CATATAN

1. **Revisi:** Setiap paket termasuk maksimal 2x revisi minor per tahapan
2. **Meeting:** Progress meeting 1x per minggu via online
3. **Support:** Garansi bug fixing 1 bulan setelah project selesai
4. **Hosting:** Biaya hosting/server tidak termasuk dalam RAB
5. **Domain:** Biaya domain tidak termasuk dalam RAB
6. **Content:** Pengisian konten (teks, gambar) dilakukan oleh klien

---

## 📞 KONTAK

Untuk informasi lebih lanjut mengenai project ini, silakan hubungi:

**Project:** ANTITESA CoffeeShop Enterprise CMS  
**Version:** 2.1.0  
**Tech Stack:** Vue.js 3, Node.js, PostgreSQL, TypeScript

---

_Dokumen ini dibuat sebagai acuan scope pekerjaan dan estimasi biaya untuk pengembangan platform ANTITESA._
