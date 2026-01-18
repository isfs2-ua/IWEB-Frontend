<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useProductStore } from '@/stores/products'
import { useNotificationStore } from '@/stores/notification'
import BaseModal from '@/components/BaseModal.vue'

const { t, locale } = useI18n()
const router = useRouter()
const cartStore = useCartStore()
const productStore = useProductStore()
const notificationStore = useNotificationStore()

// --- ESTADOS LOCALES ---
const showDeleteModal = ref(false)
const itemToDelete = ref<number | null>(null)

// --- CICLO DE VIDA ---
onMounted(async () => {
  // 1. Cargar el carrito
  await cartStore.fetchCart()

  // 2. "Hidratar" los productos: Cargar detalles completos (con tallas)
  // para cada producto único que haya en el carrito.
  const uniqueProductIds = [...new Set(cartStore.items.map((item) => item.producto_id))]

  uniqueProductIds.forEach((id) => {
    // Si no tenemos el producto completo en el store, lo pedimos
    if (!productStore.getProductById(id)) {
      productStore.fetchProduct(id)
    }
  })
})

// --- COMPUTADOS Y HELPERS ---

const cartItems = computed(() => cartStore.items)

// Helper para obtener variantes (tallas) de un producto
const getAvailableVariants = (productId: number) => {
  const product = productStore.getProductById(productId)
  return product?.variantes || []
}

