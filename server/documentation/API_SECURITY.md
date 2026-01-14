# API Security & Audit System
Implemented in Version 2.1

## 1. Security Middlewares

### accountLock (Middleware)
Memblokir akses user secara real-time jika `isLocked` = true di database, bahkan jika JWT token masih valid.
- **Lokasi**: `src/middlewares/lock.middleware.ts`
- **Logic**: Query DB setiap request untuk cek status lock.
- **Exception**: Master Admin tidak bisa dilock.

### rateLimit (Middleware)
Membatasi jumlah request untuk mencegah DDoS dan Brute Force.
- **API Default**: 100 req / 15 menit
- **Auth (Login/Register)**: 5 req / 15 menit (Strict)
- **Public**: 300 req / 15 menit

### auditLogger (Middleware)
Otomatis mencatat aktivitas create/update/delete ke tabel `ActivityLog`.
- **Lokasi**: `src/middlewares/audit.middleware.ts`
- **Usage**:
  ```typescript
  router.post('/', auditCreate('Product'), controller.create)
  ```

---

## 2. Master Admin Features

### User Management
- **List Users**: `GET /api/v1/users`
- **Lock Account**: `POST /api/v1/users/:id/lock`
- **Unlock Account**: `POST /api/v1/users/:id/unlock`
- **Change Role**: `PATCH /api/v1/users/:id/role`

### Audit Logs
- **View Logs**: `GET /api/v1/activity-logs`
- **View Stats**: `GET /api/v1/activity-logs/stats`

---

## 3. Infrastructure

### Docker
- Multi-stage build untuk Server & Client.
- Docker Compose setup dengan PostgreSQL & Redis.
- Nginx reverse proxy untuk Frontend.

### Backup
- Script `scripts/backup_db.sh` untuk dump database otomatis.
- Support upload ke AWS S3.
