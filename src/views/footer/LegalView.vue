<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">{{ $t('legal.title') }}</h1>
      <p class="intro">
        {{ $t('legal.intro') }}
      </p>

      <section>
        <h2>{{ $t('legal.data.title') }}</h2>
        <ul class="data-list">
          <li v-html="$t('legal.data.items.social_name')"></li>
          <li v-html="$t('legal.data.items.address')"></li>
          <li v-html="$t('legal.data.items.email')"></li>
          <li v-html="$t('legal.data.items.activity')"></li>
        </ul>
      </section>

      <section>
        <h2>{{ $t('legal.object.title') }}</h2>
        <p>
          {{ $t('legal.object.text') }}
        </p>
      </section>

      <section>
        <h2>{{ $t('legal.intellectual_property.title') }}</h2>
        <p>
          {{ $t('legal.intellectual_property.text') }}
        </p>
      </section>

      <section>
        <h2>{{ $t('legal.responsibility.title') }}</h2>
        <p>
          {{ $t('legal.responsibility.text') }}
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
  font-weight: 600;
}

p, li {
  line-height: 1.8;
  color: #555;
  font-size: 1.05rem;
}

.data-list {
  list-style: none;
  padding: 0;
  background: #fff8f3;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #F97316;
}

.data-list li {
  margin-bottom: 0.5rem;
}

strong {
  color: #2c3e50;
}
</style>