<template>
  <section class="hero-banner" :style="bannerStyle">
    <div class="hero-content">
      <h1 v-if="title" class="hero-title" v-html="title"></h1>
      <p v-if="subtitle" class="hero-subtitle" v-html="subtitle"></p>
      <a
        v-if="ctaText && ctaLink"
        :href="ctaLink"
        class="hero-cta"
      >
        {{ ctaText }}
      </a>
    </div>
    <div v-if="image" class="hero-overlay"></div>
  </section>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'HeroBanner',
  props: {
    title: {
      type: String,
      default: 'Welcome to Our Coffee Shop'
    },
    subtitle: {
      type: String,
      default: 'Best coffee in town'
    },
    image: {
      type: String,
      default: ''
    },
    ctaText: {
      type: String,
      default: 'Order Now'
    },
    ctaLink: {
      type: String,
      default: '/products'
    }
  },
  setup(props) {
    const bannerStyle = computed(() => ({
      backgroundImage: props.image ? `url(${props.image})` : 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }))

    return {
      bannerStyle
    }
  }
}
</script>

<style scoped>
.hero-banner {
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  color: white;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 20px;
  margin: 0 0 32px;
  opacity: 0.95;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.hero-cta {
  display: inline-block;
  padding: 14px 32px;
  background: #F4A460;
  color: #2C1810;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(244, 164, 96, 0.4);
}

.hero-cta:hover {
  background: #FFB347;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(244, 164, 96, 0.5);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 18px;
  }
  
  .hero-banner {
    min-height: 300px;
  }
}
</style>
