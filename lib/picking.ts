import type { SupabaseClient } from '@supabase/supabase-js'
import type { PickingPorProducto, PickingPorCliente } from '@/components/pdf/PickingListPDF'

export async function buildPickingData(supabase: SupabaseClient) {
  const { data: pedidos } = await supabase
    .from('pedidos')
    .select('id, numero_pedido, cliente:cliente_id(nombre)')
    .in('estado', ['CONFIRMADO', 'CON_FALTANTES', 'EN_PREPARACION'])

  if (!pedidos?.length) return { porProducto: [], porCliente: [] }

  const pedidoIds = pedidos.map((p) => p.id)
  const pedidoMap = new Map(
    pedidos.map((p) => [
      p.id,
      {
        numeroPedido: p.numero_pedido as number,
        clienteNombre: (p.cliente as unknown as { nombre: string } | null)?.nombre ?? '—',
      },
    ])
  )

  const { data: detalles } = await supabase
    .from('detalle_pedido')
    .select(`
      pedido_id, cantidad_confirmada,
      producto_unidad:producto_unidad_id(
        id, unidad,
        producto:producto_id(nombre, categoria)
      )
    `)
    .in('pedido_id', pedidoIds)
    .eq('faltante', false)
    .not('cantidad_confirmada', 'is', null)
    .gt('cantidad_confirmada', 0)

  if (!detalles?.length) return { porProducto: [], porCliente: [] }

  // ── Por producto ──────────────────────────────────────────
  const productoMap = new Map<string, PickingPorProducto>()

  for (const d of detalles) {
    const pu = d.producto_unidad as unknown as {
      id: string; unidad: string;
      producto: { nombre: string; categoria: string | null }
    } | null
    if (!pu) continue

    const key = pu.id
    const pedInfo = pedidoMap.get(d.pedido_id)!
    const cant = d.cantidad_confirmada as number

    if (!productoMap.has(key)) {
      productoMap.set(key, {
        nombre: pu.producto.nombre,
        categoria: pu.producto.categoria,
        unidad: pu.unidad,
        totalConfirmado: 0,
        clientes: [],
      })
    }
    const entry = productoMap.get(key)!
    entry.totalConfirmado += cant
    entry.clientes.push({
      nombre: pedInfo.clienteNombre,
      numeroPedido: pedInfo.numeroPedido,
      cantidad: cant,
    })
  }

  const porProducto = Array.from(productoMap.values()).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es')
  )

  // ── Por cliente ───────────────────────────────────────────
  const clienteMap = new Map<string, PickingPorCliente>()

  for (const d of detalles) {
    const pu = d.producto_unidad as unknown as {
      id: string; unidad: string;
      producto: { nombre: string }
    } | null
    if (!pu) continue

    const pedInfo = pedidoMap.get(d.pedido_id)!
    const key = `${d.pedido_id}`
    const cant = d.cantidad_confirmada as number

    if (!clienteMap.has(key)) {
      clienteMap.set(key, {
        clienteNombre: pedInfo.clienteNombre,
        numeroPedido: pedInfo.numeroPedido,
        items: [],
      })
    }
    clienteMap.get(key)!.items.push({
      nombre: pu.producto.nombre,
      unidad: pu.unidad,
      cantidad: cant,
    })
  }

  const porCliente = Array.from(clienteMap.values()).sort((a, b) =>
    a.clienteNombre.localeCompare(b.clienteNombre, 'es')
  )

  return { porProducto, porCliente }
}
