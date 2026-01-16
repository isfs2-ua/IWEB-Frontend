<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  // Intentamos loguearnos
  const success = authStore.login(email.value, password.value)

  if (success) {
    // === LÓGICA DE REDIRECCIÓN MODIFICADA ===
    if (authStore.isAdmin) {
      console.log('Redirigiendo al panel de Admin...')
      router.push('/admin')
    } else {
      console.log('Redirigiendo a la Home...')
      router.push('/')
    }
  } else {
    error.value = 'Usuario o contraseña incorrectos. Prueba con admin@tienda.com'
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h1>{{ $t('login.welcome') }}</h1>
      <p class="subtitle">Introduce tus datos para acceder</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="ej: admin@tienda.com" required />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" v-model="password" placeholder="********" required />
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="btn-login">Iniciar Sesión</button>
      </form>

      <div class="footer-links">
        <p>¿No tienes cuenta? <RouterLink to="/register">Regístrate</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h1 {
  margin-bottom: 10px;
  color: #333;
}
.subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 0.9rem;
}

.form-group {
  text-align: left;
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 0.9rem;
}
.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-login {
  width: 100%;
  padding: 12px;
  background: var(--color-primary, #ff6b00);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-login:hover {
  background: #e65100;
}

.error-msg {
  color: #d32f2f;
  background: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.footer-links {
  margin-top: 20px;
  font-size: 0.9rem;
}
.footer-links a {
  color: var(--color-primary, #ff6b00);
  text-decoration: none;
  font-weight: 600;
}
.footer-links a:hover {
  text-decoration: underline;
}
</style>
