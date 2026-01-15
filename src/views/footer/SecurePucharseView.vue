<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">Compra Segura</h1>
      <p class="intro">Tu seguridad es nuestra prioridad. Hemos implementado los estándares más altos de protección para que compres con total tranquilidad.</p>

      <section>
        <h2>🔒 Seguridad SSL</h2>
        <p>
          Toda la navegación en nuestra web está protegida mediante protocolo <strong>HTTPS</strong> con cifrado SSL de 256 bits. 
          Esto garantiza que tus datos viajan encriptados y son inaccesibles para terceros.
        </p>
      </section>

      <section>
        <h2>💳 Métodos de Pago</h2>
        <p>Aceptamos el método de pago a través de una pasarela de pago:</p>
        <ul class="payment-list">
          <li><strong>Tarjeta de Crédito/Débito:</strong> Procesado a través de pasarela segura bancaria.</li>
        </ul>
      </section>

      <section>
        <h2>🛡️ Protección de Datos</h2>
        <p>
          Cumplimos rigurosamente con el RGPD. Tus datos bancarios <strong>nunca se almacenan</strong> en nuestros servidores; 
          se envían directamente a la entidad financiera a través de canales seguros.
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

p, li { 
    line-height: 1.8; 
    color: #555; 
    font-size: 1.05rem; 
}

.payment-list { 
    list-style: none; 
    padding: 0; 
}

.payment-list li { 
    margin-bottom: 1rem; 
    background: #fff8f3; 
    padding: 1rem; 
    border-radius: 6px; 
    border-left: 4px solid #F97316; 
}
</style>