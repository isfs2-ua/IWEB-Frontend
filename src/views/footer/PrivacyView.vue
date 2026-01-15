<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">Política de Privacidad</h1>
      <p class="intro">En Tienda Deportiva estamos comprometidos con la protección de la privacidad y la seguridad de tus datos personales. Esta política describe cómo recopilamos, usamos y protegemos tu información.</p>

      <section>
        <h2>1. Responsable del Tratamiento</h2>
        <p>Los datos de carácter personal que se pudieran recabar directamente del interesado serán tratados de forma confidencial y quedarán incorporados a la correspondiente actividad de tratamiento titularidad de los alumnos desarrolladores del proyecto de esta tienda deportiva.</p>
      </section>

      <section>
        <h2>2. Finalidad del tratamiento</h2>
        <p>Tratamos la información que nos facilitan las personas interesadas con el fin de:</p>
        <ul class="check-list">
          <li>Gestionar el registro de usuarios en la plataforma.</li>
          <li>Procesar pedidos simulados y gestionar el carrito de la compra.</li>
          <li>Gestionar la lista de deseos (favoritos).</li>
        </ul>
      </section>

      <section>
        <h2>3. Legitimación</h2>
        <p>La base legal para el tratamiento de sus datos es el <strong>consentimiento</strong> del interesado al registrarse voluntariamente en nuestra plataforma académica.</p>
      </section>

      <section>
        <h2>4. Derechos del usuario</h2>
        <p>Cualquier persona tiene derecho a obtener confirmación sobre si estamos tratando datos personales que les conciernan o no. Las personas interesadas tienen derecho a:</p>
        <ul class="check-list">
          <li>Solicitar el acceso a los datos personales.</li>
          <li>Solicitar su rectificación o supresión.</li>
          <li>Solicitar la limitación de su tratamiento.</li>
          <li>Oponerse al tratamiento.</li>
        </ul>
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

p, li {
  line-height: 1.8;
  color: #555;
  font-size: 1.05rem;
}

.check-list {
  list-style: none;
  padding: 0;
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
</style>