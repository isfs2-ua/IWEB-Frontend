<script setup lang="ts">
import type { Product } from '@/types'

defineProps<{
  product: Product
}>()
</script>

<template>
  <div class="product-card">
    <div class="image-container">
      <img
        v-if="product.media && product.media[0]"
        :src="product.media[0].url"
        :alt="product.nombre"
      />
      <div v-else class="placeholder"></div>

      <button class="wishlist-btn">♡</button>
    </div>
    <div class="info">
      <h3>{{ product.nombre }}</h3>
      <p class="brand">{{ product.marca }}</p>
      <div class="price-row">
        <span class="price">{{ product.precio.toFixed(2) }}€</span>
        <span v-if="product.precio_oferta" class="old-price"> </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  width: 100%;
  transition: transform 0.2s;
}
.product-card:hover {
  transform: translateY(-5px);
}
.image-container {
  position: relative;
  background-color: #eee;
  border-radius: var(--border-radius);
  aspect-ratio: 1/1; /* Cuadrado */
  overflow: hidden;
  margin-bottom: 10px;
}
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.placeholder {
  width: 100%;
  height: 100%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wishlist-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.info h3 {
  font-size: 0.95rem;
  margin: 5px 0;
  font-weight: 600;
}
.brand {
  font-size: 0.8rem;
  color: var(--color-text-light);
  margin: 0;
}
.price {
  font-weight: bold;
  color: var(--color-text-main);
}
</style>
