Fase 5: Optimization, Analytics & Operational Readiness

Dokumen ini adalah panduan kerja (Sprint Guide) untuk Fase 5 (Final Polish). Fokus utama fase ini adalah memastikan sistem berjalan cepat saat trafik tinggi (Caching), terintegrasi dengan alat pemasaran (Analytics), memiliki dokumentasi API yang jelas (Swagger), dan prosedur backup otomatis.

🎯 Target Deliverables (Capaian Fase 5)

High Performance Caching: Implementasi Redis untuk menyimpan respon API halaman JSON (mengurangi beban database hingga 80%).

Business Intelligence: Integrasi Google Analytics 4 (GA4) & Meta Pixel dengan Custom Events (bukan sekadar page view).

Error Monitoring: Pemasangan Sentry untuk mendeteksi error di browser user secara real-time.

API Documentation: Otomatisasi dokumentasi backend menggunakan Swagger/OpenAPI.

Disaster Recovery: Skrip otomatis backup database PostgreSQL ke Cloud Storage (AWS S3/GCS).

⚡ Langkah 1: Redis Caching (Performance)

Karena "Page Builder" menyimpan konfigurasi JSON di database, setiap kali user membuka halaman, database akan di-query. Untuk trafik tinggi, ini tidak efisien. Solusinya: Cache JSON tersebut di RAM (Redis).

1.1 Setup Redis di Backend

Install dependency:

cd server
npm install redis


1.2 Implementasi Cache Service (server/src/services/cache.service.ts)

import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

export const CacheService = {
  // Simpan data (expire dalam 1 jam)
  async set(key: string, data: any, ttl = 3600) {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  },

  // Ambil data
  async get(key: string) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  },

  // Hapus cache (dipanggil saat Admin update halaman)
  async del(key: string) {
    await redisClient.del(key);
  }
};


1.3 Integrasi di Page Controller

Modifikasi controller halaman publik (server/src/controllers/page.controller.ts):

export const getPageBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const cacheKey = `page:${slug}`;

  // 1. Cek Redis dulu
  const cachedPage = await CacheService.get(cacheKey);
  if (cachedPage) {
    return res.json(cachedPage); // Return instan (< 10ms)
  }

  // 2. Jika tidak ada, ambil dari DB
  const page = await prisma.page.findUnique({ where: { slug } });
  
  if (page) {
    // 3. Simpan ke Redis untuk request berikutnya
    await CacheService.set(cacheKey, page);
  }

  res.json(page);
};


Catatan: Jangan lupa panggil CacheService.del('page:slug') saat Admin melakukan Update Page di dashboard.

📊 Langkah 2: Business Intelligence (Analytics)

Tim Media membutuhkan data perilaku user. Kita tidak hanya memasang script GA4 biasa, tapi mengirimkan event spesifik.

2.1 Analytics Composable (client/src/composables/useAnalytics.js)

Wrapper agar kita bisa mengganti provider (GA4/Mixpanel) dengan mudah di masa depan.

export function useAnalytics() {
  const logEvent = (eventName, params = {}) => {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', eventName, params);
    }
    // Console log di dev mode
    if (import.meta.env.DEV) {
      console.log(`[Analytics] ${eventName}`, params);
    }
  };

  return {
    logViewProduct: (product) => logEvent('view_item', { 
      currency: 'IDR', value: product.basePrice, items: [{ item_name: product.name }] 
    }),
    logAddToCart: (product) => logEvent('add_to_cart', { 
      currency: 'IDR', value: product.basePrice, items: [{ item_name: product.name }] 
    }),
    logDownloadBook: (bookTitle) => logEvent('file_download', { 
      file_name: bookTitle 
    })
  };
}


2.2 Integrasi di Frontend

Pasang di ProductDetail.vue atau BookDetail.vue:

import { useAnalytics } from '@/composables/useAnalytics';
const { logViewProduct } = useAnalytics();

onMounted(() => {
  if (product.value) {
    logViewProduct(product.value);
  }
});


📖 Langkah 3: API Documentation (Swagger)

Sangat penting untuk handover ke tim mobile app atau pihak ketiga di masa depan.

3.1 Setup Swagger UI

cd server
npm install swagger-ui-express swagger-jsdoc


3.2 Konfigurasi (server/src/config/swagger.ts)

Definisikan spesifikasi API secara otomatis dari komentar kode atau file JSON.

// server/src/app.ts
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


Sekarang developer bisa mengakses http://localhost:5000/api-docs untuk melihat seluruh endpoint, mencoba login, dan melihat skema data tanpa membaca kode mentah.

🚨 Langkah 4: Error Monitoring (Sentry)

Jangan biarkan user melaporkan error. Kita harus tahu duluan.

4.1 Setup Sentry di Vue.js

cd client
npx @sentry/wizard@latest -i vue


Konfigurasi di main.js akan otomatis dibuat. Ini akan menangkap error JavaScript (misal: variabel undefined saat render produk) dan mengirim notifikasi ke email developer.

💾 Langkah 5: Disaster Recovery (Backup)

Skrip shell sederhana untuk membackup database PostgreSQL dan upload ke Cloud Storage.

5.1 Backup Script (scripts/backup_db.sh)

#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_coffeeshop_$TIMESTAMP.sql"

# 1. Dump Database
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# 2. Upload ke AWS S3 (Membutuhkan AWS CLI terinstall)
aws s3 cp $BACKUP_FILE s3://my-coffeeshop-backups/

# 3. Hapus file lokal
rm $BACKUP_FILE

echo "Backup $TIMESTAMP completed."


Pasang script ini di Cron Job server (misal: setiap jam 2 pagi).

🏁 Final Handover Checklist

Sebelum proyek diserahkan sepenuhnya ke Klien (Master Admin & Owner):

Dokumen Kredensial: Serahkan file berisi:

URL Login Dashboard.

Akun Master Admin (Email & Password Awal).

Kunci API (SendGrid, AWS S3, dll).

SOP Master Admin: Panduan PDF cara menggunakan fitur "Lock Account" dan cara membaca "Audit Log".

Source Code: Repository Git (Clean commit history).

Training Sesi:

Training Media: Cara pakai Page Builder & Theme Editor.

Training Owner: Cara baca Laporan Keuangan.

Training Master: Cara restore backup & manajemen user.

Project Complete!
Dengan selesainya Fase 5, sistem "CoffeeShop Enterprise CMS" kini tidak hanya aman dan fungsional, tetapi juga berkinerja tinggi, terukur, dan siap untuk operasional bisnis jangka panjang.