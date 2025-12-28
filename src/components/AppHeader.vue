<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router' // Importamos useRouter
import { useAuthStore } from '@/stores/auth' // Importamos el store
import SearchBar from './SearchBar.vue'

const authStore = useAuthStore()
const router = useRouter()
const cartCount = ref(3)

// Lógica del botón de usuario
const handleUserClick = () => {
  if (authStore.isAuthenticated) {
    // Si ya está logueado, vamos a su perfil
    router.push('/profile')
  } else {
    // Si NO está logueado, vamos al login
    router.push('/login')
  }
}

// Lógica del botón de cerrar sesión
const handleLogout = () => {
  authStore.logout()
  // Redirigimos a la home y forzamos recarga visual
  router.push('/')
}
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="top-bar">
        <div class="logo-container">
          <RouterLink to="/" class="logo-link">
            <span class="logo-text-dark">Tienda</span>
            <span class="logo-text-primary">Deportiva</span>
            <div class="logo-icon"></div>
          </RouterLink>
        </div>

        <div class="search-bar-container">
          <SearchBar />
        </div>

        <div class="user-actions">
          <button
            class="icon-btn"
            @click="handleUserClick"
            :title="authStore.isAuthenticated ? 'Ir a mi perfil' : 'Iniciar sesión'"
          >
            <svg
              v-if="authStore.isAuthenticated"
              class="user-icon-active"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
          </button>

          <button
            v-if="authStore.isAuthenticated"
            class="icon-btn logout-btn"
            @click="handleLogout"
            title="Cerrar sesión"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>

          <button class="icon-btn" title="Favoritos">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              ></path>
            </svg>
          </button>

          <button class="icon-btn cart-btn" title="Carrito">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
          </button>
        </div>
      </div>

      <nav class="nav-bar">
        <ul class="nav-list">
          <li><RouterLink to="/category/running">Running</RouterLink></li>
          <li><RouterLink to="/category/ciclismo">Ciclismo</RouterLink></li>
          <li><RouterLink to="/category/futbol">Fútbol</RouterLink></li>
          <li><RouterLink to="/category/baloncesto">Baloncesto</RouterLink></li>
          <li><RouterLink to="/category/tenis">Tenis</RouterLink></li>
          <li><RouterLink to="/category/natacion">Natación</RouterLink></li>
          <li><a href="#">Más deportes</a></li>
          <li><a href="#">Nutrición y recuperación</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* Estilos anteriores se mantienen igual... */
.header {
  background: white;
  padding-top: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  gap: 20px;
}

/* Logo Styles */
.logo-container {
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  position: relative;
  min-width: 180px;
}
.logo-link {
  text-decoration: none;
  display: flex;
  align-items: center;
}
.logo-text-dark {
  color: #000;
  margin-right: 4px;
}
.logo-text-primary {
  color: var(--color-primary);
}
.logo-icon {
  width: 20px;
  height: 20px;
  background: radial-gradient(circle at 30% 30%, #fffeb8, #ffc107);
  border-radius: 50%;
  margin-left: -5px;
  margin-top: -15px;
  z-index: -1;
}

.search-bar-container {
  flex-grow: 1;
  max-width: 600px;
}

/* User Actions Styles */
.user-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #333;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}
.icon-btn:hover {
  color: var(--color-primary);
}

/* CLASE NUEVA: Icono activo en Naranja */
.user-icon-active {
  color: var(--color-primary); /* Se pinta de naranja */
  stroke-width: 2.5px; /* Un poco más gordito como en tu imagen */
}

.cart-btn {
  position: relative;
}
.badge {
  position: absolute;
  top: -2px;
  right: -5px;
  background-color: #dc3545;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid white;
}

/* Nav Bar Styles */
.nav-bar {
  border-top: 1px solid #f0f0f0;
}
.nav-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 25px;
  overflow-x: auto;
}
.nav-list li {
  padding: 15px 0;
}
.nav-list a {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
  white-space: nowrap;
  transition: color 0.2s;
}
.nav-list a:hover,
.nav-list a.router-link-active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 13px;
}
</style>
