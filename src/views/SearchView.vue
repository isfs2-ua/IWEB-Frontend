<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/products'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const productStore = useProductStore()

// --- ESTADO DE FILTROS ---
const selectedBrands = ref<string[]>([])
const selectedGender = ref<string[]>([]) // Array para permitir selección múltiple o simple
const selectedSizes = ref<string[]>([])
const selectedColors = ref<string[]>([])
const priceRange = ref(275) // Valor máximo del slider

// --- DATOS ESTÁTICOS PARA LA UI (Copiados del Mockup) ---
const brandsList = ['Adidas', 'Nike', 'Reebok', 'New Balance', 'Endura', 'Joma', 'Puma', 'Sportful']
const genderOptions = ['Hombre', 'Mujer', 'Niño', 'Niña']
const adultSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
const kidsSizes = ['3-4', '5-6', '7-8', '9-10', '11-12', '13-14']
const shoeSizes = ['36', '37', '38', '39', '40', '41', '42', '43']
const colorsList = [
  { name: 'Negro', hex: '#000000' },
  { name: 'Blanco', hex: '#FFFFFF', border: true },
  { name: 'Gris', hex: '#808080' },
  { name: 'Azul', hex: '#0000FF' },
  { name: 'Rojo', hex: '#FF0000' },
  { name: 'Verde', hex: '#008000' },
  { name: 'Amarillo', hex: '#FFFF00' },
  { name: 'Naranja', hex: '#FFA500' },
  { name: 'Rosa', hex: '#FFC0CB' },
  { name: 'Morado', hex: '#800080' },
  { name: 'Multicolor', hex: 'linear-gradient(45deg, red, yellow, blue)' },
]

const searchTerm = computed(() => ((route.query.q as string) || '').toLowerCase().trim())

// --- LÓGICA DE FILTRADO ---
const filteredProducts = computed(() => {
  return productStore.allProducts.filter((product) => {
    // 1. Texto
    if (
      searchTerm.value &&
      !product.nombre.toLowerCase().includes(searchTerm.value) &&
      !product.marca.toLowerCase().includes(searchTerm.value)
    ) {
      return false
    }
    // 2. Precio (Menor o igual al slider)
    if (product.precio > priceRange.value) return false

    // 3. Marcas
    if (selectedBrands.value.length > 0 && !selectedBrands.value.includes(product.marca))
      return false

    // 4. Género
    if (
      selectedGender.value.length > 0 &&
      product.genero &&
      !selectedGender.value.includes(product.genero)
    )
      return false

    // 5. Tallas (Si el producto tiene alguna de las tallas seleccionadas)
    if (selectedSizes.value.length > 0 && product.tallas) {
      const hasSize = product.tallas.some((t) => selectedSizes.value.includes(t))
      if (!hasSize) return false
    }

    // 6. Colores
    if (selectedColors.value.length > 0 && product.colores) {
      const hasColor = product.colores.some((c) => selectedColors.value.includes(c))
      if (!hasColor) return false
    }

    return true
  })
})

// Helpers para selección
const toggleSelection = (array: string[], value: string) => {
  const index = array.indexOf(value)
  if (index === -1) array.push(value)
  else array.splice(index, 1)
}
</script>

