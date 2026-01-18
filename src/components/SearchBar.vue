<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const searchQuery = ref((route.query.q as string) || '')

watch(
  () => route.query.q,
  (newQuery) => {
    searchQuery.value = (newQuery as string) || ''
  }
)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Buscando:', searchQuery.value)

    router.push({ name: 'search', query: { q: searchQuery.value } })
  }
}
</script>

<template>
  <div class="search-input-wrapper">
    <span class="search-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </span>

    <input
      v-model="searchQuery"
      @keyup.enter="handleSearch"
      type="text"
      :placeholder="$t('search.placeholder')"
      class="search-input"
    />
  </div>
</template>

<style scoped>
.search-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 50px;
  padding: 8px 15px;
  background: #fff;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  width: 100%;
}

.search-input-wrapper:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.search-icon {
  color: #888;
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.95rem;
  color: #333;
  background: transparent;
}
</style>