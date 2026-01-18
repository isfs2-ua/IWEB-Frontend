<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  mode: 'account' | 'personal',
  modelValue: {
    username: string
    email: string
    nombre: string
    apellidos: string
    telefono: string
    fechaNacimiento: string
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }
}>()

const emit = defineEmits(['update:modelValue'])

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <form class="user-form-grid" @submit.prevent>
    
    <template v-if="mode === 'account'">
      <div class="form-group full-width">
        <label>{{ $t('profile.data.username') }}</label>
        <input type="text" v-model="form.username" required />
      </div>

      <div class="form-group full-width">
        <label>{{ $t('profile.data.email') }}</label>
        <input type="email" v-model="form.email" required />
      </div>

      <div class="full-width separator-title">
         <span>Cambiar contraseña</span>
      </div>

      <div class="form-group full-width">
        <label>Contraseña Actual</label>
        <input 
            type="password" 
            v-model="form.currentPassword" 
            placeholder="Contraseña actual" 
        />
      </div>

      <div class="form-group full-width">
        <label>Nueva Contraseña</label>
        <input 
            type="password" 
            v-model="form.newPassword" 
            placeholder="Nueva contraseña" 
        />
      </div>

      <div class="form-group full-width">
        <label>Repetir Nueva</label>
        <input 
            type="password" 
            v-model="form.confirmPassword" 
            placeholder="Repite nueva contraseña" 
        />
      </div>
    </template>


    <template v-if="mode === 'personal'">
      <div class="form-group full-width">
        <label>{{ $t('profile.data.name') }}</label>
        <input type="text" v-model="form.nombre" required />
      </div>

      <div class="form-group full-width">
        <label>{{ $t('profile.data.surname') }}</label>
        <input type="text" v-model="form.apellidos" required />
      </div>

      <div class="form-group">
        <label>{{ $t('profile.data.phone') }}</label>
        <input type="tel" v-model="form.telefono" />
      </div>

      <div class="form-group">
        <label>{{ $t('profile.data.birthdate') }}</label>
        <input type="date" v-model="form.fechaNacimiento" />
      </div>
    </template>

  </form>
</template>

<style scoped>
.user-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  padding: 10px 0;
  text-align: left;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: 1 / -1;
}

.separator-title {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 0.95rem;
    font-weight: 700;
    color: #000; 
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.form-group input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  color: #333;
  width: 100%;
  box-sizing: border-box;
}

.form-group input::placeholder {
  color: #aaa;
  font-size: 0.85rem;
}

.form-group input:focus {
  border-color: var(--color-primary);
  outline: none;
}

@media (max-width: 600px) {
  .user-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>