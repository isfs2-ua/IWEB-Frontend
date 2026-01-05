export interface Media {
  id: number
  producto_id: number
  url: string
  tipo: string // 'imagen', 'video', etc.
  descripcion: string
  es_principal: boolean
}

export interface ProductVariant {
  id: number
  producto_id: number
  sku: string
  atributo1: string // Ej: Color
  atributo2: string // Ej: Talla
  precio: number
  cantidad_stock: number
}

export interface Category {
  id: number
  nombre: string
  parent_id?: number | null
}

export interface Review {
  id: number
  usuario: string
  avatar?: string // Opcional
  valoracion: number // 1 a 5
  comentario: string
  fecha: string
  titulo: string
}

export interface Product {
  id: number
  nombre: string
  referencia: number
  descripcion: string
  marca: string
  precio: number
  precio_oferta: number | null // Puede ser nulo si no hay oferta
  visible: boolean
  media?: Media[]
  variantes?: ProductVariant[]
  categorias?: Category[]
  genero?: 'Hombre' | 'Mujer' | 'Niño' | 'Niña' | 'Unisex'
  tallas?: string[] // Ej: ['S', 'M', 'L', '40', '42']
  colores?: string[] // Ej: ['Negro', 'Azul', 'Rojo']
  stock?: number
  caracteristicas?: string[] // Lista de puntos (bullets)
  composicion?: string
  reviews?: Review[]
  otros_colores_img?: string[] // URLs de las fotitos de otros colores
}

export interface CartItem {
  id: number
  usuario_id: number
  producto_id: number
  cantidad: number
  // En el frontend solemos necesitar datos del producto para mostrarlo (nombre, img) así que extendemos un poco la interfaz base de la BD.
  producto?: Product
}

export interface UserPreferences {
  id: number
  alias: string // Ej: "Mi perfil", "Hijo mayor", etc.
  genero: string
  talla: string
  tallaPie: string
  intereses: string[] // ['Running', 'Tenis']
}

export interface UserProfile {
  username: string
  email: string
  nombre: string
  apellidos: string
  telefono: string
  fechaNacimiento: string
  formularios: UserPreferences[]
}
