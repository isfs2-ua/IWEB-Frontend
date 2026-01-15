<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">Política de Cookies</h1>
      <p class="intro">
        En Tienda Deportiva utilizamos cookies propias y de terceros para mejorar la experiencia de navegación, 
        gestionar el contenido de tu carrito y permitir el acceso a áreas privadas.
      </p>

      <section>
        <h2>1. ¿Qué es una cookie?</h2>
        <p>
          Una cookie es un pequeño fichero de texto que se almacena en tu navegador cuando visitas casi cualquier página web. 
          Su utilidad es que la web sea capaz de recordar tu visita cuando vuelvas a navegar por esa página.
        </p>
      </section>

      <section>
        <h2>2. Cookies que utiliza esta web</h2>
        <p>Siguiendo las directrices de la Agencia Española de Protección de Datos, detallamos el uso de cookies que hace esta web:</p>
        
        <div class="cookie-type">
          <h3>🍪 Cookies Técnicas (Necesarias)</h3>
          <p>Son aquellas esenciales para el funcionamiento de la web. En nuestro caso, las utilizamos para:</p>
          <ul class="check-list">
            <li>Mantener tu sesión abierta (Login).</li>
            <li>Recordar los productos que has añadido al carrito.</li>
            <li>Gestionar la seguridad durante la navegación.</li>
          </ul>
        </div>

        <div class="cookie-type">
          <h3>📊 Cookies de Análisis</h3>
          <p>
            Al tratarse de un proyecto académico, no utilizamos herramientas de rastreo real como Google Analytics, 
            aunque en un entorno de producción real se usarían para cuantificar el número de usuarios y realizar 
            la medición y análisis estadístico.
          </p>
        </div>
      </section>

      <section>
        <h2>3. Desactivación o eliminación</h2>
        <p>
          En cualquier momento puedes ejercer tu derecho de desactivación o eliminación de cookies de este sitio web. 
          Estas acciones se realizan de forma diferente en función del navegador que estés usando (Chrome, Firefox, Safari, etc.).
        </p>
      </section>

      <section>
        <h2>4. Notas adicionales</h2>
        <p class="warning-box">
          Este sitio web es un <strong>proyecto académico</strong>. No se recogen datos de navegación con fines comerciales ni publicitarios.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.legal-container {
  min-height: 80vh;
  padding: 4rem 2rem;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
}

.legal-content {
  max-width: 900px;
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.text-orange {
  color: #F97316;
  font-weight: 800;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  border-bottom: 3px solid #F97316;
  display: inline-block;
  padding-bottom: 0.5rem;
}

h2 {
  color: #333;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

h3 {
  color: #F97316;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

p, li {
  line-height: 1.8;
  color: #555;
  font-size: 1.05rem;
}

.cookie-type {
  background-color: #fff8f3;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #F97316;
}

.check-list {
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
}

.check-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.check-list li::before {
  content: "✔";
  color: #F97316;
  position: absolute;
  left: 0;
  font-weight: bold;
}

.warning-box {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
}
</style>