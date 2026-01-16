<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notification'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()
const router = useRouter()

// Función auxiliar para formatear precios según el idioma
const formatPrice = (price: number) => {
  return price.toLocaleString(locale.value, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })
}

// Acciones
const increment = (id: number) => cartStore.updateQuantity(id, 1)
const decrement = (id: number) => cartStore.updateQuantity(id, -1)
const remove = (id: number) => {
  if (confirm(t('cart.confirm_remove'))) {
    cartStore.removeItem(id)
    notificationStore.showNotification(t('notifications.product_removed'), 'info')
  }
}

const moveToFavorites = () => {
  notificationStore.showNotification(t('notifications.moved_to_favorites'), 'success')
  // Aquí llamarías a wishlistStore.toggleWishlist(...)
}

const goToCheckout = () => {
  router.push('/checkout')
}
</script>

<template>
  <div class="container cart-page">
    <div class="cart-items-section">
      <h1 class="page-title">{{ $t('cart.title') }}</h1>

      <div v-if="cartStore.items.length > 0" class="items-list">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <div class="item-image">
            <img :src="item.imagen" :alt="item.nombre" />
          </div>

          <div class="item-details">
            <h3 class="item-name">{{ item.nombre }}</h3>

            <div class="controls-row">
              <div v-if="item.talla" class="size-selector">
                <label>{{ $t('cart.size') }}</label>
                <select class="size-input">
                  <option selected>{{ item.talla }}</option>
                </select>
              </div>

              <div class="qty-selector">
                <label>{{ $t('cart.quantity') }}</label>
                <div class="qty-controls">
                  <button @click="decrement(item.id)" :disabled="item.cantidad <= 1">-</button>
                  <input type="text" :value="item.cantidad" readonly />
                  <button @click="increment(item.id)">+</button>
                </div>
              </div>
            </div>

            <div class="item-actions">
              <button class="action-btn" @click="moveToFavorites" :title="$t('cart.move_to_favorites')">
                ♡
              </button>
              <button class="action-btn trash" @click="remove(item.id)" :title="$t('cart.remove')">🗑️</button>
            </div>
          </div>

          <div class="item-price-col">
            <div class="price-wrapper">
              <span v-if="item.precio_oferta" class="current-price">
                {{ formatPrice(item.precio_oferta) }} €
              </span>
              <span v-else class="current-price">
                {{ formatPrice(item.precio) }} €
              </span>

              <span v-if="item.precio_oferta" class="old-price">
                {{ formatPrice(item.precio) }} €
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-cart">
        <p>{{ $t('cart.empty_message') }}</p>
        <RouterLink to="/" class="btn-link">{{ $t('cart.continue_shopping') }}</RouterLink>
      </div>
    </div>

    <div v-if="cartStore.items.length > 0" class="cart-summary-section">
      <div class="summary-card">
        <h2>{{ $t('cart.summary.title') }}</h2>

        <div class="summary-row">
          <span>{{ $t('cart.summary.subtotal') }}</span>
          <span>{{ formatPrice(cartStore.subtotal) }} €</span>
        </div>

        <div class="summary-row total-row">
          <div class="total-label">
            <span>{{ $t('cart.summary.total') }}</span>
            <small>{{ $t('cart.summary.vat_included') }}</small>
          </div>
          <span class="total-amount">{{ formatPrice(cartStore.total) }} €</span>
        </div>

        <div class="discount-section">
          <details>
            <summary>{{ $t('cart.summary.discount_code') }}</summary>
            <div class="discount-input-group">
              <input type="text" :placeholder="$t('cart.summary.code_placeholder')" />
              <button>{{ $t('cart.summary.apply') }}</button>
            </div>
          </details>
        </div>

        <button class="btn-checkout" @click="goToCheckout">{{ $t('cart.summary.checkout') }}</button>

        <div class="trust-icons">
          <div class="trust-item">
            <span class="icon">🚚</span>
            <span>{{ $t('cart.trust.shipping') }}</span>
          </div>
          <div class="trust-item">
            <span class="icon">🔒</span>
            <span>{{ $t('cart.trust.secure') }}</span>
          </div>
          <div class="trust-item">
            <span class="icon">↩️</span>
            <span>{{ $t('cart.trust.returns') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

/* Columna Izquierda */
.cart-items-section {
  flex: 2;
}
.page-title {
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #333;
}

.cart-item {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 25px 0;
  gap: 20px;
}
.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 120px;
  height: 120px;
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}
.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.controls-row {
  display: flex;
  gap: 30px;
  margin-bottom: 15px;
}

.size-selector label,
.qty-selector label {
  display: block;
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 4px;
}
.size-input {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
}

.qty-controls {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}
.qty-controls button {
  width: 30px;
  height: 30px;
  background: #fff;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
.qty-controls button:hover {
  background: #f0f0f0;
}
.qty-controls input {
  width: 40px;
  text-align: center;
  border: none;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
  font-size: 0.9rem;
}

.item-actions {
  display: flex;
  gap: 15px;
}
.action-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #333;
}
.action-btn:hover {
  color: var(--color-primary);
}

/* Columna Precio */
.item-price-col {
  text-align: right;
  min-width: 100px;
}
.price-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.current-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}
.old-price {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
  margin-top: 4px;
}

/* Columna Derecha (Resumen) */
.cart-summary-section {
  flex: 1;
  min-width: 300px;
}

.summary-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 25px;
  position: sticky;
  top: 20px; /* Se queda fijo al hacer scroll */
}

.summary-card h2 {
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.95rem;
  color: #555;
}

.total-row {
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 15px;
  align-items: center;
  color: #000;
  font-weight: bold;
}
.total-label {
  display: flex;
  flex-direction: column;
}
.total-label small {
  font-weight: normal;
  font-size: 0.7rem;
  color: #888;
}
.total-amount {
  font-size: 1.3rem;
}

.discount-section {
  margin: 20px 0;
  font-size: 0.85rem;
}
.discount-section summary {
  cursor: pointer;
  color: #555;
  margin-bottom: 10px;
}
.discount-input-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.discount-input-group input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.discount-input-group button {
  background: #eee;
  border: none;
  padding: 0 15px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-checkout {
  width: 100%;
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 15px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}
.btn-checkout:hover {
  background: #e65100;
}

.trust-icons {
  border-top: 1px solid #eee;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.trust-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  color: #555;
}
.trust-item .icon {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  .cart-items-section,
  .cart-summary-section {
    width: 100%;
  }
}
</style>
