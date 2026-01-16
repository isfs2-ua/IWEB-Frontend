<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import ProfileSidebar from '@/components/ProfileSidebar.vue'

const authStore = useAuthStore()
const user = authStore.user 

const sportsList = ['running', 'cycling', 'football', 'basketball', 'tennis', 'swimming', 'other']
</script>

<template>
  <div class="container profile-layout">
    <ProfileSidebar />

    <div class="profile-content">
      <h1 class="page-title">{{ $t('profile.data.title') }}</h1>

      <section class="info-section">
        <div class="section-header">
          <h3>{{ $t('profile.data.account_section') }}</h3>
        </div>

        <div class="data-row">
          <div class="data-col">
            <label>{{ $t('profile.data.username') }}</label>
            <p>{{ user?.username }}</p>
          </div>
          <div class="action-col">
            <button class="btn-edit">{{ $t('common.edit') }}</button>
          </div>
        </div>

        <div class="data-row">
          <div class="data-col">
            <label>{{ $t('profile.data.email') }}</label>
            <p>{{ user?.email }}</p>
          </div>
        </div>

        <div class="data-row">
          <div class="data-col">
            <label>{{ $t('profile.data.password') }}</label>
            <p>********</p>
          </div>
        </div>

        <hr class="divider" />
      </section>

      <section class="info-section">
        <div class="section-header">
          <h3>{{ $t('profile.data.personal_section') }}</h3>
        </div>

        <div class="data-grid">
          <div class="data-item">
            <label>{{ $t('profile.data.name') }}</label>
            <p>{{ user?.nombre }}</p>
          </div>

          <div class="data-row-flex">
            <div class="data-item">
              <label>{{ $t('profile.data.surname') }}</label>
              <p>{{ user?.apellidos }}</p>
            </div>
            <div class="action-col">
              <button class="btn-edit">{{ $t('common.edit') }}</button>
            </div>
          </div>

          <div class="data-item">
            <label>{{ $t('profile.data.phone') }}</label>
            <p>{{ user?.telefono }}</p>
          </div>

          <div class="data-item">
            <label>{{ $t('profile.data.birthdate') }}</label>
            <p>{{ user?.fechaNacimiento }}</p>
          </div>
        </div>

        <hr class="divider" />
      </section>

      <section class="info-section">
        <div class="section-header flex-end">
          <h3>{{ $t('profile.data.form_section') }}</h3>
          <div class="header-actions">
            <button class="btn-edit">{{ $t('profile.data.add_new') }}</button>
            <button class="btn-edit">{{ $t('common.edit') }}</button>
          </div>
        </div>

        <div v-for="form in user?.formularios" :key="form.id" class="preference-card">
          <h4>{{ $t('profile.data.customize') }}</h4>

          <div class="card-grid">
            <div class="left-col">
              <div class="form-group">
                <label>{{ $t('profile.data.gender') }}</label>
                <select v-model="form.genero" class="input-field">
                  <option value="Hombre">{{ $t('profile.data.gender_options.male') }}</option>
                  <option value="Mujer">{{ $t('profile.data.gender_options.female') }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>{{ $t('profile.data.size') }}</label>
                <select v-model="form.talla" class="input-field">
                  <option>L</option>
                  <option>M</option>
                  <option>S</option>
                </select>
              </div>

              <div class="form-group">
                <label>{{ $t('profile.data.foot_size') }}</label>
                <input type="text" v-model="form.tallaPie" class="input-field" />
              </div>
            </div>

            <div class="right-col">
              <label class="checkbox-label">{{ $t('profile.data.interests') }}</label>
              <div class="checkbox-list">
                <label v-for="sportKey in sportsList" :key="sportKey" class="checkbox-item">
                  <input type="checkbox" :value="sportKey" v-model="form.intereses" />
                  <span>
                    {{ sportKey === 'other' ? $t('common.other') : $t('sports_list.' + sportKey) }}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <hr class="divider" />
      </section>

      <section class="delete-account">
        <button class="btn-text-danger">{{ $t('profile.data.delete_account') }}</button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-layout {
  display: flex;
  gap: 60px; /* Espacio grande entre sidebar y contenido */
  align-items: flex-start;
}

.profile-content {
  flex: 1; /* Ocupa el resto del espacio */
}

.page-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

/* Section Styles */
.info-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.section-header.flex-end {
  justify-content: space-between;
}

.header-actions {
  display: flex;
  gap: 10px;
}

h3 {
  font-size: 1.1rem;
  color: #444;
  margin: 0;
  font-weight: 600;
}

/* Data Display Styles */
.data-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.data-row-flex {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.data-col,
.data-item {
  display: flex;
  flex-direction: column;
}

.data-item {
  margin-bottom: 20px;
}

label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
}

p {
  margin: 0;
  color: #555;
  font-size: 0.95rem;
}

/* Botones Editar */
.btn-edit {
  background-color: var(--color-primary); /* Naranja */
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}
.btn-edit:hover {
  background-color: #e65100;
}

/* Form Card Styles */
.preference-card {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
}

.preference-card h4 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1rem;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  margin-top: 5px;
}
.form-group {
  margin-bottom: 15px;
}

/* Checkboxes */
.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.checkbox-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
}
.checkbox-item input {
  margin-right: 10px;
  accent-color: var(--color-primary);
}

/* Footer / Divider */
.divider {
  border: none;
  border-top: 1px solid #eee;
  margin-top: 30px;
}

.delete-account {
  margin-top: 20px;
}

.btn-text-danger {
  background: none;
  border: none;
  color: #444;
  text-decoration: none; /* Quitamos subrayado por defecto */
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
}
.btn-text-danger:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .profile-layout {
    flex-direction: column;
  }
  .profile-sidebar {
    width: 100%;
    margin-bottom: 30px;
  }
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
