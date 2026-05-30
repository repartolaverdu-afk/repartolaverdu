import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ClipboardList, ListOrdered, AlertCircle, Truck, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const hoy = new Date().toISOString().split('T')[0]

  const [
    { count: enviados },
    { count: enProceso },
    { count: entregadosHoy },
    { data: totalesHoy },
  ] = await Promise.all([
    supabase.from('pedidos').select('*', { count: 'exact', head: true })
      .eq('estado', 'ENVIADO'),
    supabase.from('pedidos').select('*', { count: 'exact', head: true })
      .in('estado', ['CONFIRMADO', 'CON_FALTANTES', 'EN_PREPARACION']),
    supabase.from('pedidos').select('*', { count: 'exact', head: true })
      .eq('estado', 'ENTREGADO')
      .gte('fecha_pedido', hoy),
    supabase.from('pedidos').select('total_estimado')
      .not('estado', 'in', '("BORRADOR","CANCELADO")')
      .gte('fecha_pedido', hoy),
  ])

  const totalDia = (totalesHoy ?? []).reduce(
    (acc, p) => acc + (p.total_estimado ?? 0), 0
  )

  const fecha = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <div>
      <header className="bg-white border-b px-5 py-4">
        <p className="text-sm text-gray-400 capitalize">{fecha}</p>
        <h1 className="text-xl font-bold text-gray-800">Panel Admin</h1>
      </header>

      <div className="px-4 py-5 space-y-4 max-w-lg mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Por confirmar</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{enviados ?? 0}</p>
            <p className="text-xs text-gray-400 mt-0.5">pedidos enviados</p>
          </div>

          <div className="bg-white rounded-2xl border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">En proceso</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{enProceso ?? 0}</p>
            <p className="text-xs text-gray-400 mt-0.5">confirmados / preparando</p>
          </div>

          <div className="bg-white rounded-2xl border p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Entregados hoy</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{entregadosHoy ?? 0}</p>
            <p className="text-xs text-gray-400 mt-0.5">pedidos completados</p>
          </div>

          <div className="bg-white rounded-2xl border p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total del día</span>
            </div>
            <p className="text-xl font-bold text-green-600">
              ${totalDia.toLocaleString('es-AR')}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">estimado activos</p>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">Accesos rápidos</p>

          <Link
            href="/admin/pedidos"
            className="flex items-center justify-between bg-white rounded-2xl border px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-gray-800">Pedidos del día</p>
                <p className="text-xs text-gray-400">Ver, confirmar y gestionar</p>
              </div>
            </div>
            {(enviados ?? 0) > 0 && (
              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {enviados} nuevos
              </span>
            )}
          </Link>

          <Link
            href="/admin/picking"
            className="flex items-center justify-between bg-white rounded-2xl border px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ListOrdered className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-semibold text-gray-800">Picking list</p>
                <p className="text-xs text-gray-400">Lista consolidada para armar</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
