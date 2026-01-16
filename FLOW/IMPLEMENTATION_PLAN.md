# IMPLEMENTATION PLAN - ANTITESA Enhancement
**Date**: 15 Januari 2026  
**Total Requests**: 6 Major Features

---

## 🎯 PRIORITY & COMPLEXITY MATRIX

| # | Request | Priority | Complexity | Est. Time | Status |
|---|---------|----------|------------|-----------|--------|
| 3 | **Product Image Upload Missing** | 🔴 CRITICAL | Low | 15 min | ⬜ Todo |
| 2 | **Favicon & Browser Title** | 🟠 HIGH | Low | 20 min | ⬜ Todo |
| 1 | **Navbar Missing in Page Builder** | 🟠 HIGH | Medium | 30 min | ⬜ Todo |
| 4 | **Connect Page Builder Buttons** | 🟡 MEDIUM | Medium | 45 min | ⬜ Todo |
| 5 | **Widget Forum & Blog + Integration** | 🟡 MEDIUM | High | 2-3 hours | ⬜ Todo |
| 6 | **Access Control Enhancement** | 🟢 LOW | High | 2-3 hours | ⬜ Todo |

**Total Estimated Time**: 5-7 hours

---

## 📝 DETAILED BREAKDOWN

### 1️⃣ **Navbar Missing in Page Builder Preview** 🟠 HIGH

**Problem**: 
- Navbar tidak muncul saat view page dari page builder
- Screenshot menunjukkan navbar ada di landing page tapi tidak di preview

**Root Cause Analysis Needed**:
- Check `PageViewer.vue` component
- Check if Navbar component is imported in preview
- Check API call for navbar data in preview mode

**Files to Check**:
```
client/src/views/dashboard/pages/PageViewer.vue
client/src/components/storefront/Navbar.vue
client/src/api/page.service.js
```

**Solution**:
- Ensure Navbar component is included in PageViewer
- Pass correct navbar data to Navbar component
- Handle navbar visibility in preview mode

---

### 2️⃣ **Favicon & Browser Title Change** 🟠 HIGH

**Request**:
a. Change favicon to `Antitesa.svg`
b. Change browser tab title from "CoffeeShop CMS" to "ANTITESA"
c. BONUS: Make favicon editable via Content Management (Cloudinary upload)

**Files to Modify**:
```
client/index.html (title + favicon link)
client/public/ (add Antitesa.svg as favicon)
```

**For Dynamic Favicon (Part C)**:
```
server/src/models/site-content.model.ts (add favicon field)
client/src/views/dashboard/content/ContentManager.vue (add favicon upload)
client/src/App.vue (dynamically set favicon on mount)
```

**Implementation Steps**:
1. Quick fix: Update `index.html` with static favicon
2. Copy `Antitesa.svg` to `client/public/favicon.svg`
3. Extended: Add favicon field to site content schema
4. Add Cloudinary upload in Content Management
5. Add dynamic favicon loading in App.vue

---

### 3️⃣ **Product Image Upload Missing** 🔴 CRITICAL

**Problem**: 
- Field "Gambar Produk" hilang di form Create/Edit Product
- Screenshot menunjukkan form hanya punya: Nama, Kategori, Harga, Deskripsi, Komposisi

**Files to Fix**:
```
client/src/views/dashboard/products/ProductForm.vue
```

**Solution**:
- Add CloudinaryImageUploader component back
- Place it between "Kategori" and "Deskripsi" sections
- Bind to `product.image` model

**Code to Add**:
```vue
<!-- Gambar Produk Section -->
<div>
  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Gambar Produk
  </label>
  <CloudinaryImageUploader
    v-model="product.image"
    :current-image="product.image"
    upload-preset="YOUR_UPLOAD_PRESET"
    folder="products"
  />
</div>
```

---

### 4️⃣ **Connect Page Builder Buttons to Actual Pages** 🟡 MEDIUM

**Request**: 
- Button "Lihat Menu" → redirect to `/menu` (product list)
- Button "Eksplor Ruang" → redirect to appropriate page
- Other CTA buttons should link to real pages

**Files to Modify**:
```
client/src/components/storefront/sections/*.vue (all CTA sections)
```

**Analysis Needed**:
1. Find all button components in sections
2. Map button labels to routes:
   - "Lihat Menu" → `/menu` or `/products`
   - "Eksplor Ruang" → `/about` or `/spaces`
   - "Hubungi Kami" → `/contact`
   - "Daftar Event" → `/events`

**Implementation**:
- Add `buttonLink` field to section schemas
- Update CTA components to use `router-link` or `<a>` tag
- Make links editable in Page Builder

---

### 5️⃣ **Widget Forum & Blog + Module Integration** 🟡 MEDIUM (COMPLEX)

