import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types'
import api from '@/api/axios'

export const useProductStore = defineStore('products', () => {
  const allProducts = ref<Product[]>([])

  const fetchProducts = async () => {
    try {
      // OBTENEMOS LA CLAVE DEL ENTORNO
      const apiKey = import.meta.env.VITE_API_KEY

      // FORZAMOS LA CABECERA AQUÍ
      // Al pasar 'Authorization' manualmente, el interceptor de axios (Paso 1)
      // verá que ya existe y no pondrá el Bearer token.
      const response = await api.get<Product[]>('/productos', {
        headers: {
          Authorization: `Api-Key ${apiKey}`,
        },
      })

      allProducts.value = response.data
    } catch (error) {
      console.error('Error al cargar productos:', error)
    }
  }

  const getProductById = (id: number) => {
    return allProducts.value.find((p) => p.id === id)
  }

  return { allProducts, fetchProducts, getProductById }
})
