import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  // Inicializamos con algunos IDs para probar visualmente (1 y 2)
  const favoriteIds = ref<number[]>([1, 2])

  // Acción para añadir/quitar
  const toggleWishlist = (productId: number) => {
    const index = favoriteIds.value.indexOf(productId)
    if (index === -1) {
      favoriteIds.value.push(productId)
    } else {
      favoriteIds.value.splice(index, 1)
    }
  }

  // Comprobar si está en favoritos
  const isInWishlist = (productId: number) => {
    return favoriteIds.value.includes(productId)
  }

  return { favoriteIds, toggleWishlist, isInWishlist }
})
