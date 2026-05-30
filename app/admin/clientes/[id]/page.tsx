import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { actualizarClienteAction } from '../actions'
import PreciosEspeciales from './PreciosEspeciales'

export default async function ClienteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: cliente }, { data: unidades }, { data: preciosEsp }] = await Promise.all([
    supabase.from('usuarios').select('id, nombre, telefono, direccion, zona_entrega, dia_entrega, activo').eq('id', id).single(),
    supabase.from('producto_unidades').select('id, unidad, precio_base, producto:producto_id(nombre, categoria)').eq('activo', true),
    supabase.from('precios_cliente').select('producto_unidad_id, precio_especial').eq('cliente_id', id).eq('activo', true),
  ])

  if (!cliente) notFound()

  const preciosMap = new Map(
    (preciosEsp ?? []).map((p) => [p.producto_unidad_id, p.precio_especial])
  )

  const unidadesConPrecio = (unidades ?? []).map((u) => {
    const prod = u.producto as unknown as { nombre: string; categoria: string | null } | null
    return {
      id: u.id,
      unidad: u.unidad,
      precio_base: u.precio_base,
      precioEspecial: preciosMap.get(u.id) ?? null,
      nombreProducto: prod?.nombre ?? '—',
      categoria: prod?.categoria ?? null,
    }
  }).sort((a, b) => a.nombreProducto.localeCompare(b.nombreProducto, 'es'))

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-10 flex items-center gap-3">
        <Link href="/admin/clientes" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-800">{cliente.nombre}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${cliente.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {cliente.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto pb-8">
        {/* Datos del cliente */}
        <form
          action={async (fd) => {
            'use server'
            await actualizarClienteAction(id, {
              nombre: fd.get('nombre') as string,
              telefono: fd.get('telefono') as string,
              direccion: fd.get('direccion') as string,
              zona_entrega: fd.get('zona_entrega') as string,
              dia_entrega: fd.get('dia_entrega') as string,
            })
          }}
          className="bg-white rounded-2xl border p-4 space-y-3"
        >
          <p className="text-sm font-semibold text-gray-700">Datos del cliente</p>
          {[
            { name: 'nombre', label: 'Nombre', defaultValue: cliente.nombre },
            { name: 'telefono', label: 'Teléfono', defaultValue: cliente.telefono ?? '' },
            { name: 'direccion', label: 'Dirección', defaultValue: cliente.direccion ?? '' },
            { name: 'zona_entrega', label: 'Zona de entrega', defaultValue: cliente.zona_entrega ?? '' },
            { name: 'dia_entrega', label: 'Día de entrega', defaultValue: cliente.dia_entrega ?? '' },
          ].map(({ name, label, defaultValue }) => (
            <div key={name}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                name={name}
                defaultValue={defaultValue}
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
          <button type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl py-3 text-sm transition-colors">
            Guardar datos
          </button>
        </form>

        {/* Precios especiales */}
        <PreciosEspeciales clienteId={id} unidades={unidadesConPrecio} />
      </div>
    </div>
  )
}
