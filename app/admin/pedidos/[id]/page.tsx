import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { EstadoPedido } from '@/types'
import FormularioPedidoAdmin from './FormularioPedidoAdmin'

const estadoBadge: Record<EstadoPedido, string> = {
  BORRADOR:       'bg-gray-100 text-gray-500',
  ENVIADO:        'bg-yellow-100 text-yellow-700',
  CONFIRMADO:     'bg-blue-100 text-blue-700',
  CON_FALTANTES:  'bg-orange-100 text-orange-700',
  EN_PREPARACION: 'bg-purple-100 text-purple-700',
  ENTREGADO:      'bg-green-100 text-green-700',
  CANCELADO:      'bg-gray-100 text-gray-400',
}

const estadoLabel: Record<EstadoPedido, string> = {
  BORRADOR: 'Borrador', ENVIADO: 'Enviado', CONFIRMADO: 'Confirmado',
  CON_FALTANTES: 'Con faltantes', EN_PREPARACION: 'En preparación',
  ENTREGADO: 'Entregado', CANCELADO: 'Cancelado',
}

export default async function AdminDetallePedidoPage({
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
      id, numero_pedido, fecha_pedido, estado, total_estimado, notas_cliente, notas_admin,
      cliente:cliente_id(nombre, telefono, zona_entrega),
      detalle_pedido(
        id, cantidad_solicitada, cantidad_confirmada, precio_unitario, notas_item, faltante,
        producto_unidad:producto_unidad_id(unidad, producto:producto_id(nombre))
      )
    `)
    .eq('id', id)
    .single()

  if (!pedido) notFound()

  type Cliente = { nombre: string; telefono: string | null; zona_entrega: string | null }
  type DetalleRaw = {
    id: string
    cantidad_solicitada: number
    cantidad_confirmada: number | null
    precio_unitario: number
    notas_item: string | null
    faltante: boolean
    producto_unidad: { unidad: string; producto: { nombre: string } } | null
  }

  const cliente = pedido.cliente as unknown as Cliente | null
  const detalles = pedido.detalle_pedido as unknown as DetalleRaw[]
  const estado = pedido.estado as EstadoPedido

  const fecha = new Date(pedido.fecha_pedido).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const items = detalles.map((d) => ({
    id: d.id,
    cantidad_solicitada: d.cantidad_solicitada,
    cantidad_confirmada: d.cantidad_confirmada,
    precio_unitario: d.precio_unitario,
    notas_item: d.notas_item,
    faltante: d.faltante,
    nombre: d.producto_unidad?.producto?.nombre ?? '—',
    unidad: d.producto_unidad?.unidad ?? '—',
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/admin/pedidos" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-bold text-gray-800">
              Pedido #{pedido.numero_pedido}
            </h1>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${estadoBadge[estado]}`}>
              {estadoLabel[estado]}
            </span>
          </div>
          <p className="text-xs text-gray-400">{fecha}</p>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto pb-8">
        {/* Info cliente */}
        <div className="bg-white rounded-2xl border px-4 py-4 space-y-1">
          <p className="font-semibold text-gray-800">{cliente?.nombre ?? '—'}</p>
          {cliente?.telefono && (
            <a href={`tel:${cliente.telefono}`} className="text-sm text-green-600 hover:underline">
              {cliente.telefono}
            </a>
          )}
          {cliente?.zona_entrega && (
            <p className="text-sm text-gray-500">Zona: {cliente.zona_entrega}</p>
          )}
          {pedido.notas_cliente && (
            <p className="text-sm text-gray-500 italic mt-1">"{pedido.notas_cliente}"</p>
          )}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between bg-white rounded-2xl border px-4 py-3">
          <span className="text-gray-500 text-sm">Total estimado</span>
          <span className="font-bold text-gray-800">
            ${(pedido.total_estimado ?? 0).toLocaleString('es-AR')}
          </span>
        </div>

        <FormularioPedidoAdmin
          pedidoId={id}
          estado={estado}
          notasAdminInicial={pedido.notas_admin}
          items={items}
        />
      </div>
    </div>
  )
}
