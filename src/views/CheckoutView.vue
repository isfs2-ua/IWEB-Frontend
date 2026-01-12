<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notification'
import type { Address } from '@/types'

// Componentes
import BaseModal from '@/components/BaseModal.vue'
import AddressForm from '@/components/AddressForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()

// --- ESTADO GENERAL ---
const currentStep = ref(1)
const orderCompleted = ref(false) // <--- NUEVO: Controla si mostramos el éxito
const orderReference = ref('') // <--- NUEVO: Guarda el nº de pedido

// --- ESTADO DE ENVÍO ---
type DeliveryMethod = 'shipping' | 'store'
const deliveryMethod = ref<DeliveryMethod>('shipping')
const selectedAddressId = ref<number | null>(null)
const selectedStoreId = ref<number | null>(null)

// --- ESTADO DE PAGO ---
const selectedPaymentMethod = ref('')
const isProcessingPayment = ref(false)

// Vigilante para resetear pago si cambia envío
watch(deliveryMethod, (newMethod) => {
  if (newMethod === 'shipping' && selectedPaymentMethod.value === 'cash') {
    selectedPaymentMethod.value = ''
  }
})

// Datos Mock de Tiendas
const stores = [
  {
    id: 101,
    nombre: 'Madrid Centro',
    direccion: 'C/ Gran Vía 55, 28013 Madrid',
    horario: '10:00 - 21:00',
  },
  {
    id: 102,
    nombre: 'Valencia Puerto',
    direccion: 'Av. del Puerto 10, 46021 Valencia',
    horario: '09:00 - 20:30',
  },
  {
    id: 103,
    nombre: 'Barcelona Diagonal',
    direccion: 'Av. Diagonal 200, 08018 Barcelona',
    horario: '10:00 - 21:00',
  },
  {
    id: 104,
    nombre: 'Sevilla',
    direccion: 'C/ Sierpes 12, 41004 Sevilla',
    horario: '10:00 - 21:00',
  },
]

// --- CÁLCULOS DEL RESUMEN ---
const shippingCostDisplay = computed(() => {
  if (deliveryMethod.value === 'store') return 0
  return cartStore.shippingCost
})

const totalDisplay = computed(() => {
  return cartStore.subtotal + shippingCostDisplay.value
})

// --- VALIDACIÓN ---
const canCheckout = computed(() => {
  return currentStep.value === 3 && selectedPaymentMethod.value !== ''
})

// --- ACCIÓN FINAL (ACTUALIZADA) ---
const finalizePurchase = () => {
  if (!canCheckout.value) return

  // Generamos un número de pedido aleatorio
  const randomRef = Math.floor(Math.random() * 100000000000000).toString()

  // Función interna para cerrar el pedido
  const finish = () => {
    cartStore.items = [] // Vaciar carrito
    orderReference.value = randomRef // Guardar referencia
    orderCompleted.value = true // <--- ESTO CAMBIA LA PANTALLA
    window.scrollTo(0, 0) // Subir arriba
  }

  if (selectedPaymentMethod.value === 'card') {
    // 1. Simulación Pasarela
    isProcessingPayment.value = true
    setTimeout(() => {
      isProcessingPayment.value = false
      finish()
    }, 3000)
  } else if (selectedPaymentMethod.value === 'cash') {
    // 2. Contrareembolso directo
    finish()
  }
}

// --- ESTADO DEL MODAL ---
const showAddressModal = ref(false)
const isEditing = ref(false)
const addressForm = reactive<Address>({
  id: 0,
  nombreCompleto: '',
  telefono: '',
  calle: '',
  ciudad: '',
  codigoPostal: '',
  provincia: '',
  pais: 'España',
  esPrincipal: false,
})

// --- INICIO ---
onMounted(() => {
  if (authStore.isAuthenticated) {
    currentStep.value = 2
    const mainAddr = authStore.user?.direcciones.find((d) => d.esPrincipal)
    if (mainAddr) selectedAddressId.value = mainAddr.id
  }
})

const selectedDeliverySummary = computed(() => {
  if (deliveryMethod.value === 'shipping') {
    const addr = authStore.user?.direcciones.find((d) => d.id === selectedAddressId.value)
    return addr ? `Envío a: ${addr.calle}, ${addr.ciudad}` : ''
  } else {
    const store = stores.find((s) => s.id === selectedStoreId.value)
    return store ? `Recogida en: Tienda ${store.nombre}` : ''
  }
})

const goToLogin = () => router.push('/login')
const goToRegister = () => router.push('/register')
const goToHome = () => router.push('/')

