# 📋 Content Management vs Page Builder - Architecture Guide

**Date**: 15 Januari 2026  
**Issue**: Changes in Content Management don't appear on live site  
**Root Cause**: Two different data sources (site-content vs pages)

---

## 🔍 **Root Cause Analysis**

### Current Architecture

ANTITESA memiliki **2 sistem terpisah** untuk mengelola konten:

```
┌─────────────────────────────────────────────────────────────────┐
│                     ANTITESA CMS Architecture                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐           ┌───────────────────────┐  │
│  │   PAGE BUILDER       │           │  CONTENT MANAGER      │  │
│  │  (Individual Pages)  │           │  (Site-wide Settings) │  │
│  └──────────────────────┘           └───────────────────────┘  │
│           │                                    │                 │
│           ▼                                    ▼                 │
│  ┌──────────────────────┐           ┌───────────────────────┐  │
│  │   PAGES Table        │           │  SITE_CONTENT Table   │  │
│  ├──────────────────────┤           ├───────────────────────┤  │
│  │ - Page id, title     │           │ - Navbar config       │  │
│  │ - Slug (index, menu) │           │ - Footer config       │  │
│  │ - Sections (JSON)    │           │ - Hero defaults       │  │
│  │ - Published status   │           │ - Section order       │  │
│  └──────────────────────┘           └───────────────────────┘  │
│           │                                    │                 │
│           ▼                                    ▼                 │
│  ┌──────────────────────┐           ┌───────────────────────┐  │
│  │ API: /api/v1/pages   │           │ API: /api/v1/site-... │  │
│  └──────────────────────┘           └───────────────────────┘  │
│           │                                    │                 │
│           ▼                                    ✗ NOT USED        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              LANDING PAGE (/)                             │  │
│  │  Loads from: GET /api/v1/pages/slug/index                │  │
│  │  Source: PAGES table, NOT site-content!                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### The Problem

**User's Question**:
> "Content Management perubahan tersimpan tapi tidak muncul di live site"

**Why it happens**:
1. User edits content in **Content Manager** (`/dashboard/content`)
2. Data saves to **SITE_CONTENT table** via `/api/v1/site-content/*` endpoints
3. Landing page (`/`) loads from **PAGES table** via `/api/v1/pages/slug/index`
4. **Result**: Changes don't appear because they're reading from different sources!

---

## ✅ **Recommended Solution**

### Option 1: Use Page Builder for Landing Page (RECOMMENDED)

**When to use each tool:**

| Tool | Purpose | Use For | Data Source |
|------|---------|---------|-------------|
| **Page Builder** | Manage individual pages | Homepage, Menu, Forum, About | `pages` table |
| **Content Manager** | Site-wide settings | Navbar links, Footer, Theme colors | `site-content` table |

**Steps to fix**:

1. **For Homepage Content** → Use **Page Builder**
   - Go to `/dashboard/pages`
   - Find page with slug `/index` (or create if not exists)
   - Click "Builder" button
   - Add/Edit sections here
   - Click "Publish"
   - ✅ Changes will appear on `/` immediately

2. **For Navbar/Footer** → Use **Content Manager**
   - Go to `/dashboard/content`
   - Edit Navbar tab (menu items, logo)
   - Edit Footer tab (copyright, links)
   - Click "Save Changes"
   - ✅ Changes will appear site-wide

---

### Option 2: Merge Content Manager with Page Builder (Future Enhancement)

This would require refactoring to make Content Manager write directly to the home page's sections in the `pages` table.

**Implementation**:
- Content Manager should fetch `/api/v1/pages/slug/index`
- Edit sections in place
- Save back to the same page endpoint
- This way both systems use the same data source

**Effort**: 2-3 hours development

---

## 🎯 **Current State: Which System to Use?**

### ✅ **Use Page Builder** for:
- ✅ Homepage content (Hero, Products showcase, Events, etc.)
- ✅ Menu/Products page
- ✅ Forum page
- ✅ About Us page
- ✅ Any dynamic page with sections

**How**: `/dashboard/pages` → Find page → Click "Builder" → Edit → Publish

---

### ✅ **Use Content Manager** for:
- ✅ Navbar menu items and links
- ✅ Footer copyright text and links
- ✅ Site name and description (meta tags)
- ✅ Primary/Secondary brand colors
- ✅ Favicon (future: dynamic favicon upload)

**How**: `/dashboard/content` → Select tab → Edit → Save Changes

---

## 📖 **User Guide: How to Edit Homepage**

### Scenario: "I want to change the hero banner text on homepage"

**❌ WRONG Way** (Current user approach):
1. Go to Content Manager → Hero tab
2. Edit hero text
3. Save
4. **Result**: Doesn't appear on live site ❌

**✅ CORRECT Way**:
1. Go to **Page Builder** (`/dashboard/pages`)
2. Find page with slug `/index` or title "Home"
3. Click **"Builder"** button
4. Find **Hero Banner** section in the list
5. Click **Edit** icon on that section
6. Change text, image, button, etc.
7. Click **"Publish"**
8. **Result**: Changes appear on `/` immediately ✅

---

### Scenario: "I want to add a link to navbar"

**✅ CORRECT Way**:
1. Go to **Content Manager** (`/dashboard/content`)
2. Click **"Navbar"** tab
3. Click **"Add Menu Item"**
4. Fill in label and URL
5. Click **"Save Changes"**
6. **Result**: New menu item appears in navbar site-wide ✅

---

## 🔧 **Technical Fix (If Merging Both Systems)**

### Changes Needed:

**1. Modify ContentManager.vue**

Instead of saving to `site-content` endpoints, save to the home page:

```javascript
// OLD (Current)
const saveAllChanges = async () => {
  await siteContentService.updateHero(content.hero)
  await siteContentService.updateSection('events', content.events)
  // ...
}

// NEW (Proposed)
const saveAllChanges = async () => {
  // Get home page
  const homePageId = await getHomePageId() // slug: 'index'
  
  // Convert content to page sections format
  const sections = [
    { type: 'HeroSection', contentData: content.hero, sortOrder: 0 },
    { type: 'EventsSection', contentData: content.events, sortOrder: 1 },
    // ...
  ]
  
  // Update page sections
  await pageService.updatePageSections(homePageId, sections)
}
```

**2. Modify LandingPage.vue**

No changes needed - already fetches from pages table.

**3. Keep site-content for**:
- Navbar (used by Navbar.vue component)
- Footer (used by Footer.vue component)
- Theme settings (CSS variables)

---

## 📊 **Data Flow Diagram**

### Current (Problematic) Flow:

```
Content Manager → site-content table → ✗ NOT used by landing page
                                       ↓
Landing Page    → pages table         ← Page Builder
```

### Recommended Flow:

```
Page Builder → pages table → Landing Page ✅
Content Manager → site-content table → Navbar/Footer ✅
```

---

## 🎓 **Quick Decision Tree**

```
Q: What do you want to edit?
│
├─ Homepage sections (Hero, Products, Events)
│  └─ Use: PAGE BUILDER (/dashboard/pages → index → Builder)
│
├─ Navbar menu items
│  └─ Use: CONTENT MANAGER (/dashboard/content → Navbar tab)
│
├─ Footer links and text
│  └─ Use: CONTENT MANAGER (/dashboard/content → Footer tab)
│
└─ Individual pages (Menu, Forum, About)
   └─ Use: PAGE BUILDER (/dashboard/pages → Find page → Builder)
```

---

## ✅ **Action Items**

### Immediate (For User):
1. ✅ Understand the difference between Page Builder and Content Manager
2. ✅ Use **Page Builder** to edit homepage content going forward
3. ✅ Use **Content Manager** only for Navbar, Footer, and site settings

### Short-term (Developer):
1. 🟡 Add clear labels/descriptions in the UI:
   - Content Manager: "Manage site-wide settings (Navbar, Footer, Theme)"
   - Page Builder: "Manage page content and layout"
2. 🟡 Add tooltip/help text explaining which tool to use

### Long-term (Developer):
1. 🔴 Consider merging Content Manager sections into Page Builder
2. 🔴 Keep Content Manager only for true site-wide settings (Navbar, Footer, Theme)
3. 🔴 Add visual indicator showing which pages are being edited

---

## 🐛 **Troubleshooting**

### Issue: "I edited in Content Manager but changes don't appear"

**Solution**: Edit in Page Builder instead (see guide above)

### Issue: "I edited navbar in Page Builder but changes don't appear"

**Solution**: Navbar should be edited in Content Manager, not Page Builder

### Issue: "I want to preview changes before publishing"

**Solution**: 
- Page Builder: Click "Preview" button (already implemented)
- Content Manager: Add preview functionality (future enhancement)

---

**Last Updated**: 15 Januari 2026  
**Status**: Documentation complete, user education needed
