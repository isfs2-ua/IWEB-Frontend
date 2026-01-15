<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">Quiénes Somos</h1>
      <p class="intro">
        Bienvenido a Tienda Deportiva, tu referencia en equipamiento deportivo. 
        Nacimos en las aulas de la Universidad de Alicante con una misión clara: demostrar que la tecnología y el deporte forman el equipo perfecto.
      </p>

      <section>
        <h2>🏆 Nuestra Historia</h2>
        <p>
          Este proyecto comenzó como un desafío académico en la asignatura de <strong>Ingeniería Web</strong>. 
          Lo que empezó con unas pocas líneas de código en Java y Vue.js se ha convertido en una plataforma de comercio electrónico completa, 
          diseñada para ofrecer una experiencia de usuario fluida y moderna.
        </p>
      </section>

      <section>
        <h2>🚀 Misión y Valores</h2>
        <div class="values-grid">
          <div class="value-card">
            <h3>Innovación</h3>
            <p>Utilizamos las últimas tecnologías (Spring Boot 3, Vue 3, Pinia) para construir software robusto.</p>
          </div>
          <div class="value-card">
            <h3>Aprendizaje</h3>
            <p>Cada bug es una lección; cada funcionalidad, un logro. Crecemos con cada commit.</p>
          </div>
          <div class="value-card">
            <h3>Trabajo en Equipo</h3>
            <p>Backend y Frontend unidos por una API REST. La colaboración es nuestra clave.</p>
          </div>
        </div>
      </section>

      <section>
        <h2>👨‍💻 El Equipo</h2>
        <p>Somos estudiantes apasionados por el desarrollo de software. Nos encargamos de todo el stack tecnológico, desde la base de datos hasta la interfaz que estás viendo ahora mismo.</p>
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

h2 { color: #333; margin-top: 2.5rem; margin-bottom: 1rem; font-size: 1.5rem; }
p { line-height: 1.8; color: #555; font-size: 1.05rem; }

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.value-card {
  background: #fff8f3;
  padding: 1.5rem;
  border-radius: 8px;
  border-top: 4px solid #F97316;
}

.value-card h3 { color: #2c3e50; margin-bottom: 0.5rem; }
.value-card p { font-size: 0.95rem; margin: 0; }
</style>