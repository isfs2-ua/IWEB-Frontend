<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Definimos la estructura de una diapositiva
interface Slide {
  id: number
  title: string
  subtitle?: string // Opcional
  buttonText: string
  image: string
  link: string
}

// Datos de las diapositivas (Mock Data)
const slides: Slide[] = [
  {
    id: 1,
    title: 'Nueva colección de invierno',
    subtitle: 'Equípate para el frío con estilo y rendimiento.',
    buttonText: 'Descubrir',
    // Usamos imágenes de Unsplash para la demo
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80',
    link: '#',
  },
  {
    id: 2,
    title: 'Supera tus límites en Running',
    subtitle: 'Zapatillas con la última tecnología de amortiguación.',
    buttonText: 'Ver Zapatillas',
    image:
      'https://goodmockups.com/wp-content/uploads/2025/07/Free-Womens-Running-Shoes-Mockup-PSD.jpg',
    link: '#',
  },
  {
    id: 3,
    title: 'Todo para tu entrenamiento',
    subtitle: 'Ropa técnica y accesorios para el gimnasio.',
    buttonText: 'Comprar ahora',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80',
    link: '#',
  },
]

const currentSlideIndex = ref(0)
let intervalId: number | null = null

// Función para cambiar al siguiente slide
const nextSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.length
}

// Función para ir a un slide específico (al hacer clic en los puntitos)
const goToSlide = (index: number) => {
  currentSlideIndex.value = index
  resetTimer() // Reiniciamos el tiempo para que no cambie inmediatamente
}

// Control del temporizador automático
const startAutoPlay = () => {
  intervalId = setInterval(nextSlide, 5000) // Cambia cada 5 segundos
}

const stopAutoPlay = () => {
  if (intervalId) clearInterval(intervalId)
}

const resetTimer = () => {
  stopAutoPlay()
  startAutoPlay()
}

// Ciclo de vida del componente
onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <div class="slider-container">
    <div
      v-for="(slide, index) in slides"
      :key="slide.id"
      class="slide"
      :class="{ active: index === currentSlideIndex }"
    >
      <img :src="slide.image" :alt="slide.title" class="slide-image" />

      <div class="overlay"></div>

      <div class="content container">
        <h2 class="title">{{ slide.title }}</h2>
        <p v-if="slide.subtitle" class="subtitle">{{ slide.subtitle }}</p>
        <button class="btn-primary">{{ slide.buttonText }}</button>
      </div>
    </div>

    <div class="indicators">
      <button
        v-for="(slide, index) in slides"
        :key="'dot-' + slide.id"
        class="dot"
        :class="{ active: index === currentSlideIndex }"
        @click="goToSlide(index)"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.slider-container {
  position: relative;
  height: 500px; /* Altura fija para el slider */
  overflow: hidden;
  background-color: #000; /* Fondo negro por si la imagen tarda en cargar */
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out; /* Suavidad del cambio */
  z-index: 1;
}

.slide.active {
  opacity: 1;
  z-index: 2;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* El truco para la legibilidad: Degradado de izquierda a derecha */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: 1;
}

.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Centrado por defecto */
  width: 100%;
  max-width: 1200px; /* Coincide con tu container global */
  padding: 0 20px;
  z-index: 2; /* Encima del overlay */
  color: white;

  /* Alineamos el texto a la izquierda dentro del container */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Sombra extra para legibilidad */
  max-width: 600px;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 500px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Indicadores */
.indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 3;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: background 0.3s;
}

.dot.active {
  background: var(--color-primary); /* Se pone naranja al estar activo */
  border-color: var(--color-primary);
}

/* Responsividad para móviles */
@media (max-width: 768px) {
  .slider-container {
    height: 400px;
  }
  .title {
    font-size: 2rem;
  }
  .overlay {
    /* En móvil oscurecemos toda la imagen un poco más */
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>
