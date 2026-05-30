import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildPickingData } from '@/lib/picking'
import PickingTabs from './PickingTabs'

export default async function PickingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { porProducto, porCliente } = await buildPickingData(admin)

  const fecha = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <div>
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-800">Picking List</h1>
        <p className="text-xs text-gray-400 capitalize">{fecha}</p>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="mb-3 flex items-center gap-3">
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm">
            <span className="font-semibold text-green-700">{porProducto.length}</span>
            <span className="text-green-600 ml-1">productos distintos</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-sm">
            <span className="font-semibold text-blue-700">{porCliente.length}</span>
            <span className="text-blue-600 ml-1">pedidos activos</span>
          </div>
        </div>

        <PickingTabs porProducto={porProducto} porCliente={porCliente} />
      </div>
    </div>
  )
}
