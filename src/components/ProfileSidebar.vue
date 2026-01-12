<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Función auxiliar para saber si el link está activo
const isActive = (path: string) => route.path === path

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <aside class="profile-sidebar">
    <nav>
      <ul>
        <li>
          <RouterLink to="/profile" :class="{ active: isActive('/profile') }">
            Mis Datos
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/profile/orders" :class="{ active: isActive('/profile/orders') }">
            Mis pedidos
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/profile/favorites" :class="{ active: isActive('/profile/favorites') }">
            Favoritos
          </RouterLink>
        </li>

        <li>
          <button @click="handleLogout" class="logout-link">Cerrar sesión</button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.profile-sidebar {
  width: 250px;
  flex-shrink: 0;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  border-left: 2px solid #eee; /* Línea gris vertical base */
}

li {
  margin-bottom: 0;
}

a,
.logout-link {
  display: block;
  padding: 12px 20px;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  border-left: 3px solid transparent; /* Borde invisible por defecto */
  margin-left: -2px; /* Para superponerse a la línea gris */
  transition: all 0.2s;
  background: none;
  border: none;
  font-size: 1rem;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
}

a:hover,
.logout-link:hover {
  color: var(--color-primary);
  background-color: #fafafa;
}

/* Estado Activo (Como en el mockup) */
a.active {
  color: var(--color-primary); /* Texto naranja */
  border-left-color: var(--color-primary); /* Línea naranja a la izquierda */
  font-weight: 700;
}
</style>
