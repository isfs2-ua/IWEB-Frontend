<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/orders'
import BaseModal from '@/components/BaseModal.vue'

const router = useRouter()
const productStore = useProductStore()
const orderStore = useOrderStore()
const authStore = useAuthStore()

// --- ESTADO GENERAL ---
const activeTab = ref<'products' | 'users' | 'orders'>('products')
const searchQuery = ref('')

// --- PAGINACIÓN ---
const currentPage = ref(1)
const itemsPerPage = 10

// --- DATOS MOCK USUARIOS ---
const mockUsers = ref([
  {
    id: 1,
    username: 'Pepito',
    email: 'pepito@gmail.com',
    isAdmin: false,
    fechaRegistro: '2025-01-01',
  },
  {
    id: 2,
    username: 'Admin',
    email: 'admin@tienda.com',
    isAdmin: true,
    fechaRegistro: '2024-12-01',
  },
  {
    id: 3,
    username: 'Maria',
    email: 'maria@hotmail.com',
    isAdmin: false,
    fechaRegistro: '2025-02-15',
  },
])

// --- ORDENACIÓN ---
const sortKey = ref('')
const sortOrder = ref(1)

const sortBy = (key: string) => {
  if (sortKey.value === key) sortOrder.value *= -1
  else {
    sortKey.value = key
    sortOrder.value = 1
  }
}

// --- FILTRADO Y ORDENACIÓN ---
const filteredAndSortedList = computed(() => {
  let list: any[] = []

  if (activeTab.value === 'products') list = [...productStore.allProducts]
  else if (activeTab.value === 'users') list = [...mockUsers.value]
  else if (activeTab.value === 'orders') list = [...orderStore.orders]

  // Filtro
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((item) => {
      if (activeTab.value === 'products')
        return item.nombre.toLowerCase().includes(q) || item.marca.toLowerCase().includes(q)
      else if (activeTab.value === 'users')
        return item.username.toLowerCase().includes(q) || item.email.toLowerCase().includes(q)
      else if (activeTab.value === 'orders')
        return item.numero_pedido.includes(q) || item.estado.toLowerCase().includes(q)
      return false
    })
  }

  // Orden
  if (sortKey.value) {
    list.sort((a, b) => {
      let valA = a[sortKey.value]
      let valB = b[sortKey.value]
      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()
      if (valA < valB) return -1 * sortOrder.value
      if (valA > valB) return 1 * sortOrder.value
      return 0
    })
  }

  return list
})

// --- PAGINACIÓN ---
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAndSortedList.value.slice(start, end)
})

