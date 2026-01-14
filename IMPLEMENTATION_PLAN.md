# ANTITESA - Major Features Implementation Plan

**Date:** 2026-01-14  
**Status:** In Progress  
**Priority:** High

---

## 🎯 Overview

Implementing 4 major feature enhancements to the ANTITESA dashboard:

1. ✅ **Toast & Dialog System** (COMPLETED)
2. 🔄 **Replace all window.confirm/alert** (IN PROGRESS)
3. 📋 **Access Control CRUD + Password Management** (PENDING)
4. 📊 **Comprehensive Audit Log System** (PENDING)
5. 🎨 **Theme Customizer Activation** (PENDING)
6. 💎 **Dashboard Redesign** (PENDING)

---

## ✅ Phase 1: Toast & Dialog System (COMPLETED)

### Completed Tasks:
- ✅ Install `vue-sonner` package
- ✅ Create `ConfirmDialog.vue` component with beautiful UI
- ✅ Create `useConfirm.js` composable 
- ✅ Create `toast.js` utility helpers
- ✅ Setup global components in `App.vue`
- ✅ Fix all lint errors

### Usage:
```javascript
// Toast
import { showToast } from '@/utils/toast'
showToast.success('Berhasil!', 'Data telah disimpan')
showToast.error('Gagal!', 'Terjadi kesalahan')

// Confirm Dialog
import { useConfirm } from '@/composables/useConfirm'
const { confirm } = useConfirm()
const confirmed = await confirm({
  title: 'Hapus Data?',
  message: 'Data akan dihapus permanen',
  variant: 'danger'
})
```

---

## 🔄 Phase 2: Replace window.confirm/alert (IN PROGRESS)

### Files to Update (22 files):

#### Confirm Dialogs:
1. `/views/dashboard/products/ProductList.vue` - Line 157
2. `/views/dashboard/products/ProductForm.vue` - Line 300
3. `/views/dashboard/library/BookList.vue` - Line 101
4. `/views/dashboard/events/EventList.vue` - Line 163
5. `/views/dashboard/merchandise/MerchandiseList.vue` - Line 162
6. `/views/dashboard/funfacts/FunFactList.vue` - Line 102
7. `/views/dashboard/notifications/NotificationList.vue` - Line 111
8. `/views/dashboard/pages/PageList.vue` - Line 216
9. `/views/dashboard/pages/PageBuilder.vue` - Lines 575, 631, 781, 790

#### Alert Messages (Replace with Toast):
1. All `ProductForm.vue` alerts
2. All `BookForm.vue` alerts
3. All `EventForm.vue` alerts
4. All `MerchandiseForm.vue` alerts
5. All `FunFactForm.vue` alerts
6. All `NotificationForm.vue` alerts
7. All `PageList.vue` alerts
8. All `PageBuilder.vue` alerts
9. `ThemeCustomizer.vue` - Line 218

### Implementation Strategy:
- Replace `confirm()` → `await confirm({...})`
- Replace `alert()` → `showToast.success/error(...)`
- Add proper async/await handling
- Add loading states during operations
- Show success toast after successful operations

---

## 📋 Phase 3: Access Control CRUD + Password Management

### Backend Requirements:

#### New API Endpoints:
```
POST   /api/v1/users                 - Create user
GET    /api/v1/users                 - List users
GET    /api/v1/users/:id             - Get user detail
PUT    /api/v1/users/:id             - Update user
DELETE /api/v1/users/:id             - Delete user
POST   /api/v1/users/:id/reset-password - Reset password (Master Admin)
PUT    /api/v1/users/:id/change-password - Change password
GET    /api/v1/users/:id/activity    - Get user activity log
```

#### Database Changes:
- Ensure `User` model has all necessary fields
- Add `lastPasswordChange` timestamp
- Add `passwordResetRequired` boolean
- Create `ActivityLog` model if not exists

### Frontend Components:

