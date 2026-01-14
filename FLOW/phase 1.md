Fase 1: Setup Backend & Database Foundation

Dokumen ini adalah panduan teknis mendalam untuk Fase 1 pengembangan CoffeeShop Enterprise CMS. Fokus utama fase ini adalah membangun pondasi server, skema database, dan sistem otentikasi yang aman sebelum masuk ke fitur CMS yang kompleks.

🎯 Target Deliverables (Capaian Fase 1)

Monorepo Setup: Struktur folder client dan server terinisialisasi.

Database Ready: PostgreSQL berjalan dan terkoneksi dengan Prisma ORM.

Schema Migration: Tabel User dan ActivityLog berhasil dibuat di database.

Auth System: API Register, Login (JWT), dan Middleware Role-Check berfungsi.

Master Seed: Script untuk membuat akun "Master Admin" pertama secara otomatis.

🛠️ Langkah 1: Inisialisasi Monorepo & Environment

Kita akan menggunakan struktur Monorepo agar konfigurasi TypeScript bisa konsisten.

1.1 Struktur Root

Buat folder proyek dan inisialisasi package.json di root.

mkdir coffeeshop-project
cd coffeeshop-project
npm init -y


1.2 Setup Server (Backend)

Install dependencies wajib untuk backend Node.js.

mkdir server
cd server
npm init -y

# Core Dependencies
npm install express cors helmet morgan dotenv bcryptjs jsonwebtoken zod @prisma/client multer

# Dev Dependencies (TypeScript)
npm install -D typescript ts-node nodemon @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken prisma


1.3 Konfigurasi TypeScript (server/tsconfig.json)

Pastikan konfigurasi ketat (strict) untuk keamanan type.

{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}


🗄️ Langkah 2: Database & Prisma ORM

Ini adalah langkah paling krusial. Kita mendefinisikan struktur data.

2.1 Inisialisasi Prisma

Di dalam folder server:

npx prisma init


2.2 Definisi Schema (server/prisma/schema.prisma)

Copy schema berikut. Fokus Fase 1 adalah User dan Security.

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  MASTER_ADMIN
  ADMIN_OWNER
  MEDIA_STAFF
  USER_PUBLIC
}

model User {
  id        String   @id @default(uuid())
  username  String
  email     String   @unique
  password  String
  role      Role     @default(USER_PUBLIC)
  isLocked  Boolean  @default(false)
  
  logs      ActivityLog[] // Relasi ke log aktivitas
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ActivityLog {
  id        String   @id @default(uuid())
  action    String   // CREATE, UPDATE, DELETE, LOGIN, LOCK
  entity    String   // User, Product, System
  targetId  String?
  details   Json?    // Data snapshot
  
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  createdAt DateTime @default(now())
}


2.3 Environment Variables (server/.env)

Pastikan developer memiliki file ini (jangan commit ke git).

PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/coffeeshop_db?schema=public"
JWT_SECRET="rahasia_super_ketat_fase_1"
JWT_EXPIRES_IN="1d"


2.4 Migrasi Database

Jalankan perintah ini untuk membuat tabel di PostgreSQL:

npx prisma migrate dev --name init_user_schema


🔐 Langkah 3: Implementasi Authentication API

Membangun logic Login dan Proteksi Route.

3.1 Utility: Password Hashing & JWT

Buat file helper di server/src/utils/.

password.ts: Gunakan bcrypt.hash(password, 10) dan bcrypt.compare().

jwt.ts: Gunakan jwt.sign({ id, role }, process.env.JWT_SECRET).

3.2 Auth Controller (server/src/controllers/auth.controller.ts)

Logic bisnis untuk login:

Terima email & password dari body.

Cari user di DB (prisma.user.findUnique).

Cek Master Lock: if (user.isLocked) throw new Error("Account Locked").

Validasi password.

Generate Token.

Return Token + User Info (tanpa password).

3.3 Middlewares (server/src/middlewares/)

auth.middleware.ts:

Ambil token dari header Authorization: Bearer <token>.

Verify token. Jika valid, tempel user ke req.user.

rbac.middleware.ts:

Fungsi untuk membatasi akses berdasarkan role.

Contoh: authorize(['MASTER_ADMIN']).

3.4 Routes (server/src/routes/auth.routes.ts)

router.post('/register', validate(registerDto), AuthController.register); // Public (untuk user biasa)
router.post('/login', validate(loginDto), AuthController.login);
router.get('/me', authMiddleware, AuthController.getProfile);


🌱 Langkah 4: Seeding Master Admin

Karena sistem ini butuh satu "Tuhan" (Master Admin) untuk pertama kali, kita harus membuatnya via script.

Buat file server/prisma/seed.ts:

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('MasterPassword123!', 10);
  
  const master = await prisma.user.upsert({
    where: { email: 'master@coffeeshop.com' },
    update: {},
    create: {
      username: 'System Master',
      email: 'master@coffeeshop.com',
      password: hashedPassword,
      role: 'MASTER_ADMIN',
      isLocked: false
    },
  });

  console.log({ master });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());


Jalankan seed: npx prisma db seed.

✅ Checklist Penyelesaian Fase 1

Sebelum lanjut ke Fase 2 (Dashboard Core), pastikan hal berikut sudah Passed:

[ ] Server Express berjalan di port 5000.

[ ] Bisa connect ke Database Postgres via Prisma Studio (npx prisma studio).

[ ] Hit API /api/auth/login dengan akun Master Admin mengembalikan Token JWT valid.

[ ] Hit API /api/auth/me tanpa token mengembalikan 401 Unauthorized.

[ ] Login dengan akun yang field isLocked: true di database, API menolak akses.

[ ] Struktur folder rapi sesuai standar Enterprise Monorepo.

Next Step (Fase 2): Setelah pondasi ini kokoh, kita akan mulai membangun Frontend Vue.js dan fitur Dashboard Admin (Theme Editor & Page Manager).