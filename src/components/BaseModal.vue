// Plantilla para mensajes de confimación
<script setup lang="ts">
defineProps<{
  show: boolean
  title?: string
}>()

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-backdrop" @click="$emit('close')">
      <div class="modal-card" @click.stop>
        <h3 v-if="title" class="modal-title">{{ title }}</h3>

        <div class="modal-body">
          <slot></slot>
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" @click="$emit('close')">
            {{ $t('common.cancel') }}
          </button>

          <button class="btn-primary" @click="$emit('confirm')">
            {{ $t('common.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fondo semitransparente oscuro */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000; /* Por encima de todo, incluso del header */
}

.modal-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-title {
  margin-top: 0;
  color: var(--color-primary);
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.modal-body {
  margin-bottom: 25px;
  color: #555;
  font-size: 0.95rem;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* Reutilizamos estilos de botones pero ajustados */
.btn-primary,
.btn-secondary {
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  font-weight: 600;
  transition: opacity 0.2s;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-secondary {
  background-color: #eee;
  color: #333;
}

.btn-primary:hover,
.btn-secondary:hover {
  opacity: 0.8;
}

/* Animación de entrada */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
