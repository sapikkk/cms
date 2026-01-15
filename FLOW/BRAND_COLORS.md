# Brand Color System - Antitesa

## 🎨 Updated Color Palette

### Background
```css
brand-bg: #F9F6EF  /* Warm cream background */
```

### Brand Colors

**Orange Scale** (Primary Actions)
```css
orange-50   #FFF7ED  
orange-500  #FF6600  ⭐ Base
orange-900  #4D2000  
```

**Green Scale** (Brand Identity)
```css
green-50    #ECFDF5
green-500   #006633  ⭐ Base  
green-900   #002E17  
```

## 📦 Category Colors

Gunakan untuk membedakan kategori produk/content:

```html
<!-- Coffee Products -->
<div class="bg-category-coffee text-white">
  <!-- light: #8B4513, DEFAULT: #654321, dark: #3E2723 -->
</div>

<!-- Non-Coffee Drinks -->
<div class="bg-category-non-coffee text-white">
  <!-- light: #FF69B4, DEFAULT: #E91E63, dark: #880E4F -->
</div>

<!-- Food/Snacks -->
<div class="bg-category-food text-gray-900">
  <!-- light: #FFD54F, DEFAULT: #FFC107, dark: #FF6F00 -->
</div>

<!-- Books/Library -->
<div class="bg-category-book text-white">
  <!-- light: #64B5F6, DEFAULT: #2196F3, dark: #1565C0 -->
</div>

<!-- Merchandise -->
<div class="bg-category-merchandise text-white">
  <!-- light: #BA68C8, DEFAULT: #9C27B0, dark: #6A1B9A -->
</div>
```

### Contoh Penggunaan:
```html
<!-- Badge untuk kategori coffee -->
<span class="px-3 py-1 bg-category-coffee rounded-full text-white text-sm">
  Kopi
</span>

<!-- Card dengan border kategori -->
<div class="border-2 border-category-food rounded-lg">
  Snack Item
</div>

<!-- Dark mode variation -->
<div class="bg-category-book-light dark:bg-category-book-dark">
  Book Card
</div>
```

## 🖼️ Logo Antitesa

Logo disimpan di `/public/Antitesa.svg`

**Cara pakai:**
```html
<!-- Navbar -->
<img src="/Antitesa.svg" alt="Antitesa" class="h-10 w-auto" />

<!-- Sidebar Dashboard -->
<img src="/Antitesa.svg" alt="Antitesa" class="h-8 w-auto" />

<!-- Footer -->
<img src="/Antitesa.svg" alt="Antitesa" class="h-12 w-auto" />
```

## ✅ Components Updated

- ✅ **Tailwind Config** - Background #F9F6EF, category colors added
- ✅ **Navbar.vue** - Logo Antitesa + brand colors
- ✅ **Footer.vue** - Logo Antitesa + green/orange theme
- ✅ **DashboardLayout.vue** - Logo Antitesa di sidebar

## 🌙 Dark Mode dengan Brand Colors

```html
<!-- Background: cream → dark green -->
<div class="bg-brand-bg dark:bg-green-900">

<!-- Cards: white → mid green -->
<div class="bg-white dark:bg-green-800">

<!-- Text: green → light green -->
<h1 class="text-green-600 dark:text-green-100">

<!-- Buttons: orange variations -->
<button class="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700">
```

Your brand identity now shines through in both light and dark modes! 🎨✨
