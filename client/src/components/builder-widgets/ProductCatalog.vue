<template>
  <section class="product-catalog" :class="`layout-${layout}`">
    <div class="catalog-header">
      <h2 v-if="title" class="catalog-title">{{ title }}</h2>
    </div>

    <div v-if="loading" class="catalog-loading">
      <p>Loading products...</p>
    </div>

    <div v-else-if="!products || products.length === 0" class="catalog-empty">
      <p>No products available</p>
    </div>

    <div v-else :class="`product-grid columns-${columns}`">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
        <div class="product-image">
          <img
            :src="product.image || '/placeholder-product.jpg'"
            :alt="product.name"
          />
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p v-if="product.description" class="product-description">
            {{ truncateText(product.description, 80) }}
          </p>
          <div v-if="showPrice" class="product-price">
            Rp {{ formatPrice(product.basePrice) }}
          </div>
          <a :href="`/products/${product.slug}`" class="product-link">
            View Details
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ProductCatalog',
  props: {
    title: {
      type: String,
      default: 'Our Products'
    },
    categoryId: String,
    layout: {
      type: String,
      default: 'grid' // 'grid' or 'list'
    },
    columns: {
      type: Number,
      default: 3
    },
    showPrice: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 12
    }
  },
  setup(props) {
    const products = ref([])
    const loading = ref(false)

    const fetchProducts = async () => {
      loading.value = true
      try {
        // TODO: Replace with actual API call
        // const response = await productService.getAll({ categoryId: props.categoryId, limit: props.limit })
        // products.value = response.data
        
        // Mock data for now
        products.value = []
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        loading.value = false
      }
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('id-ID').format(price)
    }

    const truncateText = (text, maxLength) => {
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }

    onMounted(() => {
      fetchProducts()
    })

    return {
      products,
      loading,
      formatPrice,
      truncateText
    }
  }
}
</script>

<style scoped>
.product-catalog {
  padding: 60px 20px;
}

.catalog-header {
  text-align: center;
  margin-bottom: 40px;
}

.catalog-title {
  font-size: 36px;
  font-weight: 700;
  color: #2C1810;
  margin: 0;
}

.product-grid {
  display: grid;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.columns-2 {
  grid-template-columns: repeat(2, 1fr);
}

.columns-3 {
  grid-template-columns: repeat(3, 1fr);
}

.columns-4 {
  grid-template-columns: repeat(4, 1fr);
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f3f4f6;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px;
}

.product-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px;
}

.product-price {
  font-size: 20px;
  font-weight: 700;
  color: #8B4513;
  margin: 0 0 12px;
}

.product-link {
  display: inline-block;
  padding: 8px 16px;
  background: #8B4513;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.product-link:hover {
  background: #A0522D;
}

.catalog-loading,
.catalog-empty {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

@media (max-width: 1024px) {
  .columns-4 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .columns-3,
  .columns-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
