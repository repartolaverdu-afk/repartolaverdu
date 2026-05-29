'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ItemCarrito } from '@/types'

export async function confirmarPedidoAction(
  items: ItemCarrito[],
  notasCliente: string
): Promise<{ pedidoId: string; numeroPedido: number }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  if (!items.length) throw new Error('El carrito está vacío')

  const totalEstimado = items.reduce((acc, i) => acc + i.cantidad * i.precio_unitario, 0)

  const { data: pedido, error } = await supabase
    .from('pedidos')
    .insert({
      cliente_id: user.id,
      estado: 'ENVIADO',
      fecha_pedido: new Date().toISOString(),
      notas_cliente: notasCliente.trim() || null,
      total_estimado: totalEstimado,
    })
    .select('id, numero_pedido')
    .single()

  if (error || !pedido) throw new Error('Error al crear el pedido')

  await supabase.from('detalle_pedido').insert(
    items.map((item) => ({
      pedido_id: pedido.id,
      producto_unidad_id: item.producto_unidad_id,
      cantidad_solicitada: item.cantidad,
      precio_unitario: item.precio_unitario,
      subtotal: item.cantidad * item.precio_unitario,
      notas_item: item.notas_item.trim() || null,
    }))
  )

  return { pedidoId: pedido.id, numeroPedido: pedido.numero_pedido }
}
