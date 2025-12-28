<script setup lang="ts">
// No necesitamos lógica compleja por ahora
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-col">
          <h4>Sobre Tienda Deportiva</h4>
          <ul>
            <li><a href="#">Quiénes somos</a></li>
            <li><a href="#">Tienda</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Garantías</h4>
          <ul>
            <li><a href="#">Devoluciones</a></li>
            <li><a href="#">Compra segura</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Atención al cliente</h4>
          <ul>
            <li><a href="#">Ayuda</a></li>
            <li><a href="#">Facturas</a></li>
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
          <a href="#">Aviso legal</a>
          <a href="#">Política de privacidad</a>
          <a href="#">Política de Cookies</a>
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
  border-top: 1px solid #e0e0e0; /* La línea gris del mockup */
  margin-top: auto; /* Para que siempre se empuje al fondo si hay poco contenido */
  font-family: Arial, sans-serif; /* O la fuente que uses globalmente */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* --- Footer Top --- */
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

/* Estilos específicos para banderas */
.languages li {
  display: flex;
  align-items: center;
}
.flag {
  margin-right: 8px;
  font-size: 1.2rem;
}

/* --- Footer Bottom --- */
.footer-bottom {
  text-align: center;
  padding-top: 20px;
  /* Opcional: otra línea sutil si quisieras separar legal del resto,
     pero en el mockup parece todo un bloque limpio */
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
