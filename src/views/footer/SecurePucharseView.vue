<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">{{ $t('secure_purchase.title') }}</h1>
      <p class="intro">
        {{ $t('secure_purchase.intro') }}
      </p>

      <section>
        <h2>{{ $t('secure_purchase.ssl.title') }}</h2>
        <p v-html="$t('secure_purchase.ssl.text')"></p>
      </section>

      <section>
        <h2>{{ $t('secure_purchase.methods.title') }}</h2>
        <p>{{ $t('secure_purchase.methods.text') }}</p>
        <ul class="payment-list">
          <li v-html="$t('secure_purchase.methods.list.card')"></li>
        </ul>
      </section>

      <section>
        <h2>{{ $t('secure_purchase.protection.title') }}</h2>
        <p v-html="$t('secure_purchase.protection.text')"></p>
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