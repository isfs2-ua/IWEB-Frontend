import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types'

export const useProductStore = defineStore('products', () => {
  const allProducts = ref<Product[]>([
    {
      id: 1,
      nombre: 'Pantalón Largo Hombre Running Nike',
      referencia: 101,
      descripcion: 'Tejido Dri-FIT.',
      marca: 'Nike',
      precio: 59.99,
      precio_oferta: null,
      visible: true,
      genero: 'Hombre',
      tallas: ['S', 'M', 'L', 'XL'],
      colores: ['Negro', 'Gris'],
      media: [
        {
          id: 1,
          producto_id: 1,
          url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop',
          tipo: 'imagen',
          descripcion: '',
          es_principal: true,
        },
      ],
    },
    {
      id: 2,
      nombre: 'Camiseta Adidas Originals',
      referencia: 102,
      descripcion: 'Clásica.',
      marca: 'Adidas',
      precio: 29.99,
      precio_oferta: null,
      visible: true,
      genero: 'Mujer',
      tallas: ['XS', 'S', 'M'],
      colores: ['Blanco', 'Rojo'],
      media: [
        {
          id: 2,
          producto_id: 2,
          url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop',
          tipo: 'imagen',
          descripcion: '',
          es_principal: true,
        },
      ],
    },
    {
      id: 3,
      nombre: 'Zapatillas Puma Future',
      referencia: 103,
      descripcion: 'Agarre profesional.',
      marca: 'Puma',
      precio: 120.0,
      precio_oferta: null,
      visible: true,
      genero: 'Niño',
      tallas: ['36', '37', '38'],
      colores: ['Azul', 'Amarillo'],
      media: [
        {
          id: 3,
          producto_id: 3,
          url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1964&auto=format&fit=crop',
          tipo: 'imagen',
          descripcion: '',
          es_principal: true,
        },
      ],
    },
    // ... añade más productos si quieres probar más filtros
  ])

  return { allProducts }
})