<template>
  <div class="search-page container">
    <div class="main-layout">
      <aside class="filters-sidebar">
        <div class="filter-group">
          <h3>Precio</h3>
          <div class="slider-container">
            <input type="range" v-model="priceRange" min="0" max="300" class="range-slider" />
            <div class="price-labels">
              <span>0,00€</span>
              <span>{{ priceRange }},00€</span>
            </div>
          </div>
        </div>

        <div class="filter-group">
          <h3>Marca</h3>
          <div class="checkbox-list">
            <label v-for="brand in brandsList" :key="brand" class="checkbox-item">
              <input type="checkbox" :value="brand" v-model="selectedBrands" />
              <span>{{ brand }}</span>
            </label>
          </div>
        </div>

        <div class="filter-group">
          <h3>Género</h3>
          <div class="grid-buttons two-cols">
            <button
              v-for="gen in genderOptions"
              :key="gen"
              class="filter-btn"
              :class="{ active: selectedGender.includes(gen) }"
              @click="toggleSelection(selectedGender, gen)"
            >
              {{ gen }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <h3>Talla</h3>

          <label class="sub-label">Adultos</label>
          <div class="grid-buttons sizes-grid">
            <button
              v-for="size in adultSizes"
              :key="size"
              class="size-btn"
              :class="{ active: selectedSizes.includes(size) }"
              @click="toggleSelection(selectedSizes, size)"
            >
              {{ size }}
            </button>
          </div>

          <label class="sub-label">Niños</label>
          <div class="grid-buttons sizes-grid">
            <button
              v-for="size in kidsSizes"
              :key="size"
              class="size-btn"
              :class="{ active: selectedSizes.includes(size) }"
              @click="toggleSelection(selectedSizes, size)"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <h3>Talla de pie</h3>
          <div class="grid-buttons sizes-grid">
            <button
              v-for="size in shoeSizes"
              :key="size"
              class="size-btn"
              :class="{ active: selectedSizes.includes(size) }"
              @click="toggleSelection(selectedSizes, size)"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <h3>Color</h3>
          <div class="color-grid">
            <div
              v-for="color in colorsList"
              :key="color.name"
              class="color-wrapper"
              @click="toggleSelection(selectedColors, color.name)"
            >
              <div
                class="color-circle"
                :style="{ background: color.hex, border: color.border ? '1px solid #ddd' : 'none' }"
              >
                <span v-if="selectedColors.includes(color.name)" class="check-mark">✓</span>
              </div>
              <span class="color-name">{{ color.name }}</span>
            </div>
          </div>
        </div>

        <div class="filter-group">
          <h3>Tiendas</h3>
          <div class="checkbox-list">
            <label class="checkbox-item"><input type="checkbox" /> Madrid centro</label>
            <label class="checkbox-item"><input type="checkbox" /> Barcelona diagonal</label>
            <label class="checkbox-item"><input type="checkbox" /> Valencia puerto</label>
          </div>
        </div>
      </aside>

      <section class="results-content">
        <h2 class="results-title"></h2>

        <div v-if="filteredProducts.length > 0" class="products-grid">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
        </div>

        <div v-else class="no-results">
          <h3>Sin resultados</h3>
          <p>Intenta cambiar los filtros.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px; /* Un poco más ancho para que quepa bien la sidebar */
  margin: 0 auto;
  padding: 0 20px;
}

.sub-nav {
  display: flex;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #666;
  overflow-x: auto;
}
.sub-nav a {
  text-decoration: none;
  color: inherit;
  white-space: nowrap;
}

.main-layout {
  display: grid;
  grid-template-columns: 260px 1fr; /* Sidebar fijo, resto flexible */
  gap: 40px;
  padding-bottom: 50px;
}

/* SIDEBAR STYLES */
.filters-sidebar {
  border-right: 1px solid #eee; /* Línea divisoria vertical */
  padding-right: 20px;
}

.filter-group {
  margin-bottom: 25px;
}

.filter-group h3 {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #000;
}

.sub-label {
  display: block;
  font-size: 0.75rem;
  color: #666;
  margin: 8px 0 4px;
}

/* Checkboxes */
.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.checkbox-item {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #444;
  cursor: pointer;
}
.checkbox-item input {
  margin-right: 8px;
  accent-color: var(--color-primary);
}

/* Slider Precio */
.slider-container {
  padding: 0 5px;
}
.range-slider {
  width: 100%;
  accent-color: var(--color-primary);
}
.price-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
  margin-top: 5px;
}

/* Botones Género (Naranja/Blanco) */
.grid-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.filter-btn {
  background: white;
  border: 1px solid #ffdcb0; /* Naranja muy suave para borde */
  color: var(--color-primary);
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--color-primary);
}

.filter-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Botones Talla (Cuadrados con borde redondeado) */
.sizes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.size-btn {
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px; /* Borde suave como mockup */
  min-width: 35px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0 5px;
}

.size-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.size-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Colores (Círculos) */
.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.color-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
.color-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.check-mark {
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5); /* Sombra para que se vea en colores claros */
}
.color-name {
  font-size: 0.65rem;
  color: #666;
  margin-top: 4px;
  text-align: center;
}

/* RESULTADOS */
.results-title {
  color: var(--color-primary);
  font-size: 1.5rem;
  margin-bottom: 20px;
  margin-top: 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #888;
}

/* Responsive */
@media (max-width: 768px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  .filters-sidebar {
    border-right: none;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }
}
</style>
