import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile } from '@/types'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  // Función auxiliar para cargar los datos del usuario usando el token actual
  async function fetchCurrentUser() {
    try {
      // 1. Pedimos los datos personales básicos (UsuarioController)
      const profileRes = await api.get('/usuarios/perfil')
      
      // 2. Pedimos los formularios/preferencias (PerfilController)
      // Nota: El backend devuelve una lista, el tipo UserProfile espera 'formularios'
      const formsRes = await api.get('/perfiles')

      // 3. Combinamos todo en el estado del usuario
      user.value = {
        ...profileRes.data,      // nombre, apellidos, email, username, etc.
        formularios: formsRes.data, // Array de preferencias
        direcciones: []          // Inicializamos vacío o podrías hacer otro fetch a /direcciones
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error)
      logout() // Si falla (ej. token expirado), cerramos sesión
    }
  }

  async function login(email: string, password: string) {
    try {
      // El backend devuelve: { token, usuarioId, email, telefono, rol }
      const response = await api.post('/auth/login', { email, password })
      
      const { token: newToken } = response.data

      // Guardamos el token
      token.value = newToken
      localStorage.setItem('token', newToken)

      // AHORA cargamos los datos completos del perfil
      await fetchCurrentUser()

      return true
    } catch (error) {
      console.error('Error en login:', error)
      return false
    }
  }

  async function updateProfile(profileData: any) {
    try {
      // El backend espera: { username, email, nombre, apellidos, telefono, fechaNacimiento }
      await api.put('/usuarios/perfil', profileData)
      
      // Si sale bien, refrescamos los datos del usuario localmente
      await fetchCurrentUser()
      return true
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      return false
    }
  }

  async function register(payload: any) {
    try {
      // El backend devuelve: { token, usuarioId, email... }
      const response = await api.post('/auth/register', payload)

      const { token: newToken } = response.data

      // Guardamos el token
      token.value = newToken
      localStorage.setItem('token', newToken)

      // Cargamos los datos completos tras el registro
      await fetchCurrentUser()

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
  }

  // Opcional: Si recargas la página, intentar recuperar el usuario si hay token
  if (token.value) {
    fetchCurrentUser()
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    try {
      await api.put('/usuarios/password', {
        currentPassword,
        newPassword
      })
      return { success: true }
    } catch (error: any) {
      console.error('Error cambiando password:', error)
      // Devolvemos el mensaje de error del backend si existe
      const msg = error.response?.data?.message || 'Error al cambiar la contraseña'
      return { success: false, message: msg }
    }
  }

  return { user, token, isAuthenticated, login, logout, register, fetchCurrentUser, updateProfile, changePassword }
})