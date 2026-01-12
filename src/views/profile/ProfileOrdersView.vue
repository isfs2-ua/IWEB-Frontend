<script setup lang="ts">
import { ref, computed } from 'vue'
import ProfileSidebar from '@/components/ProfileSidebar.vue'
import { useOrderStore } from '@/stores/orders'
import { useNotificationStore } from '@/stores/notification'

const orderStore = useOrderStore()
const notificationStore = useNotificationStore()

// --- FILTROS ---
const selectedYear = ref('2026')
const selectedMonth = ref('Enero')
const searchQuery = ref('')

const years = ['2026', '2025', '2024']
const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

// Función para obtener el nombre del mes desde una fecha 'YYYY-MM-DD'
const getMonthName = (dateString: string) => {
  const date = new Date(dateString)
  return months[date.getMonth()]
}

const getYear = (dateString: string) => {
  return dateString.split('-')[0]
}

// Formatear fecha para mostrarla como "10/1/2026"
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

// --- LÓGICA DE FILTRADO ---
const filteredOrders = computed(() => {
  return orderStore.orders.filter((order) => {
    // 1. Filtro por Año
    if (selectedYear.value && getYear(order.fecha) !== selectedYear.value) {
      return false
    }
    // 2. Filtro por Mes
    if (selectedMonth.value && getMonthName(order.fecha) !== selectedMonth.value) {
      return false
    }
    // 3. Filtro por Búsqueda (Nº Pedido o Nombre producto)
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchId = order.numero_pedido.includes(query)
      const matchProduct = order.items.some((item) => item.nombre.toLowerCase().includes(query))
      return matchId || matchProduct
    }
    return true
  })
})

// --- ACCIONES ---
const downloadInvoice = (orderId: string) => {
  notificationStore.showNotification(`Descargando factura del pedido ${orderId}...`, 'info')
}

const addReview = (productName: string) => {
  notificationStore.showNotification(`Añadir reseña para: ${productName}`, 'success')
  // Aquí redirigirías a un formulario de reseña
}
</script>

<template>
  <div class="container profile-layout">
    <ProfileSidebar />

    <div class="profile-content">
      <h1 class="page-title">Pedidos, devoluciones y facturas</h1>

      <div class="filters-bar">
        <select v-model="selectedYear" class="filter-select">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>

        <select v-model="selectedMonth" class="filter-select">
          <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>

        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input type="text" v-model="searchQuery" placeholder="Buscar" />
        </div>
      </div>

      <div class="orders-list">
        <div v-for="order in filteredOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="header-info">
              <div class="info-col">
                <span class="label">Realizado</span>
                <span class="value">{{ formatDate(order.fecha) }}</span>
              </div>
              <div class="info-col">
                <span class="label">Nº pedido</span>
                <span class="value">{{ order.numero_pedido }}</span>
              </div>
            </div>

            <div class="header-actions">
              <button class="btn-invoice" @click="downloadInvoice(order.numero_pedido)">
                Factura
              </button>
              <button class="btn-review" @click="addReview(order.items[0].nombre)">
                Añadir reseña
              </button>
            </div>
          </div>

          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="item-row">
              <div class="item-image">
                <img :src="item.imagen" :alt="item.nombre" />
              </div>
              <div class="item-details">
                <h4 class="item-name">{{ item.nombre }}</h4>
                <span class="item-price">{{ item.precio.toFixed(2).replace('.', ',') }} €</span>
                <span class="item-qty">x{{ item.cantidad }} Unidad/es</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredOrders.length === 0" class="no-orders">
          <p>No se han encontrado pedidos con estos filtros.</p>
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
}

.profile-layout {
  display: flex;
  gap: 60px;
  align-items: flex-start;
}

.profile-content {
  flex: 1;
}

.page-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 25px;
}

/* FILTROS */
.filters-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--color-primary); /* Borde naranja como en mockup */
  border-radius: 4px;
  background: white;
  color: #333;
  min-width: 100px;
  cursor: pointer;
}

.search-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-primary); /* Borde naranja */
  border-radius: 4px;
  padding: 0 10px;
  background: white;
  flex-grow: 1;
  max-width: 300px;
}

.search-icon {
  color: var(--color-primary);
  margin-right: 8px;
  font-size: 0.9rem;
}

.search-wrapper input {
  border: none;
  outline: none;
  padding: 8px 0;
  width: 100%;
  font-size: 0.95rem;
  color: #555;
}

/* TARJETA PEDIDO */
.order-card {
  border: 1px solid #ffdcb0; /* Naranja muy suave */
  border-radius: 6px;
  margin-bottom: 20px;
  overflow: hidden;
}

.order-header {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.header-info {
  display: flex;
  gap: 40px;
}

.info-col {
  display: flex;
  flex-direction: column;
}

.info-col .label {
  font-size: 0.75rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}
.info-col .value {
  font-size: 0.9rem;
  color: #555;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn-invoice {
  background: white;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  padding: 6px 15px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
}
.btn-invoice:hover {
  background: #fff5eb;
}

.btn-review {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 6px 15px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
}
.btn-review:hover {
  background: #e65100;
}

/* ITEMS PEDIDO */
.item-row {
  display: flex;
  padding: 20px;
  border-bottom: 1px dotted #eee;
}
.item-row:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  background: #f4f4f4;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 20px;
}
.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-name {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: #333;
}

.item-price {
  font-weight: bold;
  color: #000;
  margin-bottom: 5px;
}

.item-qty {
  font-size: 0.85rem;
  color: #777;
}

.no-orders {
  text-align: center;
  padding: 40px;
  color: #777;
  background: #f9f9f9;
  border-radius: 6px;
}

@media (max-width: 768px) {
  .profile-layout {
    flex-direction: column;
  }
  .order-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
