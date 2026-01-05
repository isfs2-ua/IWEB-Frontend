<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useNotificationStore } from '@/stores/notification'
import type { Product } from '@/types'

const route = useRoute()
const productStore = useProductStore()
const notificationStore = useNotificationStore()

const product = ref<Product | undefined>(undefined)
const loading = ref(true) // Nuevo estado de carga explícito
const selectedImage = ref('')
const selectedSize = ref('')
const quantity = ref(1)
const showDetails = ref(true)
const showReviews = ref(true)

const loadProduct = () => {
  loading.value = true
  const id = Number(route.params.id)

  console.log(`🔎 Buscando producto con ID: ${id}`) // DEBUG

  // Buscamos en el store
  const foundProduct = productStore.getProductById(id)

  if (foundProduct) {
    console.log('✅ Producto encontrado:', foundProduct.nombre)
    product.value = foundProduct
    // Inicializar imagen principal si existe
    if (product.value.media && product.value.media.length > 0) {
      selectedImage.value = product.value.media[0].url
    }
  } else {
    console.error(
      '❌ Producto NO encontrado en el store. IDs disponibles:',
      productStore.allProducts.map((p) => p.id),
    )
    product.value = undefined
  }
  loading.value = false
}

onMounted(loadProduct)
watch(() => route.params.id, loadProduct)

// Acciones
const addToCart = () => {
  if (!selectedSize.value) {
    notificationStore.showNotification('Por favor, selecciona una talla.', 'error')
    return
  }

  // Aquí llamarías a useCartStore.addItem(...)
  notificationStore.showNotification('Producto añadido al carrito correctamente', 'success')
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

        <div class="color-selection">
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
          <select v-model="selectedSize" class="size-select">
            <option value="" disabled selected>Selecciona una talla</option>
            <option v-for="talla in product.tallas" :key="talla" :value="talla">
              {{ talla }}
            </option>
          </select>
        </div>

        <div class="purchase-row">
          <div class="quantity-wrapper">
            <label>Cantidad:</label>
            <input type="number" v-model="quantity" min="1" max="10" />
          </div>

          <div class="stock-status">
            <span v-if="product.stock && product.stock > 0" class="in-stock">En stock</span>
            <span v-else class="out-stock">No disponible</span>
          </div>
        </div>

        <div class="actions-row">
          <button @click="addToCart" class="btn-add-cart">Añadir al carrito</button>
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
          <p class="description">{{ product.descripcion }}</p>

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
  <div v-if="!loading && product" class="product-detail-page container">
    <div class="top-section"></div>
    <div class="details-accordion"></div>
  </div>

  <div v-else-if="loading" class="container feedback-msg">
    <div class="spinner"></div>
    <p>Cargando producto...</p>
  </div>

  <div v-else class="container feedback-msg">
    <h2>⚠️ Producto no encontrado</h2>
    <p>Parece que el artículo que buscas no existe o ha sido eliminado.</p>
    <RouterLink to="/" class="btn-primary" style="display: inline-block; margin-top: 20px"
      >Volver a la tienda</RouterLink
    >
  </div>
</template>

<style scoped>
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

/* --- TOP SECTION --- */
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
  height: 500px; /* Altura fija para mantener proporción */
}

.thumbnails {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 80px;
  overflow-y: auto;

  scrollbar-width: none; /* Para Firefox */
  -ms-overflow-style: none; /* Para IE y Edge */
}

/* Para Chrome, Safari y Opera */
.thumbnails::-webkit-scrollbar {
  display: none;
}

.thumb-wrapper {
  width: 80px;
  height: 100px; /* Rectangular vertical */
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

/* Info Derecha */
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

/* Colores */
.color-selection {
  margin-bottom: 20px;
}
.color-selection .label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 8px;
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

/* Formulario */
.form-group {
  margin-bottom: 20px;
}
.size-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  color: #555;
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

/* Botones Acción */
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

/* --- ACCORDIONS --- */
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
.accordion-content li {
  margin-bottom: 5px;
}

/* Reviews */
.review-card {
  border-bottom: 1px solid #f9f9f9;
  padding: 15px 0;
}
.review-card:last-child {
  border-bottom: none;
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
  color: #000;
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
.review-text {
  font-size: 0.95rem;
}

/* Responsive */
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
