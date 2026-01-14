# Installation Guide - CoffeeShop Enterprise CMS v2.1

## 📋 Prerequisites

Sebelum memulai instalasi, pastikan sistem Anda memiliki:

### Required Software
- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **PostgreSQL** >= 14.x ([Download](https://www.postgresql.org/download/))
- **npm** >= 9.x (included with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Optional (Recommended)
- **VS Code** dengan extensions:
  - Vue - Official
  - Prisma
  - ESLint
  - Prettier
- **pgAdmin** atau **TablePlus** untuk database management
- **Postman** atau **Insomnia** untuk API testing

---

## 🚀 Installation Steps

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd coffeeshop-project
```

### Step 2: Install Dependencies

Install dependencies untuk monorepo:

```bash
npm run setup
```

Atau install secara manual:

```bash
# Root dependencies
npm install

# Client dependencies
cd client && npm install

# Server dependencies
cd ../server && npm install
```

### Step 3: Setup Database

#### 3.1 Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE coffeeshop_cms;

# Create user (optional)
CREATE USER coffeeshop_admin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE coffeeshop_cms TO coffeeshop_admin;

# Exit
\q
```

#### 3.2 Configure Database Connection

Copy environment file:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` dan update DATABASE_URL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/coffeeshop_cms?schema=public"
```

Contoh:
```env
DATABASE_URL="postgresql://coffeeshop_admin:your_password@localhost:5432/coffeeshop_cms?schema=public"
```

### Step 4: Configure Environment Variables

#### 4.1 Server Environment

Edit `server/.env`:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/coffeeshop_cms?schema=public"

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars-long-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-chars-long

# Master Admin (Initial Setup)
MASTER_ADMIN_EMAIL=master@coffeeshop.com
MASTER_ADMIN_PASSWORD=MasterAdmin@2025
MASTER_ADMIN_USERNAME=masteradmin
```

**⚠️ IMPORTANT:** Change JWT secrets to strong random strings in production!

#### 4.2 Client Environment

```bash
cd ../client
cp .env.example .env
```

Edit `client/.env` (default values should work):

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_STORAGE_BASE_URL=http://localhost:3000/uploads
```

### Step 5: Database Migration

Run Prisma migrations:

```bash
cd server

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed initial data (creates Master Admin)
npm run prisma:seed
```

### Step 6: Start Development Servers

#### Option 1: Run Both (Recommended)

From root directory:

```bash
npm run dev
```

This will start:
- Backend API: http://localhost:3000
- Frontend App: http://localhost:5173

#### Option 2: Run Separately

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

---

## ✅ Verify Installation

### 1. Check Backend

Open browser: http://localhost:3000

You should see:
```json
{
  "message": "CoffeeShop CMS API v1.0",
  "status": "OK"
}
```

### 2. Check Frontend

Open browser: http://localhost:5173

You should see the login page.

### 3. Test Login

Use default Master Admin credentials:
- **Email:** master@coffeeshop.com
- **Password:** MasterAdmin@2025

### 4. Check Database

```bash
cd server
npm run prisma:studio
```

This opens Prisma Studio at http://localhost:5555 where you can view database tables.

---

## 🔧 Common Issues & Solutions

### Issue 1: Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find and kill process using port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Or change port in `server/.env`:
```env
PORT=3001
```

### Issue 2: Database Connection Failed

**Error:** `Can't reach database server`

**Solution:**
1. Ensure PostgreSQL is running:
   ```bash
   # macOS (Homebrew)
   brew services start postgresql
   
   # Linux (systemd)
   sudo systemctl start postgresql
   
   # Windows
   # Start from Services or pgAdmin
   ```

2. Verify credentials in `server/.env`

3. Test connection:
   ```bash
   psql -U username -d coffeeshop_cms
   ```

### Issue 3: Prisma Migration Failed

**Error:** `Migration engine error`

**Solution:**
```bash
# Reset database (⚠️ DELETES ALL DATA)
cd server
npx prisma migrate reset

# Or push schema without migration
npx prisma db push
```

### Issue 4: Module Not Found

**Error:** `Cannot find module 'xxx'`

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or use npm ci for clean install
npm ci
```

### Issue 5: JWT Token Invalid

**Error:** `Token invalid or expired`

**Solution:**
1. Clear browser localStorage
2. Logout and login again
3. Verify JWT_SECRET in `server/.env` hasn't changed

---

## 🏗️ Project Structure Verification

After installation, verify your project structure:

```bash
# Check server structure
ls -la server/src/

# Expected directories:
# config/, constants/, controllers/, dtos/, 
# interfaces/, middlewares/, routes/, services/, utils/

# Check client structure
ls -la client/src/

# Expected directories:
# api/, assets/, components/, composables/, 
# config/, layouts/, router/, stores/, utils/, views/
```

---

## 📦 Build for Production

### Build Client

```bash
cd client
npm run build
```

Output will be in `client/dist/`

### Build Server

```bash
cd server
npm run build
```

Output will be in `server/dist/`

### Run Production Build

```bash
# Set environment to production
export NODE_ENV=production

# Start server
cd server
npm start
```

---

## 🔒 Security Checklist for Production

Before deploying to production:

- [ ] Change all default passwords
- [ ] Generate strong JWT secrets (min 64 chars)
- [ ] Setup proper CORS origins
- [ ] Enable HTTPS
- [ ] Setup rate limiting
- [ ] Configure proper database backups
- [ ] Setup logging and monitoring
- [ ] Use environment-specific .env files
- [ ] Never commit .env files to git
- [ ] Setup firewall rules
- [ ] Configure PostgreSQL for remote access (if needed)

---

## 📚 Next Steps

1. **Read Documentation:**
   - [API Documentation](./server/docs/API.md)
   - [Frontend Architecture](./client/docs/ARCHITECTURE.md)
   - [Main README](./README.md)

2. **Explore Features:**
   - Login as Master Admin
   - Create test products
   - Build a test page
   - Configure theme

3. **Development:**
   - Review code structure
   - Understand authentication flow
   - Learn CMS architecture

---

## 💬 Support

If you encounter issues not covered here:

1. Check existing documentation
2. Review error logs in `server/logs/`
3. Check browser console for frontend errors
4. Contact development team

---

## 🎉 Installation Complete!

You're now ready to start developing with CoffeeShop Enterprise CMS!

**Default Access:**
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000
- **Prisma Studio:** http://localhost:5555 (run `npm run prisma:studio`)

**Default Master Admin:**
- **Email:** master@coffeeshop.com
- **Password:** MasterAdmin@2025

**⚠️ Remember to change default credentials immediately!**
