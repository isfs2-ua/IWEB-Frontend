import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info'

export const useNotificationStore = defineStore('notification', () => {
  const message = ref('')
  const type = ref<NotificationType>('info')
  const isVisible = ref(false)
  let timeoutId: number | undefined

  function showNotification(msg: string, notifType: NotificationType = 'info', duration = 3000) {
    message.value = msg
    type.value = notifType
    isVisible.value = true

    // Limpiamos el temporizador anterior si existía (por si salen muchos mensajes rápido)
    if (timeoutId) clearTimeout(timeoutId)

    // Ocultamos automáticamente después de X segundos
    timeoutId = setTimeout(() => {
      isVisible.value = false
    }, duration)
  }

  function hideNotification() {
    isVisible.value = false
  }

  return { message, type, isVisible, showNotification, hideNotification }
})
