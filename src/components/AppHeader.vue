<script setup lang="ts">
import { ref } from 'vue'

// Simulamos una cantidad en el carrito para que se vea el círculo rojo
const cartCount = ref(3)
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="top-bar">
        <div class="logo-container">
          <span class="logo-text-dark">Tienda</span>
          <span class="logo-text-primary">Deportiva</span>
          <div class="logo-icon"></div>
        </div>

        <div class="search-bar-container">
          <div class="search-input-wrapper">
            <span class="search-icon">
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
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input type="text" placeholder="¿Qué buscas?" class="search-input" />
          </div>
        </div>

        <div class="user-actions">
          <button class="icon-btn" title="Mi Cuenta">
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
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
          <li><a href="#">Running</a></li>
          <li><a href="#">Ciclismo</a></li>
          <li><a href="#">Fútbol</a></li>
          <li><a href="#">Baloncesto</a></li>
          <li><a href="#">Tenis</a></li>
          <li><a href="#">Natación</a></li>
          <li><a href="#">Más deportes</a></li>
          <li><a href="#">Nutrición y recuperación</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: white;
  padding-top: 15px;
  /* Una sombra sutil para separarlo del contenido */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* --- TOP BAR --- */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  gap: 20px; /* Espacio entre logo, buscador y acciones */
}

/* Logo */
.logo-container {
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  position: relative;
  min-width: 180px; /* Para asegurar que no se aplaste */
}
.logo-text-dark {
  color: #000;
  margin-right: 4px;
}
.logo-text-primary {
  color: var(--color-primary); /* Usamos el naranja definido en base.css */
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

/* Buscador */
.search-bar-container {
  flex-grow: 1; /* Ocupa todo el espacio disponible */
  max-width: 600px; /* Pero no más de 600px */
}
.search-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 50px; /* Bordes muy redondos (pill shape) */
  padding: 8px 15px;
  background: #fff;
  transition: border-color 0.3s;
}
.search-input-wrapper:focus-within {
  border-color: var(--color-primary);
}
.search-icon {
  color: #888;
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.95rem;
  color: #333;
}

/* Iconos de Usuario */
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
.cart-btn {
  position: relative;
}
.badge {
  position: absolute;
  top: -2px;
  right: -5px;
  background-color: #dc3545; /* Rojo alerta */
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid white; /* Pequeño borde blanco para separar del icono */
}

/* --- NAV BAR (Fila inferior) --- */
.nav-bar {
  border-top: 1px solid #f0f0f0; /* Línea sutil separadora */
}
.nav-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 25px;
  overflow-x: auto; /* Por si en pantallas pequeñas no cabe todo */
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
.nav-list a:hover {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary); /* Efecto de subrayado al pasar el mouse */
  padding-bottom: 13px; /* Ajuste para que el borde no mueva el texto */
}
</style>
