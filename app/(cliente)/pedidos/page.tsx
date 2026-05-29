import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { EstadoPedido } from '@/types'

const estadoConfig: Record<EstadoPedido, { label: string; className: string }> = {
  BORRADOR:       { label: 'Borrador',        className: 'bg-gray-100 text-gray-500' },
  ENVIADO:        { label: 'Enviado',          className: 'bg-yellow-100 text-yellow-700' },
  CONFIRMADO:     { label: 'Confirmado',       className: 'bg-blue-100 text-blue-700' },
  CON_FALTANTES:  { label: 'Con faltantes',    className: 'bg-orange-100 text-orange-700' },
  EN_PREPARACION: { label: 'En preparación',   className: 'bg-purple-100 text-purple-700' },
  ENTREGADO:      { label: 'Entregado',        className: 'bg-green-100 text-green-700' },
  CANCELADO:      { label: 'Cancelado',        className: 'bg-gray-100 text-gray-400' },
}

export default async function MisPedidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pedidos } = await supabase
    .from('pedidos')
    .select('id, numero_pedido, fecha_pedido, estado, total_estimado, detalle_pedido(id)')
    .eq('cliente_id', user.id)
    .neq('estado', 'BORRADOR')
    .order('fecha_pedido', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/inicio" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Mis pedidos</h1>
      </header>

      <div className="px-4 py-4 space-y-3 max-w-lg mx-auto">
        {!pedidos?.length ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-gray-400">Todavía no tenés pedidos</p>
            <Link
              href="/catalogo"
              className="inline-block text-green-600 font-medium hover:underline"
            >
              Hacer mi primer pedido →
            </Link>
          </div>
        ) : (
          pedidos.map((pedido) => {
            const config = estadoConfig[pedido.estado as EstadoPedido]
            const cantItems = (pedido.detalle_pedido as { id: string }[]).length
            const fecha = new Date(pedido.fecha_pedido).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })

            return (
              <Link
                key={pedido.id}
                href={`/pedidos/${pedido.id}`}
                className="flex items-center justify-between gap-3 bg-white rounded-2xl border px-4 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-gray-800">
                      Pedido #{pedido.numero_pedido}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.className}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {fecha}
                    {' · '}
                    {cantItems} {cantItems === 1 ? 'producto' : 'productos'}
                    {pedido.total_estimado != null
                      ? ` · $${pedido.total_estimado.toLocaleString('es-AR')}`
                      : ''}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
