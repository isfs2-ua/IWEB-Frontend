<script setup lang="ts">
import { computed } from 'vue'
import type { Address } from '@/types'

const props = defineProps<{
  modelValue: Address
}>()

const emit = defineEmits(['update:modelValue'])

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <form class="address-form-grid" @submit.prevent>
    <div class="form-group full-width">
      <label>Nombre Completo</label>
      <input
        type="text"
        v-model="form.nombreCompleto"
        placeholder="Ej: Pepito Pérez González"
        required
      />
    </div>

    <div class="form-group full-width">
      <label>Dirección (Calle, número, piso, letra, etc)</label>
      <input type="text" v-model="form.calle" placeholder="Ej: C/ Mayor 12, 3ºA" required />
    </div>

    <div class="form-group">
      <label>Código postal</label>
      <input type="text" v-model="form.codigoPostal" placeholder="Ej: 03000" required />
    </div>
    <div class="form-group">
      <label>Ciudad</label>
      <input type="text" v-model="form.ciudad" placeholder="Ej: Alicante" required />
    </div>
    <div class="form-group">
      <label>Provincia</label>
      <input type="text" v-model="form.provincia" placeholder="Ej: Alicante" required />
    </div>

    <div class="form-group full-width">
      <label>Teléfono</label>
      <input type="tel" v-model="form.telefono" placeholder="Ej: 600 000 000" required />
    </div>
  </form>
</template>

<style scoped>
.address-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3 columnas iguales */
  gap: 15px;
  padding: 10px 0;
  text-align: left;
}

.form-group {
  display: flex;
  flex-direction: column;
}

/* Esta clase hace que el campo ocupe todo el ancho (las 3 columnas) */
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
  width: 100%; /* Asegura que llene su celda */
  box-sizing: border-box; /* Evita que el padding rompa el ancho */
}

.form-group input::placeholder {
  color: #999;
}

.form-group input:focus {
  border-color: var(--color-primary);
  outline: none;
}
</style>
