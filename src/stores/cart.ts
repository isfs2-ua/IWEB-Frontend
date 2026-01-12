import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '@/types'

export const useCartStore = defineStore('cart', () => {
  // Inicializamos con datos mockeados para replicar tu imagen "9. Carrito"
  const items = ref<CartItem[]>([
    {
      id: 101,
      producto_id: 50,
      nombre: 'Bicicleta montaña Scott Spark',
      marca: 'Scott',
      precio: 3999.95,
      precio_oferta: null,
      imagen: 'https://images.unsplash.com/photo-1576435728678-35d0160d0141?q=80&w=200', // Foto bici ejemplo
      cantidad: 1,
      talla: 'L', // Asumimos talla si aplica
    },
    {
      id: 102,
      producto_id: 51,
      nombre: 'Zapatillas Endura MT500 Burner Flat MTB negro',
      marca: 'Endura',
      precio: 170.0,
      precio_oferta: 105.9, // Oferta
      imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200', // Foto zapatilla ejemplo
      cantidad: 1,
      talla: '39',
    },
    {
      id: 103,
      producto_id: 52,
      nombre: 'Casco Abus AirBreaker blanco',
      marca: 'Abus',
      precio: 240.0,
      precio_oferta: 199.95, // Oferta
      imagen: 'https://images.unsplash.com/photo-1557166983-5939644443a0?q=80&w=200', // Foto casco ejemplo
      cantidad: 1,
      talla: 'M',
    },
  ])

  // --- GETTERS (Cálculos automáticos) ---

  const totalItems = computed(() => items.value.reduce((acc, item) => acc + item.cantidad, 0))

  const subtotal = computed(() => {
    return items.value.reduce((acc, item) => {
      const price = item.precio_oferta || item.precio
      return acc + price * item.cantidad
    }, 0)
  })

  const shippingCost = computed(() => (subtotal.value > 49 ? 0 : 5.95))

  const total = computed(() => subtotal.value + shippingCost.value)

  // --- ACTIONS (Funciones para modificar el carrito) ---

  function addItem(product: Product, size?: string) {
    const existingItem = items.value.find((i) => i.producto_id === product.id && i.talla === size)

    if (existingItem) {
      existingItem.cantidad++
    } else {
      items.value.push({
        id: Date.now(), // ID temporal
        producto_id: product.id,
        nombre: product.nombre,
        marca: product.marca,
        precio: product.precio,
        precio_oferta: product.precio_oferta,
        imagen: product.media?.[0]?.url || '',
        cantidad: 1,
        talla: size,
      })
    }
  }

  function removeItem(itemId: number) {
    items.value = items.value.filter((i) => i.id !== itemId)
  }

  function updateQuantity(itemId: number, change: number) {
    const item = items.value.find((i) => i.id === itemId)
    if (item) {
      const newQty = item.cantidad + change
      if (newQty > 0) item.cantidad = newQty
    }
  }

  return { items, totalItems, subtotal, shippingCost, total, addItem, removeItem, updateQuantity }
})