const nextStep = () => {
  let canProceed = false
  if (currentStep.value === 2) {
    if (deliveryMethod.value === 'shipping' && selectedAddressId.value) canProceed = true
    if (deliveryMethod.value === 'store' && selectedStoreId.value) canProceed = true
    if (canProceed) currentStep.value = 3
  }
}

const openAddAddress = () => {
  isEditing.value = false
  Object.assign(addressForm, {
    id: 0,
    nombreCompleto: '',
    telefono: '',
    calle: '',
    ciudad: '',
    codigoPostal: '',
    provincia: '',
    pais: 'España',
    esPrincipal: false,
  })
  showAddressModal.value = true
}
const openEditAddress = (addr: Address) => {
  isEditing.value = true
  Object.assign(addressForm, { ...addr })
  showAddressModal.value = true
}
const saveAddress = () => {
  if (
    !addressForm.nombreCompleto ||
    !addressForm.calle ||
    !addressForm.ciudad ||
    !addressForm.codigoPostal ||
    !addressForm.provincia ||
    !addressForm.telefono
  ) {
    alert('Por favor rellena todos los campos obligatorios')
    return
  }
  if (authStore.user) {
    if (isEditing.value) {
      const index = authStore.user.direcciones.findIndex((a) => a.id === addressForm.id)
      if (index !== -1) authStore.user.direcciones[index] = { ...addressForm }
    } else {
      const newId = Date.now()
      const newAddress = { ...addressForm, id: newId }
      authStore.user.direcciones.push(newAddress)
      selectedAddressId.value = newId
    }
  }
  showAddressModal.value = false
}
</script>

