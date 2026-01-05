import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import SearchView from '../views/SearchView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { hideLayout: true }, // <--- ¡Importante!
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { hideLayout: true }, // Importante: Sin Header/Footer
    },
    {
      path: '/profile',
      name: 'profile',
      // Por ahora reutilizamos el Home o creas un componente vacío
      component: HomeView,
      meta: { requiresAuth: true }, // Esto nos servirá luego para proteger la ruta
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: ProductDetailView,
    },
    {
      path: '/category/:categoryName',
      name: 'category',
      // Por ahora reutilizamos la vista de búsqueda, ya que es muy parecida (lista de productos)
      component: SearchView,
    },
  ],
})

export default router
