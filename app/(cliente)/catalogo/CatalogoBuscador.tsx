'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useCarrito } from '@/lib/store/carrito'
import type { ProductoCatalogo } from './page'

export default function CatalogoBuscador({ productos }: { productos: ProductoCatalogo[] }) {
  const [busqueda, setBusqueda] = useState('')
  const { items, addItem, updateCantidad } = useCarrito()

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.categoria ?? '').toLowerCase().includes(busqueda.toLowerCase())
  )

  const getCantidad = (id: string) =>
    items.find((i) => i.producto_unidad_id === id)?.cantidad ?? 0

  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)
  const totalPrecio = items.reduce((acc, i) => acc + i.cantidad * i.precio_unitario, 0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 px-4 py-3 space-y-2">
        <h1 className="text-lg font-bold text-gray-800">Catálogo</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Lista de productos */}
      <div className="flex-1 px-4 py-3 pb-28 space-y-3 max-w-lg mx-auto w-full">
        {filtrados.length === 0 ? (
          <p className="text-center text-gray-400 text-sm pt-10">
            No se encontraron productos
          </p>
        ) : (
          filtrados.map((producto) => (
            <div key={producto.id} className="bg-white rounded-2xl border overflow-hidden">
              <div className="px-4 pt-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-gray-800">{producto.nombre}</h2>
                  {producto.categoria && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {producto.categoria}
                    </span>
                  )}
                </div>
              </div>

              <div className="divide-y">
                {producto.unidades.map((unidad) => {
                  const cantidad = getCantidad(unidad.id)

                  return (
                    <div key={unidad.id} className="flex items-center justify-between px-4 py-3 gap-3">
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {unidad.unidad}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          ${unidad.precio.toLocaleString('es-AR')}
                        </span>
                      </div>

                      {cantidad === 0 ? (
                        <button
                          onClick={() =>
                            addItem({
                              producto_unidad_id: unidad.id,
                              producto_nombre: producto.nombre,
                              unidad: unidad.unidad,
                              cantidad: 1,
                              precio_unitario: unidad.precio,
                              notas_item: '',
                            })
                          }
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Agregar
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => updateCantidad(unidad.id, cantidad - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-gray-800">
                            {cantidad}
                          </span>
                          <button
                            onClick={() => updateCantidad(unidad.id, cantidad + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Carrito flotante */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-20">
          <Link
            href="/carrito"
            className="flex items-center justify-between bg-green-600 hover:bg-green-700 text-white rounded-2xl px-5 py-4 shadow-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-1.5 bg-white text-green-700 text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              </div>
              <span className="font-semibold">Ver carrito</span>
            </div>
            <span className="font-semibold">
              ${totalPrecio.toLocaleString('es-AR')}
            </span>
          </Link>
        </div>
      )}
    </div>
  )
}
