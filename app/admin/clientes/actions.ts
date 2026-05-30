'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function crearClienteAction(datos: {
  nombre: string; email: string; password: string
  telefono: string; direccion: string; zona_entrega: string; dia_entrega: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Crear usuario en Supabase Auth
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const admin = createAdminClient()

  const { data: nuevoUser, error } = await admin.auth.admin.createUser({
    email: datos.email,
    password: datos.password,
    email_confirm: true,
  })

  if (error || !nuevoUser.user) return { error: error?.message ?? 'Error al crear usuario' }

  await admin.from('usuarios').update({
    nombre: datos.nombre.trim(),
    telefono: datos.telefono.trim() || null,
    direccion: datos.direccion.trim() || null,
    zona_entrega: datos.zona_entrega.trim() || null,
    dia_entrega: datos.dia_entrega.trim() || null,
    rol: 'cliente',
    activo: true,
  }).eq('id', nuevoUser.user.id)

  revalidatePath('/admin/clientes')
  return { error: null }
}

export async function actualizarClienteAction(id: string, datos: {
  nombre: string; telefono: string; direccion: string
  zona_entrega: string; dia_entrega: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('usuarios').update({
    nombre: datos.nombre.trim(),
    telefono: datos.telefono.trim() || null,
    direccion: datos.direccion.trim() || null,
    zona_entrega: datos.zona_entrega.trim() || null,
    dia_entrega: datos.dia_entrega.trim() || null,
  }).eq('id', id)

  revalidatePath(`/admin/clientes/${id}`)
  revalidatePath('/admin/clientes')
}

export async function toggleClienteAction(id: string, activo: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('usuarios').update({ activo }).eq('id', id)
  revalidatePath('/admin/clientes')
}

export type PrecioEspecialInput = {
  producto_unidad_id: string
  precio_especial: number | null
}

export async function guardarPreciosEspecialesAction(
  clienteId: string,
  precios: PrecioEspecialInput[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  for (const p of precios) {
    const { data: existente } = await supabase
      .from('precios_cliente')
      .select('id')
      .eq('cliente_id', clienteId)
      .eq('producto_unidad_id', p.producto_unidad_id)
      .maybeSingle()

    if (p.precio_especial && p.precio_especial > 0) {
      if (existente) {
        await supabase.from('precios_cliente')
          .update({ precio_especial: p.precio_especial, activo: true })
          .eq('id', existente.id)
      } else {
        await supabase.from('precios_cliente')
          .insert({ cliente_id: clienteId, producto_unidad_id: p.producto_unidad_id, precio_especial: p.precio_especial, activo: true })
      }
    } else if (existente) {
      await supabase.from('precios_cliente').delete().eq('id', existente.id)
    }
  }

  revalidatePath(`/admin/clientes/${clienteId}`)
}
