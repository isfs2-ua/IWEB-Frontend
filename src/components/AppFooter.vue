<script setup lang="ts">

</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-col">
          <h4>Sobre Tienda Deportiva</h4>
          <ul>
            <li><RouterLink to="/about">Quiénes somos</RouterLink></li>
            <li><RouterLink to="/stores">Tienda</RouterLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Garantías</h4>
          <ul>
            <li><RouterLink to="/returns">Devoluciones</RouterLink></li>
            <li><RouterLink to="/secure-purchase">Compra segura</RouterLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Atención al cliente</h4>
          <ul>
            <li><RouterLink to="/help">Ayuda</RouterLink></li>
            <li><RouterLink to="/invoices">Facturas</RouterLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Tienda Deportiva en</h4>
          <ul class="languages">
            <li>
              <a href="#"> <span class="flag">🇪🇸</span> Español </a>
            </li>
            <li>
              <a href="#"> <span class="flag">🇬🇧</span> Inglés </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="legal-links">
          <RouterLink to="/legal-advice">Aviso legal</RouterLink>
          <RouterLink to="/privacy">Política de privacidad</RouterLink>
          <RouterLink to="/cookies">Política de Cookies</RouterLink>
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
