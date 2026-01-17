<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">{{ $t('privacy.title') }}</h1>
      <p class="intro">
        {{ $t('privacy.intro') }}
      </p>

      <section>
        <h2>{{ $t('privacy.controller.title') }}</h2>
        <p>
          {{ $t('privacy.controller.text') }}
        </p>
      </section>

      <section>
        <h2>{{ $t('privacy.purpose.title') }}</h2>
        <p>{{ $t('privacy.purpose.intro') }}</p>
        <ul class="check-list">
          <li>{{ $t('privacy.purpose.list.register') }}</li>
          <li>{{ $t('privacy.purpose.list.orders') }}</li>
          <li>{{ $t('privacy.purpose.list.wishlist') }}</li>
        </ul>
      </section>

      <section>
        <h2>{{ $t('privacy.legitimation.title') }}</h2>
        <p v-html="$t('privacy.legitimation.text')"></p>
      </section>

      <section>
        <h2>{{ $t('privacy.rights.title') }}</h2>
        <p>{{ $t('privacy.rights.intro') }}</p>
        <ul class="check-list">
          <li>{{ $t('privacy.rights.list.access') }}</li>
          <li>{{ $t('privacy.rights.list.rectification') }}</li>
          <li>{{ $t('privacy.rights.list.limitation') }}</li>
          <li>{{ $t('privacy.rights.list.opposition') }}</li>
        </ul>
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

.check-list {
  list-style: none;
  padding: 0;
}

.check-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.check-list li::before {
  content: "✔";
  color: #F97316;
  position: absolute;
  left: 0;
  font-weight: bold;
}
</style>