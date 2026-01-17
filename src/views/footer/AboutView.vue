<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">{{ $t('about.title') }}</h1>
      <p class="intro">
        {{ $t('about.intro') }}
      </p>

      <section>
        <h2>{{ $t('about.history.title') }}</h2>
        <p v-html="$t('about.history.text')"></p>
      </section>

      <section>
        <h2>{{ $t('about.mission.title') }}</h2>
        <div class="values-grid">
          <div class="value-card">
            <h3>{{ $t('about.mission.innovation.title') }}</h3>
            <p>{{ $t('about.mission.innovation.text') }}</p>
          </div>
          <div class="value-card">
            <h3>{{ $t('about.mission.learning.title') }}</h3>
            <p>{{ $t('about.mission.learning.text') }}</p>
          </div>
          <div class="value-card">
            <h3>{{ $t('about.mission.teamwork.title') }}</h3>
            <p>{{ $t('about.mission.teamwork.text') }}</p>
          </div>
        </div>
      </section>

      <section>
        <h2>{{ $t('about.team.title') }}</h2>
        <p>{{ $t('about.team.text') }}</p>
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

h2 { color: #333; margin-top: 2.5rem; margin-bottom: 1rem; font-size: 1.5rem; }
p { line-height: 1.8; color: #555; font-size: 1.05rem; }

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.value-card {
  background: #fff8f3;
  padding: 1.5rem;
  border-radius: 8px;
  border-top: 4px solid #F97316;
}

.value-card h3 { color: #2c3e50; margin-bottom: 0.5rem; }
.value-card p { font-size: 0.95rem; margin: 0; }
</style>