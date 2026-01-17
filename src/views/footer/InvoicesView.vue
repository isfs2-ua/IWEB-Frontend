<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">{{ $t('invoices.title') }}</h1>
      
      <section>
        <h2>{{ $t('invoices.download.title') }}</h2>
        <p v-html="$t('invoices.download.text')"></p>
      </section>

      <section>
        <h2>{{ $t('invoices.business.title') }}</h2>
        <p>
          {{ $t('invoices.business.text1') }}
        </p>
        <p>{{ $t('invoices.business.text2') }}</p>
      </section>

      <section>
        <h2>{{ $t('invoices.taxes.title') }}</h2>
        <p v-html="$t('invoices.taxes.text')"></p>
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
    display: inline-block; padding-bottom: 0.5rem; 
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
}

strong { 
    color: #2c3e50; 
}
</style>