const totalItems = computed(() => filteredAndSortedList.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

watch([activeTab, searchQuery], () => {
  currentPage.value = 1
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// --- EXPANSIÓN Y EDICIÓN ---
const expandedId = ref<number | null>(null)
const toggleExpand = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id
}

const showModal = ref(false)
const editingItem = ref<any>({})

const openEdit = (item: any) => {
  editingItem.value = JSON.parse(JSON.stringify(item))
  showModal.value = true
}

const saveChanges = () => {
  // Lógica de guardado simulada
  if (activeTab.value === 'products') {
    const idx = productStore.allProducts.findIndex((p) => p.id === editingItem.value.id)
    if (idx !== -1) productStore.allProducts[idx] = { ...editingItem.value }
  } else if (activeTab.value === 'users') {
    const idx = mockUsers.value.findIndex((u) => u.id === editingItem.value.id)
    if (idx !== -1) mockUsers.value[idx] = { ...editingItem.value }
  } else if (activeTab.value === 'orders') {
    const idx = orderStore.orders.findIndex((o) => o.id === editingItem.value.id)
    if (idx !== -1) orderStore.orders[idx] = { ...editingItem.value }
  }
  showModal.value = false
  alert('Elemento actualizado correctamente')
}

const goToPreview = (id: number) => {
  if (activeTab.value === 'products') router.push(`/product/${id}`)
}

// Computed para el título dinámico del modal
const modalTitle = computed(() => {
  if (activeTab.value === 'products') return 'Editar Producto'
  if (activeTab.value === 'users') return 'Editar Usuario'
  return 'Gestionar Pedido'
})

// Función para dar color al select de estado
const statusClass = (status: string) => {
  if (!status) return ''
  switch (status.toLowerCase()) {
    case 'entregado':
      return 'status-success'
    case 'cancelado':
      return 'status-danger'
    case 'pendiente':
      return 'status-warning'
    case 'en camino':
      return 'status-info'
    default:
      return ''
  }
}
</script>

<template>
  <div class="admin-container">
    <div class="header-flex">
      <h1 class="admin-title">Panel de Administración</h1>

      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="
            activeTab === 'products'
              ? 'Buscar producto...'
              : activeTab === 'users'
                ? 'Buscar usuario...'
                : 'Buscar pedido...'
          "
        />
      </div>
    </div>

    <div class="tabs">
      <button
        :class="{ active: activeTab === 'products' }"
        @click="((activeTab = 'products'), (sortKey = ''))"
      >
        Productos
      </button>
      <button
        :class="{ active: activeTab === 'users' }"
        @click="((activeTab = 'users'), (sortKey = ''))"
      >
        Usuarios
      </button>
      <button
        :class="{ active: activeTab === 'orders' }"
        @click="((activeTab = 'orders'), (sortKey = ''))"
      >
        Pedidos
      </button>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr v-if="activeTab === 'products'">
            <th class="hide-mobile" @click="sortBy('id')">ID ↕</th>
            <th @click="sortBy('nombre')">Nombre ↕</th>
            <th class="hide-mobile" @click="sortBy('marca')">Marca ↕</th>
            <th @click="sortBy('precio')">Precio ↕</th>
            <th class="hide-mobile" @click="sortBy('stock')">Stock ↕</th>
            <th>Acciones</th>
          </tr>
          <tr v-if="activeTab === 'users'">
            <th class="hide-mobile" @click="sortBy('id')">ID ↕</th>
            <th @click="sortBy('username')">Usuario ↕</th>
            <th class="hide-mobile" @click="sortBy('email')">Email ↕</th>
            <th @click="sortBy('isAdmin')">Rol ↕</th>
            <th class="hide-mobile" @click="sortBy('fechaRegistro')">Registro ↕</th>
            <th>Acciones</th>
          </tr>
          <tr v-if="activeTab === 'orders'">
            <th class="hide-mobile" @click="sortBy('id')">ID ↕</th>
            <th @click="sortBy('numero_pedido')">Nº Ref ↕</th>
            <th class="hide-mobile" @click="sortBy('fecha')">Fecha ↕</th>
            <th @click="sortBy('total')">Total ↕</th>
            <th @click="sortBy('estado')">Estado ↕</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="item in paginatedList" :key="item.id">
            <tr class="main-row" @click="toggleExpand(item.id)">
              <template v-if="activeTab === 'products'">
                <td class="hide-mobile">{{ item.id }}</td>
                <td class="font-bold">{{ item.nombre }}</td>
                <td class="hide-mobile">{{ item.marca }}</td>
                <td>{{ item.precio }}€</td>
                <td class="hide-mobile">
                  <span :class="item.stock > 0 ? 'badge-success' : 'badge-danger'">{{
                    item.stock
                  }}</span>
                </td>
              </template>

              <template v-if="activeTab === 'users'">
                <td class="hide-mobile">{{ item.id }}</td>
                <td class="font-bold">{{ item.username }}</td>
                <td class="hide-mobile">{{ item.email }}</td>
                <td>
                  <span :class="item.isAdmin ? 'badge-admin' : 'badge-user'">{{
                    item.isAdmin ? 'Admin' : 'User'
                  }}</span>
                </td>
                <td class="hide-mobile">{{ item.fechaRegistro }}</td>
              </template>

              <template v-if="activeTab === 'orders'">
                <td class="hide-mobile">{{ item.id }}</td>
                <td class="font-bold">{{ item.numero_pedido }}</td>
                <td class="hide-mobile">{{ item.fecha }}</td>
                <td>{{ item.total }}€</td>
                <td>
                  <span class="badge-status" :class="item.estado.toLowerCase()">{{
                    item.estado
                  }}</span>
                </td>
              </template>

              <td class="actions-cell" @click.stop>
                <button class="btn-icon edit" title="Editar" @click="openEdit(item)">✏️</button>
                <button
                  v-if="activeTab === 'products'"
                  class="btn-icon preview"
                  title="Ver"
                  @click="goToPreview(item.id)"
                >
                  👁️
                </button>
              </td>
            </tr>

            <tr v-if="expandedId === item.id" class="details-row">
              <td colspan="6">
                <div v-if="activeTab === 'products'" class="details-content product-detail">
                  <h4 class="detail-title">Detalles <span class="caret">v</span></h4>

                  <div class="product-detail-grid">
                    <div class="info-col">
                      <p class="data-row"><strong>Precio:</strong> {{ item.precio }}€</p>
                      <p class="data-row">
                        <strong>Precio oferta:</strong> <span class="text-muted">----</span>
                      </p>
                      <p class="data-row"><strong>Marca:</strong> {{ item.marca }}</p>
                      <p class="data-row"><strong>Categoría:</strong> Running</p>
                      <div class="controls-row">
                        <div class="control-group">
                          <span class="label">Visible:</span>
                          <div class="toggle-switch">
                            <button class="toggle-btn active">Sí</button>
                            <button class="toggle-btn">No</button>
                          </div>
                        </div>

                        <div class="control-group">
                          <span class="label">Stock:</span>
                          <input type="number" class="stock-input" :value="item.stock" readonly />
                        </div>
                      </div>
                    </div>

                    <div class="media-col">
                      <p class="label-strong">Imágenes:</p>
                      <div class="img-gallery">
                        <div class="main-img">
                          <img :src="item.media?.[0]?.url || item.imagen" alt="Producto" />
                        </div>
                        <div class="thumbnails">
                          <div class="thumb" v-for="i in 4" :key="i">
                            <img :src="item.media?.[0]?.url || item.imagen" alt="Thumb" />
                          </div>
                        </div>
                      </div>

                      <div class="variants-row">
                        <div class="variant-group">
                          <p class="label-strong">Tallas:</p>
                          <div class="tags-list">
                            <span class="tag orange">XXS</span>
                            <span class="tag">XS</span>
                            <span class="tag orange">S</span>
                            <span class="tag orange">M</span>
                            <span class="tag orange">L</span>
                            <span class="tag orange">XL</span>
                            <span class="tag">XXL</span>
                          </div>
                        </div>
                        <div class="variant-group">
                          <p class="label-strong">Colores:</p>
                          <div class="color-dots">
                            <span class="dot grey"></span>
                            <span class="dot blue"></span>
                            <span class="dot black"></span>
                            <span class="dot white"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="full-width-info">
                    <h5>Descripción:</h5>
                    <p class="desc-text">
                      {{
                        item.descripcion ||
                        'El pantalón largo Nike Dri-FIT Challenger está diseñado para ofrecerte comodidad y rendimiento en cada kilómetro. Confeccionado con un tejido ligero y tecnología de gestión del sudor...'
                      }}
                    </p>

                    <h5>Características:</h5>
                    <ul class="features-list">
                      <li>Incorpora la tecnología Nike Dri-FIT, que capilariza el sudor.</li>
                      <li>Cuenta con un sistema de almacenamiento versátil.</li>
                      <li>Diseño funcional con cremalleras en los tobillos.</li>
                      <li>Cintura elástica con cordón interior.</li>
                    </ul>

                    <p>
                      <strong>Composición:</strong> 100% Poliéster (fabricado con al menos un 75% de
                      fibras recicladas).
                    </p>
                  </div>
                </div>

                <div v-else class="details-content simple-detail">
                  <h4>Detalles del elemento #{{ item.id }}</h4>
                  <div v-if="activeTab === 'users'">
                    <p><strong>Email:</strong> {{ item.email }}</p>
                    <p>
                      <strong>Direcciones:</strong> {{ item.direcciones?.length || 0 }} guardadas
                    </p>
                  </div>
                  <div v-if="activeTab === 'orders'">
                    <p><strong>Total:</strong> {{ item.total }}€</p>
                    <ul>
                      <li v-for="p in item.items" :key="p.id">{{ p.cantidad }}x {{ p.nombre }}</li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="pagination-controls" v-if="totalPages > 1">
      <button :disabled="currentPage === 1" @click="prevPage" class="page-btn">← Anterior</button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage" class="page-btn">
        Siguiente →
      </button>
    </div>

    <BaseModal
      :show="showModal"
      :title="modalTitle"
      @close="showModal = false"
      @confirm="saveChanges"
    >
      <form class="crud-form" @submit.prevent>
        <div v-if="activeTab === 'products'" class="form-grid">
          <div class="form-group full-width">
            <label>Nombre del producto</label>
            <input type="text" v-model="editingItem.nombre" placeholder="Ej: Zapatillas Nike..." />
          </div>

          <div class="form-group">
            <label>Marca</label>
            <input type="text" v-model="editingItem.marca" placeholder="Ej: Nike" />
          </div>
          <div class="form-group">
            <label>Categoría</label>
            <select v-model="editingItem.categoria">
              <option value="">Selecciona...</option>
              <option value="Running">Running</option>
              <option value="Ciclismo">Ciclismo</option>
              <option value="Fútbol">Fútbol</option>
              <option value="Tenis">Tenis</option>
              <option value="Natación">Natación</option>
            </select>
          </div>

          <div class="form-group">
            <label>Precio (€)</label>
            <input type="number" v-model="editingItem.precio" step="0.01" />
          </div>
          <div class="form-group">
            <label>Precio Oferta (€)</label>
            <input
              type="number"
              v-model="editingItem.precio_oferta"
              step="0.01"
              placeholder="Opcional"
            />
          </div>
          <div class="form-group">
            <label>Stock</label>
            <input type="number" v-model="editingItem.stock" />
          </div>

          <div class="form-group full-width">
            <label>URL Imagen Principal</label>
            <input type="text" v-model="editingItem.imagen" placeholder="https://..." />
          </div>

          <div class="form-group full-width">
            <label>Descripción</label>
            <textarea
              v-model="editingItem.descripcion"
              rows="4"
              placeholder="Descripción detallada del producto..."
            ></textarea>
          </div>
        </div>

        <div v-if="activeTab === 'users'" class="form-grid">
          <div class="form-group full-width">
            <label>Nombre de usuario</label>
            <input type="text" v-model="editingItem.username" />
          </div>

          <div class="form-group full-width">
            <label>Correo Electrónico</label>
            <input type="email" v-model="editingItem.email" />
          </div>

          <div class="form-group full-width checkbox-container">
            <label class="checkbox-label">
              <input type="checkbox" v-model="editingItem.isAdmin" />
              <span class="custom-check"></span>
              <span class="text">Conceder permisos de <strong>Administrador</strong></span>
            </label>
          </div>
        </div>

        <div v-if="activeTab === 'orders'" class="form-grid">
          <div class="form-group full-width">
            <label>Referencia del Pedido</label>
            <input
              type="text"
              v-model="editingItem.numero_pedido"
              disabled
              class="input-disabled"
            />
          </div>

          <div class="form-group">
            <label>Fecha</label>
            <input type="text" v-model="editingItem.fecha" disabled class="input-disabled" />
          </div>

          <div class="form-group">
            <label>Total (€)</label>
            <input type="number" v-model="editingItem.total" step="0.01" />
          </div>

          <div class="form-group full-width">
            <label>Estado del pedido</label>
            <select v-model="editingItem.estado" :class="statusClass(editingItem.estado)">
              <option value="Pendiente">Pendiente</option>
              <option value="En camino">En camino</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<style scoped>
.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Header & Search */
.header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}
.admin-title {
  margin: 0;
  color: #333;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 5px;
}
.search-box {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 5px 15px;
  min-width: 250px;
}
.search-box input {
  border: none;
  outline: none;
  margin-left: 10px;
  width: 100%;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
}
.tabs button {
  padding: 10px 25px;
  background: #eee;
  border: none;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  font-weight: 600;
  color: #666;
}
.tabs button.active {
  background: var(--color-primary);
  color: white;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
th {
  background: #f8f8f8;
  cursor: pointer;
  white-space: nowrap;
}
.main-row {
  cursor: pointer;
  transition: background 0.1s;
}
.main-row:hover {
  background: #fdfdfd;
}
.hide-mobile {
  display: table-cell;
}
@media (max-width: 768px) {
  .hide-mobile {
    display: none;
  }
}
.badge-success,
.badge-danger,
.badge-admin,
.badge-user,
.badge-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.85rem;
}
.badge-success {
  background: #e8f5e9;
  color: #2e7d32;
}
.badge-danger {
  background: #ffebee;
  color: #c62828;
}
.badge-admin {
  background: #e8eaf6;
  color: #3f51b5;
  border: 1px solid #c5cae9;
}
.badge-user {
  background: #f5f5f5;
  color: #616161;
}

/* === ESTILOS DEL DETALLE DE PRODUCTO (NUEVO) === */
.details-row {
  background: white;
}
.details-content {
  padding: 30px;
  border-left: 5px solid var(--color-primary);
  background: #fff;
  box-shadow: inset 0 3px 10px rgba(0, 0, 0, 0.05);
}
.detail-title {
  color: var(--color-primary);
  margin-top: 0;
  font-size: 1.1rem;
  margin-bottom: 20px;
}
.detail-title .caret {
  font-size: 0.8rem;
  margin-left: 5px;
}

.product-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 30px;
}

