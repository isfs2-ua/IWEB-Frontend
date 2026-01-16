<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">{{ $t('stores.title') }}</h1>
      <p class="intro">{{ $t('stores.intro') }}</p>

      <section>
        <h2>{{ $t('stores.central.title') }}</h2>
        <div class="store-box">
          <div class="store-info">
            <h3>{{ $t('stores.central.name') }}</h3>
            <p>{{ $t('stores.central.address1') }}</p>
            <p>{{ $t('stores.central.address2') }}</p>
            <p v-html="$t('stores.central.building')"></p>
          </div>
          <div class="store-hours">
            <h3>{{ $t('stores.hours.title') }}</h3>
            <ul>
              <li v-html="$t('stores.hours.week')"></li>
              <li v-html="$t('stores.hours.saturday')"></li>
              <li v-html="$t('stores.hours.sunday')"></li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>{{ $t('stores.online.title') }}</h2>
        <p v-html="$t('stores.online.text')"></p>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Reutiliza los estilos base anteriores... */
.legal-container { min-height: 80vh; padding: 4rem 2rem; background-color: #f8f9fa; display: flex; justify-content: center; }
.legal-content { max-width: 900px; background: white; padding: 3rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.text-orange { color: #F97316; font-weight: 800; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: -0.5px; border-bottom: 3px solid #F97316; display: inline-block; padding-bottom: 0.5rem; }
h2 { color: #333; margin-top: 2.5rem; margin-bottom: 1rem; font-size: 1.5rem; }
p { line-height: 1.8; color: #555; font-size: 1.05rem; }

/* Específico */
.store-box {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  background-color: #f3f4f6;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
.store-info, .store-hours { flex: 1; min-width: 250px; }
.store-hours ul { list-style: none; padding: 0; }
.store-hours li { margin-bottom: 0.5rem; color: #555; }
h3 { color: #F97316; margin-bottom: 1rem; }
</style>