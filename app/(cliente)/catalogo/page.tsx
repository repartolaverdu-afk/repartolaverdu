import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Unidad } from '@/types'
import CatalogoBuscador from './CatalogoBuscador'

export type UnidadConPrecio = {
  id: string
  unidad: Unidad
  precio: number
}

export type ProductoCatalogo = {
  id: string
  nombre: string
  categoria: string | null
  unidades: UnidadConPrecio[]
}

export default async function CatalogoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: unidades }, { data: preciosEspeciales }] = await Promise.all([
    supabase
      .from('producto_unidades')
      .select('id, unidad, precio_base, producto:producto_id(id, nombre, categoria, activo)')
      .eq('activo', true),
    supabase
      .from('precios_cliente')
      .select('producto_unidad_id, precio_especial')
      .eq('cliente_id', user.id)
      .eq('activo', true),
  ])

  const preciosMap = new Map(
    (preciosEspeciales ?? []).map((p) => [p.producto_unidad_id, p.precio_especial])
  )

  const productosMap = new Map<string, ProductoCatalogo>()

  for (const u of unidades ?? []) {
    const prod = u.producto as unknown as { id: string; nombre: string; categoria: string | null; activo: boolean } | null
    if (!prod?.activo) continue

    if (!productosMap.has(prod.id)) {
      productosMap.set(prod.id, {
        id: prod.id,
        nombre: prod.nombre,
        categoria: prod.categoria,
        unidades: [],
      })
    }

    productosMap.get(prod.id)!.unidades.push({
      id: u.id,
      unidad: u.unidad as Unidad,
      precio: preciosMap.get(u.id) ?? u.precio_base,
    })
  }

  const productos = Array.from(productosMap.values()).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es')
  )

  return <CatalogoBuscador productos={productos} />
}
