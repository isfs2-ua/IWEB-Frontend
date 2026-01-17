<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">{{ $t('cookies.title') }}</h1>
      <p class="intro">
        {{ $t('cookies.intro') }}
      </p>

      <section>
        <h2>{{ $t('cookies.what_is.title') }}</h2>
        <p>
          {{ $t('cookies.what_is.text') }}
        </p>
      </section>

      <section>
        <h2>{{ $t('cookies.used_cookies.title') }}</h2>
        <p>{{ $t('cookies.used_cookies.intro') }}</p>
        
        <div class="cookie-type">
          <h3>{{ $t('cookies.used_cookies.technical.title') }}</h3>
          <p>{{ $t('cookies.used_cookies.technical.text') }}</p>
          <ul class="check-list">
            <li>{{ $t('cookies.used_cookies.technical.list.session') }}</li>
            <li>{{ $t('cookies.used_cookies.technical.list.cart') }}</li>
            <li>{{ $t('cookies.used_cookies.technical.list.security') }}</li>
          </ul>
        </div>

        <div class="cookie-type">
          <h3>{{ $t('cookies.used_cookies.analysis.title') }}</h3>
          <p>
            {{ $t('cookies.used_cookies.analysis.text') }}
          </p>
        </div>
      </section>

      <section>
        <h2>{{ $t('cookies.deactivation.title') }}</h2>
        <p>
          {{ $t('cookies.deactivation.text') }}
        </p>
      </section>

      <section>
        <h2>{{ $t('cookies.notes.title') }}</h2>
        <p class="warning-box" v-html="$t('cookies.notes.text')"></p>
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

h3 {
  color: #F97316;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

p, li {
  line-height: 1.8;
  color: #555;
  font-size: 1.05rem;
}

.cookie-type {
  background-color: #fff8f3;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #F97316;
}

.check-list {
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
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

.warning-box {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
}
</style>