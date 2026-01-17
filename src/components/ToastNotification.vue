<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'

const store = useNotificationStore()
</script>

<template>
  <Transition name="toast">
    <div v-if="store.isVisible" class="toast-container" :class="store.type">
      <div class="icon">
        <span v-if="store.type === 'success'">✅</span>
        <span v-else-if="store.type === 'error'">❌</span>
        <span v-else>ℹ️</span>
      </div>

      <div class="message">
        {{ store.message }}
      </div>

      <button 
        @click="store.hideNotification" 
        class="close-btn"
        :title="$t('toast.close')"
        :aria-label="$t('toast.close')"
      >×</button>
    </div>
  </Transition>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  max-width: 400px;
  padding: 16px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: white;
  font-weight: 500;
  gap: 12px;
}

.success {
  background-color: #2ecc71;
  border-left: 5px solid #27ae60;
}

.error {
  background-color: #e74c3c;
  border-left: 5px solid #c0392b;
}

.info {
  background-color: var(--color-primary);
  border-left: 5px solid #e65100;
}

.message {
  flex: 1;
  font-size: 0.95rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
}
.close-btn:hover {
  opacity: 1;
}

/* Animación de Vue (Slide + Fade) */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px); /* Entra desde la derecha */
}
</style>
