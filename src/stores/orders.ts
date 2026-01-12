import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order } from '@/types'

export const useOrderStore = defineStore('orders', () => {
  // Datos Mock basados en tu imagen
  const orders = ref<Order[]>([
    {
      id: 1,
      numero_pedido: '983247498234',
      fecha: '2026-01-10', // Formato estándar para facilitar filtrado
      total: 59.99,
      estado: 'Entregado',
      items: [
        {
          id: 101,
          producto_id: 1,
          nombre: 'Pantalón Largo Hombre Running Nike Dri-FIT Challenger',
          precio: 59.99,
          cantidad: 1,
          imagen: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=200',
        },
      ],
    },
    {
      id: 2,
      numero_pedido: '095848095439',
      fecha: '2026-01-05',
      total: 59.99,
      estado: 'Entregado',
      items: [
        {
          id: 102,
          producto_id: 1, // Reutilizamos el mismo producto como en el ejemplo
          nombre: 'Pantalón Largo Hombre Running Nike Dri-FIT Challenger',
          precio: 59.99,
          cantidad: 1,
          imagen: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=200',
        },
      ],
    },
  ])

  return { orders }
})
