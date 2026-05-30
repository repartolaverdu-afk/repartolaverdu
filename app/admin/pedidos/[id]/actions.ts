'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { EstadoPedido } from '@/types'

export type ItemUpdate = {
  id: string
  cantidad_confirmada: number
  faltante: boolean
  notas_item: string
}

export async function confirmarPedidoAdminAction(
  pedidoId: string,
  items: ItemUpdate[],
  notasAdmin: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await Promise.all(
    items.map((item) =>
      supabase
        .from('detalle_pedido')
        .update({
          cantidad_confirmada: item.cantidad_confirmada,
          faltante: item.faltante,
          notas_item: item.notas_item.trim() || null,
        })
        .eq('id', item.id)
    )
  )

  const hayFaltantes = items.some((i) => i.faltante)
  const nuevoEstado: EstadoPedido = hayFaltantes ? 'CON_FALTANTES' : 'CONFIRMADO'

  await supabase
    .from('pedidos')
    .update({
      estado: nuevoEstado,
      notas_admin: notasAdmin.trim() || null,
    })
    .eq('id', pedidoId)

  revalidatePath(`/admin/pedidos/${pedidoId}`)
  revalidatePath('/admin/pedidos')
  revalidatePath('/admin/dashboard')
}

export async function cambiarEstadoAction(pedidoId: string, estado: EstadoPedido) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('pedidos').update({ estado }).eq('id', pedidoId)

  revalidatePath(`/admin/pedidos/${pedidoId}`)
  revalidatePath('/admin/pedidos')
  revalidatePath('/admin/dashboard')
}
