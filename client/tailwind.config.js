/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ═══════════════════════════════════════════════════════════════════
        // 🎨 STRICT MODE BRAND PALETTE
        // Hanya menggunakan turunan dari Orange, Green, dan Cream
        // Tidak ada Gray/Slate default - semua warna berasal dari brand
        // ═══════════════════════════════════════════════════════════════════

        // CREAM SCALE - Pengganti White/Light Gray
        // Light Mode: Backgrounds, surfaces, light text
        // Base: #F9F6EF (cream-500)
        cream: {
          50: '#FFFFFF',   // Pure white
          100: '#FEFEFB',  // Almost white with cream tint
          200: '#FDFCF7',  // Very light cream
          300: '#FBFAF3',  // Light cream
          400: '#FAF8F1',  // Medium light cream
          500: '#F9F6EF',  // BASE CREAM - main background light mode
          600: '#C7C5BF',  // Muted cream - borders
          700: '#95948F',  // Dark cream - secondary text
          800: '#646260',  // Very dark cream - primary text on light
          900: '#323130',  // Nearly black cream - headings on light
        },

        // GREEN SCALE - Pengganti Black/Dark Gray
        // Dark Mode: Backgrounds, text colors, semantic success
        // Base: #006633 (green-500)
        green: {
          50: '#E6F0EB',   // Lightest green - success backgrounds
          100: '#CCE0D6',  // Very light - hover states
          200: '#99C2AD',  // Light - borders in dark mode
          300: '#66A385',  // Light medium - secondary elements
          400: '#33855C',  // Medium - interactive elements
          500: '#006633',  // BASE GREEN - primary brand green
          600: '#005229',  // Darker - hover states
          700: '#003D1F',  // Dark - active states
          800: '#002914',  // Very dark - dark mode surfaces
          900: '#00140A',  // Nearly black - dark mode backgrounds
          950: '#000A05',  // Deepest - darkest background
        },

        // ORANGE SCALE - Accent & Primary Actions
        // Base: #FF6600 (orange-500)
        orange: {
          50: '#FFF5EB',   // Lightest - backgrounds
          100: '#FFE0CC',  // Very light - hover backgrounds
          200: '#FFC299',  // Light - borders
          300: '#FFA366',  // Light medium - secondary accents
          400: '#FF8533',  // Medium - interactive
          500: '#FF6600',  // BASE ORANGE - primary CTA
          600: '#CC5200',  // Darker - hover on primary
          700: '#993D00',  // Dark - active states
          800: '#662900',  // Very dark - text on light
          900: '#331400',  // Darkest - strong emphasis
        },

        // ═══════════════════════════════════════════════════════════════════
        // 📦 CATEGORY COLORS - For product/content categorization
        // ═══════════════════════════════════════════════════════════════════
        category: {
          coffee: {
            light: '#8B4513',    // Saddle brown for coffee
            DEFAULT: '#654321',  // Dark brown
            dark: '#3E2723',     // Very dark brown
          },
          'non-coffee': {
            light: '#FF69B4',    // Hot pink for fruity drinks
            DEFAULT: '#E91E63',  // Pink
            dark: '#880E4F',     // Dark pink
          },
          food: {
            light: '#FFD54F',    // Amber for snacks
            DEFAULT: '#FFC107',  // Amber
            dark: '#FF6F00',     // Dark amber
          },
          book: {
            light: '#64B5F6',    // Light blue for books
            DEFAULT: '#2196F3',  // Blue
            dark: '#1565C0',     // Dark blue
          },
          merchandise: {
            light: '#BA68C8',    // Purple for merch
            DEFAULT: '#9C27B0',  // Purple
            dark: '#6A1B9A',     // Dark purple
          }
        },

        // ═══════════════════════════════════════════════════════════════════
        // 🔗 BACKWARD COMPATIBILITY ALIASES
        // ═══════════════════════════════════════════════════════════════════
        'brand-orange': '#FF6600',  // → orange-500
        'brand-green': '#006633',   // → green-500
        'brand-cream': '#F9F6EF',   // → cream-500
        'brand-bg': '#F9F6EF',      // Legacy alias for cream-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      // Shadows removed as requested for "firm" design
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