<template>
  <div class="container checkout-page">
    <template v-if="!orderCompleted">
      <div class="steps-column">
        <div class="step-item" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
          <div class="step-header">
            <div class="step-number">1</div>
            <h2>Datos de contacto</h2>
          </div>
          <div v-if="currentStep === 1 && !authStore.isAuthenticated" class="step-content">
            <p class="step-question">¿Ya tienes una cuenta con nosotros?</p>
            <button @click="goToLogin" class="btn-primary">Iniciar sesión</button>
            <p class="step-question mt-4">¿Todavía no tienes cuenta?</p>
            <button @click="goToRegister" class="btn-primary">Regístrate</button>
          </div>
          <div v-if="currentStep > 1" class="step-summary">
            <p class="summary-line">
              Entregando a <strong>{{ authStore.user?.username }}</strong>
            </p>
          </div>
        </div>

        <div
          class="step-item"
          :class="{
            active: currentStep === 2,
            completed: currentStep > 2,
            disabled: currentStep < 2,
          }"
        >
          <div class="step-header">
            <div class="step-number">2</div>
            <h2>Método de entrega</h2>
          </div>
          <div v-if="currentStep === 2" class="step-content">
            <div class="delivery-tabs">
              <button
                class="tab-btn"
                :class="{ active: deliveryMethod === 'shipping' }"
                @click="deliveryMethod = 'shipping'"
              >
                🚚 Envío a domicilio
              </button>
              <button
                class="tab-btn"
                :class="{ active: deliveryMethod === 'store' }"
                @click="deliveryMethod = 'store'"
              >
                🏪 Recogida en tienda
              </button>
            </div>

            <div v-if="deliveryMethod === 'shipping'" class="shipping-section">
              <div v-if="authStore.user?.direcciones.length">
                <div
                  v-for="addr in authStore.user.direcciones"
                  :key="addr.id"
                  class="address-card"
                  :class="{ selected: selectedAddressId === addr.id }"
                  @click="selectedAddressId = addr.id"
                >
                  <div class="radio-wrapper">
                    <input type="radio" :checked="selectedAddressId === addr.id" />
                  </div>
                  <div class="address-details">
                    <p class="addr-line">
                      <strong>{{ addr.calle }}, {{ addr.ciudad }}</strong>
                    </p>
                    <p class="addr-info">{{ addr.nombreCompleto }}</p>
                    <button class="btn-link-action" @click.stop="openEditAddress(addr)">
                      Modificar dirección
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="no-address"><p>No tienes direcciones guardadas.</p></div>
              <button class="btn-link-add" @click="openAddAddress">
                + Añadir una nueva dirección
              </button>
            </div>

            <div v-else class="store-section">
              <p class="store-intro">Selecciona tu tienda (Gratis):</p>
              <div
                v-for="store in stores"
                :key="store.id"
                class="address-card"
                :class="{ selected: selectedStoreId === store.id }"
                @click="selectedStoreId = store.id"
              >
                <div class="radio-wrapper">
                  <input type="radio" :checked="selectedStoreId === store.id" />
                </div>
                <div class="address-details">
                  <p class="addr-line">
                    <strong>{{ store.nombre }}</strong>
                  </p>
                  <p class="addr-info">{{ store.direccion }}</p>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button
                v-if="
                  (deliveryMethod === 'shipping' && selectedAddressId) ||
                  (deliveryMethod === 'store' && selectedStoreId)
                "
                class="btn-continue"
                @click="nextStep"
              >
                Continuar al Pago
              </button>
            </div>
          </div>
          <div v-if="currentStep > 2" class="step-summary">
            <p>{{ selectedDeliverySummary }}</p>
          </div>
        </div>

        <div class="step-item" :class="{ active: currentStep === 3, disabled: currentStep < 3 }">
          <div class="step-header">
            <div class="step-number">3</div>
            <h2>Pago</h2>
          </div>
          <div v-if="currentStep === 3" class="step-content">
            <p class="payment-intro">Selecciona tu método de pago:</p>
            <div class="payment-options">
              <label class="payment-card" :class="{ selected: selectedPaymentMethod === 'card' }">
                <div class="radio-wrapper">
                  <input type="radio" value="card" v-model="selectedPaymentMethod" />
                </div>
                <div class="payment-info">
                  <span class="payment-title">Tarjeta de Crédito / Débito</span>
                  <div class="payment-icons">💳 <span class="small">Visa / Mastercard</span></div>
                </div>
              </label>
              <label
                v-if="deliveryMethod === 'store'"
                class="payment-card"
                :class="{ selected: selectedPaymentMethod === 'cash' }"
              >
                <div class="radio-wrapper">
                  <input type="radio" value="cash" v-model="selectedPaymentMethod" />
                </div>
                <div class="payment-info">
                  <span class="payment-title">Contrareembolso</span>
                  <div class="payment-icons">💶 <span class="small">Paga en tienda</span></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="summary-column">
        <div class="summary-card top-card">
          <h3>Resumen del pedido</h3>
          <div class="summary-row">
            <span>Subtotal</span
            ><span>{{ cartStore.subtotal.toFixed(2).replace('.', ',') }} €</span>
          </div>
          <div class="summary-row">
            <span>Gastos de envío</span
            ><span v-if="deliveryMethod === 'store'" class="green-text">Gratis</span
            ><span v-else>{{
              shippingCostDisplay === 0
                ? 'Gratis'
                : shippingCostDisplay.toFixed(2).replace('.', ',') + ' €'
            }}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span><span>{{ totalDisplay.toFixed(2).replace('.', ',') }} €</span>
          </div>
          <small class="tax-text">IVA incluido</small>
          <button
            class="btn-checkout"
            :class="{ disabled: !canCheckout }"
            :disabled="!canCheckout"
            @click="finalizePurchase"
          >
            {{ selectedPaymentMethod === 'cash' ? 'Confirmar Reserva' : 'Realizar Compra' }}
          </button>
          <div class="shipping-info">
            <span v-if="deliveryMethod === 'store'">🏪 Recogida en tienda seleccionada</span
            ><span v-else>🚚 Envío gratis a partir de 49 €</span>
          </div>
        </div>
        <div class="summary-card products-card">
          <h3>Mis productos</h3>
          <div v-for="item in cartStore.items" :key="item.id" class="mini-product">
            <div class="mini-img"><img :src="item.imagen" /></div>
            <div class="mini-info">
              <p class="mini-name">{{ item.nombre }}</p>
              <span class="mini-price">{{ (item.precio_oferta || item.precio).toFixed(2) }} €</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isProcessingPayment" class="gateway-overlay">
        <div class="gateway-box">
          <h3>Enviando a la pasarela de pago, esperando confirmación</h3>
          <span class="loader">...</span>
        </div>
      </div>

      <BaseModal
        :show="showAddressModal"
        :title="isEditing ? 'Modificar dirección' : 'Nueva dirección'"
        @close="showAddressModal = false"
        @confirm="saveAddress"
      >
        <AddressForm v-model="addressForm" />
      </BaseModal>
    </template>

    <div v-else class="success-container">
      <div class="success-box">
        <h1>¡Pedido realizado, gracias!</h1>
        <p class="ref-text">
          Pedido con Nº referencia de: <strong>{{ orderReference }}</strong>
        </p>
        <p class="info-text">
          En breves le llegará un correo con la información del pedido y la estimación de entrega.
        </p>
        <button class="btn-back-home" @click="goToHome">Volver a la tienda</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* (MANTÉN TODOS TUS ESTILOS ANTERIORES AQUÍ...) */
