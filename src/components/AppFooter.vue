<script setup lang="ts">
  import { useI18n } from 'vue-i18n';

  // Obtenemos el objeto 'locale' que controla el idioma actual
  const { locale } = useI18n();

  // Función para cambiar el idioma
  const changeLanguage = (lang: string) => {
    // Solo cambiamos si es distinto al actual (como pediste)
    if (locale.value !== lang) {
      locale.value = lang;
      // Opcional: Guardar en localStorage para recordar la elección
      localStorage.setItem('user-locale', lang);
    }
  };
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-col">
          <h4>{{ $t('footer.about') }}</h4>
          <ul>
            <li><RouterLink to="/about">{{ $t('footer.who_we_are') }}</RouterLink></li>
            <li><RouterLink to="/stores">{{ $t('footer.stores') }}</RouterLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{{ $t('footer.guarantees') }}</h4>
          <ul>
            <li><RouterLink to="/returns">{{ $t('footer.returns') }}</RouterLink></li>
            <li><RouterLink to="/secure-purchase">{{ $t('footer.secure_purchase') }}</RouterLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{{ $t('footer.customer_support') }}</h4>
          <ul>
            <li><RouterLink to="/help">{{ $t('footer.help') }}</RouterLink></li>
            <li><RouterLink to="/invoices">{{ $t('footer.invoices') }}</RouterLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{{ $t('footer.language') }}</h4>
          <div class="language-selector">
  <button 
    @click="changeLanguage('es')" 
    :class="{ 'active': locale === 'es' }"
    title="Cambiar a Español"
  >
    ES 🇪🇸
  </button>
  
  <span> | </span>

  <button 
    @click="changeLanguage('en')" 
    :class="{ 'active': locale === 'en' }"
    title="Switch to English"
  >
    EN 🇬🇧
  </button>
</div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="legal-links">
          <RouterLink to="/legal-advice">{{ $t('footer.legal') }}</RouterLink>
          <RouterLink to="/privacy">{{ $t('footer.privacy') }}</RouterLink>
          <RouterLink to="/cookies">{{ $t('footer.cookies') }}</RouterLink>
        </div>
        <div class="copyright">© 2025-2028, Tienda Deportiva</div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: white;
  padding: 40px 0 20px;
  border-top: 1px solid #e0e0e0;
  margin-top: auto;
  font-family: Arial, sans-serif; 
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 40px;
}

.footer-col h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 15px;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col li {
  margin-bottom: 8px;
}

.footer-col a {
  text-decoration: none;
  color: #333;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.footer-col a:hover {
  text-decoration: underline;
}

.languages li {
  display: flex;
  align-items: center;
}

.flag {
  margin-right: 8px;
  font-size: 1.2rem;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
}

.legal-links {
  margin-bottom: 15px;
}

.legal-links a {
  text-decoration: none;
  color: #333;
  font-size: 0.85rem;
  margin: 0 15px;
}

.legal-links a:hover {
  text-decoration: underline;
}

.copyright {
  font-size: 0.8rem;
  color: #666;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
  }
}
</style>
