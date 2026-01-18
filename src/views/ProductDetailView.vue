<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useNotificationStore } from '@/stores/notification'
import { useCartStore } from '@/stores/cart' // IMPORTANTE: Importar el store del carrito
import { useAuthStore } from '@/stores/auth'
import type { Product } from '@/types'

const route = useRoute()
const productStore = useProductStore()
const notificationStore = useNotificationStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const product = ref<Product | undefined>(undefined)
const loading = ref(true)
const selectedImage = ref('')
const selectedSize = ref('')
const quantity = ref(1)
const showDetails = ref(true)
const showReviews = ref(true)

// --- LÓGICA DE CARGA ---
const loadProduct = () => {
  loading.value = true
  const id = Number(route.params.id)

  const foundProduct = productStore.getProductById(id)

  if (foundProduct) {
    product.value = foundProduct

    // 1. GESTIÓN DE TALLAS (Incluyendo Talla Única)
    if (product.value.variantes && product.value.variantes.length > 0) {
      // Mapeamos: si la talla es null/vacía, la llamamos "Talla Única"
      const tallasMap = product.value.variantes.map((v) => v.talla || 'Talla Única')
      // Eliminamos duplicados
      const tallasUnicas = [...new Set(tallasMap)]
      product.value.tallas = tallasUnicas

      // AUTO-SELECCIÓN: Si solo hay una opción (ej: Talla Única), la marcamos sola
      if (tallasUnicas.length === 1) {
        selectedSize.value = tallasUnicas[0]
      }
    }

    // Inicializar imagen
    if (product.value.media && product.value.media.length > 0) {
      selectedImage.value = product.value.media[0].url
    }
  } else {
    product.value = undefined
  }
  loading.value = false
}

onMounted(loadProduct)
watch(() => route.params.id, loadProduct)

// --- COMPUTADOS ---

// Calcula el stock de la variante seleccionada
const currentStock = computed(() => {
  if (!product.value?.variantes || !selectedSize.value) return 0

  // Buscamos la variante coincidente (manejando el caso null -> Talla Única)
  const variant = product.value.variantes.find((v) => {
    const nombreTalla = v.talla || 'Talla Única'
    return nombreTalla === selectedSize.value
  })

  // IMPORTANTE: Usamos 'cantidadStock' (o 'cantidad_stock' según llegue del back)
  // Forzamos el tipo any para evitar error de TypeScript si la interfaz no está actualizada
  return variant ? ((variant as any).cantidadStock ?? (variant as any).cantidad_stock ?? 0) : 0
})

const isOutOfStock = computed(() => {
  if (!selectedSize.value) return false
  return currentStock.value <= 0
})

// --- ACCIONES ---

const addToCart = async () => {
  // 1. Verificación de seguridad
  if (!authStore.isAuthenticated) {
    notificationStore.showNotification('Debes iniciar sesión para comprar', 'info')
    return
  }

  // 2. Validación de talla
  if (!selectedSize.value) {
    notificationStore.showNotification('Por favor, selecciona una talla.', 'error')
    return
  }

  // 3. Buscar la variante real (ID) para enviarla al backend
  const variant = product.value?.variantes?.find((v) => {
    const nombreTalla = v.talla || 'Talla Única'
    return nombreTalla === selectedSize.value
  })

  if (!variant) {
    notificationStore.showNotification('Error al localizar la variante del producto', 'error')
    return
  }

  try {
    // 4. Llamada al Store
    // loading.value = true // Opcional: bloquear pantalla
    await cartStore.addItem(variant.id, quantity.value)
    notificationStore.showNotification('¡Producto añadido al carrito!', 'success')
  } catch (error) {
    console.error(error)
    notificationStore.showNotification('No se pudo añadir al carrito. Revisa el stock.', 'error')
  } finally {
    // loading.value = false
  }
}

const toggleWishlist = () => {
  notificationStore.showNotification('Añadido a lista de deseos', 'info')
}
</script>

