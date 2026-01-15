import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // IMPORTANTE: Esta propiedad comprueba si el usuario tiene el flag isAdmin en true
  const isAdmin = computed(() => !!user.value?.isAdmin)

  function login(email: string, password: string) {
    // CASO 1: LOGIN COMO ADMINISTRADOR
    if (email === 'admin@tienda.com') {
      console.log('👑 Login como ADMIN (Store)')
      user.value = {
        username: 'AdminMaster',
        email: 'admin@tienda.com',
        nombre: 'Super',
        apellidos: 'Administrador',
        telefono: '000 00 00 00',
        fechaNacimiento: '1990-01-01',
        isAdmin: true, // <--- ¡ESTO ES CRUCIAL! Tiene que ser TRUE
        formularios: [],
        direcciones: [],
      }
    }
    // CASO 2: LOGIN COMO USUARIO NORMAL
    else {
      console.log('👤 Login como USUARIO (Store)')
      user.value = {
        username: 'Pepito',
        email: email,
        nombre: 'Pepe',
        apellidos: 'Ramírez González',
        telefono: '696 96 96 96',
        fechaNacimiento: '2001-01-01',
        isAdmin: false, // <--- Usuario normal es FALSE
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
    }
    return true
  }

  function logout() {
    user.value = null
  }

  return { user, isAuthenticated, isAdmin, login, logout }
})
