import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile, AuthResponse } from '@/types'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  // Login (se mantiene igual)
  async function login(email: string, password: string) {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password })
      const { token: newToken, user: userData } = response.data

      token.value = newToken
      localStorage.setItem('token', newToken)
      user.value = userData
      return true
    } catch (error) {
      console.error('Error en login:', error)
      return false
    }
  }

  // Registro Completo (Guiado)
  // Aceptamos un objeto 'payload' que coincida con lo que espera tu Backend
  // para crear Usuario + Perfil + Preferencias
  async function register(payload: any) {
    try {
      // Ajusta '/auth/register' si tu endpoint es distinto
      const response = await api.post<AuthResponse>('/auth/register', payload)

      const { token: newToken, user: userData } = response.data

      // Auto-login tras registro
      token.value = newToken
      localStorage.setItem('token', newToken)
      user.value = userData

      return true
    } catch (error) {
      console.error('Error en registro:', error)
      return false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return { user, token, isAuthenticated, login, logout, register }
})