<template>
  <div v-if="product" class="product-detail-page container">
    <div class="top-section">
      <div class="gallery-container">
        <div class="thumbnails">
          <div
            v-for="img in product.media"
            :key="img.id"
            class="thumb-wrapper"
            :class="{ active: selectedImage === img.url }"
            @click="selectedImage = img.url"
          >
            <img :src="img.url" :alt="product.nombre" />
          </div>
        </div>
        <div class="main-image">
          <img :src="selectedImage" :alt="product.nombre" />
        </div>
      </div>

      <div class="info-container">
        <h1 class="product-title">{{ product.nombre }}</h1>

        <div class="rating-stars">
          <span class="stars">★★★★☆</span>
          <span class="rating-text">4.0</span>
        </div>

        <div class="price-block">
          <span class="price">{{ product.precio }} €</span>
        </div>

        <div class="color-selection" v-if="product.otros_colores_img?.length">
          <p class="label">Otros colores</p>
          <div class="color-thumbs">
            <div class="color-thumb active">
              <img :src="product.media?.[0].url" alt="Color actual" />
            </div>
            <div
              v-for="(imgUrl, index) in product.otros_colores_img"
              :key="index"
              class="color-thumb"
            >
              <img :src="imgUrl" alt="Otro color" />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="label">Talla:</label>
          <select v-model="selectedSize" class="size-select">
            <option value="" disabled>Selecciona una opción</option>
            <option v-for="talla in product.tallas" :key="talla" :value="talla">
              {{ talla }}
            </option>
          </select>
        </div>

        <div class="purchase-row">
          <div class="quantity-wrapper">
            <label>Cantidad:</label>
            <input
              type="number"
              v-model="quantity"
              min="1"
              :max="currentStock > 0 ? currentStock : 1"
            />
          </div>

          <div class="stock-status">
            <span v-if="!selectedSize" style="color: #888; font-size: 0.9rem"
              >Elige talla para ver stock</span
            >
            <span v-else-if="currentStock > 0" class="in-stock">En stock</span>
            <span v-else class="out-stock">Agotado</span>
          </div>
        </div>

        <div class="actions-row">
          <button
            @click="addToCart"
            class="btn-add-cart"
            :disabled="isOutOfStock || !selectedSize"
            :class="{ disabled: isOutOfStock || !selectedSize }"
          >
            {{ isOutOfStock && selectedSize ? 'Agotado' : 'Añadir al carrito' }}
          </button>
          <button @click="toggleWishlist" class="btn-wishlist">♡</button>
        </div>
      </div>
    </div>

    <div class="details-accordion">
      <div class="accordion-item">
        <div class="accordion-header" @click="showDetails = !showDetails">
          <h2>Detalles</h2>
          <span class="chevron" :class="{ rotated: showDetails }">^</span>
        </div>
        <div v-show="showDetails" class="accordion-content">
          <p class="description">{{ product.descripcionLarga }}</p>
          <div v-if="product.caracteristicas">
            <h4>Características:</h4>
            <ul>
              <li v-for="(car, idx) in product.caracteristicas" :key="idx">{{ car }}</li>
            </ul>
          </div>
          <div v-if="product.composicion" class="composition">
            <strong>Composición:</strong> {{ product.composicion }}
          </div>
        </div>
      </div>

      <div class="accordion-item">
        <div class="accordion-header" @click="showReviews = !showReviews">
          <h2 class="orange-text">Opiniones ({{ product.reviews?.length || 0 }})</h2>
          <span class="chevron" :class="{ rotated: showReviews }">^</span>
        </div>
        <div v-show="showReviews" class="accordion-content">
          <div v-for="review in product.reviews" :key="review.id" class="review-card">
            <div class="review-header">
              <div class="stars-row">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="star"
                  :class="{ filled: n <= review.valoracion }"
                  >★</span
                >
              </div>
              <span class="review-title">{{ review.titulo }}</span>
              <span class="review-date">{{ review.fecha }}</span>
            </div>
            <p class="review-author">{{ review.usuario }}</p>
            <p class="review-text">{{ review.comentario }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="container feedback-msg">
    <div class="spinner"></div>
    <p>Cargando producto...</p>
  </div>

  <div v-else class="container feedback-msg">
    <h2>⚠️ Producto no encontrado</h2>
    <RouterLink to="/" class="btn-primary" style="margin-top: 20px">Volver a la tienda</RouterLink>
  </div>
</template>

<style scoped>
/* ESTILOS PREVIOS */
.feedback-msg {
  text-align: center;
  padding: 100px 20px;
  color: #666;
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}
.top-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-bottom: 60px;
}

