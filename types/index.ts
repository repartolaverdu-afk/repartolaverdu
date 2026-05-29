export type Rol = 'admin' | 'cliente'
export type Unidad = 'kg' | 'cajon' | 'bolsa' | 'atado' | 'unidad'
export type EstadoPedido =
  | 'BORRADOR' | 'ENVIADO' | 'CONFIRMADO'
  | 'CON_FALTANTES' | 'EN_PREPARACION' | 'ENTREGADO' | 'CANCELADO'

export interface Usuario {
  id: string
  nombre: string
  telefono: string | null
  direccion: string | null
  zona_entrega: string | null
  dia_entrega: string | null
  rol: Rol
  activo: boolean
  creado_en: string
}

export interface Producto {
  id: string
  nombre: string
  categoria: string | null
  imagen_url: string | null
  activo: boolean
  creado_en: string
}

export interface ProductoUnidad {
  id: string
  producto_id: string
  unidad: Unidad
  precio_base: number
  activo: boolean
  producto?: Producto
}

export interface PrecioCliente {
  id: string
  cliente_id: string
  producto_unidad_id: string
  precio_especial: number
  activo: boolean
}

export interface Pedido {
  id: string
  numero_pedido: number
  cliente_id: string
  estado: EstadoPedido
  fecha_pedido: string
  fecha_entrega: string | null
  zona_entrega: string | null
  notas_cliente: string | null
  notas_admin: string | null
  total_estimado: number | null
  cliente?: Usuario
  detalle?: DetallePedido[]
}

export interface DetallePedido {
  id: string
  pedido_id: string
  producto_unidad_id: string
  cantidad_solicitada: number
  cantidad_confirmada: number | null
  precio_unitario: number
  subtotal: number | null
  faltante: boolean
  notas_item: string | null
  producto_unidad?: ProductoUnidad
}

export interface ItemCarrito {
  producto_unidad_id: string
  producto_nombre: string
  unidad: Unidad
  cantidad: number
  precio_unitario: number
  notas_item: string
}
