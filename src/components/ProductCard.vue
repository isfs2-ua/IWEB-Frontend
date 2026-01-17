<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Product } from '@/types'

const props = defineProps<{
  product: Product
}>()

const { t } = useI18n()
const router = useRouter()

const goToDetail = () => {
  router.push({
    name: 'product-detail',
    params: { id: props.product.id },
  })
}

const toggleWishlist = (e: Event) => {
  e.stopPropagation()
  // Nota: El console.log lo dejamos igual (es para desarrolladores)
  console.log('Añadido a favoritos:', props.product.nombre)
}
</script>

<template>
  <div class="product-card" @click="goToDetail">
    <div class="image-container">
      <img
        v-if="product.media && product.media[0]"
        :src="product.media[0].url"
        :alt="product.nombre"
      />
      <div v-else class="placeholder"></div>

      <button 
        class="wishlist-btn" 
        @click="toggleWishlist" 
        :title="$t('product.add_to_wishlist')"
      >
        ♡
      </button>
    </div>

    <div class="info">
      <h3>{{ product.nombre }}</h3>
      <p class="brand">{{ product.marca }}</p>

      <div class="price-row">
        <template v-if="product.precio_oferta">
          <span class="price-original">{{ product.precio.toFixed(2) }}€</span>
          <span class="price-offer">{{ product.precio_oferta.toFixed(2) }}€</span>
        </template>

        <template v-else>
          <span class="price-regular">{{ product.precio.toFixed(2) }}€</span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  width: 100%;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
  position: relative;
  border-radius: var(--border-radius);
  padding: 10px;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.image-container {
  position: relative;
  background-color: #eee;
  border-radius: var(--border-radius);
  aspect-ratio: 1/1;
  overflow: hidden;
  margin-bottom: 10px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .image-container img {
  transform: scale(1.05);
}

.placeholder {
  width: 100%;
  height: 100%;
  background: #e0e0e0;
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
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition:
    background 0.2s,
    color 0.2s;
}
.wishlist-btn:hover {
  background: var(--color-primary);
  color: white;
}

.info h3 {
  font-size: 0.95rem;
  margin: 5px 0;
  font-weight: 600;
  color: var(--color-text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand {
  font-size: 0.8rem;
  color: var(--color-text-light);
  margin: 0 0 5px;
}

/* --- ESTILOS DE PRECIO ACTUALIZADOS --- */
.price-row {
  display: flex;
  align-items: baseline; /* Alinea los textos por la base para que se vea ordenado */
  gap: 8px; /* Espacio entre el precio tachado y el nuevo */
}

/* 1. Precio Regular (Cuando no hay oferta) */
.price-regular {
  font-weight: bold;
  color: var(--color-text-main); /* Negro o gris oscuro */
  font-size: 1rem;
}

/* 2. Precio Original (Cuando hay oferta - TACHADO) */
.price-original {
  text-decoration: line-through; /* Esto tacha el texto */
  color: #999; /* Gris claro */
  font-size: 0.9rem; /* Un poco más pequeño */
}

/* 3. Precio Oferta (DESTACADO) */
.price-offer {
  font-weight: 800; /* Extra negrita */
  color: var(--color-primary); /* Naranja */
  font-size: 1.15rem; /* Más grande */
}
</style>