#### New Components:
1. `/views/dashboard/users/UserList.vue` - User management table
2. `/views/dashboard/users/UserForm.vue` - Create/Edit user
3. `/views/dashboard/users/PasswordResetDialog.vue` - Password reset modal
4. `/views/dashboard/users/UserActivityLog.vue` - User activity viewer
5. `/components/ui/PasswordInput.vue` - Password input with strength meter

#### Features:
- [x] CRUD operations for users
- [x] Role assignment (MASTER_ADMIN, ADMIN_OWNER, MEDIA_STAFF)
- [x] Password management:
  - Reset password (generate temporary)
  - Force password change
  - Password strength requirements
- [x] User status (Active/Inactive)
- [x] Activity log per user
- [x] Bulk actions
- [x] Export user list

### Router Updates:
```javascript
{
  path: '/dashboard/users',
  name: 'UserList',
  component: UserList,
  meta: { roles: ['MASTER_ADMIN'] }
},
{
  path: '/dashboard/users/create',
  name: 'UserCreate',
  component: UserForm,
  meta: { roles: ['MASTER_ADMIN'] }
},
{
  path: '/dashboard/users/:id/edit',
  name: 'UserEdit',
  component: UserForm,
  meta: { roles: ['MASTER_ADMIN'] }
}
```

---

## 📊 Phase 4: Comprehensive Audit Log System

### Backend Implementation:

#### Audit Log Model:
```prisma
model AuditLog {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  entity      String   // "Product", "Page", "User", etc.
  entityId    String?
  action      AuditAction  // CREATE, UPDATE, DELETE, LOGIN, LOGOUT
  description String
  ipAddress   String?
  userAgent   String?
  changes     Json?    // Store before/after data
  createdAt   DateTime @default(now())
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  LOGIN
  LOGOUT
  PASSWORD_RESET
  STATUS_CHANGE
  PUBLISH
  UNPUBLISH
}
```

#### Audit Logging Middleware:
- Create `audit.middleware.ts`
- Auto-log all mutating operations
- Capture user, timestamp, IP, changes
- Store in background (non-blocking)

#### API Endpoints:
```
GET /api/v1/audit-logs              - List all logs (Master Admin)
GET /api/v1/audit-logs/:id          - Get log detail
GET /api/v1/audit-logs/entity/:type - Filter by entity type
GET /api/v1/audit-logs/user/:userId - Filter by user
GET /api/v1/audit-logs/export       - Export to CSV/Excel
```

### Frontend Components:

#### Update Existing:
1. `/views/master-admin/AuditLogs.vue` - Enhance with:
   - Real-time activity feed
   - Advanced filtering (entity, action, date range, user)
   - Timeline view
   - Detailed change viewer (JSON diff)
   - Export functionality
   - Activity statistics

#### New Components:
1. `/components/dashboard/ActivityTimeline.vue` - Visual timeline
2. `/components/dashboard/ChangeViewer.vue` - JSON diff viewer
3. `/components/dashboard/AuditStats.vue` - Activity statistics

### Logging Points:
All CRUD operations should trigger audit logs:
- Products (Create, Update, Delete)
- Library Books (Create, Update, Delete)
- Events (Create, Update, Delete, Publish)
- Merchandise (Create, Update, Delete)
- Fun Facts (Create, Update, Delete)
- Notifications (Create, Update, Delete, Status Change)
- Pages (Create, Update, Delete, Publish, Navbar Toggle)
- Users (Create, Update, Delete, Password Reset)
- Access Control Changes
- Theme Settings Updates
- Login/Logout events

---

## 🎨 Phase 5: Theme Customizer Activation

### Current Status:
- Component exists at `/views/dashboard/settings/ThemeCustomizer.vue`
- Route exists but might need review
- Needs integration with landing page

### Tasks:
1. Review `ThemeCustomizer.vue` functionality
2. Test color picker and preview
3. Ensure changes apply to:
   - Dashboard (already working)
   - **Landing page/Storefront** (primary goal)
4. Add real-time preview toggle
5. Add theme templates/presets
6. Add export/import theme config

