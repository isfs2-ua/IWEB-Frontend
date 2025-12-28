<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const currentStep = ref(1)

// Datos del formulario
const formData = reactive({
  // PASO 1: Cuenta
  username: '',
  email: '',
  password: '',
  confirmPassword: '',

  // PASO 2: Datos Personales
  firstName: '',
  lastName: '',
  phone: '',
  birthDate: '',

  // PASO 3: Info Adicional
  gender: '',
  size: '',
  footSize: '',
  interests: [] as string[],
  termsAccepted: false,
  newsletter: false,
})

const sportsList = ['Running', 'Ciclismo', 'Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Otro']

// --- LÓGICA DE NAVEGACIÓN ---

const nextStep = () => {
  if (currentStep.value === 1) {
    if (!formData.email || !formData.password || formData.password !== formData.confirmPassword) {
      notificationStore.showNotification(
        'Revisa los campos y que las contraseñas coincidan.',
        'error',
      )
      return
    }
  }
  if (currentStep.value === 2) {
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      notificationStore.showNotification('Completa los datos personales obligatorios.', 'error')
      return
    }
  }
  currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const handleSubmit = () => {
  // Validaciones finales
  if (!formData.termsAccepted) {
    notificationStore.showNotification('Debes aceptar los términos y condiciones.', 'error')
    return
  }

  // Aquí iría la llamada real al Backend para crear el usuario (POST /register)
  console.log('Registrando usuario:', formData)

  // --- CAMBIO CLAVE: AUTO-LOGIN ---
  // Una vez registrado con éxito, iniciamos sesión automáticamente en el frontend
  authStore.login(formData.email, formData.password)

  // Opcional: Actualizamos el nombre en el store para que sea el real del registro
  // (Esto requiere que el store exponga 'user' como modificable, que por defecto en Pinia lo es)
  if (authStore.user) {
    authStore.user.name = formData.firstName
  }

  // Notificamos y redirigimos a la HOME
  notificationStore.showNotification(`¡Bienvenido/a ${formData.firstName}!`, 'success')
  router.push('/')
}
</script>
<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="title">¡Regístrate en sólo unos minutos!</h2>

      <div class="stepper">
        <div class="step-item" :class="{ active: currentStep >= 1 }">
          <div class="step-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span class="step-label">Cuenta</span>
        </div>

        <div class="step-line" :class="{ active: currentStep >= 2 }"></div>

        <div class="step-item" :class="{ active: currentStep >= 2 }">
          <div class="step-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </div>
          <span class="step-label">Datos personales</span>
        </div>

        <div class="step-line" :class="{ active: currentStep >= 3 }"></div>

        <div class="step-item" :class="{ active: currentStep >= 3 }">
          <div class="step-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <span class="step-label">Información adicional</span>
        </div>
      </div>

      <form @submit.prevent class="wizard-form">
        <div v-if="currentStep === 1" class="step-content fade-in">
          <div class="form-group">
            <label>Nombre de usuario</label>
            <input type="text" v-model="formData.username" placeholder="Tu nombre de usuario" />
          </div>
          <div class="form-group">
            <label>Correo electrónico *</label>
            <input type="email" v-model="formData.email" placeholder="Tu email" required />
          </div>
          <div class="form-group">
            <label>Contraseña *</label>
            <input type="password" v-model="formData.password" placeholder=".........." required />
          </div>
          <div class="form-group">
            <label>Repetir contraseña *</label>
            <input
              type="password"
              v-model="formData.confirmPassword"
              placeholder=".........."
              required
            />
          </div>
        </div>

        <div v-if="currentStep === 2" class="step-content fade-in">
          <div class="form-group">
            <label>Nombre *</label>
            <input type="text" v-model="formData.firstName" placeholder="Tu nombre" required />
          </div>
          <div class="form-group">
            <label>Apellidos *</label>
            <input type="text" v-model="formData.lastName" placeholder="Tus apellidos" required />
          </div>
          <div class="form-group">
            <label>Teléfono móvil *</label>
            <input type="tel" v-model="formData.phone" placeholder="616 16 16 16" required />
          </div>
          <div class="form-group">
            <label>Fecha de nacimiento</label>
            <input type="date" v-model="formData.birthDate" />
          </div>
        </div>

        <div v-if="currentStep === 3" class="step-content fade-in">
          <p class="info-text">Personaliza tu experiencia (opcional):</p>

          <div class="two-columns">
            <div class="col-left">
              <div class="form-group">
                <label>Género</label>
                <select v-model="formData.gender">
                  <option value="" disabled selected>Hombre / Mujer / Niño...</option>
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                  <option value="nino">Niño</option>
                  <option value="nina">Niña</option>
                </select>
              </div>
              <div class="form-group">
                <label>Talla</label>
                <select v-model="formData.size">
                  <option value="" disabled selected>XXS / XS / S / M / L / XL...</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>
              <div class="form-group">
                <label>Talla de pie</label>
                <input type="number" v-model="formData.footSize" placeholder="Nº pie" />
              </div>
            </div>

            <div class="col-right">
              <label class="checkbox-group-label">Interés por el deporte:</label>
              <div class="checkbox-list">
                <label v-for="sport in sportsList" :key="sport" class="checkbox-item">
                  <input type="checkbox" :value="sport" v-model="formData.interests" />
                  <span>{{ sport }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="legal-checks">
            <label class="checkbox-item">
              <input type="checkbox" v-model="formData.termsAccepted" required />
              <span>He leído y acepto los <a href="#">términos y condiciones</a> *.</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="formData.newsletter" />
              <span>Acepto recibir novedades y ofertas promocionales.</span>
            </label>
          </div>
        </div>

        <div class="buttons-row">
          <button v-if="currentStep > 1" type="button" class="btn-secondary" @click="prevStep">
            Anterior
          </button>

          <button v-if="currentStep < 3" type="button" class="btn-primary" @click="nextStep">
            Siguiente
          </button>

          <button v-if="currentStep === 3" type="button" class="btn-primary" @click="handleSubmit">
            Siguiente
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor Principal (Igual que Login) */
.register-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 20px;
}

