Fase 4: Security Hardening, Optimization & Deployment

Dokumen ini adalah panduan kerja (Sprint Guide) untuk Fase 4 (Final). Di fase ini, kita akan mengubah aplikasi yang "berfungsi" menjadi aplikasi yang "siap tempur" (Production Ready). Fokus utama adalah implementasi keamanan mutlak (Master Lock), pencatatan jejak digital (Audit Log), optimasi performa, dan strategi deployment menggunakan Docker.

🎯 Target Deliverables (Capaian Fase 4)

Security "Iron Dome": Implementasi Middleware Master Lock yang memblokir akses user terkunci secara real-time.

Audit Log Middleware: Sistem otomatis yang mencatat setiap aksi Create/Update/Delete ke database tanpa kode berulang di controller.

Frontend Optimization: Penerapan Lazy Loading dan Code Splitting untuk mempercepat loading awal.

Containerization: Setup Dockerfile dan docker-compose untuk Client dan Server.

CI/CD Pipeline: Skrip otomatisasi untuk deployment.

🛡️ Langkah 1: Security Hardening

Mengamankan API dari akses yang tidak sah dan serangan umum.

1.1 Master Lock Middleware (server/src/middlewares/lock.middleware.ts)

Middleware ini dipasang setelah verifikasi Token JWT. Tujuannya: Meskipun token masih valid (belum expired), jika status di DB isLocked = true, request harus ditolak seketika.

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export const checkLockStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; // Dari Auth Middleware
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Cek langsung ke DB untuk status terbaru (Real-time block)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isLocked: true }
    });

    if (user?.isLocked) {
      return res.status(403).json({ 
        message: 'ACCOUNT_LOCKED_BY_MASTER', 
        detail: 'Hubungi Master Admin untuk pemulihan akses.' 
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};


1.2 Automated Audit Log (server/src/middlewares/audit.middleware.ts)

Interceptor untuk mencatat aktivitas penting. Kita tempelkan pada route mutasi (POST, PUT, DELETE).

export const auditLogger = (actionType: string, entity: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Jalankan request aslinya dulu
    const originalJson = res.json;
    
    res.json = function (body) {
      // Setelah response dikirim ke client, catat log di background
      res.on('finish', async () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          await prisma.activityLog.create({
            data: {
              userId: req.user.id,
              action: actionType, // e.g., "UPDATE_PRICE"
              entity: entity,     // e.g., "Product"
              targetId: req.params.id || body.id,
              details: req.method === 'GET' ? undefined : req.body // Simpan payload yang dikirim
            }
          });
        }
      });
      return originalJson.call(this, body);
    };
    
    next();
  };
};

// Cara Pakai di Route:
// router.post('/products', auth, auditLogger('CREATE', 'Product'), ProductController.create);


1.3 Rate Limiting & Helmet

Install express-rate-limit dan helmet untuk mencegah DDoS ringan dan serangan header.

// server/src/app.ts
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

app.use(helmet()); // Secure HTTP Headers

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Limit 100 request per IP
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);


⚡ Langkah 2: Performance Optimization

2.1 Backend Query Optimization

Pastikan Prisma tidak mengambil data yang tidak perlu (Over-fetching).

Salah: prisma.user.findMany() -> Mengambil password hash juga.

Benar: Gunakan select.

const users = await prisma.user.findMany({
  select: { id: true, username: true, role: true, isLocked: true } // Password tidak diambil
});


2.2 Frontend Lazy Loading

Pecah bundle Vue.js agar halaman Admin tidak diload oleh User Public.

// client/src/router/index.js
const routes = [
  {
    path: '/dashboard',
    component: () => import('../layouts/DashboardLayout.vue'), // Lazy Load Layout
    children: [
      {
        path: 'pages',
        // Lazy Load Page Editor yang berat (karena library drag-n-drop)
        component: () => import('../views/dashboard/pages/PageEditor.vue') 
      }
    ]
  }
];


🐳 Langkah 3: Containerization (Docker)

Menyiapkan lingkungan yang konsisten untuk Server dan Client.

3.1 Dockerfile Server (server/Dockerfile)

# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000
CMD ["node", "dist/server.js"]


3.2 Dockerfile Client (client/Dockerfile)

# Stage 1: Build Vue App
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


3.3 Docker Compose (docker-compose.yml)

Menjalankan seluruh stack (Database, Backend, Frontend) dengan satu perintah.

version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: coffeeshop_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build: ./server
    environment:
      DATABASE_URL: "postgresql://user:password@postgres:5432/coffeeshop_db?schema=public"
      JWT_SECRET: "production_secret_key"
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    command: sh -c "npx prisma migrate deploy && node dist/server.js"

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - api

volumes:
  postgres_data:


🚀 Langkah 4: Deployment Strategy

4.1 CI/CD Workflow (GitHub Actions)

Contoh file .github/workflows/deploy.yml untuk otomatis deploy saat push ke main.

Test: Jalankan unit test.

Build: Build Docker images.

Push: Push images ke Docker Hub / ECR.

Deploy: SSH ke VPS dan jalankan docker-compose up -d --pull always.

4.2 Production Environment Checklist

Sebelum rilis, verifikasi hal berikut:

[ ] NODE_ENV diset ke production.

[ ] JWT_SECRET menggunakan string acak panjang (bukan "rahasia").

[ ] Database di-backup secara berkala.

[ ] SSL (HTTPS) aktif menggunakan Let's Encrypt / Certbot pada Nginx.

[ ] Akun Master Admin default password sudah diubah.

✅ Final Project Checklist

Selamat! Jika Anda sampai di tahap ini, berarti sistem "CoffeeShop Enterprise CMS" sudah siap.

Fase 1: Database & Auth API ✅

Fase 2: Dashboard Dasar & Theme Editor ✅

Fase 3: Builder, Product Intelligence & Library ✅

Fase 4: Security Hardening & Deployment ✅

Langkah Terakhir: Lakukan User Acceptance Testing (UAT) dengan klien menggunakan data dummy untuk memastikan semua skenario hak akses (Master Lock, Audit Log) berjalan sesuai ekspektasi.