/* container, steps-column, step-item, btn-primary, address-card, payment-card, etc. */

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 40px;
  align-items: flex-start;
  position: relative;
}
.steps-column {
  flex: 2;
}
.summary-column {
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.step-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.step-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}
.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ccc;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
}
h2 {
  margin: 0;
  color: #ccc;
  font-weight: normal;
}
.active .step-number,
.completed .step-number {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.active h2,
.completed h2 {
  color: #333;
  font-weight: 600;
}
.completed .step-number {
  background: var(--color-primary);
  color: white;
}
.step-content {
  padding-left: 55px;
}
.step-summary {
  padding-left: 55px;
  color: #333;
  font-size: 0.95rem;
  margin-top: -10px;
}

/* Delivery tabs */
.delivery-tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}
.tab-btn {
  background: white;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  color: #555;
  transition: all 0.2s;
  flex: 1;
  text-align: center;
}
.tab-btn.active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: #fff5eb;
}

/* Cards */
.address-card {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  padding: 15px;
  border: 1px solid transparent;
  border-radius: 6px;
  transition: background 0.2s;
}
.address-card:hover {
  background: #f9f9f9;
}
.address-card.selected {
  border-color: #ffdcb0;
  background: #fffbf6;
}
.radio-wrapper input {
  accent-color: var(--color-primary);
  transform: scale(1.2);
  margin-top: 5px;
}
.addr-line {
  margin: 0 0 5px 0;
  font-size: 0.95rem;
  color: #333;
}
.addr-info {
  margin: 0 0 2px 0;
  font-size: 0.85rem;
  color: #666;
}
.store-intro {
  margin-bottom: 15px;
  font-weight: 600;
  color: #444;
}
.green-text {
  color: #27ae60;
  font-weight: 600;
}

/* Buttons */
.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
.btn-link-action {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
  margin-top: 5px;
  text-decoration: underline;
}
.btn-link-add {
  display: block;
  margin-top: 15px;
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
}
.btn-continue {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

/* Summary */
.summary-card {
  background: white;
  border: 1px solid #ddd;
  padding: 20px;
}
.top-card h3,
.products-card h3 {
  margin-top: 0;
  font-size: 1.1rem;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #555;
}
.summary-row.total {
  color: #000;
  font-weight: bold;
  font-size: 1.1rem;
  border-top: 1px solid #eee;
  padding-top: 10px;
}
.tax-text {
  display: block;
  color: #999;
  font-size: 0.75rem;
  margin-bottom: 20px;
}
.shipping-info {
  margin-top: 15px;
  font-size: 0.85rem;
  color: #333;
  font-weight: 500;
}
.mini-product {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.mini-img {
  width: 60px;
  height: 60px;
  background: #eee;
  flex-shrink: 0;
}
.mini-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.mini-info {
  flex: 1;
  font-size: 0.85rem;
}
.mini-name {
  margin: 0 0 5px;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
}
.mini-price {
  font-weight: bold;
  color: #000;
}

/* Payment & Checkout */
.payment-intro {
  margin-bottom: 15px;
  font-weight: 600;
  color: #444;
}
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.payment-card {
  display: flex;
  gap: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  align-items: center;
  transition: all 0.2s;
}
.payment-card:hover {
  background: #f9f9f9;
}
.payment-card.selected {
  border-color: #ffdcb0;
  background: #fffbf6;
}
.payment-title {
  font-weight: 600;
  color: #333;
  display: block;
}
.payment-icons {
  font-size: 1.2rem;
  margin-top: 4px;
  color: #666;
}
.small {
  font-size: 0.8rem;
  vertical-align: middle;
}
.btn-checkout {
  width: 100%;
  padding: 15px;
  border: 1px solid var(--color-primary);
  background: var(--color-primary);
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-checkout.disabled {
  background: white;
  color: var(--color-primary);
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-checkout:not(.disabled):hover {
  background: #e65100;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Gateway Popup */
.gateway-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.gateway-box {
  background: #eee;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  color: var(--color-primary);
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
}
.loader {
  display: block;
  font-size: 2rem;
  margin-top: 10px;
  animation: blink 1s infinite;
}
@keyframes blink {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

/* --- NUEVOS ESTILOS PARA LA PANTALLA DE ÉXITO --- */
.success-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
}

.success-box {
  background-color: var(--color-primary); /* Fondo naranja */
  color: white;
  padding: 60px;
  border-radius: 8px;
  text-align: center;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 10px 20px rgba(255, 107, 0, 0.2);
}

.success-box h1 {
  margin: 0 0 20px 0;
  font-size: 2.2rem;
  font-weight: 800;
}

.ref-text {
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.info-text {
  font-size: 0.95rem;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.5;
}

.btn-back-home {
  background: white;
  color: var(--color-primary);
  border: none;
  padding: 15px 40px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-back-home:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  .summary-column {
    width: 100%;
  }
}
</style>
