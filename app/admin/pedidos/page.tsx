import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { EstadoPedido } from '@/types'

const ESTADOS: { value: EstadoPedido | 'TODOS'; label: string }[] = [
  { value: 'TODOS',          label: 'Todos' },
  { value: 'ENVIADO',        label: 'Enviados' },
  { value: 'CONFIRMADO',     label: 'Confirmados' },
  { value: 'EN_PREPARACION', label: 'Preparando' },
  { value: 'CON_FALTANTES',  label: 'Faltantes' },
  { value: 'ENTREGADO',      label: 'Entregados' },
]

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

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>
}) {
  const { estado } = await searchParams
  const filtro = (estado ?? 'TODOS') as EstadoPedido | 'TODOS'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  let query = admin
    .from('pedidos')
    .select(`
      id, numero_pedido, fecha_pedido, estado, total_estimado,
      cliente:cliente_id(nombre),
      detalle_pedido(id)
    `)
    .neq('estado', 'BORRADOR')
    .order('fecha_pedido', { ascending: false })

  if (filtro !== 'TODOS') {
    query = query.eq('estado', filtro)
  }

  const { data: pedidos } = await query

  return (
    <div>
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-800 mb-3">Pedidos</h1>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {ESTADOS.map(({ value, label }) => (
            <Link
              key={value}
              href={value === 'TODOS' ? '/admin/pedidos' : `/admin/pedidos?estado=${value}`}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filtro === value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </header>

      <div className="px-4 py-3 space-y-2 max-w-lg mx-auto">
        {!pedidos?.length ? (
          <p className="text-center text-gray-400 text-sm py-12">No hay pedidos</p>
        ) : (
          pedidos.map((pedido) => {
            const cliente = pedido.cliente as unknown as { nombre: string } | null
            const cantItems = (pedido.detalle_pedido as { id: string }[]).length
            const fecha = new Date(pedido.fecha_pedido).toLocaleDateString('es-AR', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })

            return (
              <Link
                key={pedido.id}
                href={`/admin/pedidos/${pedido.id}`}
                className="flex items-center justify-between gap-3 bg-white rounded-2xl border px-4 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-semibold text-gray-800">#{pedido.numero_pedido}</span>
                    <span className="font-medium text-gray-700 truncate">
                      {cliente?.nombre ?? '—'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoBadge[pedido.estado as EstadoPedido]}`}>
                      {estadoLabel[pedido.estado as EstadoPedido]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {fecha} · {cantItems} productos
                    {pedido.total_estimado != null ? ` · $${pedido.total_estimado.toLocaleString('es-AR')}` : ''}
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
