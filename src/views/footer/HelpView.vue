<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">{{ $t('help.title') }}</h1>
      <p class="intro">{{ $t('help.intro') }}</p>

      <div class="faq-section">
        <details open>
          <summary>{{ $t('help.faq.shipping.question') }}</summary>
          <p>{{ $t('help.faq.shipping.answer') }}</p>
        </details>

        <details>
          <summary>{{ $t('help.faq.returns.question') }}</summary>
          <p>{{ $t('help.faq.returns.answer') }}</p>
        </details>

        <details>
          <summary>{{ $t('help.faq.password.question') }}</summary>
          <p>{{ $t('help.faq.password.answer') }}</p>
        </details>

        <details>
          <summary>{{ $t('help.faq.invoice.question') }}</summary>
          <p>{{ $t('help.faq.invoice.answer') }}</p>
        </details>
      </div>

      <section class="contact-box">
        <h2>{{ $t('help.contact.title') }}</h2>
        <p>{{ $t('help.contact.text') }}</p>
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