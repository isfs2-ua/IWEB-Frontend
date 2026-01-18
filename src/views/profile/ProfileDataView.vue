<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import ProfileSidebar from '@/components/ProfileSidebar.vue'
import BaseModal from '@/components/BaseModal.vue'
import UserEditForm from '@/components/UserEditForm.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { user } = storeToRefs(authStore)

// LÓGICA DEL MODAL
const isEditModalOpen = ref(false)
const isSaving = ref(false)
const activeSection = ref<'account' | 'personal'>('personal')

const editData = ref({
  username: '',
  email: '',
  nombre: '',
  apellidos: '',
  telefono: '',
  fechaNacimiento: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Backend (dd-MM-yyyy) -> Input (yyyy-MM-dd)
const formatDateForInput = (dateStr: string | undefined): string => {
  if (!dateStr) return ''
  if (dateStr.includes('/')) dateStr = dateStr.replace(/\//g, '-') 
  const parts = dateStr.split('-')
  if (parts[0].length === 4) return dateStr 
  return `${parts[2]}-${parts[1]}-${parts[0]}` 
}

// Backend (dd-MM-yyyy) -> Input (yyyy-MM-dd)
const formatDateForBackend = (dateStr: string): string | null => {
  if (!dateStr) return null 
  const parts = dateStr.split('-')
  if (parts.length !== 3) return null
  return `${parts[2]}-${parts[1]}-${parts[0]}`
}

const openEditModal = (section: 'account' | 'personal') => {
  if (!user.value) return

  activeSection.value = section
  
  editData.value = {
    username: user.value.username || '',
    email: user.value.email || '',
    nombre: user.value.nombre || '',
    apellidos: user.value.apellidos || '',
    telefono: user.value.telefono || '',
    fechaNacimiento: formatDateForInput(user.value.fechaNacimiento),
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  isEditModalOpen.value = true
}

const handleSaveChanges = async () => {
  isSaving.value = true
  
  try {
    // Si estamos en sección de cuenta y hay cambio de contraseña
    if (activeSection.value === 'account' && editData.value.newPassword) {
      if (editData.value.newPassword !== editData.value.confirmPassword) {
        notificationStore.showNotification(t('profile.notifications.password_mismatch'), 'error')
        isSaving.value = false
        return
      }
      if (!editData.value.currentPassword) {
        notificationStore.showNotification(t('profile.notifications.current_password_required'), 'error')
        isSaving.value = false
        return
      }

      const passResult = await authStore.changePassword(
        editData.value.currentPassword, 
        editData.value.newPassword
      )
      
      if (!passResult.success) {
        // Error del back
        notificationStore.showNotification(passResult.message || t('profile.notifications.password_change_error'), 'error')
        isSaving.value = false
        return
      }
    }

    // Actualización del perfil
    const payload = {
      username: editData.value.username,
      email: editData.value.email,
      nombre: editData.value.nombre,
      apellidos: editData.value.apellidos,
      telefono: editData.value.telefono?.trim() === '' ? null : editData.value.telefono,
      fechaNacimiento: formatDateForBackend(editData.value.fechaNacimiento)
    }

    const success = await authStore.updateProfile(payload)
    
    if (success) {
      isEditModalOpen.value = false
      notificationStore.showNotification(t('common.save_success'), 'success')
    } else {
      notificationStore.showNotification(t('errors.generic'), 'error')
    }

  } catch (e) {
    console.error(e)
    notificationStore.showNotification(t('errors.generic'), 'error')
  } finally {
    isSaving.value = false
  }
}
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
            <button class="btn-edit" @click="openEditModal('account')">{{ $t('common.edit') }}</button>
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
               <button class="btn-edit" @click="openEditModal('personal')">{{ $t('common.edit') }}</button>
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
                 </div>
        </div>
        <hr class="divider" />
      </section>

      <section class="delete-account">
        <button class="btn-text-danger">{{ $t('profile.data.delete_account') }}</button>
      </section>
    </div>

    <BaseModal 
      :show="isEditModalOpen" 
      :title="activeSection === 'account' ? 'Editar Cuenta' : 'Editar Datos Personales'"
      @close="isEditModalOpen = false"
    >
      <UserEditForm v-model="editData" :mode="activeSection" />

      <template #footer>
        <div class="modal-actions">
          <button class="btn-secondary" @click="isEditModalOpen = false">
            {{ $t('common.cancel') }}
          </button>
          <button class="btn-primary" @click="handleSaveChanges" :disabled="isSaving">
            {{ isSaving ? '...' : $t('common.save') }}
          </button>
        </div>
      </template>
    </BaseModal>

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
  gap: 60px; 
  align-items: flex-start;
}
.profile-content {
  flex: 1;
}
.page-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}
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
.btn-edit {
  background-color: var(--color-primary); 
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
  text-decoration: none; 
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
  .card-grid {
    grid-template-columns: 1fr;
  }
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}
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
.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.btn-secondary {
  background-color: #eee;
  color: #333;
}
.btn-primary:hover:not(:disabled),
.btn-secondary:hover {
  opacity: 0.8;
}
</style>