<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">Aviso Legal</h1>
      <p class="intro">En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), se exponen a continuación los datos identificativos de la entidad:</p>

      <section>
        <h2>1. Datos Identificativos</h2>
        <ul class="data-list">
          <li><strong>Denominación Social:</strong> Tienda Deportiva (Proyecto Académico)</li>
          <li><strong>Domicilio Social:</strong> Carretera de San Vicente del Raspeig s/n, 03690 San Vicente del Raspeig, Alicante (Universidad de Alicante)</li>
          <li><strong>Email de contacto:</strong> tiendadeportiva@ua.es</li>
          <li><strong>Actividad:</strong> Práctica docente de la asignatura Ingeniería Web.</li>
        </ul>
      </section>

      <section>
        <h2>2. Objeto del sitio web</h2>
        <p>El presente sitio web ha sido creado con fines meramente educativos para la demostración de competencias en desarrollo web Full Stack (Vue.js + Spring Boot). Ningún producto ofertado es real ni se realizará ningún cobro efectivo.</p>
      </section>

      <section>
        <h2>3. Propiedad Intelectual</h2>
        <p>El código fuente, los diseños gráficos, las imágenes, las fotografías, los sonidos, las animaciones, el software, los textos, así como la información y los contenidos que se recogen en este sitio web están protegidos por la legislación española sobre los derechos de propiedad intelectual e industrial a favor de los autores del proyecto.</p>
      </section>

      <section>
        <h2>4. Exclusión de garantías y responsabilidad</h2>
        <p>Los autores no se hacen responsables, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.</p>
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
  font-weight: 600;
}

p, li {
  line-height: 1.8;
  color: #555;
  font-size: 1.05rem;
}

.data-list {
  list-style: none;
  padding: 0;
  background: #fff8f3;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #F97316;
}

.data-list li {
  margin-bottom: 0.5rem;
}

strong {
  color: #2c3e50;
}
</style>