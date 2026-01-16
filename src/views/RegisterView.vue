<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { useI18n } from 'vue-i18n' // <--- IMPORTACIÓN

const { t } = useI18n() // <--- USO
const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const currentStep = ref(1)
const isLoading = ref(false)

// Datos del formulario
const formData = reactive({
  // PASO 1
  username: '',
  email: '',
  password: '',
  confirmPassword: '',

  // PASO 2
  firstName: '',
  lastName: '',
  phone: '',
  birthDate: '',

  // PASO 3
  gender: '',
  size: '',
  footSize: '',
  interests: [] as string[],
  termsAccepted: false,
  newsletter: false,
})

// CAMBIO: Usamos las claves para poder traducir luego
const sportsList = ['running', 'cycling', 'football', 'basketball', 'tennis', 'swimming', 'other']

// --- LÓGICA DE NAVEGACIÓN ---
const nextStep = () => {
  if (currentStep.value === 1) {
    if (!formData.email || !formData.password || formData.password !== formData.confirmPassword) {
      notificationStore.showNotification(t('register.notifications.password_mismatch'), 'error')
      return
    }
  }
  if (currentStep.value === 2) {
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      notificationStore.showNotification(t('register.notifications.missing_personal'), 'error')
      return
    }
  }
  currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

