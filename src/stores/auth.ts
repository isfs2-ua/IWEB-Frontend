import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Estado: ¿Hay un usuario logueado?
  const user = ref<{ email: string; name: string } | null>(null)

  // Getter: ¿Está autenticado?
  const isAuthenticated = computed(() => !!user.value)

  // Acción: Iniciar sesión (Simulado)
  function login(email: string, password: string) {
    // Aquí conectaríamos con tu Backend real
    console.log(`Intentando login con ${email} y ${password}`)

    // Simulamos éxito
    user.value = { email, name: 'Usuario Deportivo' }
    return true
  }

  // Acción: Cerrar sesión
  function logout() {
    user.value = null
  }

  return { user, isAuthenticated, login, logout }
})
