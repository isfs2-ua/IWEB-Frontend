<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">Envíos y Devoluciones</h1>
      
      <section>
        <h2>1. Política de Envíos</h2>
        <p>Al tratarse de un proyecto académico, <strong>no se realizan envíos físicos reales</strong>. Los tiempos mostrados en la web son simulaciones para recrear la experiencia de usuario.</p>
        <div class="info-box">
          <p>🚚 <strong>Envío Estándar:</strong> 3-5 días laborables</p>
          <p>🚀 <strong>Envío Express:</strong> 24/48 horas</p>
        </div>
      </section>

      <section>
        <h2>2. Derecho de Desistimiento</h2>
        <p>De conformidad con la normativa vigente, el cliente dispondría (en un entorno real) del derecho a desistir de su compra en un plazo de <strong>14 días naturales</strong> sin necesidad de justificación.</p>
        <p>El plazo de desistimiento expirará a los 14 días naturales del día que usted o un tercero por usted indicado, distinto del transportista, adquirió la posesión material de los bienes.</p>
      </section>

      <section>
        <h2>3. Garantía de los productos</h2>
        <p>En caso de producto defectuoso, el vendedor deberá proceder, según corresponda, a la reparación, sustitución, rebaja del precio o resolución del contrato, gestiones que serán gratuitas para el consumidor y usuario. El vendedor responde de las faltas de conformidad que se manifiesten en un plazo de <strong>tres años</strong> desde la entrega.</p>
      </section>

      <section>
        <h2>4. Procedimiento de devolución</h2>
        <p>Para ejercer su derecho de devolución, debería contactar con nuestro servicio de atención al cliente a través del correo <span>devoluciones@tiendadeportiva.test</span> facilitando el número de pedido y el motivo de la devolución (opcional).</p>
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

p {
  line-height: 1.8;
  color: #555;
  font-size: 1.05rem;
  margin-bottom: 1rem;
}

.info-box {
  background-color: #f3f4f6;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid #e5e7eb;
}

.info-box p {
  margin: 0.5rem 0;
  color: #374151;
}

span {
  color: #F97316;
  font-weight: 500;
  text-decoration: underline;
}
</style>