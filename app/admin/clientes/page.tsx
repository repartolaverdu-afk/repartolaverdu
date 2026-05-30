import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { toggleClienteAction } from './actions'
import NuevoCliente from './NuevoCliente'

export default async function AdminClientesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: clientes } = await admin
    .from('usuarios')
    .select('id, nombre, telefono, zona_entrega, dia_entrega, activo')
    .eq('rol', 'cliente')
    .order('nombre')

  return (
    <div>
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Clientes</h1>
        <NuevoCliente />
      </header>

      <div className="px-4 py-4 space-y-2 max-w-lg mx-auto">
        {!clientes?.length ? (
          <p className="text-center text-gray-400 text-sm py-12">No hay clientes registrados</p>
        ) : (
          clientes.map((c) => (
            <div key={c.id} className={`bg-white rounded-2xl border overflow-hidden ${!c.activo ? 'opacity-60' : ''}`}>
              <Link href={`/admin/clientes/${c.id}`} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-800">{c.nombre}</p>
                  <p className="text-sm text-gray-500">
                    {[c.telefono, c.zona_entrega, c.dia_entrega].filter(Boolean).join(' · ') || 'Sin datos de contacto'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <form action={async () => {
                    'use server'
                    await toggleClienteAction(c.id, !c.activo)
                  }}>
                    <button type="submit"
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </form>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