/* Columna Izq */
.info-col .data-row {
  margin-bottom: 15px;
  font-size: 1rem;
  color: #333;
}
.text-muted {
  color: #999;
}

.controls-row {
  display: flex;
  gap: 30px;
  margin-top: 30px;
  align-items: center;
}
.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.control-group .label {
  font-weight: bold;
  font-size: 0.95rem;
}

/* Toggle Visible */
.toggle-switch {
  display: flex;
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  overflow: hidden;
}
.toggle-btn {
  border: none;
  padding: 6px 15px;
  cursor: pointer;
  font-size: 0.9rem;
  background: white;
  color: #666;
}
.toggle-btn.active {
  background: var(--color-primary);
  color: white;
  font-weight: bold;
}

/* Stock Input */
.stock-input {
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  padding: 6px 10px;
  width: 60px;
  text-align: center;
  color: var(--color-primary);
  font-weight: bold;
}

/* Columna Der (Imágenes y Variantes) */
.label-strong {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.img-gallery {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}
.main-img {
  width: 120px;
  height: 120px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}
.main-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumbnails {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  width: 120px;
}
.thumb {
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
  height: 55px;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
}

.variants-row {
  display: flex;
  gap: 40px;
}
.tags-list {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.tag {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}
.tag.orange {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  font-weight: bold;
}

.color-dots {
  display: flex;
  gap: 8px;
}
.dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ddd;
  display: inline-block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.dot.grey {
  background: #999;
}
.dot.blue {
  background: #3498db;
}
.dot.black {
  background: #000;
}
.dot.white {
  background: #fff;
}

/* Texto completo abajo */
.full-width-info h5 {
  font-size: 1rem;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
}
.desc-text {
  color: #555;
  line-height: 1.5;
  margin-bottom: 20px;
}
.features-list {
  margin-bottom: 20px;
  padding-left: 20px;
  color: #555;
}
.features-list li {
  margin-bottom: 5px;
}

/* Pagination Controls */
.pagination-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  align-items: center;
}
.page-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  cursor: pointer;
}