### Landing Page Integration:
```javascript
// In storefront layout
import { useTheme } from '@/composables/useTheme'
const { currentTheme } = useTheme()

// Apply custom CSS variables
watch(currentTheme, (theme) => {
  document.documentElement.style.setProperty('--primary-color', theme.primaryColor)
  document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor)
  // ... etc
})
```

---

## 💎 Phase 6: Dashboard Redesign

### Design Goals:
- Modern, premium aesthetics
- Improved data visualization
- Better UX/UI flow
- Responsive and mobile-friendly
- Dark mode optimized

### Updated Components:

#### 1. `/views/dashboard/Overview.vue`
**Enhancements:**
- Hero stats section with animated counters
- Revenue chart (Chart.js/ApexCharts)
- Recent activity feed
- Quick actions grid
- Sales performance cards
- Top products/books widget
- Upcoming events calendar widget
- Activity heatmap

#### 2. Sidebar Navigation
**Improvements:**
- Grouped menu items
- Icon updates (Phosphor Icons)
- Collapsible sections
- Active state indicators
- Hover effects
- Badge notifications

#### 3. Data Tables
**Enhancements:**
- Better pagination
- Column sorting
- Quick filters
- Bulk actions
- Export options
- Responsive design

#### 4. Forms
**Improvements:**
- Better validation feedback
- Loading states
- Success animations
- Field hints/tooltips
- Auto-save indicators

#### 5. Color Palette Refinement
**Updates:**
- Primary: Orange (#F97316)
- Secondary: Green (#166534)
- Background: Cream (#FFFBF5)
- Dark Mode: Deep Green (#052e16)
- Accent colors for categories

---

## 📋 Implementation Checklist

### Phase 2 (Current):
- [ ] Create helper function for async confirm dialogs
- [ ] Update ProductList.vue
- [ ] Update BookList.vue
- [ ] Update EventList.vue
- [ ] Update MerchandiseList.vue
- [ ] Update FunFactList.vue
- [ ] Update NotificationList.vue
- [ ] Update PageList.vue
- [ ] Update PageBuilder.vue
- [ ] Update All Form components (replace alerts with toasts)
- [ ] Test all CRUD operations

### Phase 3:
- [ ] Design User Management wireframes
- [ ] Create backend API endpoints
- [ ] Create database migrations
- [ ] Implement UserList component
- [ ] Implement UserForm component
- [ ] Implement PasswordResetDialog
- [ ] Implement UserActivityLog
- [ ] Add password strength meter
- [ ] Test all user management flows
- [ ] Add master admin restrictions

### Phase 4:
- [ ] Design AuditLog database schema
- [ ] Create audit middleware
- [ ] Implement logging in all controllers
- [ ] Update AuditLogs view
- [ ] Add timeline visualization
- [ ] Add JSON diff viewer
- [ ] Add export functionality
- [ ] Test audit trail completeness

### Phase 5:
- [ ] Review ThemeCustomizer
- [ ] Test with landing page
- [ ] Add preview mode
- [ ] Create theme presets
- [ ] Add import/export
- [ ] Document usage

### Phase 6:
- [ ] Design new dashboard mockups
- [ ] Update Overview component
- [ ] Update all data tables
- [ ] Update sidebar navigation
- [ ] Refine color system
- [ ] Test dark mode
- [ ] Mobile responsive testing

---

## 🚀 Next Steps

**Immediate (Today):**
1. Complete Phase 2 - Replace all window.confirm/alert
2. Start Phase 3 - Backend API for User Management

**This Week:**
1. Complete User Management CRUD
2. Implement Audit Log system
3. Test Theme Customizer with landing page

**Next Week:**
1. Dashboard Redesign
2. Final testing & polish
3. Documentation

---

## 📝 Notes

- All changes should be committed incrementally
- Test each phase before moving to next
- Maintain backward compatibility
- Document all new APIs
- Update README with new features

---

**Last Updated:** 2026-01-14  
**Next Review:** After Phase 2 completion
