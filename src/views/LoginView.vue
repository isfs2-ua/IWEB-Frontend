<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Variables reactivas
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  // Validación básica
  if (!email.value || !password.value) {
    notificationStore.showNotification('Por favor, introduce tu email y contraseña.', 'error')
    return
  }

  isLoading.value = true

  // Llamada al store (que usa Axios internamente)
  const success = await authStore.login(email.value, password.value)

  isLoading.value = false

  if (success) {
    notificationStore.showNotification('¡Has iniciado sesión correctamente!', 'success')
    router.push('/')
  } else {
    // Si falla, el store ya suele loguear el error, aquí avisamos al usuario
    notificationStore.showNotification('Credenciales incorrectas. Inténtalo de nuevo.', 'error')
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="header">
        <h2 class="title">Bienvenido de nuevo</h2>
        <p class="subtitle">Introduce tus credenciales para acceder a tu cuenta.</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <div class="input-wrapper">
            <svg
              class="input-icon"
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
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              ></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="ejemplo@email.com"
              required
              autofocus
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-wrapper">
            <svg
              class="input-icon"
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Entrando...' : 'Iniciar Sesión' }}
        </button>

        <div class="footer-links">
          <p>¿No tienes cuenta? <RouterLink to="/register">Regístrate gratis</RouterLink></p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor Principal con Imagen de Fondo (Igual que Registro) */
.login-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Usamos la misma imagen para dar continuidad */
  background-image: url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 20px;
}

/* Overlay oscuro para mejorar legibilidad */
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 0;
}

/* Tarjeta de Login */
.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 450px; /* Un poco más estrecho que el registro */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 1;
  text-align: center;
}

.header {
  margin-bottom: 2rem;
}

.title {
  color: var(--color-primary, #ff6600);
  font-weight: 800;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.subtitle {
  color: #666;
  font-size: 0.95rem;
}

/* Campos del Formulario */
.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
}

/* Wrapper para poner icono dentro del input */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #999;
  pointer-events: none; /* Para que el click pase al input */
}

.form-group input {
  width: 100%;
  padding: 12px 12px 12px 40px; /* Padding izquierdo extra para el icono */
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary, #ff6600);
  box-shadow: 0 0 0 3px rgba(255, 102, 0, 0.1); /* Efecto glow suave */
}

/* Botón Principal */
.btn-primary {
  width: 100%;
  padding: 12px;
  background: var(--color-primary, #ff6600);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.05rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.btn-primary:hover {
  filter: brightness(0.9);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* Enlaces del pie */
.footer-links {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
  color: #666;
}

.footer-links a {
  color: var(--color-primary, #ff6600);
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
}

.footer-links a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
  .title {
    font-size: 1.5rem;
  }
}
</style>
