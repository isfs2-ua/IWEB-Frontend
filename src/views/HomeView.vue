<script setup lang="ts">
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import HeroSlider from '@/components/HeroSlider.vue'
import type { Product, Category } from '@/types'
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/products'

const productStore = useProductStore()

onMounted(() => {
  productStore.fetchProducts()
})
</script>

<template>
  <div class="home-view">
    <HeroSlider />

    <div class="container main-content">
      <section class="section categories">
        <div class="section-header">
          <h2>{{ $t('home.categories.title') }}</h2>
          <div class="nav-arrows"><button>&lt;</button> <button>&gt;</button></div>
        </div>

        <div class="categories-grid">
          <div v-for="cat in categories" :key="cat.id" class="category-card">
            <div class="cat-image"></div>
            <span>{{ cat.nombre }}</span>
          </div>
        </div>
      </section>

      <section class="section featured">
        <div class="section-header">
          <h2 class="orange-title">{{ $t('home.featured.title') }}</h2>
        </div>

        <div class="products-grid">
          <ProductCard
            v-for="product in productStore.allProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero {
  height: 400px;
  background-color: #daeef5; /* Color azulado/hielo similar al mockup */
  background-image: url('https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80'); /* Imagen ejemplo esquí */
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  position: relative;
}
.hero-content {
  margin-left: 10%;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  max-width: 400px;
  line-height: 1.1;
}

/* Sections General */
.section {
  margin: 4rem 0;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.orange-title {
  color: var(--color-primary); /* Título naranja como en 'Artículos destacados' */
}
.nav-arrows button {
  border: 1px solid #ddd;
  background: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-left: 5px;
  cursor: pointer;
}

/* Categories */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.category-card {
  text-align: center;
  cursor: pointer;
}
.cat-image {
  height: 250px;
  background-color: #ddd;
  border-radius: var(--border-radius);
  margin-bottom: 10px;
  transition: transform 0.3s;
}
.cat-image:hover {
  transform: scale(1.02);
}
.category-card span {
  font-weight: bold;
  color: var(--color-primary);
}

/* Product Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 30px;
}

/* Footer */
.footer {
  background: #f4f4f4;
  padding: 3rem 0;
  margin-top: 4rem;
}
.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.footer h4 {
  margin-bottom: 1rem;
}
.footer ul {
  list-style: none;
  padding: 0;
}
.footer li {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-light);
  cursor: pointer;
}
</style>