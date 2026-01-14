# ⚡ Quick Start Guide - CoffeeShop Enterprise CMS

Panduan singkat untuk memulai development dalam 5 menit!

---

## 🎯 Prerequisites

- ✅ Node.js >= 18.x
- ✅ PostgreSQL >= 14.x
- ✅ npm >= 9.x

---

## 🚀 5-Minute Setup

### 1. Extract Project
```bash
tar -xzf coffeeshop-enterprise-cms-v2.1.tar.gz
cd coffeeshop-project
```

### 2. Install Dependencies
```bash
npm run setup
```
*This installs dependencies for both client and server*

### 3. Setup Database

**Create database:**
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE coffeeshop_cms;

# Exit
\q
```

**Configure connection:**
```bash
# Copy env file
cd server
cp .env.example .env

# Edit DATABASE_URL in .env
# Change: postgresql://username:password@localhost:5432/coffeeshop_cms
```

### 4. Run Migrations & Seed
```bash
cd server
npm run prisma:migrate
npm run prisma:seed
```

### 5. Start Development
```bash
# From root directory
cd ..
npm run dev
```

**Done!** 🎉

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 🔑 Default Login

```
Email: master@coffeeshop.com
Password: MasterAdmin@2025
```

**⚠️ Change this immediately after first login!**

---

## 📁 What's Inside

```
coffeeshop-project/
├── client/           → Vue.js 3 Frontend
│   ├── src/
│   │   ├── api/      → HTTP services
│   │   ├── components/ → UI components
│   │   ├── router/   → Vue Router
│   │   ├── stores/   → Pinia stores
│   │   └── views/    → Pages
│   └── package.json
│
├── server/           → Node.js + TypeScript Backend
│   ├── src/
│   │   ├── config/   → Configuration
│   │   ├── constants/ → App constants
│   │   ├── controllers/ → API handlers
│   │   ├── services/ → Business logic
│   │   └── utils/    → Helpers
│   ├── prisma/       → Database schema
│   └── package.json
│
└── package.json      → Root scripts
```

---

## 🛠️ Common Commands

### Development
```bash
npm run dev              # Start both servers
npm run dev:client       # Start frontend only
npm run dev:server       # Start backend only
```

### Database
```bash
npm run prisma:studio    # Open database UI
npm run prisma:migrate   # Run migrations
npm run prisma:generate  # Generate Prisma client
```

### Build
```bash
npm run build            # Build both
npm run build:client     # Build frontend
npm run build:server     # Build backend
```

---

## 🎨 Tech Stack Overview

| Component | Technology |
|-----------|-----------|
| Frontend | Vue 3 + Vite + Tailwind CSS |
| Backend | Node.js + TypeScript + Express |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + Bcrypt |
| State | Pinia |
| Routing | Vue Router 4 |

---

## 📚 Documentation

- [README.md](./README.md) - Full overview
- [INSTALLATION.md](./INSTALLATION.md) - Detailed setup
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Architecture & roadmap

---

## 🔥 Quick Tips

### 1. Environment Variables
Always check `.env` files in both `client/` and `server/`

### 2. Prisma Studio
Best way to view/edit database:
```bash
cd server && npm run prisma:studio
```

### 3. Hot Reload
Both frontend and backend support hot reload - just save and see changes!

### 4. Port Conflicts
If ports 3000 or 5173 are taken, change them in:
- Backend: `server/.env` → `PORT=3001`
- Frontend: `client/vite.config.js` → `server.port`

### 5. Database Reset
To reset database (⚠️ deletes all data):
```bash
cd server
npx prisma migrate reset
```

---

## ⚠️ Troubleshooting

### "Cannot connect to database"
```bash
# Check PostgreSQL is running
# macOS:
brew services start postgresql

# Linux:
sudo systemctl start postgresql

# Windows: Start from Services
```

### "Module not found"
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### "Port already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## 🎯 Next Steps

1. ✅ Login with Master Admin
2. ✅ Explore dashboard
3. ✅ Create test product
4. ✅ Build test page
5. ✅ Customize theme
6. 🔄 Start developing features!

---

## 💡 Development Workflow

### Adding a New Feature

1. **Backend:**
   - Create controller in `server/src/controllers/`
   - Add service in `server/src/services/`
   - Define route in `server/src/routes/`

2. **Frontend:**
   - Create API service in `client/src/api/services/`
   - Add view in `client/src/views/`
   - Update router in `client/src/router/`

3. **Database:**
   - Update schema in `server/prisma/schema.prisma`
   - Run `npm run prisma:migrate`

---

## 🎓 Learning Path

**Beginner:**
1. Understand project structure
2. Follow existing patterns
3. Modify existing features

**Intermediate:**
4. Create new API endpoints
5. Build new UI components
6. Connect frontend to backend

**Advanced:**
7. Implement page builder
8. Add advanced features
9. Optimize performance

---

## 📞 Need Help?

- Check documentation in `/docs`
- Review code comments
- Test with Prisma Studio
- Use browser dev tools

---

**Happy Coding!** 🚀

---

*Version: 2.1.0*  
*Last Updated: January 2025*
