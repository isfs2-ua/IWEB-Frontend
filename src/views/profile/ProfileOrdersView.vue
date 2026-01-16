<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProfileSidebar from '@/components/ProfileSidebar.vue'
import { useOrderStore } from '@/stores/orders'
import { useNotificationStore } from '@/stores/notification'

const { t, tm, locale } = useI18n()
const orderStore = useOrderStore()
const notificationStore = useNotificationStore()

// FILTROS
const selectedYear = ref('2026')
const selectedMonthIndex = ref<number | ''>('') // Guardamos el índice (0-11) o vacío
const searchQuery = ref('')

const years = ['2026', '2025', '2024']

// Computamos los meses para que se traduzcan al cambiar el idioma
const months = computed(() => tm('date.months') as string[])

const getMonthIndex = (dateString: string) => {
  const date = new Date(dateString)
  return date.getMonth()
}

const getYear = (dateString: string) => {
  return dateString.split('-')[0]
}

// Formatear fecha según el idioma actual (ES: 10/1/2026, EN: 1/10/2026)
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value)
}

// Formatear precio según idioma (ES: 25,00 €, EN: 25.00 €)
const formatPrice = (price: number) => {
  return price.toLocaleString(locale.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// LÓGICA DE FILTRADO
const filteredOrders = computed(() => {
  return orderStore.orders.filter((order) => {
    // Filtro por Año
    if (selectedYear.value && getYear(order.fecha) !== selectedYear.value) {
      return false
    }
    // Filtro por Mes
    if (selectedMonthIndex.value !== '' && getMonthIndex(order.fecha) !== selectedMonthIndex.value) {
      return false
    }
    // Filtro por Búsqueda
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchId = order.numero_pedido.includes(query)
      const matchProduct = order.items.some((item) => item.nombre.toLowerCase().includes(query))
      return matchId || matchProduct
    }
    return true
  })
})

// ACCIONES
const downloadInvoice = (orderId: string) => {
  // Traducción con parámetro {id}
  notificationStore.showNotification(t('profile.orders.notifications.download', { id: orderId }), 'info')
}

const addReview = (productName: string) => {
  // Traducción con parámetro {product}
  notificationStore.showNotification(t('profile.orders.notifications.review', { product: productName }), 'success')
}
</script>

<template>
  <div class="container profile-layout">
    <ProfileSidebar />

    <div class="profile-content">
      <h1 class="page-title">{{ $t('profile.orders.title') }}</h1>

      <div class="filters-bar">
        <select v-model="selectedYear" class="filter-select">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>

        <select v-model="selectedMonthIndex" class="filter-select">
          <option value="">{{ $t('common.all') || 'Todos' }}</option> <option v-for="(month, index) in months" :key="index" :value="index">
            {{ month }}
          </option>
        </select>

        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            :placeholder="$t('profile.orders.search_placeholder')" 
          />
        </div>
      </div>

      <div class="orders-list">
        <div v-for="order in filteredOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="header-info">
              <div class="info-col">
                <span class="label">{{ $t('profile.orders.placed_on') }}</span>
                <span class="value">{{ formatDate(order.fecha) }}</span>
              </div>
              <div class="info-col">
                <span class="label">{{ $t('profile.orders.order_number') }}</span>
                <span class="value">{{ order.numero_pedido }}</span>
              </div>
            </div>

            <div class="header-actions">
              <button class="btn-invoice" @click="downloadInvoice(order.numero_pedido)">
                {{ $t('profile.orders.invoice') }}
              </button>
              <button class="btn-review" @click="addReview(order.items[0].nombre)">
                {{ $t('profile.orders.add_review') }}
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
                <span class="item-price">{{ formatPrice(item.precio) }} €</span>
                <span class="item-qty">x{{ item.cantidad }} {{ $t('profile.orders.units') }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredOrders.length === 0" class="no-orders">
          <p>{{ $t('profile.orders.no_results') }}</p>
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
