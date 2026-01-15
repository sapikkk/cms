# 🚂 Railway Environment Variables Setup

## 📋 Langkah Setup Cloudinary di Railway

### 1. Login ke Railway Dashboard

Buka: https://railway.app/dashboard

### 2. Pilih Project ANTITESA API

### 3. Tambahkan Environment Variables

Klik **Variables** tab, lalu tambahkan:

#### ✅ Cloudinary Configuration (REQUIRED untuk Upload)

```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
STORAGE_TYPE=cloudinary
```

**Cara mendapatkan Cloudinary credentials:**

1. Login ke https://cloudinary.com/console
2. Di Dashboard, lihat **Account Details**
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

#### 🔐 JWT & Security (Jika belum ada)

```
JWT_SECRET=your-secret-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-min-32-characters
BCRYPT_SALT_ROUNDS=10
```

Generate secrets:

```bash
openssl rand -hex 32
```

#### 🌐 CORS (Update untuk Vercel)

```
CORS_ORIGIN=https://penditegar.vercel.app,http://localhost:5173
CORS_CREDENTIALS=true
```

#### 📊 Database

```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

### 4. Redeploy Service

Setelah menambahkan environment variables:

1. Klik **Deploy** tab
2. Klik **Redeploy** atau tunggu auto-deploy

### 5. Test Endpoint

```bash
curl https://antitesa-api-production.up.railway.app/api/v1/health
```

---

## 🧪 Test Upload Endpoint

Setelah deploy selesai, test dengan:

```bash
# Pastikan sudah login dan punya token
curl -X POST https://antitesa-api-production.up.railway.app/api/v1/upload/image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "folder=antitesa/test"
```

---

## ⚠️ Troubleshooting

### Error: "Route not found"

- ✅ Pastikan deploy selesai
- ✅ Cek Railway logs untuk error
- ✅ Pastikan commit terbaru sudah di-push

### Error: "Cloudinary configuration missing"

- ✅ Pastikan semua 3 Cloudinary variables sudah di-set
- ✅ Pastikan `STORAGE_TYPE=cloudinary`
- ✅ Redeploy setelah menambahkan variables

### Error: "401 Unauthorized"

- ✅ User harus login dulu untuk upload
- ✅ Pastikan token JWT valid

---

## 📝 Checklist

- [ ] Cloudinary account created
- [ ] CLOUDINARY_CLOUD_NAME added to Railway
- [ ] CLOUDINARY_API_KEY added to Railway
- [ ] CLOUDINARY_API_SECRET added to Railway
- [ ] STORAGE_TYPE=cloudinary added to Railway
- [ ] CORS_ORIGIN includes https://penditegar.vercel.app
- [ ] Redeployed service
- [ ] Tested /api/v1/health endpoint
- [ ] Tested upload with valid JWT token

---

## 🎯 Current Status

**Frontend:** ✅ https://penditegar.vercel.app
**Backend:** ✅ https://antitesa-api-production.up.railway.app
**Upload Endpoint:** ❌ Need Cloudinary config in Railway

---

**Next Steps:**

1. Add Cloudinary environment variables to Railway
2. Redeploy Railway service
3. Test upload functionality after login
