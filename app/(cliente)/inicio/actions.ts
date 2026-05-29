'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function repetirPedidoAction(pedidoId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: items } = await supabase
    .from('detalle_pedido')
    .select('producto_unidad_id, cantidad_solicitada, notas_item, producto_unidad:producto_unidad_id(precio_base)')
    .eq('pedido_id', pedidoId)

  if (!items || items.length === 0) redirect('/catalogo')

  const productUnitIds = items.map(i => i.producto_unidad_id)

  const { data: preciosEspeciales } = await supabase
    .from('precios_cliente')
    .select('producto_unidad_id, precio_especial')
    .eq('cliente_id', user.id)
    .in('producto_unidad_id', productUnitIds)
    .eq('activo', true)

  const preciosMap = new Map(
    (preciosEspeciales ?? []).map(p => [p.producto_unidad_id, p.precio_especial])
  )

  const { data: nuevoPedido } = await supabase
    .from('pedidos')
    .insert({ cliente_id: user.id, estado: 'BORRADOR', fecha_pedido: new Date().toISOString() })
    .select('id')
    .single()

  if (!nuevoPedido) throw new Error('Error al crear pedido')

  await supabase.from('detalle_pedido').insert(
    items.map(item => ({
      pedido_id: nuevoPedido.id,
      producto_unidad_id: item.producto_unidad_id,
      cantidad_solicitada: item.cantidad_solicitada,
      precio_unitario: preciosMap.get(item.producto_unidad_id)
        ?? (item.producto_unidad as { precio_base: number } | null)?.precio_base
        ?? 0,
      notas_item: item.notas_item,
    }))
  )

  redirect(`/carrito?borrador=${nuevoPedido.id}`)
}
