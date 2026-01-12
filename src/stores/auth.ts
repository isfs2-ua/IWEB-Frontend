import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // Estado: Usamos la interfaz completa
  const user = ref<UserProfile | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  function login(email: string, password: string) {
    console.log(`Login con ${email}`)

    // SIMULAMOS DATOS DE PERFIL COMPLETOS (Como en el mockup)
    user.value = {
      username: 'Pepito',
      email: email, // Usamos el que introdujo
      nombre: 'Pepe',
      apellidos: 'Ramírez González',
      telefono: '696 96 96 96',
      fechaNacimiento: '2001-01-01',
      formularios: [
        {
          id: 1,
          alias: 'Principal',
          genero: 'Hombre',
          talla: 'L',
          tallaPie: '44',
          intereses: ['Tenis'],
        },
      ],
      direcciones: [
        {
          id: 1,
          nombreCompleto: 'Pepito Ramírez González',
          telefono: '696 96 96 96',
          calle: 'C/ Pepito, nº 10, 3º B',
          ciudad: 'San Vicente del Raspeig',
          codigoPostal: '03690',
          provincia: 'Alicante',
          pais: 'España',
          esPrincipal: true,
        },
      ],
    }
    return true
  }

  function logout() {
    user.value = null
  }

  return { user, isAuthenticated, login, logout }
})
