'use client'

import { useState } from 'react'
import { FileDown } from 'lucide-react'
import type { PickingPorProducto, PickingPorCliente } from '@/components/pdf/PickingListPDF'

type Props = {
  porProducto: PickingPorProducto[]
  porCliente: PickingPorCliente[]
}

export default function PickingTabs({ porProducto, porCliente }: Props) {
  const [tab, setTab] = useState<'producto' | 'cliente'>('producto')
  const [descargando, setDescargando] = useState(false)

  const handleDescargarPDF = async () => {
    setDescargando(true)
    try {
      const res = await fetch('/api/admin/picking/pdf')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `picking-${new Date().toISOString().split('T')[0]}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDescargando(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {(['producto', 'cliente'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'producto' ? 'Por producto' : 'Por cliente'}
          </button>
        ))}
      </div>

      {/* Tab: Por producto */}
      {tab === 'producto' && (
        <div className="space-y-3">
          {porProducto.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">
              No hay pedidos confirmados o en preparación
            </p>
          ) : (
            porProducto.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                  <div>
                    <span className="font-semibold text-gray-800">{item.nombre}</span>
                    <span className="text-sm text-gray-500 capitalize ml-2">— {item.unidad}</span>
                    {item.categoria && (
                      <span className="ml-2 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                        {item.categoria}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-green-700 text-lg">
                    {item.totalConfirmado}
                    <span className="text-sm font-normal text-gray-400 ml-1">{item.unidad}</span>
                  </span>
                </div>
                <div className="divide-y">
                  {item.clientes.map((c, j) => (
                    <div key={j} className="flex items-center justify-between px-4 py-2">
                      <span className="text-sm text-gray-600">
                        {c.nombre}
                        <span className="text-gray-400 ml-1">#{c.numeroPedido}</span>
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {c.cantidad} {item.unidad}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Por cliente */}
      {tab === 'cliente' && (
        <div className="space-y-3">
          {porCliente.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">
              No hay pedidos confirmados o en preparación
            </p>
          ) : (
            porCliente.map((cliente, i) => (
              <div key={i} className="bg-white rounded-2xl border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                  <span className="font-semibold text-gray-800">{cliente.clienteNombre}</span>
                  <span className="text-sm text-gray-400">Pedido #{cliente.numeroPedido}</span>
                </div>
                <div className="divide-y">
                  {cliente.items.map((item, j) => (
                    <div key={j} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-sm text-gray-700">{item.nombre}</span>
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {item.cantidad} {item.unidad}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Botón PDF */}
      {(porProducto.length > 0 || porCliente.length > 0) && (
        <button
          onClick={handleDescargarPDF}
          disabled={descargando}
          className="flex items-center justify-center gap-2 w-full border-2 border-green-600 text-green-700 font-semibold rounded-xl py-3 hover:bg-green-50 disabled:opacity-50 transition-colors"
        >
          <FileDown className="w-5 h-5" />
          {descargando ? 'Generando PDF...' : 'Descargar picking list PDF'}
        </button>
      )}
    </div>
  )
}