**Request Part A: New Widgets**
1. **Forum Widget** (connect to FunFact comments)
2. **Blog/News Widget**

**Request Part B: Connect All Widgets to Dashboard Modules**
- Products → ProductsSection widget
- Library → LibrarySection widget
- Events → EventsSection widget
- Merchandise → MerchandiseSection widget
- Notifications → NotificationSection widget
- FunFacts → FunFactsSection widget (with comments)
- **NEW: Forum → ForumSection widget**
- **NEW: Blog → BlogSection widget**

**Architecture Analysis**:

Current state:
```
Dashboard Modules → Isolated data management
Storefront Widgets → Static/hardcoded data
```

Desired state:
```
Dashboard Modules ←→ API ←→ Storefront Widgets
        ↓                         ↓
    CRUD Ops              Dynamic Content Display
```

**Implementation Plan**:

**5.1. Create ForumSection Widget**
```
Files to Create:
- client/src/components/storefront/sections/ForumSection.vue
- server/src/models/forum-post.model.ts (if not exists)
- server/src/controllers/forum.controller.ts
- server/src/services/forum.service.ts
```

**5.2. Create BlogSection Widget**
```
Files to Create:
- client/src/components/storefront/sections/BlogSection.vue
- server/src/models/blog-post.model.ts
- server/src/controllers/blog.controller.ts
- server/src/services/blog.service.ts
```

**5.3. Update Existing Widgets to Fetch from API**

Current widgets that need API connection:
```
✅ ProductsSection.vue → GET /api/v1/products (DONE)
✅ LibrarySection.vue → GET /api/v1/books (DONE)
✅ EventsSection.vue → GET /api/v1/events (DONE)
⚠️ MerchandiseSection.vue → GET /api/v1/merchandise (VERIFY)
⚠️ NotificationSection.vue → GET /api/v1/notifications (VERIFY)
❌ FunFactsSection.vue → GET /api/v1/funfacts (TODO)
❌ ForumSection.vue → GET /api/v1/forum (TODO - NEW)
❌ BlogSection.vue → GET /api/v1/blog (TODO - NEW)
```

**5.4. Schema Design**

**Forum Post Schema**:
```typescript
interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  category: string
  tags: string[]
  likes: number
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
}

interface Comment {
  id: string
  postId: string
  authorName: string
  authorEmail: string
  content: string
  createdAt: Date
}
```

**Blog Post Schema**:
```typescript
interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string (rich text)
  coverImage: string
  author: User
  category: string
  tags: string[]
  publishedAt: Date
  status: 'DRAFT' | 'PUBLISHED'
  viewCount: number
}
```

---

### 6️⃣ **Access Control Enhancement** 🟢 LOW (COMPLEX)

**Request Part A: User Profile Management**
1. Ubah Password feature
2. Ubah Nama feature

**Request Part B: New User Roles**
Add 2 new roles:
- `CASHIER` (for point of sale operations)
- `BARISTA` (for production/kitchen)

**Request Part C: Content Management Integration**
Ensure Content Management properly connects with:
- Page Builder (edit pages)
- Landing Page (preview changes)

---

**Current Roles** (from codebase):
```typescript
enum UserRole {
  MASTER_ADMIN = 'MASTER_ADMIN',
  ADMIN_OWNER = 'ADMIN_OWNER',
  MEDIA_STAFF = 'MEDIA_STAFF',
  PUBLIC = 'PUBLIC'
}
```

**New Roles to Add**:
```typescript
enum UserRole {
  MASTER_ADMIN = 'MASTER_ADMIN',
  ADMIN_OWNER = 'ADMIN_OWNER',
  MEDIA_STAFF = 'MEDIA_STAFF',
  CASHIER = 'CASHIER',        // NEW
  BARISTA = 'BARISTA',        // NEW
  PUBLIC = 'PUBLIC'
}
```

**Permission Matrix**:

| Feature | Master Admin | Owner | Media Staff | Cashier | Barista | Public |
|---------|-------------|-------|-------------|---------|---------|--------|
| User Management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Products (CRUD) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Orders (View) | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Orders (Create) | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Orders (Update Status) | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Content Management | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Reports | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Change Own Password | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Change Own Name | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

**Files to Modify (Part A - Profile)**:
```
server/src/controllers/auth.controller.ts (add changePassword, updateProfile)
client/src/views/dashboard/profile/UserProfile.vue (NEW)
client/src/api/auth.service.js (add changePassword, updateProfile methods)
```

**Files to Modify (Part B - Roles)**:
```
server/src/types/enums.ts (add CASHIER, BARISTA)
server/prisma/schema.prisma (update UserRole enum)
server/src/middleware/role.middleware.ts (update permissions)
client/src/router/guards/role.guard.js (update role checks)
```

