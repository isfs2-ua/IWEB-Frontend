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
      <label>{{ $t('address.full_name') }}</label>
      <input
        type="text"
        v-model="form.nombreCompleto"
        :placeholder="$t('address.full_name_placeholder')" 
        required
      />
    </div>

    <div class="form-group full-width">
      <label>{{ $t('address.street') }}</label>
      <input 
        type="text" 
        v-model="form.calle" 
        :placeholder="$t('address.street_placeholder')" 
        required 
      />
    </div>

    <div class="form-group">
      <label>{{ $t('address.zip_code') }}</label>
      <input 
        type="text" 
        v-model="form.codigoPostal" 
        :placeholder="$t('address.zip_code_placeholder')" 
        required 
      />
    </div>
    
    <div class="form-group">
      <label>{{ $t('address.city') }}</label>
      <input 
        type="text" 
        v-model="form.ciudad" 
        :placeholder="$t('address.city_placeholder')" 
        required 
      />
    </div>
    
    <div class="form-group">
      <label>{{ $t('address.province') }}</label>
      <input 
        type="text" 
        v-model="form.provincia" 
        :placeholder="$t('address.province_placeholder')" 
        required 
      />
    </div>

    <div class="form-group full-width">
      <label>{{ $t('address.phone') }}</label>
      <input 
        type="tel" 
        v-model="form.telefono" 
        :placeholder="$t('address.phone_placeholder')" 
        required 
      />
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
