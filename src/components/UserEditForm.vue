<script setup lang="ts">
import { ref, watch } from 'vue'

// Definimos las props tipadas
const props = defineProps<{
  modelValue: {
    username: string
    email: string
    nombre: string
    apellidos: string
    telefono: string
    fechaNacimiento: string
  }
}>()

// Definimos el evento para comunicarnos con el padre
const emit = defineEmits(['update:modelValue'])

// 1. CREAR COPIA LOCAL:
// Inicializamos 'form' clonando los datos que recibimos.
// Esto permite que el usuario edite sin restricciones.
const form = ref({ ...props.modelValue })

// 2. DETECTAR CAMBIOS EXTERNOS (Padre -> Hijo):
// Si abres el modal de nuevo, actualizamos el formulario.
watch(() => props.modelValue, (newValue) => {
  // Solo actualizamos si son objetos diferentes para evitar bucles
  if (JSON.stringify(newValue) !== JSON.stringify(form.value)) {
    form.value = { ...newValue }
  }
}, { deep: true })

// 3. ENVIAR CAMBIOS (Hijo -> Padre):
// Cada vez que escribes una letra, avisamos al padre (ProfileDataView)
// para que su variable 'editData' se actualice en tiempo real.
watch(form, (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })
</script>

<template>
  <form class="user-form-grid" @submit.prevent>
    <div class="form-group full-width">
      <label>{{ $t('profile.data.username') }}</label>
      <input type="text" v-model="form.username" required />
    </div>

    <div class="form-group full-width">
      <label>{{ $t('profile.data.email') }}</label>
      <input type="email" v-model="form.email" required />
    </div>

    <div class="form-group">
      <label>{{ $t('profile.data.name') }}</label>
      <input type="text" v-model="form.nombre" required />
    </div>

    <div class="form-group">
      <label>{{ $t('profile.data.surname') }}</label>
      <input type="text" v-model="form.apellidos" required />
    </div>

    <div class="form-group">
      <label>{{ $t('profile.data.phone') }}</label>
      <input type="tel" v-model="form.telefono" />
    </div>

    <div class="form-group full-width">
      <label>{{ $t('profile.data.birthdate') }}</label>
      <input type="date" v-model="form.fechaNacimiento" />
    </div>
  </form>
</template>

<style scoped>
/* Tus estilos (Grid de 2 columnas) */
.user-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.form-group input:focus {
  border-color: var(--color-primary);
  outline: none;
}
</style>