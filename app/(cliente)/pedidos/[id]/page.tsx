import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { EstadoPedido } from '@/types'
import BotonDescargaPDF from './BotonDescargaPDF'

const estadoConfig: Record<EstadoPedido, { label: string; className: string }> = {
  BORRADOR:       { label: 'Borrador',       className: 'bg-gray-100 text-gray-500' },
  ENVIADO:        { label: 'Enviado',         className: 'bg-yellow-100 text-yellow-700' },
  CONFIRMADO:     { label: 'Confirmado',      className: 'bg-blue-100 text-blue-700' },
  CON_FALTANTES:  { label: 'Con faltantes',   className: 'bg-orange-100 text-orange-700' },
  EN_PREPARACION: { label: 'En preparación',  className: 'bg-purple-100 text-purple-700' },
  ENTREGADO:      { label: 'Entregado',       className: 'bg-green-100 text-green-700' },
  CANCELADO:      { label: 'Cancelado',       className: 'bg-gray-100 text-gray-400' },
}

export default async function DetallePedidoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pedido } = await supabase
    .from('pedidos')
    .select(`
      id, numero_pedido, fecha_pedido, estado, total_estimado, notas_cliente,
      detalle_pedido(
        id, cantidad_solicitada, cantidad_confirmada, precio_unitario, subtotal, notas_item, faltante,
        producto_unidad:producto_unidad_id(unidad, producto:producto_id(nombre))
      )
    `)
    .eq('id', id)
    .eq('cliente_id', user.id)
    .single()

  if (!pedido) notFound()

  const config = estadoConfig[pedido.estado as EstadoPedido]
  const fecha = new Date(pedido.fecha_pedido).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  type DetalleItem = {
    id: string
    cantidad_solicitada: number
    cantidad_confirmada: number | null
    precio_unitario: number
    subtotal: number | null
    notas_item: string | null
    faltante: boolean
    producto_unidad: { unidad: string; producto: { nombre: string } } | null
  }

  const items = pedido.detalle_pedido as unknown as DetalleItem[]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/pedidos" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-800 leading-tight">
            Pedido #{pedido.numero_pedido}
          </h1>
          <p className="text-xs text-gray-400">{fecha}</p>
        </div>
        <span className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full ${config.className}`}>
          {config.label}
        </span>
      </header>

      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        {/* Items */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Productos — {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
            </p>
          </div>
          <div className="divide-y">
            {items.map((item) => {
              const pu = item.producto_unidad
              const subtotal = item.subtotal ?? item.cantidad_solicitada * item.precio_unitario
              return (
                <div key={item.id} className={`px-4 py-3 ${item.faltante ? 'bg-orange-50' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800">
                        {pu?.producto?.nombre ?? '—'}
                        {item.faltante && (
                          <span className="ml-2 text-xs text-orange-600 font-normal">Sin stock</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {item.cantidad_solicitada} {pu?.unidad} · ${item.precio_unitario.toLocaleString('es-AR')} c/u
                        {item.cantidad_confirmada != null && item.cantidad_confirmada !== item.cantidad_solicitada && (
                          <span className="text-orange-600"> → confirmado: {item.cantidad_confirmada}</span>
                        )}
                      </p>
                      {item.notas_item && (
                        <p className="text-xs text-gray-400 mt-0.5 italic">{item.notas_item}</p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 shrink-0">
                      ${subtotal.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-2xl border px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Total estimado</span>
            <span className="text-xl font-bold text-gray-800">
              ${(pedido.total_estimado ?? 0).toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Notas */}
        {pedido.notas_cliente && (
          <div className="bg-white rounded-2xl border px-4 py-4">
            <p className="text-sm font-semibold text-gray-600 mb-1">Notas del pedido</p>
            <p className="text-sm text-gray-600">{pedido.notas_cliente}</p>
          </div>
        )}

        {/* PDF */}
        <BotonDescargaPDF pedidoId={id} />
      </div>
    </div>
  )
}
