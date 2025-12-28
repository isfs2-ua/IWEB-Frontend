<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router' // Importar useRoute
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const route = useRoute() // Obtenemos la ruta actual
</script>

<template>
  <div class="app-layout">
    <AppHeader v-if="!route.meta.hideLayout" />

    <main class="main-content">
      <RouterView />
    </main>

    <AppFooter v-if="!route.meta.hideLayout" />
  </div>
</template>

<style>
@import './assets/base.css';

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex: 1;
}
</style>
