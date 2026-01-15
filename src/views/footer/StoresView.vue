<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">Nuestras Tiendas</h1>
      <p class="intro">Aunque nuestra alma es digital, puedes encontrarnos en el corazón del campus universitario.</p>

      <section>
        <h2>📍 Sede Central</h2>
        <div class="store-box">
          <div class="store-info">
            <h3>Campus San Vicente</h3>
            <p>Carretera de San Vicente del Raspeig s/n</p>
            <p>03690 San Vicente del Raspeig (Alicante)</p>
            <p><strong>Edificio Politécnica IV</strong></p>
          </div>
          <div class="store-hours">
            <h3>Horario de Atención</h3>
            <ul>
              <li><strong>Lunes - Viernes:</strong> 09:00 - 20:00</li>
              <li><strong>Sábados:</strong> 10:00 - 14:00</li>
              <li><strong>Domingos:</strong> Cerrado (¡Estamos programando!)</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>🌍 Venta Online</h2>
        <p>
          Recuerda que nuestra tienda online está abierta las <strong>24 horas del día, los 365 días del año</strong>. 
          Realiza tu pedido desde cualquier lugar y recíbelo cómodamente.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Reutiliza los estilos base anteriores... */
.legal-container { min-height: 80vh; padding: 4rem 2rem; background-color: #f8f9fa; display: flex; justify-content: center; }
.legal-content { max-width: 900px; background: white; padding: 3rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.text-orange { color: #F97316; font-weight: 800; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: -0.5px; border-bottom: 3px solid #F97316; display: inline-block; padding-bottom: 0.5rem; }
h2 { color: #333; margin-top: 2.5rem; margin-bottom: 1rem; font-size: 1.5rem; }
p { line-height: 1.8; color: #555; font-size: 1.05rem; }

/* Específico */
.store-box {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  background-color: #f3f4f6;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
.store-info, .store-hours { flex: 1; min-width: 250px; }
.store-hours ul { list-style: none; padding: 0; }
.store-hours li { margin-bottom: 0.5rem; color: #555; }
h3 { color: #F97316; margin-bottom: 1rem; }
</style>