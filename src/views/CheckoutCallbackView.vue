<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('') // Aquí guardaremos el "failureReason"

onMounted(async () => {
  const token = route.query.token as string
  if (!token) {
    status.value = 'error'
    message.value = 'Token no encontrado.'
    return
  }

  try {
    const { data } = await api.get(`/pagar/verify/${token}`)

    if (data.status === 'COMPLETED') {
      status.value = 'success'
      cartStore.items = [] // Limpiar carrito
      await cartStore.fetchCart()
    } else {
      // PAGO FALLIDO (FAILED)
      status.value = 'error'
      // Usamos el motivo del TPV o un texto por defecto
      message.value = data.failureReason || 'El pago ha sido denegado o cancelado.'
    }
  } catch (e: any) {
    console.error(e)
    status.value = 'error'
    message.value = 'Error de conexión con el servidor.'
  }
})

const goToHome = () => router.push('/')
const retry = () => router.push('/checkout')
</script>

<template>
  <div class="callback-container">
    <div v-if="status === 'error'" class="box error">
      <div class="icon">❌</div>
      <h1>Error en el pago</h1>

      <p class="error-reason">{{ message }}</p>

      <div class="actions">
        <button @click="retry" class="btn-secondary">Volver al Checkout</button>
        <button @click="goToHome" class="btn-text">Ir a Inicio</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 20px;
  background-color: #f8f9fa;
}

.box {
  background: white;
  padding: 50px 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  text-align: center;
  max-width: 500px;
  width: 100%;
  border: 1px solid #eee;
}

.icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

h1 {
  margin-bottom: 10px;
  color: #333;
  font-weight: 800;
}
p {
  color: #666;
  margin-bottom: 20px;
  font-size: 1.05rem;
}
.subtext {
  font-size: 0.9rem;
  color: #999;
  margin-top: -10px;
}

/* Botones */
.btn-primary {
  background: var(--color-primary, #ff6600);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 4px 10px rgba(255, 102, 0, 0.2);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 102, 0, 0.3);
}

.btn-secondary {
  background: #333;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
}
.btn-text {
  background: none;
  border: none;
  color: #888;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 15px;
}

.error-reason {
  font-size: 1.2rem;
  color: #c0392b; /* Rojo oscuro */
  font-weight: bold;
  margin: 20px 0;
}

/* Spinner */
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--color-primary, #ff6600);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