.register-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 0;
}

/* Tarjeta */
.register-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 600px; /* Un poco más ancha que el login para que quepa todo */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 1;
  text-align: center;
}

.title {
  color: var(--color-primary);
  font-weight: 800;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

/* --- STEPPER STYLES --- */
.stepper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 10px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  color: #ccc; /* Color inactivo */
}

.step-item.active {
  color: var(--color-primary); /* Color activo */
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  margin-bottom: 5px;
  transition: all 0.3s;
}

.step-item.active .step-circle {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.step-label {
  font-size: 0.75rem;
  font-weight: 600;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e0e0e0;
  margin: 0 10px;
  margin-bottom: 15px; /* Ajuste para alinear con los círculos */
}

.step-line.active {
  background: var(--color-primary);
}

/* --- FORM STYLES --- */
.form-group {
  margin-bottom: 1rem;
  text-align: left;
}
.form-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 600;
  font-size: 0.85rem;
  color: #333;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Info Adicional (Paso 3) - Dos Columnas */
.info-text {
  font-weight: bold;
  margin-bottom: 15px;
  text-align: left;
  text-decoration: underline;
  font-size: 0.9rem;
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  text-align: left;
}

.checkbox-group-label {
  font-weight: 600;
  font-size: 0.85rem;
  display: block;
  margin-bottom: 8px;
}

.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #555;
  cursor: pointer;
}
.checkbox-item input {
  margin-right: 8px;
  accent-color: var(--color-primary);
}
.checkbox-item a {
  color: var(--color-primary);
  text-decoration: none;
}

.legal-checks {
  margin-top: 20px;
  text-align: left;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

/* BOTONES */
.buttons-row {
  display: flex;
  justify-content: flex-end; /* Alinea a la derecha por defecto */
  gap: 15px;
  margin-top: 2rem;
}

/* Si hay botón anterior, usamos space-between para separarlos */
.buttons-row:has(.btn-secondary) {
  justify-content: space-between;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-primary:hover {
  background: #e55a2b;
}

.btn-secondary {
  background: #999;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-secondary:hover {
  background: #777;
}

/* Animación simple */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .two-columns {
    grid-template-columns: 1fr;
  } /* Apilar columnas en móvil */
  .stepper {
    padding: 0;
  }
  .step-label {
    display: none;
  } /* Ocultar etiquetas en móvil si falta espacio */
}
</style>
