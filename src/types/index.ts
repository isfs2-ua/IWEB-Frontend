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
}

export interface CartItem {
  id: number
  usuario_id: number
  producto_id: number
  cantidad: number
  // En el frontend solemos necesitar datos del producto para mostrarlo (nombre, img) así que extendemos un poco la interfaz base de la BD.
  producto?: Product
}