/* Galería */
.gallery-container {
  display: flex;
  gap: 20px;
  height: 500px;
}
.thumbnails {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 80px;
  overflow-y: auto;
  scrollbar-width: none;
}
.thumbnails::-webkit-scrollbar {
  display: none;
}
.thumb-wrapper {
  width: 80px;
  height: 100px;
  border: 1px solid #ddd;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
}
.thumb-wrapper.active {
  opacity: 1;
  border: 2px solid var(--color-primary);
}
.thumb-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.main-image {
  flex: 1;
  background: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
}
.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Info */
.product-title {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 10px;
  font-weight: 700;
}
.rating-stars {
  color: #f39c12;
  margin-bottom: 15px;
  font-size: 1.1rem;
}
.rating-text {
  color: #888;
  font-size: 0.9rem;
  margin-left: 5px;
}
.price {
  font-size: 1.8rem;
  font-weight: 800;
  color: #000;
  display: block;
  margin-bottom: 20px;
}

.color-selection {
  margin-bottom: 20px;
}
.label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 8px;
  display: block;
}
.color-thumbs {
  display: flex;
  gap: 10px;
}
.color-thumb {
  width: 50px;
  height: 50px;
  border: 1px solid #ddd;
  cursor: pointer;
}
.color-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.color-thumb.active {
  border: 2px solid var(--color-primary);
}

.form-group {
  margin-bottom: 20px;
}
.size-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
}

.purchase-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}
.quantity-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #ddd;
  padding: 8px 15px;
  border-radius: 4px;
}
.quantity-wrapper input {
  width: 40px;
  border: none;
  text-align: center;
  font-size: 1rem;
  outline: none;
}

.in-stock {
  color: #27ae60;
  font-weight: bold;
}
.out-stock {
  color: #c0392b;
  font-weight: bold;
}

.actions-row {
  display: flex;
  gap: 10px;
}
.btn-add-cart {
  flex: 1;
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 15px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}
.btn-add-cart:hover {
  background: #e65100;
}
.btn-add-cart.disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-wishlist {
  width: 50px;
  background: white;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Acordeón */
.details-accordion {
  border-top: 2px solid var(--color-primary);
}
.accordion-item {
  border-bottom: 1px solid #eee;
}
.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  cursor: pointer;
}
.accordion-header h2 {
  font-size: 1.2rem;
  margin: 0;
  color: var(--color-primary);
}
.chevron {
  font-weight: bold;
  color: var(--color-primary);
  transition: transform 0.3s;
}
.chevron.rotated {
  transform: rotate(180deg);
}
.accordion-content {
  padding-bottom: 20px;
  color: #444;
  line-height: 1.6;
}
.accordion-content ul {
  margin-bottom: 15px;
  padding-left: 20px;
}

/* Reviews */
.review-card {
  border-bottom: 1px solid #f9f9f9;
  padding: 15px 0;
}
.review-header {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 5px;
}
.stars-row {
  color: #ddd;
}
.star.filled {
  color: #f39c12;
}
.review-title {
  font-weight: bold;
}
.review-date {
  margin-left: auto;
  color: #999;
  font-size: 0.85rem;
}
.review-author {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
}

@media (max-width: 768px) {
  .top-section {
    grid-template-columns: 1fr;
  }
  .gallery-container {
    flex-direction: column-reverse;
    height: auto;
  }
  .thumbnails {
    flex-direction: row;
    width: 100%;
    height: 80px;
    overflow-x: auto;
  }
  .thumb-wrapper {
    width: 70px;
    height: 70px;
  }
}
</style>
