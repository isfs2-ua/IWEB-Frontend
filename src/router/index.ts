import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import SearchView from '../views/SearchView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import ProfileDataView from '@/views/profile/ProfileDataView.vue'
import CheckoutCallbackView from '../views/CheckoutCallbackView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },

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
      meta: { hideLayout: true },
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
      component: ProfileDataView,
      meta: { requiresAuth: true }, // Esto nos sirve para proteger la ruta
    },
    {
      path: '/profile/orders',
      name: 'profile-orders',
      component: () => import('../views/profile/ProfileOrdersView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/favorites',
      name: 'profile-favorites',
      component: () => import('../views/profile/ProfileFavoritesView.vue'),
      // meta: { requiresAuth: true }
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
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      // No ponemos 'requiresAuth' porque el propio componente maneja el caso de usuario no logueado en el Paso 1
    },
    {
      path: '/checkout/callback',
      name: 'checkout-callback',
      component: CheckoutCallbackView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }, // Para el futuro
    },
    {
      path: '/legal-advice',
      name: 'legal',
      component: () => import('../views/footer/LegalView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/footer/PrivacyView.vue'),
    },
    {
      path: '/returns',
      name: 'returns',
      component: () => import('../views/footer/ReturnsView.vue'),
    },
    {
      path: '/cookies',
      name: 'cookies',
      component: () => import('../views/footer/CookiesView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/footer/AboutView.vue'),
    },
    {
      path: '/stores',
      name: 'stores',
      component: () => import('../views/footer/StoresView.vue'),
    },
    {
      path: '/secure-purchase',
      name: 'secure-purchase',
      component: () => import('../views/footer/SecurePucharseView.vue'),
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/footer/HelpView.vue'),
    },
    {
      path: '/invoices',
      name: 'invoices',
      component: () => import('../views/footer/InvoicesView.vue'),
    },
  ],
})

export default router
