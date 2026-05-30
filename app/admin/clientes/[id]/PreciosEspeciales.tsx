'use client'

import { useState, useTransition } from 'react'
import { Search, CheckCircle2 } from 'lucide-react'
import { guardarPreciosEspecialesAction } from '../actions'

type UnidadConPrecio = {
  id: string
  unidad: string
  precio_base: number
  precioEspecial: number | null
  nombreProducto: string
  categoria: string | null
}

export default function PreciosEspeciales({
  clienteId,
  unidades,
}: {
  clienteId: string
  unidades: UnidadConPrecio[]
}) {
  const [busqueda, setBusqueda] = useState('')
  const [precios, setPrecios] = useState<Record<string, string>>(
    Object.fromEntries(
      unidades
        .filter((u) => u.precioEspecial)
        .map((u) => [u.id, String(u.precioEspecial)])
    )
  )
  const [isPending, startTransition] = useTransition()
  const [guardado, setGuardado] = useState(false)

  const filtradas = unidades.filter(
    (u) =>
      u.nombreProducto.toLowerCase().includes(busqueda.toLowerCase()) ||
      (u.categoria ?? '').toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleGuardar = () => {
    startTransition(async () => {
      await guardarPreciosEspecialesAction(
        clienteId,
        unidades.map((u) => ({
          producto_unidad_id: u.id,
          precio_especial: precios[u.id] ? Number(precios[u.id]) : null,
        }))
      )
      setGuardado(true)
      setTimeout(() => setGuardado(false), 3000)
    })
  }

  const conPrecioEspecial = Object.values(precios).filter((v) => v && Number(v) > 0).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">Precios especiales</p>
          <p className="text-xs text-gray-400">
            Dejá vacío para usar el precio base. {conPrecioEspecial > 0 && `${conPrecioEspecial} precio${conPrecioEspecial > 1 ? 's' : ''} personalizado${conPrecioEspecial > 1 ? 's' : ''}.`}
          </p>
        </div>
        {guardado && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle2 className="w-4 h-4" /> Guardado
          </div>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden max-h-96 overflow-y-auto">
        <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <span className="col-span-1">Producto</span>
          <span className="text-right">Base</span>
          <span className="text-right">Especial</span>
        </div>
        <div className="divide-y">
          {filtradas.map((u) => (
            <div key={u.id} className="grid grid-cols-3 gap-2 px-4 py-2.5 items-center">
              <div className="col-span-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{u.nombreProducto}</p>
                <p className="text-xs text-gray-400 capitalize">{u.unidad}</p>
              </div>
              <span className="text-sm text-gray-400 text-right">
                ${u.precio_base.toLocaleString('es-AR')}
              </span>
              <div className="flex justify-end">
                <input
                  type="number"
                  min={0}
                  placeholder="—"
                  value={precios[u.id] ?? ''}
                  onChange={(e) =>
                    setPrecios((prev) => ({ ...prev, [u.id]: e.target.value }))
                  }
                  className={`w-24 text-right border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    precios[u.id] ? 'border-green-400 bg-green-50' : ''
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleGuardar}
        disabled={isPending}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
      >
        {isPending ? 'Guardando...' : 'Guardar precios especiales'}
      </button>
    </div>
  )
}
