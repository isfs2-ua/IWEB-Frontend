import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile, AuthResponse } from '@/types' // Importamos AuthResponse
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
  // Estado: Usamos la interfaz completa
  const user = ref<UserProfile | null>(null)

  const token = ref<string | null>(localStorage.getItem('token')) // Gestionamos el token

  const isAuthenticated = computed(() => !!token.value) // La autenticación depende del token

  async function login(email: string, password: string) {
    try {
      // Indicamos a TypeScript que esperamos un AuthResponse (Usuario + Token)
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      })

      // Extraemos el token y el resto de datos del usuario
      const { token: newToken, ...userData } = response.data

      // 1. Guardamos el token
      token.value = newToken
      localStorage.setItem('token', newToken)

      // 2. Guardamos los datos del usuario
      user.value = userData

      // Configurar el header por defecto para futuras peticiones
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

      return true
    } catch (error) {
      console.error('Error en login:', error)
      return false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }

  return { user, isAuthenticated, login, logout }
})
