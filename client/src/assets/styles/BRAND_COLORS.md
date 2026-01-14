# 🎨 ANTITESA Brand Color System

## Strict Mode Palette

Color palette ini menggunakan **Strict Mode** - hanya menggunakan turunan dari 3 warna brand utama:
- **Orange** (#FF6600) - Accent & Primary Actions
- **Green** (#006633) - Text & Dark Mode Backgrounds  
- **Cream** (#F9F6EF) - Light Mode Backgrounds & Surfaces

**Tidak ada Gray/Slate default** - semua warna berasal dari brand.

---

## 🎯 Strategi Light/Dark Mode

| Mode | Background | Text Primary | Accent |
|------|------------|--------------|--------|
| **Light** | `cream-500` (#F9F6EF) | `green-900` (#00140A) | `orange-500` (#FF6600) |
| **Dark** | `green-950` (#000A05) | `cream-500` (#F9F6EF) | `orange-500` (#FF6600) |

---

## 🍊 Orange Scale - Accent & CTA

| Token | Hex | Usage |
|-------|-----|-------|
| `orange-50` | #FFF5EB | Lightest backgrounds |
| `orange-100` | #FFE0CC | Hover backgrounds |
| `orange-200` | #FFC299 | Borders |
| `orange-300` | #FFA366 | Secondary accents |
| `orange-400` | #FF8533 | Interactive elements |
| **`orange-500`** | **#FF6600** | **BASE - Primary CTA** |
| `orange-600` | #CC5200 | Hover on primary |
| `orange-700` | #993D00 | Active states |
| `orange-800` | #662900 | Text on light |
| `orange-900` | #331400 | Strong emphasis |

---

## 🌿 Green Scale - Text & Dark Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `green-50` | #E6F0EB | Success backgrounds |
| `green-100` | #CCE0D6 | Hover states |
| `green-200` | #99C2AD | Borders in dark mode |
| `green-300` | #66A385 | Secondary elements |
| `green-400` | #33855C | Interactive elements |
| **`green-500`** | **#006633** | **BASE - Primary brand green** |
| `green-600` | #005229 | Hover states |
| `green-700` | #003D1F | Active states |
| `green-800` | #002914 | Dark mode surfaces |
| `green-900` | #00140A | Dark mode backgrounds |
| `green-950` | #000A05 | Deepest background |

---

## 🥛 Cream Scale - Light Mode Backgrounds

| Token | Hex | Usage |
|-------|-----|-------|
| `cream-50` | #FFFFFF | Pure white |
| `cream-100` | #FEFEFB | Almost white with cream tint |
| `cream-200` | #FDFCF7 | Very light cream |
| `cream-300` | #FBFAF3 | Light cream |
| `cream-400` | #FAF8F1 | Medium light cream |
| **`cream-500`** | **#F9F6EF** | **BASE - Main background** |
| `cream-600` | #C7C5BF | Muted cream - borders |
| `cream-700` | #95948F | Dark cream - secondary text |
| `cream-800` | #646260 | Very dark - primary text on light |
| `cream-900` | #323130 | Nearly black - headings on light |

---

## 📦 Category Colors

Untuk kategorisasi produk dan konten:

| Category | Light | Default | Dark |
|----------|-------|---------|------|
| Coffee | #8B4513 | #654321 | #3E2723 |
| Non-Coffee | #FF69B4 | #E91E63 | #880E4F |
| Food | #FFD54F | #FFC107 | #FF6F00 |
| Book | #64B5F6 | #2196F3 | #1565C0 |
| Merchandise | #BA68C8 | #9C27B0 | #6A1B9A |

---

## 💻 Usage Examples

### Tailwind Classes

```html
<!-- Light Mode Background -->
<body class="bg-cream-500 text-green-900 dark:bg-green-950 dark:text-cream-500">

<!-- Card Component -->
<div class="bg-cream-100 dark:bg-green-900 border border-green-100 dark:border-green-800 rounded-xl">

<!-- Primary Button -->
<button class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">

<!-- Secondary Button -->
<button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">

<!-- Input Field -->
<input class="bg-cream-100 dark:bg-green-950 border border-green-200 dark:border-green-700 rounded-lg px-4 py-3">

<!-- Badge -->
<span class="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-2.5 py-0.5 rounded-full text-xs">
```

### CSS Custom Properties

```css
/* Using CSS variables */
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-default);
}

/* Button with brand colors */
.my-button {
  background-color: var(--color-orange-500);
  color: white;
}

.my-button:hover {
  background-color: var(--color-orange-600);
}
```

---

## 🔗 File Structure

```
src/assets/styles/
├── _variables.css      # CSS Custom Properties
├── _transitions.css    # Animation utilities  
└── main.css           # Main entry point

tailwind.config.js     # Tailwind color definitions
```

---

## ✅ Best Practices

1. **Gunakan Tailwind classes** untuk styling cepat
2. **Gunakan CSS variables** untuk komponen kompleks yang membutuhkan JavaScript
3. **Selalu sediakan dark mode variant** dengan prefix `dark:`
4. **Hindari warna gray/slate** - gunakan `cream-*` atau `green-*`
5. **Orange untuk aksi utama** (CTA, tombol penting)
6. **Green untuk elemen sekunder** (navigasi, teks, backgrounds)
