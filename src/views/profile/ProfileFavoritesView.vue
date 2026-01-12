<script setup lang="ts">
import { computed } from 'vue'
import ProfileSidebar from '@/components/ProfileSidebar.vue'
import FavoriteCard from '@/components/FavoriteCard.vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useProductStore } from '@/stores/products'

const wishlistStore = useWishlistStore()
const productStore = useProductStore()

// Obtenemos los objetos completos de producto basándonos en los IDs guardados
const favoriteProducts = computed(() => {
  return wishlistStore.favoriteIds
    .map((id) => productStore.getProductById(id))
    .filter((p) => p !== undefined) // Filtramos por si algún producto fue borrado
})
</script>

<template>
  <div class="container profile-layout">
    <ProfileSidebar />

    <div class="profile-content">
      <h1 class="page-title">Favoritos</h1>

      <div v-if="favoriteProducts.length > 0" class="favorites-grid">
        <FavoriteCard v-for="product in favoriteProducts" :key="product!.id" :product="product!" />
      </div>

      <div v-else class="empty-state">
        <p>No tienes artículos en tu lista de deseos.</p>
        <RouterLink to="/" class="btn-link">Explorar productos</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}
.profile-layout {
  display: flex;
  gap: 60px;
  align-items: flex-start;
}
.profile-content {
  flex: 1;
}
.page-title {
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: #333;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 50px;
  background: #f9f9f9;
  border-radius: 8px;
  color: #666;
}
.btn-link {
  color: var(--color-primary);
  text-decoration: underline;
  font-weight: bold;
}

@media (max-width: 768px) {
  .profile-layout {
    flex-direction: column;
  }
}
</style>
