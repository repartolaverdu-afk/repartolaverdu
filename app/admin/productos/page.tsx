import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GestionProductos from './GestionProductos'
import ImportarExcel from './ImportarExcel'

export default async function AdminProductosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: productos } = await supabase
    .from('productos')
    .select('id, nombre, categoria, activo, producto_unidades(id, unidad, precio_base, activo)')
    .order('nombre')

  return (
    <div>
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">Productos</h1>
          <ImportarExcel />
        </div>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto">
        <GestionProductos productos={(productos ?? []) as any} />
      </div>
    </div>
  )
}