const formatPrice = (price: number) => {
  return price.toLocaleString(locale.value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// --- ACCIONES ---

// 1. Cambiar Cantidad
const updateQuantity = async (id: number, change: number) => {
  await cartStore.updateQuantity(id, change)
}

// 2. Cambiar Talla (Variante)
const handleSizeChange = async (itemId: number, productId: number, event: Event) => {
  const select = event.target as HTMLSelectElement
  const newVariantId = Number(select.value)

  if (!newVariantId || isNaN(newVariantId)) return

  try {
    // Llamamos a la acción del store que conecta con el backend
    await cartStore.changeItemVariant(itemId, newVariantId)
    notificationStore.showNotification(t('cart.size_updated') || 'Talla actualizada', 'success')
  } catch (error) {
    console.error(error)
    notificationStore.showNotification(
      t('cart.error_updating_size') || 'Error al cambiar talla (posible falta de stock)',
      'error',
    )
    // Recargamos el carrito para revertir visualmente el cambio si falló
    await cartStore.fetchCart()
  }
}

// 3. Eliminar Item (con Modal)
const requestRemove = (id: number) => {
  itemToDelete.value = id
  showDeleteModal.value = true
}

const confirmRemove = async () => {
  if (itemToDelete.value !== null) {
    await cartStore.removeItem(itemToDelete.value)
    notificationStore.showNotification(t('notifications.product_removed'), 'info')
    closeModal()
  }
}

const closeModal = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

const moveToFavorites = () => {
  notificationStore.showNotification(t('notifications.moved_to_favorites'), 'success')
}

const goToCheckout = () => {
  router.push('/checkout')
}
</script>

<template>
  <div class="page-wrapper">
    <div class="cart-container">
      <h1 class="page-title">{{ $t('cart.title') }} ({{ cartStore.totalItems }})</h1>

      <div v-if="cartItems.length > 0" class="cart-layout">
        <div class="items-column">
          <div v-for="item in cartItems" :key="item.id" class="cart-card">
            <div class="card-image">
              <img :src="item.imagen" :alt="item.nombre" />
            </div>

            <div class="card-details">
              <div class="header-flex">
                <span class="brand-text">{{ item.marca }}</span>
                <button
                  class="btn-delete"
                  @click="requestRemove(item.id)"
                  :title="$t('cart.remove')"
                >
                  ✕
                </button>
              </div>

              <h3 class="product-name">
                <RouterLink :to="`/product/${item.producto_id}`">{{ item.nombre }}</RouterLink>
              </h3>

              <div class="specs-row">
                <div v-if="item.color" class="spec-group">
                  <span class="spec-label">Color:</span>
                  <span class="spec-text">{{ item.color }}</span>
                </div>

                <div class="size-selector-wrapper">
                  <label class="spec-label">{{ $t('cart.size') || 'Talla' }}:</label>

                  <select
                    v-if="getAvailableVariants(item.producto_id).length > 1"
                    class="size-select-input"
                    :value="
                      getAvailableVariants(item.producto_id).find((v) => v.talla === item.talla)?.id
                    "
                    @change="(e) => handleSizeChange(item.id, item.producto_id, e)"
                  >
                    <option
                      v-for="variant in getAvailableVariants(item.producto_id)"
                      :key="variant.id"
                      :value="variant.id"
                      :disabled="variant.cantidadStock === 0"
                    >
                      {{ variant.talla }} {{ variant.cantidadStock === 0 ? '(Agotado)' : '' }}
                    </option>
                  </select>

                  <span v-else class="size-text-static">
                    {{ item.talla || 'Única' }}
                  </span>
                </div>
              </div>

              <div class="card-footer">
                <div class="quantity-selector">
                  <button @click="updateQuantity(item.id, -1)" :disabled="item.cantidad <= 1">
                    −
                  </button>
                  <span>{{ item.cantidad }}</span>
                  <button @click="updateQuantity(item.id, 1)">+</button>
                </div>

                <div class="price-box">
                  <span v-if="item.precio_oferta" class="old-price">
                    {{ formatPrice(item.precio || 0) }} €
                  </span>
                  <span class="final-price" :class="{ 'is-offer': item.precio_oferta }">
                    {{ formatPrice(item.precio_oferta || item.precio || 0) }} €
                  </span>
                </div>
              </div>

              <div class="wishlist-link-wrapper">
                <button class="btn-text-action" @click="moveToFavorites">
                  ♡ {{ $t('cart.move_to_favorites') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="summary-column">
          <div class="summary-card">
            <h2>{{ $t('cart.summary.title') }}</h2>

            <div class="summary-row">
              <span>{{ $t('cart.summary.subtotal') }}</span>
              <span>{{ formatPrice(cartStore.subtotal) }} €</span>
            </div>

            <div class="summary-row">
              <span>{{ $t('cart.summary.shipping') || 'Envío' }}</span>
              <span :class="{ 'text-green': cartStore.shippingCost === 0 }">
                {{
                  cartStore.shippingCost === 0
                    ? 'GRATIS'
                    : formatPrice(cartStore.shippingCost) + ' €'
                }}
              </span>
            </div>

            <div class="discount-block">
              <details>
                <summary>{{ $t('cart.summary.discount_code') }}</summary>
                <div class="discount-input-group">
                  <input type="text" :placeholder="$t('cart.summary.code_placeholder')" />
                  <button>{{ $t('cart.summary.apply') }}</button>
                </div>
              </details>
            </div>

            <div class="divider"></div>

            <div class="summary-total">
              <div class="total-labels">
                <span>{{ $t('cart.summary.total') }}</span>
                <small>{{ $t('cart.summary.vat_included') }}</small>
              </div>
              <span class="total-amount">{{ formatPrice(cartStore.total) }} €</span>
            </div>

            <button class="btn-checkout" @click="goToCheckout">
              {{ $t('cart.summary.checkout') }}
            </button>

            <div class="security-badges">
              <span>🔒 {{ $t('cart.trust.secure') }}</span>
              <span>🚚 {{ $t('cart.trust.shipping') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">🛒</div>
        <h2>{{ $t('cart.empty_message') }}</h2>
        <p>¡Descubre nuestras novedades y llénalo de cosas chulas!</p>
        <RouterLink to="/" class="btn-primary">{{ $t('cart.continue_shopping') }}</RouterLink>
      </div>
    </div>

    <BaseModal
      :show="showDeleteModal"
      :title="$t('cart.confirm_remove_title') || 'Eliminar producto'"
      @close="closeModal"
      @confirm="confirmRemove"
    >
      <p>{{ $t('cart.confirm_remove') }}</p>
    </BaseModal>
  </div>
</template>

<style scoped>
/* --- ESTRUCTURA GENERAL --- */
.page-wrapper {
  background-color: #f8f9fa;
  min-height: 80vh;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

.cart-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 25px;
  color: #111;
  border-bottom: 2px solid #eee;
  padding-bottom: 15px;
}

/* --- GRID LAYOUT --- */
.cart-layout {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 30px;
  align-items: start;
}

/* --- TARJETA DE PRODUCTO --- */
.cart-card {
  display: flex;
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
  box-sizing: border-box;
}

.card-image {
  width: 110px;
  height: 110px;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 5px;
  flex-shrink: 0;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  mix-blend-mode: multiply;
}

.card-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.brand-text {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #999;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.btn-delete {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #ccc;
  cursor: pointer;
  line-height: 1;
  padding: 5px;
  transition: color 0.2s;
}
.btn-delete:hover {
  color: #e74c3c;
}

.product-name a {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.1rem;
  display: block;
  margin: 5px 0 10px 0;
}
.product-name a:hover {
  color: var(--color-primary, #ff6600);
}

/* Especificaciones (Color y Talla) */
.specs-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Separación entre Color y Talla */
  margin-bottom: 15px;
  align-items: center;
}

.spec-group,
.size-selector-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #555;
  background: #fcfcfc;
  padding: 5px 10px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.spec-label {
  font-weight: 400;
  color: #888;
  font-size: 0.85rem;
}

.spec-text {
  font-weight: 600;
  color: #333;
}

/* Ajustes para el select dentro del grupo */
.size-select-input {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px 5px;
  font-size: 0.9rem;
  background-color: white;
  color: #333;
  font-weight: 600;
  cursor: pointer;
}

.size-text-static {
  font-weight: 600;
  color: #333;
}

/* Footer Item */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto; /* Empuja hacia abajo */
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  height: 32px;
}
.quantity-selector button {
  background: white;
  border: none;
  width: 30px;
  height: 100%;
  cursor: pointer;
  font-weight: bold;
  color: #555;
}
.quantity-selector button:hover:not(:disabled) {
  background: #f0f0f0;
}
.quantity-selector button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.quantity-selector span {
  padding: 0 8px;
  font-size: 0.95rem;
  font-weight: 600;
  min-width: 25px;
  text-align: center;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
  line-height: 32px;
}

.price-box {
  text-align: right;
}
.old-price {
  display: block;
  font-size: 0.8rem;
  color: #aaa;
  text-decoration: line-through;
}
.final-price {
  font-size: 1.2rem;
  font-weight: 800;
  color: #333;
}
.final-price.is-offer {
  color: #e67e22;
}

.wishlist-link-wrapper {
  margin-top: 10px;
}
.btn-text-action {
  background: none;
  border: none;
  font-size: 0.8rem;
  color: #888;
  cursor: pointer;
  padding: 0;
}
.btn-text-action:hover {
  color: var(--color-primary, #ff6600);
}

/* --- TARJETA DE RESUMEN (Derecha) --- */
.summary-column {
  position: sticky;
  top: 20px;
}

.summary-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.summary-card h2 {
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #555;
  font-size: 0.95rem;
}
.text-green {
  color: #27ae60;
  font-weight: bold;
}

/* Descuentos */
.discount-block {
  margin: 15px 0;
  font-size: 0.85rem;
}
.discount-block summary {
  cursor: pointer;
  color: #666;
  margin-bottom: 8px;
}
.discount-input-group {
  display: flex;
  gap: 8px;
  margin-top: 8px;
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
  padding: 0 12px;
  border-radius: 4px;
  cursor: pointer;
}

.divider {
  height: 1px;
  background: #eee;
  margin: 15px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 1.4rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 10px;
}
.total-labels {
  display: flex;
  flex-direction: column;
}
.total-labels small {
  font-size: 0.7rem;
  color: #999;
  font-weight: normal;
  margin-top: 2px;
}

/* BOTÓN NARANJA */
.btn-checkout {
  box-sizing: border-box;
  display: block;
  width: 100%;
  background: var(--color-primary, #ff6600);
  color: white;
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  border: none;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 4px 15px rgba(255, 102, 0, 0.25);
  transition: all 0.3s ease;
  margin-top: 10px;
  cursor: pointer;
  font-size: 1rem;
}
.btn-checkout:hover {
  background: #e65c00;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 102, 0, 0.35);
}

.security-badges {
  margin-top: 20px;
  text-align: center;
  font-size: 0.85rem;
  color: #888;
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* --- ESTADO VACÍO --- */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}
.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}
.btn-primary {
  display: inline-block;
  background: var(--color-primary, #ff6600);
  color: white;
  padding: 12px 30px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  margin-top: 20px;
}

/* RESPONSIVE */
@media (max-width: 800px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
  .summary-column {
    position: static;
    order: 2;
  }
}
</style>
