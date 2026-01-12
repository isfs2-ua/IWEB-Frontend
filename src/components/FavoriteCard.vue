<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types'
import { useWishlistStore } from '@/stores/wishlist'
import { useNotificationStore } from '@/stores/notification'

const props = defineProps<{
  product: Product
}>()

const wishlistStore = useWishlistStore()
const notificationStore = useNotificationStore()

const selectedSize = ref('')

// Eliminar de favoritos
const removeFavorite = () => {
  wishlistStore.toggleWishlist(props.product.id)
  notificationStore.showNotification('Eliminado de favoritos', 'info')
}

// Añadir al carrito desde la tarjeta
const addToCart = () => {
  // Si el producto tiene tallas, obligamos a elegir una
  if (props.product.tallas && props.product.tallas.length > 0 && !selectedSize.value) {
    notificationStore.showNotification('Por favor, selecciona una talla.', 'error')
    return
  }

  notificationStore.showNotification('¡Producto añadido al carrito!', 'success')
  // Aquí llamarías a cartStore.addItem(...)
}
</script>

<template>
  <div class="fav-card">
    <button class="heart-btn active" @click="removeFavorite">♥</button>

    <div class="image-container">
      <img :src="product.media?.[0].url" :alt="product.nombre" />
    </div>

    <div class="info">
      <h3 class="title">{{ product.nombre }}</h3>

      <div class="price">
        <span v-if="product.precio_oferta" class="offer-price">{{ product.precio_oferta }} €</span>
        <span v-else>{{ product.precio }} €</span>
      </div>

      <div class="actions-row">
        <select
          v-if="product.tallas && product.tallas.length > 0"
          v-model="selectedSize"
          class="size-select"
        >
          <option value="" disabled selected>Selecciona Talla</option>
          <option v-for="talla in product.tallas" :key="talla" :value="talla">
            {{ talla }}
          </option>
        </select>

        <button class="cart-btn" @click="addToCart">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fav-card {
  border: 1px solid #ffdcb0; /* Borde naranja suave */
  border-radius: 8px;
  padding: 15px;
  position: relative;
  background: white;
  transition: box-shadow 0.2s;
}
.fav-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.heart-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #ccc;
  z-index: 2;
}
.heart-btn.active {
  color: var(--color-primary);
}

.image-container {
  height: 180px;
  width: 100%;
  background: #f9f9f9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
  font-size: 0.9rem;
  color: #333;
  margin: 0 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 15px;
}
.offer-price {
  color: var(--color-primary);
}

/* Acciones inferiores */
.actions-row {
  display: flex;
  gap: 10px;
}

.size-select {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  font-size: 0.85rem;
  background: white;
  color: #555;
  outline: none;
}

.cart-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  width: 40px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-btn:hover {
  background: #e65100;
}
</style>