**Files to Verify (Part C - Content Integration)**:
```
client/src/views/dashboard/content/ContentManager.vue
client/src/views/dashboard/pages/PageBuilder.vue
server/src/controllers/site-content.controller.ts
server/src/controllers/page.controller.ts
```

---

## 🚀 IMPLEMENTATION ORDER

**Phase 1: Critical Fixes** (30 minutes)
1. ✅ Fix Product Image Upload
2. ✅ Update Favicon & Title

**Phase 2: UI/UX Improvements** (1 hour)
3. ✅ Fix Navbar in Page Builder Preview
4. ✅ Connect Page Builder Buttons

**Phase 3: Backend Enhancement** (3-4 hours)
5. ✅ Create Forum Module (Backend + Frontend)
6. ✅ Create Blog Module (Backend + Frontend)
7. ✅ Update All Widgets to Fetch from API
8. ✅ Add Forum & Blog Widgets to Page Builder

**Phase 4: Access Control** (2-3 hours)
9. ✅ Add Change Password Feature
10. ✅ Add Update Profile Feature
11. ✅ Add CASHIER and BARISTA Roles
12. ✅ Update Permission System
13. ✅ Verify Content Management Integration

---

## ⚠️ QUESTIONS FOR USER (Before Implementation)

### Q1: Forum Feature Scope
Apakah Forum ini untuk:
- A) Internal discussion (staff only)?
- B) Public discussion (customer dapat comment)?
- C) Hybrid (ada public posts + staff-only posts)?

**Current FunFact** already has comments. Should we:
- Merge Forum with FunFact?
- Keep them separate (FunFact = fun coffee facts, Forum = general discussion)?

### Q2: Blog/News Feature
Apakah Blog ini untuk:
- A) Company news & updates?
- B) Coffee education articles?
- C) Both?

Should Blog posts have:
- Rich text editor? (Bold, Italic, Images, etc)
- Categories? (News, Tutorial, Promo, etc)
- Author attribution?

### Q3: Button Routing
Current buttons di screenshots:
- "Lihat Menu" → Should go to `/menu` or `/products`?
- "Eksplor Ruang" → Should go to `/about`, `/gallery`, or custom page?

Do you want these links to be:
- Hardcoded (developer sets)?
- Configurable (admin can change via Page Builder)?

### Q4: Cashier & Barista Dashboard
Do CASHIER and BARISTA roles need:
- Their own dashboard view?
- Only access to Orders module?
- POS (Point of Sale) interface?

### Q5: Content Management → Landing Page Connection
The current Content Management already has "Landing Page Preview" toggle. Is the issue:
- Preview not working?
- Changes not saving?
- Changes not appearing on live site?

---

## 📊 RISK ASSESSMENT

| Risk | Impact | Mitigation |
|------|--------|------------|
| Adding new roles breaks existing permissions | HIGH | Test all role-based route guards |
| Widget API calls slow down page load | MEDIUM | Implement caching + lazy loading |
| Database migration for new modules | MEDIUM | Create backup before migration |
| Breaking changes in ProductForm | LOW | Test product CRUD thoroughly |

---

## ✅ ACCEPTANCE CRITERIA

**Request 1: Navbar in Page Builder**
- [ ] Navbar appears in Page Builder preview mode
- [ ] Navbar data loads correctly
- [ ] Navbar is interactive (links work)

**Request 2: Favicon & Title**
- [ ] Browser tab shows "ANTITESA" title
- [ ] Favicon shows Antitesa logo
- [ ] (Bonus) Favicon uploadable via Content Management

**Request 3: Product Image Upload**
- [ ] "Gambar Produk" field visible in Create Product
- [ ] "Gambar Produk" field visible in Edit Product
- [ ] Cloudinary upload works
- [ ] Image displays in product list

**Request 4: Page Builder Buttons**
- [ ] "Lihat Menu" button links to products page
- [ ] All CTA buttons have working links
- [ ] Links are configurable in Page Builder

**Request 5: Forum & Blog Widgets**
- [ ] ForumSection widget created
- [ ] BlogSection widget created
- [ ] All widgets fetch real data from API
- [ ] Forum & Blog manageable from Dashboard
- [ ] Comments work on Forum posts

**Request 6: Access Control**
- [ ] Change Password feature works
- [ ] Update Name feature works
- [ ] CASHIER role added to system
- [ ] BARISTA role added to system
- [ ] Permission matrix implemented correctly
- [ ] Content Management ↔ Landing Page verified

---

## 🎯 NEXT STEPS

**Immediate Action** (Reply from user needed):
1. Answer Q1-Q5 above
2. Confirm priority order
3. Approve estimated timeline

**Once Approved**:
1. Start with Phase 1 (Critical Fixes)
2. Deploy & test after each phase
3. Get user feedback before next phase

---

**Last Updated**: 15 Januari 2026, 10:58 WIB
