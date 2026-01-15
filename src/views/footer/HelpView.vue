<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">Ayuda y Preguntas Frecuentes</h1>
      <p class="intro">¿Tienes dudas? Aquí resolvemos las consultas más habituales de nuestros clientes.</p>

      <div class="faq-section">
        <details open>
          <summary>📦 ¿Cuánto tardará en llegar mi pedido?</summary>
          <p>Los envíos peninsulares suelen tardar entre 24 y 48 horas laborables. Para las islas, el plazo es de 3-5 días.</p>
        </details>

        <details>
          <summary>🔄 ¿Cómo puedo devolver un producto?</summary>
          <p>Tienes 30 días para devoluciones. Entra en tu perfil, ve a "Mis Pedidos" y selecciona la opción "Solicitar Devolución". Te enviaremos una etiqueta prepagada.</p>
        </details>

        <details>
          <summary>🔑 He olvidado mi contraseña, ¿qué hago?</summary>
          <p>En la pantalla de Login, pulsa sobre "¿Olvidaste tu contraseña?". Recibirás un email para restablecerla de forma segura.</p>
        </details>

        <details>
          <summary>🧾 ¿Recibiré factura de mi compra?</summary>
          <p>Sí, recibirás un email con la factura simplificada automáticamente. También puedes descargarla desde tu área de cliente.</p>
        </details>
      </div>

      <section class="contact-box">
        <h2>¿Necesitas más ayuda?</h2>
        <p>Nuestro equipo de soporte está disponible para ti.</p>
        <p class="email">📧 soporte@tiendadeportiva.test</p>
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

p { 
    line-height: 1.8; 
    color: #555; 
}

/* Accordion de FAQ */
details { 
    background: #f9fafb; 
    margin-bottom: 1rem; 
    border-radius: 8px; 
    border: 1px solid #e5e7eb; 
    overflow: hidden; 
}

summary { 
    padding: 1.2rem; 
    cursor: pointer; 
    font-weight: 600; 
    color: #2c3e50; 
    list-style: none; 
    position: relative; 
}

summary::after { 
    content: '+'; 
    position: absolute; 
    right: 1.5rem; 
    font-weight: bold; 
    color: #F97316; 
}

details[open] summary::after { 
    content: '-'; 
}

details p { 
    padding: 1.2rem; 
    padding-top: 0; 
    margin: 0; 
    color: #666; 
    border-top: 1px solid #f0f0f0; 
}

.contact-box { 
    margin-top: 3rem; 
    text-align: center; 
    background: #fff8f3; 
    padding: 2rem; 
    border-radius: 8px; 
}

.contact-box h2 { 
    color: #F97316; 
    margin-top: 0; 
    font-size: 1.4rem; 
}

.email { 
    font-weight: bold; 
    font-size: 1.1rem; 
    color: #333; 
}
</style>