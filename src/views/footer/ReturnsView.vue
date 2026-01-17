<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">{{ $t('returns.title') }}</h1>
      
      <section>
        <h2>{{ $t('returns.shipping.title') }}</h2>
        <p v-html="$t('returns.shipping.text')"></p>
        
        <div class="info-box">
          <p v-html="$t('returns.shipping.standard')"></p>
          <p v-html="$t('returns.shipping.express')"></p>
        </div>
      </section>

      <section>
        <h2>{{ $t('returns.withdrawal.title') }}</h2>
        <p v-html="$t('returns.withdrawal.text1')"></p>
        <p>
          {{ $t('returns.withdrawal.text2') }}
        </p>
      </section>

      <section>
        <h2>{{ $t('returns.warranty.title') }}</h2>
        <p v-html="$t('returns.warranty.text')"></p>
      </section>

      <section>
        <h2>{{ $t('returns.procedure.title') }}</h2>
        <p v-html="$t('returns.procedure.text')"></p>
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