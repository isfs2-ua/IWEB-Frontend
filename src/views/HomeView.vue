<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router' // <--- 1. Importar router
import ProductCard from '@/components/ProductCard.vue'
import HeroSlider from '@/components/HeroSlider.vue'
import { useProductStore } from '@/stores/products'

const productStore = useProductStore()
const router = useRouter() // <--- 2. Instanciar router

// --- CONFIGURACIÓN DE CATEGORÍAS ---
// Usamos imágenes de Unsplash para que quede visualmente atractivo ya mismo
const allCategories = [
  { 
    id: 'running', 
    img: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&q=80',
    route: 'running'
  },
  { 
    id: 'ciclismo', 
    img: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80',
    route: 'ciclismo'
  },
  { 
    id: 'futbol', 
    img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80',
    route: 'futbol'
  },
  { 
    id: 'baloncesto', 
    img: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80',
    route: 'baloncesto'
  },
  { 
    id: 'tenis', 
    img: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80',
    route: 'tenis'
  },
  { 
    id: 'natacion', 
    img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80',
    route: 'natacion'
  }
]

// --- LÓGICA DEL CARRUSEL ---
const currentIndex = ref(0)
const itemsToShow = 4

const visibleCategories = computed(() => {
  // Creamos un array circular calculando los índices con módulo (%)
  return Array.from({ length: itemsToShow }, (_, i) => {
    const index = (currentIndex.value + i) % allCategories.length
    return allCategories[index]
  })
})

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % allCategories.length
}

const prevSlide = () => {
  // Sumamos la longitud antes de restar para evitar índices negativos
  currentIndex.value = (currentIndex.value - 1 + allCategories.length) % allCategories.length
}

const goToCategory = (categoryRoute: string) => {
  router.push(`/category/${categoryRoute}`)
}

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
          <div class="nav-arrows">
            <button @click="prevSlide" class="arrow-btn">&lt;</button>
            <button @click="nextSlide" class="arrow-btn">&gt;</button>
          </div>
        </div>

        <div class="categories-grid">
          <div 
            v-for="(cat, index) in visibleCategories" 
            :key="cat.id + '-' + index" 
            class="category-card"
            @click="goToCategory(cat.route)"
          >
            <div class="cat-image-wrapper">
               <img :src="cat.img" :alt="cat.id" class="cat-image" />
               <div class="overlay"></div>
            </div>
            <span class="cat-name">{{ $t('categories.' + cat.id) }}</span>
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
  color: var(--color-primary);
}

/* Arrows */
.nav-arrows {
  display: flex;
  gap: 10px;
}
.arrow-btn {
  border: 1px solid #ddd;
  background: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.2rem;
  color: #555;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.arrow-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: #fff8f0;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.category-card {
  text-align: center;
  cursor: pointer;
  group: hover; /* Para efectos hover */
}

.cat-image-wrapper {
  position: relative;
  height: 350px; /* Altura más imponente para las imágenes */
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.cat-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

/* Efecto Zoom al pasar el ratón */
.category-card:hover .cat-image {
  transform: scale(1.1);
}

.cat-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.3s;
}

.category-card:hover .cat-name {
  color: var(--color-primary);
}

/* Product Grid (Existente) */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 30px;
}

/* Responsive */
@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columnas en móvil/tablet */
  }
  .cat-image-wrapper {
    height: 200px;
  }
}
</style>