// --- ENVÍO AL BACKEND ---
const handleSubmit = async () => {
  if (!formData.termsAccepted) {
    notificationStore.showNotification(t('register.notifications.terms_required'), 'error')
    return
  }

  isLoading.value = true

  const payload = {
    username: formData.username || formData.email.split('@')[0],
    email: formData.email,
    password: formData.password,
    nombre: formData.firstName,
    apellidos: formData.lastName,
    telefono: formData.phone,
    fechaNacimiento: formData.birthDate,
    formularios: [
      {
        alias: 'Principal',
        genero: formData.gender || 'Unisex',
        talla: formData.size,
        tallaPie: formData.footSize,
        intereses: formData.interests,
      },
    ],
  }

  const success = await authStore.register(payload)

  isLoading.value = false

  if (success) {
    // Traducción con parámetro {name}
    notificationStore.showNotification(t('register.notifications.success', { name: formData.firstName }), 'success')
    router.push('/')
  } else {
    notificationStore.showNotification(t('register.notifications.error'), 'error')
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="title">{{ $t('register.title') }}</h2>

      <div class="stepper">
        <div class="step-item" :class="{ active: currentStep >= 1 }">
          <div class="step-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span class="step-label">{{ $t('register.steps.account') }}</span>
        </div>

        <div class="step-line" :class="{ active: currentStep >= 2 }"></div>

        <div class="step-item" :class="{ active: currentStep >= 2 }">
          <div class="step-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </div>
          <span class="step-label">{{ $t('register.steps.personal') }}</span>
        </div>

        <div class="step-line" :class="{ active: currentStep >= 3 }"></div>

        <div class="step-item" :class="{ active: currentStep >= 3 }">
          <div class="step-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <span class="step-label">{{ $t('register.steps.additional') }}</span>
        </div>
      </div>

      <form @submit.prevent class="wizard-form">
        <div v-if="currentStep === 1" class="step-content fade-in">
          <div class="form-group">
            <label>{{ $t('register.account.username') }}</label>
            <input type="text" v-model="formData.username" :placeholder="$t('register.account.username_placeholder')" />
          </div>
          <div class="form-group">
            <label>{{ $t('register.account.email') }}</label>
            <input type="email" v-model="formData.email" :placeholder="$t('register.account.email_placeholder')" required />
          </div>
          <div class="form-group">
            <label>{{ $t('register.account.password') }}</label>
            <input type="password" v-model="formData.password" :placeholder="$t('register.account.password_placeholder')" required />
          </div>
          <div class="form-group">
            <label>{{ $t('register.account.confirm_password') }}</label>
            <input type="password" v-model="formData.confirmPassword" :placeholder="$t('register.account.password_placeholder')" required />
          </div>
        </div>

        <div v-if="currentStep === 2" class="step-content fade-in">
          <div class="form-group">
            <label>{{ $t('register.personal.name') }}</label>
            <input type="text" v-model="formData.firstName" :placeholder="$t('register.personal.name_placeholder')" required />
          </div>
          <div class="form-group">
            <label>{{ $t('register.personal.surname') }}</label>
            <input type="text" v-model="formData.lastName" :placeholder="$t('register.personal.surname_placeholder')" required />
          </div>
          <div class="form-group">
            <label>{{ $t('register.personal.phone') }}</label>
            <input type="tel" v-model="formData.phone" :placeholder="$t('register.personal.phone_placeholder')" required />
          </div>
          <div class="form-group">
            <label>{{ $t('register.personal.birthdate') }}</label>
            <input type="date" v-model="formData.birthDate" />
          </div>
        </div>

        <div v-if="currentStep === 3" class="step-content fade-in">
          <p class="info-text">{{ $t('register.additional.intro') }}</p>

          <div class="two-columns">
            <div class="col-left">
              <div class="form-group">
                <label>{{ $t('register.additional.gender') }}</label>
                <select v-model="formData.gender">
                  <option value="" disabled selected>{{ $t('register.additional.gender_placeholder') }}</option>
                  <option value="Hombre">{{ $t('profile.data.gender_options.male') || 'Hombre' }}</option>
                  <option value="Mujer">{{ $t('profile.data.gender_options.female') || 'Mujer' }}</option>
                  <option value="Niño">{{ $t('common.child_male') || 'Niño' }}</option> 
                  <option value="Niña">{{ $t('common.child_female') || 'Niña' }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>{{ $t('register.additional.size') }}</label>
                <select v-model="formData.size">
                  <option value="" disabled selected>{{ $t('register.additional.size_placeholder') }}</option>
                  <option value="XXS">XXS</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
              <div class="form-group">
                <label>{{ $t('register.additional.foot_size') }}</label>
                <input type="number" v-model="formData.footSize" :placeholder="$t('register.additional.foot_size_placeholder')" />
              </div>
            </div>

            <div class="col-right">
              <label class="checkbox-group-label">{{ $t('register.additional.interests') }}</label>
              <div class="checkbox-list">
                <label v-for="sportKey in sportsList" :key="sportKey" class="checkbox-item">
                  <input type="checkbox" :value="sportKey" v-model="formData.interests" />
                  <span>{{ sportKey === 'other' ? $t('common.other') : $t('sports_list.' + sportKey) }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="legal-checks">
            <label class="checkbox-item">
              <input type="checkbox" v-model="formData.termsAccepted" required />
              <span v-html="$t('register.additional.terms')"></span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="formData.newsletter" />
              <span>{{ $t('register.additional.newsletter') }}</span>
            </label>
          </div>
        </div>

        <div class="buttons-row">
          <button v-if="currentStep > 1" type="button" class="btn-secondary" @click="prevStep">
            {{ $t('register.buttons.prev') }}
          </button>

          <button v-if="currentStep < 3" type="button" class="btn-primary" @click="nextStep">
            {{ $t('register.buttons.next') }}
          </button>

          <button
            v-if="currentStep === 3"
            type="button"
            class="btn-primary"
            @click="handleSubmit"
            :disabled="isLoading"
          >
            {{ isLoading ? $t('register.buttons.loading') : $t('register.buttons.submit') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Tus estilos visuales originales */
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
.register-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 1;
  text-align: center;
}
.title {
  color: var(--color-primary, #ff6600);
  font-weight: 800;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}
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
  color: #ccc;
}
.step-item.active {
  color: var(--color-primary, #ff6600);
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
  background: var(--color-primary, #ff6600);
  color: white;
  border-color: var(--color-primary, #ff6600);
}
.step-label {
  font-size: 0.75rem;
  font-weight: 600;
}
.step-line {
  flex: 1;
  height: 2px;
  background: #e0e0e0;
  margin: 0 10px 15px 10px;
}
.step-line.active {
  background: var(--color-primary, #ff6600);
}
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
.form-group input:focus {
  outline: none;
  border-color: var(--color-primary, #ff6600);
}
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
  accent-color: var(--color-primary, #ff6600);
}
.legal-checks {
  margin-top: 20px;
  text-align: left;
  border-top: 1px solid #eee;
  padding-top: 15px;
}
.buttons-row {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 2rem;
}
.buttons-row:has(.btn-secondary) {
  justify-content: space-between;
}
.btn-primary {
  background: var(--color-primary, #ff6600);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
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
@media (max-width: 600px) {
  .two-columns {
    grid-template-columns: 1fr;
  }
  .stepper {
    padding: 0;
  }
  .step-label {
    display: none;
  }
}
</style>
