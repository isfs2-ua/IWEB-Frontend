<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleSubmit = () => {
  if (email.value && password.value) {
    // Llamamos a la acción de Pinia
    authStore.login(email.value, password.value)

    // Redirigimos al usuario a la Home después de loguearse
    router.push('/')
  } else {
    alert('Por favor, rellena todos los campos')
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">Inicia sesión</h2>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input type="email" id="email" v-model="email" placeholder="Tu email" required />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder=".........."
            required
          />
        </div>

        <button type="submit" class="btn-primary login-btn">Iniciar sesión</button>
      </form>

      <div class="footer-text">
        ¿Todavía no tienes cuenta? <RouterLink to="/register">Regístrate</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Fondo oscuro con imagen de deporte */
  background-image: url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  position: relative;
}

/* Capa oscura superpuesta para asegurar contraste si la imagen es muy clara */
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Oscurece el fondo un 50% */
  z-index: 0;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px; /* Bordes redondeados */
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 1; /* Para estar encima de la capa oscura */
  text-align: center;
}

.title {
  color: var(--color-primary);
  font-weight: 800;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text-main);
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px; /* Inputs ligeramente cuadrados como en el mockup */
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.login-btn {
  width: 100%;
  margin-top: 1rem;
  font-size: 1rem;
  padding: 12px;
}

.footer-text {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.footer-text a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}

.footer-text a:hover {
  text-decoration: underline;
}
</style>
