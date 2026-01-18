<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useNotificationStore } from '@/stores/notification'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import type { Product, ProductVariant } from '@/types'

const { t } = useI18n()
const route = useRoute()
const productStore = useProductStore()
const notificationStore = useNotificationStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const product = ref<Product | undefined>(undefined)
const loading = ref(true)
const selectedImage = ref('')

// Estados de selección
const selectedColor = ref('')
const selectedSize = ref('')

// Listas computadas
const uniqueColors = ref<string[]>([])

const quantity = ref(1)
const showDetails = ref(true)
const showReviews = ref(true)

const getVariantStock = (v: ProductVariant | any): number => {
  if (!v) return 0
  return v.cantidadStock ?? v.cantidad_stock ?? v.stock ?? 0
}

const loadProduct = () => {
  loading.value = true
  const id = Number(route.params.id)
  const foundProduct = productStore.getProductById(id)

  if (foundProduct) {
    product.value = foundProduct

    // Extraer Colores Únicos
    if (product.value.variantes) {
      const colorsMap = product.value.variantes
        .map((v: any) => v.color)
        .filter((c: string) => c)

      uniqueColors.value = [...new Set(colorsMap)]
    }

    // Resetear selecciones
    selectedColor.value = ''
    selectedSize.value = ''

    // Imagen Principal
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

const availableSizes = computed(() => {
  if (!product.value?.variantes) return []

  let variants = product.value.variantes

  // Filtrar por color si hay colores y se ha seleccionado uno
  if (uniqueColors.value.length > 0 && selectedColor.value) {
    variants = variants.filter((v: any) => v.color === selectedColor.value)
  }

  const sizes = variants.map((v) => v.talla || 'Talla Única')
  return [...new Set(sizes)]
})

watch(
  () => uniqueColors.value,
  (colors) => {
    if (colors.length === 1) selectedColor.value = colors[0]
  },
  { immediate: true },
)

watch(
  availableSizes,
  (sizes) => {
    if (sizes.length === 1) selectedSize.value = sizes[0]
  },
  { immediate: true },
)

watch(selectedColor, () => {
  if (availableSizes.value.length > 1) selectedSize.value = ''
})

const currentStock = computed(() => {
  if (!product.value?.variantes) return 0
  if (product.value.variantes.length === 1) {
    return getVariantStock(product.value.variantes[0])
  }
  const variant = product.value.variantes.find((v: any) => {
    const nombreTalla = v.talla || 'Talla Única'
    const matchSize = nombreTalla === selectedSize.value
    const matchColor = uniqueColors.value.length > 0 ? v.color === selectedColor.value : true
    return matchSize && matchColor
  })
  return getVariantStock(variant)
})

const isOutOfStock = computed(() => {
  if (currentStock.value <= 0) return true
  if (uniqueColors.value.length > 1 && !selectedColor.value) return true
  if (availableSizes.value.length > 1 && !selectedSize.value) return true
  return false
})

const addToCart = async () => {
  if (!authStore.isAuthenticated) {
    notificationStore.showNotification(t('product_detail.login_required'), 'info')
    return
  }

  let variant: ProductVariant | undefined

  if (product.value?.variantes?.length === 1) {
    variant = product.value.variantes[0]
  } else {
    if (uniqueColors.value.length > 0 && !selectedColor.value) {
      notificationStore.showNotification(t('product_detail.notifications.select_color_error'), 'error')
      return
    }
    if (availableSizes.value.length > 1 && !selectedSize.value) {
      notificationStore.showNotification(t('product_detail.notifications.select_size_error'), 'error')
      return
    }

    variant = product.value?.variantes?.find((v: any) => {
      const nombreTalla = v.talla || 'Talla Única'
      const matchSize = nombreTalla === selectedSize.value
      const matchColor = uniqueColors.value.length > 0 ? v.color === selectedColor.value : true
      return matchSize && matchColor
    })
  }

  if (!variant) {
    notificationStore.showNotification('Error: Variante no encontrada', 'error')
    return
  }

  try {
    await cartStore.addItem(variant.id, quantity.value)
    notificationStore.showNotification(t('product_detail.notifications.added_success'), 'success')
  } catch (error) {
    console.error(error)
    notificationStore.showNotification(t('product_detail.notifications.add_error'), 'error')
  }
}

const toggleWishlist = () => {
  notificationStore.showNotification(t('product_detail.notifications.wishlist_info'), 'info')
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
          <p class="label">{{ $t('product_detail.other_colors') }}</p>
          <div class="color-thumbs">
            <div class="color-thumb active">
              <img :src="product.media?.[0].url" alt="Modelo actual" />
            </div>
            <div
              v-for="(imgUrl, index) in product.otros_colores_img"
              :key="index"
              class="color-thumb"
            >
              <img :src="imgUrl" alt="Otro modelo" />
            </div>
          </div>
        </div>

        <div class="form-group" v-if="uniqueColors.length > 1">
          <label class="label">{{ $t('search_page.filters.color') }}:</label>
          <select v-model="selectedColor" class="size-select">
            <option value="" disabled>{{ $t('product_detail.select_color') }}</option>
            <option v-for="color in uniqueColors" :key="color" :value="color">
              {{ $te('colors.' + color.toLowerCase()) ? $t('colors.' + color.toLowerCase()) : color }}
            </option>
          </select>
        </div>
        <div class="form-group" v-else-if="uniqueColors.length === 1">
           <label class="label">{{ $t('search_page.filters.color') }}:</label>
           <span class="static-size-text">
             {{ $te('colors.' + uniqueColors[0].toLowerCase()) ? $t('colors.' + uniqueColors[0].toLowerCase()) : uniqueColors[0] }}
           </span>
        </div>

        <div class="form-group" v-if="availableSizes.length > 1">
          <label class="label">{{ $t('search_page.filters.size') }}:</label>
          <select
            v-model="selectedSize"
            class="size-select"
            :disabled="uniqueColors.length > 0 && !selectedColor"
          >
            <option value="" disabled>
              {{
                uniqueColors.length > 0 && !selectedColor
                  ? $t('product_detail.first_select_color')
                  : $t('product_detail.select_size')
              }}
            </option>
            <option v-for="talla in availableSizes" :key="talla" :value="talla">
              {{ talla }}
            </option>
          </select>
        </div>

        <div
          class="form-group"
          v-else-if="availableSizes.length === 1 && availableSizes[0] !== 'Talla Única'"
        >
          <label class="label">{{ $t('search_page.filters.size') }}:</label>
          <span class="static-size-text">{{ availableSizes[0] }}</span>
        </div>

        <div class="purchase-row">
          <div class="quantity-wrapper">
            <label>{{ $t('product_detail.quantity') }}</label>
            <input
              type="number"
              v-model="quantity"
              min="1"
              :max="currentStock > 0 ? currentStock : 1"
            />
          </div>

          <div class="stock-status">
            <span v-if="uniqueColors.length > 1 && !selectedColor" class="text-gray"
              >{{ $t('product_detail.select_color') }}</span
            >
            <span v-else-if="availableSizes.length > 1 && !selectedSize" class="text-gray"
              >{{ $t('product_detail.select_size') }}</span
            >
            <span v-else-if="currentStock > 5" class="in-stock">{{ $t('product_detail.in_stock') }}</span>
            <span v-else-if="currentStock <= 5" class="in-low-stock">{{ $t('product_detail.low_stock') }}</span>
            <span v-else class="out-stock">{{ $t('product_detail.out_of_stock') }}</span>
          </div>
        </div>

        <div class="actions-row">
          <button
            @click="addToCart"
            class="btn-add-cart"
            :disabled="isOutOfStock"
            :class="{ disabled: isOutOfStock }"
          >
            {{ currentStock <= 0 ? $t('product_detail.out_of_stock') : $t('product_detail.add_to_cart') }}
          </button>
          <button @click="toggleWishlist" class="btn-wishlist">♡</button>
        </div>
      </div>
    </div>

    <div class="details-accordion">
      <div class="accordion-item">
        <div class="accordion-header" @click="showDetails = !showDetails">
          <h2>{{ $t('product_detail.details') }}</h2>
          <span class="chevron" :class="{ rotated: showDetails }">^</span>
        </div>
        <div v-show="showDetails" class="accordion-content">
          <p class="description">{{ product.descripcionLarga }}</p>
          <div v-if="product.caracteristicas">
            <h4>{{ $t('product_detail.features') }}</h4>
            <ul>
              <li v-for="(car, idx) in product.caracteristicas" :key="idx">{{ car }}</li>
            </ul>
          </div>
          <div v-if="product.composicion" class="composition">
            <strong>{{ $t('product_detail.composition') }}</strong> {{ product.composicion }}
          </div>
        </div>
      </div>

      <div class="accordion-item">
        <div class="accordion-header" @click="showReviews = !showReviews">
          <h2 class="orange-text">{{ $t('product_detail.reviews', { count: product.reviews?.length || 0 }) }}</h2>
          <span class="chevron" :class="{ rotated: showReviews }">^</span>
        </div>
        <div v-show="showReviews" class="accordion-content">
          <div v-for="review in product.reviews" :key="review.id" class="review-card">
            <div class="review-header">
              <div class="stars-row">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= review.valoracion }">★</span>
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
    <p>{{ $t('product_detail.loading') }}</p>
  </div>

  <div v-else class="container feedback-msg">
    <h2>{{ $t('product_detail.not_found') }}</h2>
    <RouterLink to="/" class="btn-primary" style="margin-top: 20px">{{ $t('product_detail.back_to_store') }}</RouterLink>
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
.static-size-text {
  font-weight: bold;
  color: #333;
  font-size: 1.1rem;
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

.in-low-stock {
  color: #f78c28;
  font-weight: bold;
}

.out-stock {
  color: #c0392b;
  font-weight: bold;
}
.text-gray {
  color: #888;
  font-style: italic;
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