@media (max-width: 768px) {
  .product-detail-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .img-gallery {
    flex-direction: column;
  }
  .thumbnails {
    display: flex;
    width: 100%;
    gap: 10px;
  }
  .thumb {
    width: 60px;
    height: 60px;
  }
}

/* === ESTILOS DEL FORMULARIO CRUD === */
.crud-form {
  padding: 10px 0;
}

/* Grid Layout Inteligente */
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 Columnas por defecto */
  gap: 20px;
}

/* Campos que ocupan todo el ancho */
.full-width {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #444;
  margin-bottom: 8px;
}

/* Inputs y Selects */
.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #333;
  transition: border-color 0.2s;
  background: #fff;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1); /* Sombra naranja suave */
}

/* Inputs deshabilitados */
.input-disabled {
  background-color: #f5f5f5;
  color: #888;
  cursor: not-allowed;
}

/* Checkbox personalizado (Usuario) */
.checkbox-container {
  margin-top: 10px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #eee;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 10px;
}

.checkbox-label input {
  width: 20px;
  height: 20px;
  accent-color: var(--color-primary);
}

/* Colores para el estado del pedido */
.status-success {
  border-left: 5px solid #2e7d32;
  color: #2e7d32;
  font-weight: bold;
}
.status-danger {
  border-left: 5px solid #c62828;
  color: #c62828;
  font-weight: bold;
}
.status-warning {
  border-left: 5px solid #ef6c00;
  color: #ef6c00;
  font-weight: bold;
}
.status-info {
  border-left: 5px solid #1565c0;
  color: #1565c0;
  font-weight: bold;
}
</style>
