import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBasket, ClipboardList, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import RepetirPedidoButton from './RepetirPedidoButton'

export default async function InicioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: usuario }, { data: ultimoPedido }] = await Promise.all([
    supabase.from('usuarios').select('nombre').eq('id', user.id).single(),
    supabase
      .from('pedidos')
      .select('id, numero_pedido, fecha_pedido, total_estimado, detalle_pedido(id)')
      .eq('cliente_id', user.id)
      .not('estado', 'in', '("BORRADOR","CANCELADO")')
      .order('fecha_pedido', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const nombre = usuario?.nombre?.split(' ')[0] ?? 'Cliente'
  const cantidadItems = ultimoPedido
    ? (ultimoPedido.detalle_pedido as { id: string }[]).length
    : 0
  const fechaUltimo = ultimoPedido
    ? new Date(ultimoPedido.fecha_pedido).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
    : null

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-5 py-4">
        <p className="text-sm text-gray-500">Buen día,</p>
        <h1 className="text-xl font-bold text-gray-800">{nombre}</h1>
      </header>

      <div className="flex-1 px-5 py-6 space-y-4 max-w-lg mx-auto w-full">
        <p className="text-gray-600 font-medium">¿Qué querés hacer?</p>

        <Link
          href="/catalogo"
          className="flex items-center justify-between bg-green-600 hover:bg-green-700 text-white rounded-2xl px-6 py-5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShoppingBasket className="w-6 h-6" />
            <span className="text-lg font-semibold">Nuevo pedido</span>
          </div>
          <ChevronRight className="w-5 h-5 opacity-80" />
        </Link>

        {ultimoPedido ? (
          <div className="bg-white rounded-2xl border p-5 space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Último pedido</p>
              <p className="font-semibold text-gray-800">Pedido #{ultimoPedido.numero_pedido}</p>
              <p className="text-sm text-gray-500">
                {fechaUltimo} · {cantidadItems} {cantidadItems === 1 ? 'producto' : 'productos'}
                {ultimoPedido.total_estimado
                  ? ` · $${ultimoPedido.total_estimado.toLocaleString('es-AR')}`
                  : ''}
              </p>
            </div>
            <RepetirPedidoButton pedidoId={ultimoPedido.id} />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border p-5 text-center text-gray-400 text-sm">
            Todavía no tenés pedidos anteriores
          </div>
        )}

        <Link
          href="/pedidos"
          className="flex items-center justify-between bg-white border rounded-2xl px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Mis pedidos</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </Link>
      </div>
    </main>
  )
}
