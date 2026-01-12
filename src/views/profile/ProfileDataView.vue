<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ProfileSidebar from '@/components/ProfileSidebar.vue'

const authStore = useAuthStore()
const user = authStore.user // Acceso directo al usuario (asumimos que está logueado)

// Datos estáticos para los selects del formulario
const sportsList = ['Running', 'Ciclismo', 'Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Otro']
</script>

<template>
  <div class="container profile-layout">
    <ProfileSidebar />

    <div class="profile-content">
      <h1 class="page-title">Mis Datos</h1>

      <section class="info-section">
        <div class="section-header">
          <h3>Datos de cuenta</h3>
        </div>

        <div class="data-row">
          <div class="data-col">
            <label>Nombre de usuario</label>
            <p>{{ user?.username }}</p>
          </div>
          <div class="action-col">
            <button class="btn-edit">Editar</button>
          </div>
        </div>

        <div class="data-row">
          <div class="data-col">
            <label>Email</label>
            <p>{{ user?.email }}</p>
          </div>
        </div>

        <div class="data-row">
          <div class="data-col">
            <label>Contraseña</label>
            <p>********</p>
          </div>
        </div>

        <hr class="divider" />
      </section>

      <section class="info-section">
        <div class="section-header">
          <h3>Datos personales</h3>
        </div>

        <div class="data-grid">
          <div class="data-item">
            <label>Nombre</label>
            <p>{{ user?.nombre }}</p>
          </div>

          <div class="data-row-flex">
            <div class="data-item">
              <label>Apellidos</label>
              <p>{{ user?.apellidos }}</p>
            </div>
            <div class="action-col">
              <button class="btn-edit">Editar</button>
            </div>
          </div>

          <div class="data-item">
            <label>Teléfono</label>
            <p>{{ user?.telefono }}</p>
          </div>

          <div class="data-item">
            <label>Fecha de nacimiento</label>
            <p>{{ user?.fechaNacimiento }}</p>
          </div>
        </div>

        <hr class="divider" />
      </section>

      <section class="info-section">
        <div class="section-header flex-end">
          <h3>Formulario</h3>
          <div class="header-actions">
            <button class="btn-edit">Añadir nuevo</button>
            <button class="btn-edit">Editar</button>
          </div>
        </div>

        <div v-for="form in user?.formularios" :key="form.id" class="preference-card">
          <h4>Personaliza tu experiencia:</h4>

          <div class="card-grid">
            <div class="left-col">
              <div class="form-group">
                <label>Género</label>
                <select v-model="form.genero" class="input-field">
                  <option>Hombre</option>
                  <option>Mujer</option>
                </select>
              </div>

              <div class="form-group">
                <label>Talla</label>
                <select v-model="form.talla" class="input-field">
                  <option>L</option>
                  <option>M</option>
                  <option>S</option>
                </select>
              </div>

              <div class="form-group">
                <label>Talla de pie</label>
                <input type="text" v-model="form.tallaPie" class="input-field" />
              </div>
            </div>

            <div class="right-col">
              <label class="checkbox-label">Interés por el deporte:</label>
              <div class="checkbox-list">
                <label v-for="sport in sportsList" :key="sport" class="checkbox-item">
                  <input type="checkbox" :value="sport" v-model="form.intereses" />
                  <span>{{ sport }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <hr class="divider" />
      </section>

      <section class="delete-account">
        <button class="btn-text-danger">Dar de baja mi cuenta</button>
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
