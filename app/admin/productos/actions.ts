'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Unidad } from '@/types'

export type UnidadInput = { unidad: Unidad; precio_base: number }

export async function crearProductoAction(
  nombre: string,
  categoria: string,
  unidades: UnidadInput[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: producto } = await supabase
    .from('productos')
    .insert({ nombre: nombre.trim(), categoria: categoria.trim() || null, activo: true })
    .select('id')
    .single()

  if (!producto) throw new Error('Error al crear producto')

  if (unidades.length > 0) {
    await supabase.from('producto_unidades').insert(
      unidades.map((u) => ({
        producto_id: producto.id,
        unidad: u.unidad,
        precio_base: u.precio_base,
        activo: true,
      }))
    )
  }

  revalidatePath('/admin/productos')
}

export async function actualizarProductoAction(
  id: string,
  nombre: string,
  categoria: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('productos')
    .update({ nombre: nombre.trim(), categoria: categoria.trim() || null })
    .eq('id', id)

  revalidatePath('/admin/productos')
}

export async function toggleProductoAction(id: string, activo: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('productos').update({ activo }).eq('id', id)
  revalidatePath('/admin/productos')
}

export async function actualizarUnidadAction(
  id: string,
  precio_base: number,
  activo: boolean
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('producto_unidades').update({ precio_base, activo }).eq('id', id)
  revalidatePath('/admin/productos')
}

export async function agregarUnidadAction(
  producto_id: string,
  unidad: Unidad,
  precio_base: number
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('producto_unidades')
    .insert({ producto_id, unidad, precio_base, activo: true })

  revalidatePath('/admin/productos')
}

export type FilaImport = {
  nombre: string
  categoria: string
  unidad: string
  precio_base: number
}

export async function importarProductosAction(filas: FilaImport[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Agrupar por nombre+categoria
  const grupos = new Map<string, FilaImport[]>()
  for (const fila of filas) {
    const key = `${fila.nombre.trim().toLowerCase()}|${fila.categoria.trim().toLowerCase()}`
    if (!grupos.has(key)) grupos.set(key, [])
    grupos.get(key)!.push(fila)
  }

  for (const [, items] of grupos) {
    const primera = items[0]
    const nombre = primera.nombre.trim()
    const categoria = primera.categoria.trim() || null

    // Buscar producto existente
    let { data: existente } = await supabase
      .from('productos')
      .select('id')
      .ilike('nombre', nombre)
      .maybeSingle()

    if (!existente) {
      const { data } = await supabase
        .from('productos')
        .insert({ nombre, categoria, activo: true })
        .select('id')
        .single()
      existente = data
    }

    if (!existente) continue

    for (const item of items) {
      const unidadVal = item.unidad.trim().toLowerCase() as Unidad

      // Verificar si ya existe esa unidad para este producto
      const { data: unidadExistente } = await supabase
        .from('producto_unidades')
        .select('id')
        .eq('producto_id', existente.id)
        .eq('unidad', unidadVal)
        .maybeSingle()

      if (unidadExistente) {
        await supabase
          .from('producto_unidades')
          .update({ precio_base: item.precio_base, activo: true })
          .eq('id', unidadExistente.id)
      } else {
        await supabase
          .from('producto_unidades')
          .insert({ producto_id: existente.id, unidad: unidadVal, precio_base: item.precio_base, activo: true })
      }
    }
  }

  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')
}
