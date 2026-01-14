# 🚀 Panduan Deployment ke Vercel

## Domain Target: penditegar.vercel.app

---

## 📋 Prerequisite

1. **Akun Vercel** - Daftar di [vercel.com](https://vercel.com)
2. **Database PostgreSQL** - Gunakan salah satu:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [Supabase](https://supabase.com) (Recommended - Free tier)
   - [Neon](https://neon.tech)
   - [Railway](https://railway.app)
   - [PlanetScale](https://planetscale.com)

---

## 🗄️ Step 1: Setup Database (Menggunakan Supabase)

1. Buka [supabase.com](https://supabase.com) dan buat project baru
2. Setelah project dibuat, pergi ke **Settings** → **Database**
3. Copy **Connection string** (URI):
   - Untuk `DATABASE_URL`: Gunakan **Transaction pooler** (port 6543)
   - Untuk `DIRECT_URL`: Gunakan **Direct connection** (port 5432)

Contoh:

```
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

---

## 🔧 Step 2: Deploy ke Vercel

### Opsi A: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login ke Vercel
vercel login

# Deploy project
vercel

# Untuk production deployment
vercel --prod
```

### Opsi B: Deploy via Git (Recommended)

1. Push project ke GitHub/GitLab/Bitbucket
2. Buka [vercel.com/new](https://vercel.com/new)
3. Import repository
4. Pilih **Root Directory**: `.` (root folder)
5. Klik **Deploy**

---

## 🔐 Step 3: Setup Environment Variables di Vercel

Buka Vercel Dashboard → Project → **Settings** → **Environment Variables**

Tambahkan variabel berikut:

### Database

| Variable       | Value              | Environment                      |
| -------------- | ------------------ | -------------------------------- |
| `DATABASE_URL` | `postgresql://...` | Production, Preview, Development |
| `DIRECT_URL`   | `postgresql://...` | Production, Preview, Development |

### JWT & Security

| Variable                 | Value                      | Environment |
| ------------------------ | -------------------------- | ----------- |
| `JWT_SECRET`             | Random string 32+ karakter | Production  |
| `JWT_REFRESH_SECRET`     | Random string 32+ karakter | Production  |
| `JWT_EXPIRES_IN`         | `7d`                       | Production  |
| `JWT_REFRESH_EXPIRES_IN` | `30d`                      | Production  |
| `BCRYPT_SALT_ROUNDS`     | `10`                       | Production  |

### Server Config

| Variable      | Value        | Environment |
| ------------- | ------------ | ----------- |
| `NODE_ENV`    | `production` | Production  |
| `PORT`        | `3000`       | Production  |
| `API_VERSION` | `v1`         | Production  |

### CORS

| Variable           | Value                           | Environment |
| ------------------ | ------------------------------- | ----------- |
| `CORS_ORIGIN`      | `https://penditegar.vercel.app` | Production  |
| `CORS_CREDENTIALS` | `true`                          | Production  |

### Frontend

| Variable       | Value                                  | Environment |
| -------------- | -------------------------------------- | ----------- |
| `VITE_API_URL` | `https://penditegar.vercel.app/api/v1` | Production  |

---

## 🔑 Generate Secret Keys

Jalankan di terminal untuk generate JWT secrets:

```bash
# Generate JWT_SECRET
openssl rand -hex 32

# Generate JWT_REFRESH_SECRET
openssl rand -hex 32
```

Atau gunakan Node.js:

```javascript
require("crypto").randomBytes(32).toString("hex");
```

---

## 📦 Step 4: Jalankan Prisma Migrations

Setelah environment variables diset, jalankan migration:

```bash
# Di local machine dengan DATABASE_URL pointing ke production DB
cd server
npx prisma migrate deploy

# Seed data (optional)
npx prisma db seed
```

Atau via Vercel CLI:

```bash
vercel env pull .env.local
cd server
npx prisma migrate deploy
```

---

## 🌐 Step 5: Custom Domain (penditegar.vercel.app)

Domain `penditegar.vercel.app` akan otomatis tersedia setelah deploy.

Jika ingin custom domain (contoh: `yourdomain.com`):

1. Buka Vercel Dashboard → Project → **Settings** → **Domains**
2. Tambahkan domain
3. Update DNS settings sesuai instruksi

---

## ✅ Checklist Deployment

- [ ] Database PostgreSQL sudah dibuat
- [ ] Environment variables sudah diset di Vercel
- [ ] `DATABASE_URL` sudah benar dengan pooling
- [ ] `DIRECT_URL` sudah benar untuk migrations
- [ ] JWT secrets sudah digenerate
- [ ] CORS origin sudah diset ke `https://penditegar.vercel.app`
- [ ] Prisma migrations sudah dijalankan
- [ ] Test API endpoint: `https://penditegar.vercel.app/api/v1/health`

---

## 🐛 Troubleshooting

### Error: Prisma Client not generated

```bash
cd server && npx prisma generate
```

### Error: Database connection failed

- Pastikan `DATABASE_URL` format benar
- Untuk Supabase, gunakan pooler connection (port 6543)
- Tambahkan `?pgbouncer=true` di akhir URL

### Error: CORS blocked

- Pastikan `CORS_ORIGIN` diset dengan benar
- Include `https://` di URL

### Error: 500 Internal Server Error

- Cek Vercel Function Logs di dashboard
- Pastikan semua environment variables sudah diset

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Prisma + Vercel: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- Supabase Docs: https://supabase.com/docs

---

**🎉 Happy Deploying!**
