<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Estado del Wizard
const currentStep = ref(1)
const totalSteps = 3
const isLoading = ref(false)
const errorMessage = ref('')

// Datos del Formulario Completo
const formData = ref({
  // Paso 1: Cuenta
  email: '',
  username: '', // Lo generaremos o pediremos
  password: '',
  confirmPassword: '',

  // Paso 2: Personal
  nombre: '',
  apellidos: '',
  telefono: '',
  fechaNacimiento: '',

  // Paso 3: Preferencias (Para el formulario inicial)
  genero: 'Unisex', // Hombre, Mujer, Unisex
  tallaRopa: '', // S, M, L...
  tallaPie: '', // 40, 41...
  intereses: [] as string[], // ['Running', 'Tenis']
})

// Opciones para los selectores (Paso 3)
const tallasRopaOpts = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const interesesOpts = [
  'Running',
  'Ciclismo',
  'Fútbol',
  'Baloncesto',
  'Tenis',
  'Natación',
  'Moda Urbana',
]

// --- VALIDACIONES ---
const step1Valid = computed(() => {
  return (
    formData.value.email.includes('@') &&
    formData.value.password.length >= 6 &&
    formData.value.password === formData.value.confirmPassword
  )
})

const step2Valid = computed(() => {
  return (
    formData.value.nombre.length > 0 &&
    formData.value.apellidos.length > 0 &&
    formData.value.fechaNacimiento !== ''
  )
})

const step3Valid = computed(() => {
  // Opcional: Podríamos obligar a elegir al menos un interés
  return true
})

