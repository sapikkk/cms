# 🔧 Widget Conversion Guide - Make ALL Widgets Editable

## ❌ Problem
Out of 25 widgets, only **2 widgets** (HeroSection & HeroSplitLeft) are fully editable. The remaining **23 widgets** still have hardcoded text.

## ✅ Solution (Token-Efficient Approach)

### **Widgets Fixed So Far:**
1. ✅ **HeroSection.vue** (Hero - Center) - DONE
2. ✅ **HeroSplitLeft.vue** (Hero - Image Left) - DONE

### **Widgets Still Hardcoded (23 remaining):**
- HeroSplitRight.vue
- ContentImageLeft.vue
- ContentImageRight.vue
- FeatureGrid3.vue
- FeatureGrid4.vue
- CTACentered.vue
- CTASplit.vue
- TextBlock.vue
- Stats3Col.vue
- TestimonialCard.vue
- GalleryGrid.vue
- PricingCard.vue
- FAQSection.vue
- TeamGrid.vue
- NewsletterForm.vue
- LogoCloud.vue
- VideoEmbed.vue
- ContactCard.vue
- LibrarySection.vue (fetches API data - special case)
- MerchandiseSection.vue (fetches API data - special case)
- EventsSection.vue (fetches API data - special case)
- ProductsSection.vue (fetches API data - special case)
- FunFactsSection.vue (fetches API data - special case)

---

## 📋 Conversion Template

For each widget, follow this pattern:

### **Step 1: Identify Hardcoded Text**
Look for:
- `<h1>`, `<h2>`, `<p>` with static text
- `<span>`, `<button>` with labels
- Lists (`<ul>`, `<li>`) with items
- Image paths

### **Step 2: Convert to Props**
```vue
// BEFORE (Hardcoded)
<h2>Why Choose Us</h2>
<p>We deliver excellence...</p>
<button>Learn More</button>

// AFTER (Props-driven)
<h2>{{ title }}</h2>
<p>{{ description }}</p>
<button>{{ buttonText }}</button>

// Props definition
defineProps({
  title: { type: String, default: 'Why Choose Us' },
  description: { type: String, default: 'We deliver excellence...' },
  buttonText: { type: String, default: 'Learn More' }
})
```

### **Step 3: Convert Lists to Arrays**
```vue
// BEFORE (Hardcoded list)
<li>Private Workspace</li>
<li>Book Library</li>
<li>Premium Coffee</li>

// AFTER (Array-driven)
<li v-for="(item, index) in items" :key="index">
  {{ item.text }}
</li>

// Props definition
defineProps({
  items: {
    type: Array,
    default: () => [
      { text: 'Private Workspace' },
      { text: 'Book Library' },
      { text: 'Premium Coffee' }
    ]
  }
})
```

### **Step 4: Update PageBuilder defaultProps**
```javascript
// In availableWidgets array
{ 
  type: 'FeatureGrid3', 
  label: 'Features (3 Col)', 
  iconComponent: PhSquaresFour, 
  default Props: { 
    title: 'Why Choose Us',
    description: 'We offer...',
    items: [
      { title: 'Feature 1', subtitle: 'Description...' },
      { title: 'Feature 2', subtitle: 'Description...' },
      { title: 'Feature 3', subtitle: 'Description...' }
    ]
  } 
},
```

---

## 🚀 Quick Conversion Checklist

For each widget file:

- [ ] Open widget file
- [ ] Find ALL hardcoded text (headings, paragraphs, buttons, labels)
- [ ] Create props for each text element
- [ ] Convert repeated elements to arrays with v-for
- [ ] Set default values matching original text
- [ ] Update PageBuilder.vue availableWidgets with full defaultProps
- [ ] Test in page builder - all fields should appear in form

---

## 💡 Priority Order (Do These First)

Based on user usage frequency:

### **High Priority (Do Now):**
1. ✅ HeroSection - DONE
2. ✅ HeroSplitLeft - DONE
3. ⏳ HeroSplitRight - PENDING
4. ⏳ ContentImageLeft - PENDING
5. ⏳ ContentImageRight - PENDING
6. ⏳ FeatureGrid3 - PENDING
7. ⏳ CTACentered - PENDING

### **Medium Priority:**
8. CTASplit
9. TextBlock
10. Stats3Col
11. FAQSection
12. TestimonialCard

### **Low Priority (Can do later):**
13-25. Remaining widgets

---

## ⚠️ Special Cases

### **API-Driven Widgets**
These widgets fetch data from API (Products, Events, Library, etc.):
- They already have dynamic data from backend
- BUT their **titles, subtitles, empty states** are still hardcoded
- Convert only the **UI text**, not the data itself

Example for `ProductsSection.vue`:
```vue
// Editable props:
- title (section heading)
- subtitle (section description)
- buttonText
- emptyStateText

// NOT editable (from API):
- products array
- product.name, product.price, etc.
```

---

## 🎯 Expected Result

After converting all widgets, user should be able to click ANY widget in Page Builder and see:

```
┌────────────────────────────────────────┐
│ Edit [Widget Name]                     │
├────────────────────────────────────────┤
│ Title                                  │
│ [                            ]         │
│                                        │
│ Subtitle                               │
│ [                            ]         │
│                                        │
│ Description                            │
│ ┌────────────────────────────────┐     │
│ │                                │     │
│ └────────────────────────────────┘     │
│                                        │
│ Features/Items                         │
│ ┌────────────────────────────────┐ ❌  │
│ │ text: Feature 1                │     │
│ └────────────────────────────────┘     │
│ [+ Tambah Features]                    │
│                                        │
│ Button Text                            │
│ [                            ]         │
└────────────────────────────────────────┘
```

**NOT this:**
```
┌────────────────────────────────────────┐
│ Edit [Widget Name]                     │
├────────────────────────────────────────┤
│ Title                                  │
│ [                            ]         │
│                                        │
│ (Only 1-2 fields shown!)               │
└────────────────────────────────────────┘
```

---

## 📝 Next Steps (For Developer)

1. **Batch Conversion Script** (Recommended for efficiency):
   - Write a Node.js script to auto-convert widgets
   - Parse Vue files, extract hardcoded text
   - Generate props definitions
   - Update PageBuilder defaults

2. **Manual Conversion** (If time allows):
   - Follow template above
   - Convert 1 widget at a time
   - Test each widget after conversion

3. **Hybrid Approach** (Best for now):
   - Convert top 7 high-priority widgets manually (in progress)
   - Document pattern for user to finish rest later

---

**Status:** 2/25 widgets fully editable
**Goal:** 25/25 widgets fully editable
**Estimated Time:** 2-3 hours for remaining 23 widgets (if done manually)
