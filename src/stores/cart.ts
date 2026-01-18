import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios'
import type { CartItem } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  // --- GETTERS ---
  const totalItems = computed(() => items.value.reduce((acc, item) => acc + item.cantidad, 0))

  const subtotal = computed(() => {
    return items.value.reduce((acc, item) => {
      const p = item.precio_oferta || item.precio
      return acc + p * item.cantidad
    }, 0)
  })

  const shippingCost = computed(() => (subtotal.value > 49 || subtotal.value === 0 ? 0 : 5.95))
  const total = computed(() => subtotal.value + shippingCost.value)

  // --- ACTIONS ---

  // 1. Fetch
  async function fetchCart() {
    try {
      const { data } = await api.get('/carrito')

      const normalizePrice = (val: any): number => {
        if (val === null || val === undefined) return 0
        if (typeof val === 'number') return val
        if (typeof val === 'string') return parseFloat(val)
        if (typeof val === 'object' && val.parsedValue) return Number(val.parsedValue)
        return 0
      }

      items.value = data.items.map((backendItem: any) => {
        const v = backendItem.variante
        const p = v.producto

        // Precio base
        const rawPrice = v.precio !== null && v.precio !== undefined ? v.precio : p.precio

        return {
          id: backendItem.id,
          producto_id: p.id,
          nombre: p.nombre,
          marca: p.marca,
          precio: normalizePrice(rawPrice),
          precio_oferta: p.precioOferta ? normalizePrice(p.precioOferta) : null,
          imagen: p.media && p.media.length > 0 ? p.media[0].url : '',
          cantidad: backendItem.cantidad,
          talla: v.talla,
          color: v.color,
          sku: v.sku,
        } as CartItem
      })
    } catch (error) {
      console.error('Error cargando carrito:', error)
      items.value = []
    }
  }

  // 2. Add
  async function addItem(varianteId: number, cantidad: number) {
    await api.post('/carrito/items', { varianteId, cantidad })
    await fetchCart()
  }

  // 3. Remove (AQUÍ ESTÁ LA SOLUCIÓN A TU ERROR)
  async function removeItem(itemId: number) {
    try {
      // Llamamos al nuevo endpoint DELETE del backend
      await api.delete(`/carrito/items/${itemId}`)
      // Refrescamos la lista
      await fetchCart()
    } catch (error) {
      console.error('Error eliminando item:', error)
    }
  }

  // 4. Update Quantity (AQUÍ ESTÁ LA SOLUCIÓN A TU ERROR)
  async function updateQuantity(itemId: number, change: number) {
    const item = items.value.find((i) => i.id === itemId)
    if (!item) return

    const newQty = item.cantidad + change
    if (newQty < 1) return // No permitimos bajar de 1 (para eso está borrar)

    try {
      // Llamamos al nuevo endpoint PUT del backend
      // PUT /api/carrito/items/{id}?cantidad={newQty}
      await api.put(`/carrito/items/${itemId}`, null, {
        params: { cantidad: newQty },
      })
      await fetchCart()
    } catch (error) {
      console.error('Error actualizando cantidad:', error)
      // Si falla (ej: sin stock), podrías mostrar una notificación
    }
  }

  async function clearCart() {
    await api.delete('/carrito')
    items.value = []
  }

  async function changeItemVariant(itemId: number, newVariantId: number) {
    try {
      // PUT /api/carrito/items/{id}/variante?nuevaVarianteId={id}
      await api.put(`/carrito/items/${itemId}/variante`, null, {
        params: { nuevaVarianteId: newVariantId },
      })
      await fetchCart() // Recargar carrito para ver cambios (fusión de items, etc)
    } catch (error) {
      console.error('Error cambiando variante:', error)
      throw error // Lanzar para que la vista muestre notificación si falla
    }
  }

  // EXPORTAMOS TODO (Asegúrate de que updateQuantity esté aquí dentro)
  return {
    items,
    totalItems,
    subtotal,
    shippingCost,
    total,
    fetchCart,
    addItem,
    removeItem, // <--- Importante
    updateQuantity, // <--- Importante
    changeItemVariant,
    clearCart,
  }
})