// --- NAVEGACIÓN ---
const nextStep = () => {
  if (currentStep.value === 1 && step1Valid.value) {
    // Generar username automático si está vacío (ej: parte del email)
    if (!formData.value.username) {
      formData.value.username = formData.value.email.split('@')[0]
    }
    currentStep.value++
  } else if (currentStep.value === 2 && step2Valid.value) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

// --- ENVÍO FINAL ---
const handleRegister = async () => {
  errorMessage.value = ''
  isLoading.value = true

  // Construimos el Payload para el Backend
  // Adaptamos la estructura plana del form a la estructura UserProfile compleja
  const payload = {
    email: formData.value.email,
    password: formData.value.password,
    username: formData.value.username,
    nombre: formData.value.nombre,
    apellidos: formData.value.apellidos,
    telefono: formData.value.telefono,
    fechaNacimiento: formData.value.fechaNacimiento,
    // Creamos el primer formulario de preferencias
    formularios: [
      {
        alias: 'Principal', // Nombre por defecto
        genero: formData.value.genero,
        talla: formData.value.tallaRopa,
        tallaPie: formData.value.tallaPie,
        intereses: formData.value.intereses,
      },
    ],
  }

  const success = await authStore.register(payload)

  isLoading.value = false

  if (success) {
    router.push('/perfil')
  } else {
    errorMessage.value = 'Hubo un error al registrarse. Verifica los datos.'
  }
}
</script>

<template>
  <div class="wizard-container">
    <div class="wizard-card">
      <div class="wizard-header">
        <h2>Registro Guiado</h2>
        <div class="steps-indicator">
          <div class="step" :class="{ active: currentStep >= 1 }">1</div>
          <div class="line" :class="{ active: currentStep >= 2 }"></div>
          <div class="step" :class="{ active: currentStep >= 2 }">2</div>
          <div class="line" :class="{ active: currentStep >= 3 }"></div>
          <div class="step" :class="{ active: currentStep >= 3 }">3</div>
        </div>
        <p class="step-title" v-if="currentStep === 1">Datos de Cuenta</p>
        <p class="step-title" v-if="currentStep === 2">Sobre Ti</p>
        <p class="step-title" v-if="currentStep === 3">Tus Preferencias</p>
      </div>

      <form @submit.prevent="handleRegister" class="wizard-form">
        <div v-if="currentStep === 1" class="step-content">
          <div class="form-group">
            <label>Email</label>
            <input v-model="formData.email" type="email" placeholder="ejemplo@email.com" required />
          </div>

          <div class="form-group">
            <label>Nombre de Usuario (Opcional)</label>
            <input v-model="formData.username" type="text" placeholder="Como te verán los demás" />
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <input
              v-model="formData.password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div class="form-group">
            <label>Repetir Contraseña</label>
            <input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirma la contraseña"
              :class="{
                'error-border':
                  formData.confirmPassword && formData.password !== formData.confirmPassword,
              }"
              required
            />
          </div>
        </div>

        <div v-if="currentStep === 2" class="step-content">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre</label>
              <input v-model="formData.nombre" type="text" required />
            </div>
            <div class="form-group">
              <label>Apellidos</label>
              <input v-model="formData.apellidos" type="text" required />
            </div>
          </div>

          <div class="form-group">
            <label>Fecha de Nacimiento</label>
            <input v-model="formData.fechaNacimiento" type="date" required />
          </div>

          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="formData.telefono" type="tel" placeholder="600 00 00 00" />
          </div>
        </div>

        <div v-if="currentStep === 3" class="step-content">
          <div class="intro-text">
            <p>Ayúdanos a recomendarte lo mejor.</p>
          </div>

          <div class="form-group">
            <label>Género Principal</label>
            <select v-model="formData.genero">
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Unisex">No especificar / Unisex</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Talla Camiseta</label>
              <select v-model="formData.tallaRopa">
                <option value="" disabled>Elige...</option>
                <option v-for="t in tallasRopaOpts" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Talla Pie</label>
              <input
                v-model="formData.tallaPie"
                type="number"
                placeholder="Ej: 42"
                min="30"
                max="50"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Intereses (Deportes)</label>
            <div class="tags-container">
              <label
                v-for="interes in interesesOpts"
                :key="interes"
                class="tag-checkbox"
                :class="{ active: formData.intereses.includes(interes) }"
              >
                <input type="checkbox" :value="interes" v-model="formData.intereses" hidden />
                {{ interes }}
              </label>
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>

        <div class="wizard-actions">
          <button type="button" class="btn-secondary" v-if="currentStep > 1" @click="prevStep">
            Atrás
          </button>

          <button
            type="button"
            class="btn-primary"
            v-if="currentStep < 3"
            @click="nextStep"
            :disabled="(currentStep === 1 && !step1Valid) || (currentStep === 2 && !step2Valid)"
          >
            Siguiente
          </button>

          <button type="submit" class="btn-success" v-if="currentStep === 3" :disabled="isLoading">
            {{ isLoading ? 'Creando cuenta...' : 'Finalizar Registro' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.wizard-container {
  min-height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
  padding: 20px;
}

.wizard-card {
  background: white;
  width: 100%;
  max-width: 550px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

/* Header & Steps */
.wizard-header {
  text-align: center;
  margin-bottom: 2rem;
}
.wizard-header h2 {
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}
.steps-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}
.step {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #eee;
  color: #777;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s;
}
.step.active {
  background: var(--color-primary, #ff6600);
  color: white;
}
.line {
  width: 50px;
  height: 3px;
  background: #eee;
  margin: 0 5px;
}
.line.active {
  background: var(--color-primary, #ff6600);
}
.step-title {
  color: #666;
  font-size: 0.9rem;
  margin-top: 5px;
}

/* Forms */
.form-group {
  margin-bottom: 1.2rem;
}
.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #333;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.error-border {
  border-color: red !important;
}

/* Tags Intereses */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.tag-checkbox {
  padding: 8px 16px;
  background: #f0f0f0;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  user-select: none;
}
.tag-checkbox.active {
  background: var(--color-primary, #ff6600);
  color: white;
  font-weight: bold;
}

/* Buttons */
.wizard-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}
.btn-primary,
.btn-secondary,
.btn-success {
  padding: 10px 24px;
  border-radius: 6px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
}
.btn-primary {
  background: var(--color-primary, #ff6600);
  color: white;
  margin-left: auto; /* Push to right */
}
.btn-secondary {
  background: #e0e0e0;
  color: #333;
}
.btn-success {
  background: #28a745;
  color: white;
  margin-left: auto;
}
.btn-primary:disabled,
.btn-success:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-msg {
  color: red;
  text-align: center;
  margin-top: 10px;
  background: #fff5f5;
  padding: 5px;
  border-radius: 4px;
}
</style>
